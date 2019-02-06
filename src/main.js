import {
    app,
    BrowserWindow,
    Menu,
    globalShortcut,
    ipcMain,
    webContents,
    dialog,
    net,
} from 'electron';
import path from 'path';
import packageJson from '../package.json';
import ChildWindowManager from './main/ChildWindowManager';
import root from 'window-or-global';
import MainUtils from './main/mainUtils';
import CommonUtils from './common/commonUtils';
import './main/ipcMainHelper';

let hostURI = 'playentry.org';
let hostProtocol = 'https:';

const downloadFilterList = {
    'image/png': [
        {
            name: 'PNG Image (*.png)',
            extensions: ['png'],
        },
        {
            name: 'All Files (*.*)',
            extensions: ['*'],
        },
    ],
};

root.sharedObject = {
    roomId: '',
    mainWindowId: '',
    workingPath: '',
    isInitEntry: false,
    appName: 'entry',
    hostURI,
    hostProtocol,
};


const argv = process.argv.slice(1);
const option = {
    file: null,
    help: null,
    version: null,
    webdriver: null,
    modules: [],
};
for (let i = 0; i < argv.length; i++) {
    if (argv[i] == '--version' || argv[i] == '-v') {
        option.version = true;
        break;
    } else if (argv[i].match(/^--app=/)) {
        option.file = argv[i].split('=')[1];
        break;
    } else if (argv[i] == '--debug' || argv[i] == '-d') {
        option.debug = true;
        continue;
    } else if (argv[i].match(/^--host=/) || argv[i].match(/^-h=/)) {
        hostURI = argv[i].split('=')[1];
        continue;
    } else if (argv[i].match(/^--protocol=/) || argv[i].match(/^-p=/)) {
        hostProtocol = argv[i].split('=')[1];
        continue;
    } else if (argv[i][0] == '-') {
        continue;
    } else {
        option.file = argv[i];
        break;
    }
}

let mainWindow = null;
let cwm; let isForceClose;
const isClose = true;

app.on('window-all-closed', function() {
    app.quit();
    process.exit(0);
});


const singleInstanceLock = app.requestSingleInstanceLock();
if (!singleInstanceLock) {
    app.quit();
} else {
    const crashedMsg = {};

    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // 어플리케이션을 중복 실행했습니다. 주 어플리케이션 인스턴스를 활성화 합니다.
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.focus();

            if (Array.isArray(commandLine) && commandLine[1]) {
                mainWindow.webContents.send('loadProject', commandLine[1]);
            }
        }
    });

    app.on('open-file', function(event, pathToOpen) {
        if (process.platform === 'darwin') {
            option.file = pathToOpen;
            if (mainWindow) {
                mainWindow.webContents.send('loadProject', pathToOpen);
            }
        }
    });

    app.once('ready', () => {
        const language = app.getLocale();
        let title = app.getVersion();

        if (language === 'ko') {
            title = `엔트리 v${title}`;
            crashedMsg.title = '오류 발생';
            crashedMsg.content =
                '프로그램이 예기치 못하게 종료되었습니다. 작업 중인 파일을 저장합니다.';
        } else {
            title = `Entry v${title}`;
            crashedMsg.title = 'Error occurs';
            crashedMsg.content =
                'This program has been shut down unexpectedly. Save the file you were working on.';
        }

        mainWindow = new BrowserWindow({
            width: 1024,
            height: 768,
            useContentSize: true,
            title,
            show: false,
            backgroundColor: '#e5e5e5',
            nodeIntegration: false,
            webPreferences: {
                backgroundThrottling: false,
            },
        });

        root.sharedObject.mainWindowId = mainWindow.id;

        mainWindow.once('ready-to-show', () => {
            mainWindow.show();
        });

        mainWindow.webContents.session.on('will-download', (event, downloadItem, webContents) => {
            const filename = downloadItem.getFilename();
            const option = {
                defaultPath: filename,
            };
            const filters = downloadFilterList[downloadItem.getMimeType()];
            if (filters) {
                option.filters = filters;
            }
            const fileName = dialog.showSaveDialog(option);
            if (typeof fileName == 'undefined') {
                downloadItem.cancel();
            } else {
                downloadItem.setSavePath(fileName);
            }
        });


        mainWindow.webContents.on('crashed', () => {
            dialog.showErrorBox(crashedMsg.title, crashedMsg.content);
            dialog.showSaveDialog(
                mainWindow,
                {
                    filters: [
                        {
                            name: 'Entry File',
                            extensions: ['ent'],
                        },
                    ],
                },
                async(destinationPath) => {
                    let err;
                    try {
                        await MainUtils.saveProject(root.sharedObject.workingPath, destinationPath);
                    } catch (error) {
                        console.log(error);
                        err = error;
                    }
                    mainWindow.reload();
                },
            );
        });

        mainWindow.setMenu(null);
        mainWindow.loadURL(`file:///${path.join(__dirname, 'main.html')}`);

        if (option.debug) {
            mainWindow.webContents.openDevTools();
        }

        if (option.file) {
            mainWindow.webContents.startFile = option.file;
        }

        mainWindow.webContents.name = 'entry';

        mainWindow.on('page-title-updated', function(e) {
            e.preventDefault();
        });

        mainWindow.on('close', function(e) {
            if (!isForceClose && root.sharedObject.isInitEntry) {
                e.preventDefault();
                cwm.closeHardwareWindow();
                mainWindow.webContents.send('mainClose');
            }
        });

        mainWindow.on('closed', function() {
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
                webContents.getFocusedWebContents()
                    .openDevTools();
            }
        });

        cwm = new ChildWindowManager(mainWindow);
        cwm.createAboutWindow();
    });

    ipcMain.on('forceClose', () => {
        isForceClose = true;
        mainWindow.close();
    });

    ipcMain.on('reload', function(event, arg) {
        if (event.sender.webContents.name !== 'entry') {
            return cwm.reloadHardwareWindow();
        }

        if (event.sender.webContents) {
            if (process.platform === 'darwin') {
                const menu = Menu.buildFromTemplate([]);
                Menu.setApplicationMenu(menu);
            } else {
                mainWindow.setMenu(null);
            }
            event.sender.webContents.reload();
        }
    });

    ipcMain.on('roomId', function(event, arg) {
        event.returnValue = root.sharedObject.roomId;
    });

    ipcMain.on('version', function(event, arg) {
        event.returnValue = '99';
    });

    ipcMain.on('serverMode', function(event, mode) {
        if (event.sender && event.sender.webContents) {
            event.sender.webContents.send('serverMode', mode);
        }
    });

    ipcMain.on('openHardware', function(event, arg) {
        cwm.openHardwareWindow();
    });

    ipcMain.on('openAboutWindow', function(event, arg) {
        cwm.openAboutWindow();
    });

    ipcMain.on('closeAboutWindow', function(event, arg) {
        cwm.closeAboutWindow();
    });

    ipcMain.on('checkUpdate', ({ sender }, msg) => {
        if (sender.name !== 'entry') {
            return;
        }
        const request = net.request({
            method: 'POST',
            host: hostURI,
            protocol: hostProtocol,
            path: '/api/checkVersion',
        });
        let body = '';
        request.on('response', (res) => {
            res.on('data', (chunk) => {
                body += chunk.toString();
            });
            res.on('end', () => {
                let data = {};
                try {
                    data = JSON.parse(body);
                } catch (e) {
                }
                sender.send('checkUpdateResult', data);
            });
        });
        request.on('error', (err) => {
            console.log(err);
        });
        request.setHeader('content-type', 'application/json; charset=utf-8');
        request.write(
            JSON.stringify({
                category: 'offline',
                version: app.getVersion(),
            }),
        );
        request.end();
    });
}
