'use strict';

import { app, BrowserWindow, Menu, globalShortcut, ipcMain, webContents, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import ChildProcess from 'child_process';
import ChildWindowManager from './main/ChildWindowManager';
import MainUtils from './main/MainUtils';
import { addBypassChecker, init } from 'electron-compile';

const bypassList = ['.png', '.jpg', '.mp3', '.wav', '.gif'];
addBypassChecker((filePath) => {
    const { ext = '' } = path.parse(filePath);
    return filePath.indexOf(app.getAppPath()) === -1 && bypassList.indexOf(ext) > -1;
});

const downloadFilterList = {
    'image/png': [
        { name: 'PNG Image (*.png)', extensions: ['png'] }, 
        { name: 'All Files (*.*)', extensions: ['*'] }
    ],
}

global.sharedObject = {
    roomId: '',
    mainWindowId: '',
    workingPath: '',
    isInitEntry: false,
}

function logger(text) {
    var log_path = path.join(__dirname);
    if (!fs.existsSync(log_path)) {
        fs.mkdirSync(log_path);
    }
    if (!fs.existsSync(path.join(log_path, 'debug.log'))) {
        fs.writeFileSync(path.join(log_path, 'debug.log'), '', 'utf8');
    }
    var data = fs.readFileSync(path.join(log_path, 'debug.log'), 'utf8');
    data += '\n\r' + new Date() + ' : ' + text;
    fs.writeFileSync(path.join(log_path, 'debug.log'), data, 'utf8');
}

var argv = process.argv.slice(1);
var option = { file: null, help: null, version: null, webdriver: null, modules: [] };
for (var i = 0; i < argv.length; i++) {
    if (argv[i] == '--version' || argv[i] == '-v') {
        option.version = true;
        break;
    } else if (argv[i].match(/^--app=/)) {
        option.file = argv[i].split('=')[1];
        break;
    } else if (argv[i] == '--help' || argv[i] == '-h') {
        option.help = true;
        break;
    } else if (argv[i] == '--test-type=webdriver') {
        option.webdriver = true;
    } else if (argv[i] == '--debug' || argv[i] == '-d') {
        option.debug = true;
        continue;
    } else if (argv[i] == '--require' || argv[i] == '-r') {
        option.modules.push(argv[++i]);
        continue;
    } else if (argv[i][0] == '-') {
        continue;
    } else if (argv[i] == 'app') {
        continue;
    } else {
        option.file = argv[i];
        break;
    }
}

let mainWindow = null;
let cwm, isForceClose;
let isClose = true;

app.on('window-all-closed', function () {
    app.quit();
    process.exit(0);
});

let shouldQuit = app.makeSingleInstance(function (commandLine, workingDirectory) {
    // 어플리케이션을 중복 실행했습니다. 주 어플리케이션 인스턴스를 활성화 합니다.
    if (mainWindow) {
        if (mainWindow.isMinimized())
            mainWindow.restore();
        mainWindow.focus();

        if (Array.isArray(commandLine) && commandLine[1]) {
            mainWindow.webContents.send('loadProject', commandLine[1]);
        }
    }

    return true;
});

if (shouldQuit) {
    app.quit();
} else {
    let language;
    let mainUtils;
    const crashedMsg = {};

    function createMainWindow() {
        language = app.getLocale();
        let title = app.getVersion();

        if (language === 'ko') {
            title = '엔트리 v' + title;
            crashedMsg.title = '오류 발생';
            crashedMsg.content = '프로그램이 예기치 못하게 종료되었습니다. 작업 중인 파일을 저장합니다.';
        } else {
            title = 'Entry v' + title;
            crashedMsg.title = 'Error occurs';
            crashedMsg.content = 'This program has been shut down unexpectedly. Save the file you were working on.';
        }

        mainWindow = new BrowserWindow({
            width: 1024,
            height: 700,
            title: title,
            show: false,
            backgroundColor: '#e5e5e5',
            webPreferences: {
                backgroundThrottling: false
            }
        });

        global.sharedObject.mainWindowId = mainWindow.id;

        mainWindow.once('ready-to-show', () => {
            mainWindow.show()
        });

        mainWindow.webContents.session.on('will-download', (event, downloadItem, webContents) => {
            const filename = downloadItem.getFilename();
            const option = {
                defaultPath: filename,
            }
            const filters = downloadFilterList[downloadItem.getMimeType()];
            if(filters) {
                option.filters = filters;
            }
            var fileName = dialog.showSaveDialog(option);
            if (typeof fileName == "undefined") {
                downloadItem.cancel()
            } else {
                downloadItem.setSavePath(fileName);
            }
        });

        mainUtils = new MainUtils(mainWindow);

        mainWindow.webContents.on('crashed', () => {
            dialog.showErrorBox(crashedMsg.title, crashedMsg.content);
            dialog.showSaveDialog(mainWindow, {
                filters: [{
                    name: 'Entry File',
                    extensions: ['ent']
                }]
            }, async (destinationPath) => {
                let err;
                try {
                    await mainUtils.saveProject({
                        destinationPath,
                        sourcePath: global.sharedObject.workingPath,
                    });
                } catch (error) {
                    console.log(error);
                    err = error;
                }
                mainWindow.reload();
            });
        });

        mainWindow.setMenu(null);
        mainWindow.loadURL('file:///' + path.join(__dirname, 'renderer', 'entry_offline.html'));

        if (option.debug) {
            mainWindow.webContents.openDevTools();
        }

        if (option.file) {
            mainWindow.webContents.startFile = option.file;
        }

        mainWindow.webContents.name = 'entry';

        mainWindow.on('page-title-updated', function (e) {
            e.preventDefault();
        });

        mainWindow.on('close', function (e) {
            if (!isForceClose && global.sharedObject.isInitEntry) {
                e.preventDefault();
                cwm.closeHardwareWindow();
                mainWindow.webContents.send('mainClose');
            }
        });
        
        mainWindow.on('closed', function () {
            mainWindow = null;
            app.quit();
            process.exit(0);
        });

        let inspectorShortcut = '';
        if (process.platform == 'darwin') {
            inspectorShortcut = 'Command+Alt+i';
        } else {
            inspectorShortcut = 'Control+Shift+i';
        }
        globalShortcut.register(inspectorShortcut, (e) => {
            const content = webContents.getFocusedWebContents();
            if (content) {
                webContents.getFocusedWebContents().openDevTools();
            }
        });

        cwm = new ChildWindowManager(mainWindow);
        cwm.createAboutWindow();
    }

    app.on('open-file', function (event, pathToOpen) {
        if (process.platform === 'darwin') {
            option.file = pathToOpen;
            if (mainWindow) {
                mainWindow.webContents.send('loadProject', pathToOpen);
            }
        }
    });

    app.once('ready', createMainWindow);

    ipcMain.on('forceClose', () => {
        isForceClose = true;
        mainWindow.close();
    });

    ipcMain.on('reload', function (event, arg) {
        if (event.sender.webContents.name !== 'entry') {
            return cwm.reloadHardwareWindow();
        }

        if (event.sender.webContents) {
            if (process.platform === 'darwin') {
                var menu = Menu.buildFromTemplate([]);
                Menu.setApplicationMenu(menu);
            } else {
                mainWindow.setMenu(null);
            }
            event.sender.webContents.reload();
        }
    });

    ipcMain.on('roomId', function (event, arg) {
        event.returnValue = global.sharedObject.roomId;
    });

    ipcMain.on('version', function (event, arg) {
        event.returnValue = '99';
    });

    ipcMain.on('serverMode', function (event, mode) {
        if (event.sender && event.sender.webContents) {
            event.sender.webContents.send('serverMode', mode);
        }
    });

    ipcMain.on('openHardware', function (event, arg) {
        cwm.openHardwareWindow();
    });

    ipcMain.on('openAboutWindow', function (event, arg) {
        cwm.openAboutWindow();
    });

    ipcMain.on('closeAboutWindow', function (event, arg) {
        cwm.closeAboutWindow();
    });

    ipcMain.on('saveProject', async (event, arg) => {
        let err;
        try {
            await mainUtils.saveProject(arg);
        } catch (error) {
            console.log(error);
            err = error;
        }
        if (event) {
            event.sender.send(arg.channel, err);
        }
    });
}
