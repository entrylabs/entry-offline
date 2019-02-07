import {
    app,
    Menu,
    ipcMain,
    net,
} from 'electron';
import ChildWindowManager from './main/ChildWindowManager';
import MainWindowManager from './main/views/mainWindowManager';
import AboutWindowManager from './main/views/aboutWindowManager';
import root from 'window-or-global';
import commandLineResolve from './main/electron/commandLineResolver';

import './main/ipcMainHelper';
import './main/electron/globalShortCutRegister';

root.sharedObject = {
    roomId: '',
    mainWindowId: '',
    workingPath: '',
    isInitEntry: false,
    appName: 'entry',
    hostURI: 'playentry.org',
    hostProtocol: 'https:',
};

const option = commandLineResolve(process.argv.slice(1));

app.on('window-all-closed', function() {
    app.quit();
    process.exit(0);
});

if (!app.requestSingleInstanceLock()) {
    app.quit();
} else {
    let mainWindow = undefined;
    let aboutWindow = undefined;
    let cwm;

    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // 어플리케이션을 중복 실행했습니다. 주 어플리케이션 인스턴스를 활성화 합니다.
        if (mainWindow) {
            mainWindow.secondInstanceLoaded(commandLine);
        }
    });

    app.on('open-file', function(event, pathToOpen) {
        if (process.platform === 'darwin') {
            option.file = pathToOpen;
            if (mainWindow) {
                mainWindow.loadProjectFromPath(pathToOpen);
            }
        }
    });

    app.once('ready', () => {
        mainWindow = new MainWindowManager(option);
        cwm = new ChildWindowManager(mainWindow.window);
        aboutWindow = new AboutWindowManager(mainWindow.window);
        cwm.createAboutWindow();
    });

    ipcMain.on('forceClose', () => {
        mainWindow.close({ isForceClose : true });
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
        aboutWindow.openAboutWindow();
    });

    ipcMain.on('closeAboutWindow', function(event, arg) {
        aboutWindow.closeAboutWindow();
    });

    ipcMain.on('checkUpdate', ({ sender }, msg) => {
        if (sender.name !== 'entry') {
            return;
        }
        const request = net.request({
            method: 'POST',
            host: option.hostURI,
            protocol: option.hostProtocol,
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
