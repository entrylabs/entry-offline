import {
    app,
    Menu,
    ipcMain,
    net,
} from 'electron';
import HardwareWindowManager from './main/views/hardwareWindowManager';
import MainWindowManager from './main/views/mainWindowManager';
import AboutWindowManager from './main/views/aboutWindowManager';
import root from 'window-or-global';
import commandLineResolve from './main/electron/commandLineResolver';

import CommonUtils from './main/commonUtils';
import packageJson from '../package.json';
import('./main/ipcMainHelper');
require('./main/electron/globalShortCutRegister');

const option = commandLineResolve(process.argv.slice(1));

root.sharedObject = {
    roomId: '',
    mainWindowId: '',
    workingPath: '',
    isInitEntry: false,
    initProjectPath: option.file,
    appName: 'entry',
    hostURI: 'playentry.org',
    hostProtocol: 'https:',
};

app.on('window-all-closed', function() {
    app.quit();
    process.exit(0);
});

if (!app.requestSingleInstanceLock()) {
    app.quit();
} else {
    app.once('ready', () => {
        const mainWindow = new MainWindowManager(option);
        const hardwareWindow = new HardwareWindowManager();
        const aboutWindow = new AboutWindowManager(mainWindow.window);

        app.on('second-instance', (event, commandLine, workingDirectory) => {
            // 어플리케이션을 중복 실행했습니다. 주 어플리케이션 인스턴스를 활성화 합니다.
            const option = commandLineResolve(commandLine);

            if (mainWindow) {
                mainWindow.activateWindow();
                mainWindow.loadProjectFromPath(option.file);
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

        ipcMain.on('forceClose', () => {
            mainWindow.close({ isForceClose : true });
        });

        ipcMain.on('reload', function(event, arg) {
            if (event.sender.webContents.name !== 'entry') {
                return hardwareWindow.reloadHardwareWindow();
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

        ipcMain.on('openHardwareWindow', function(event, arg) {
            hardwareWindow.openHardwareWindow(arg);
        });

        ipcMain.on('openAboutWindow', function(event, arg) {
            aboutWindow.openAboutWindow();
        });

        ipcMain.on('closeAboutWindow', function(event, arg) {
            aboutWindow.closeAboutWindow();
        });
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
}
