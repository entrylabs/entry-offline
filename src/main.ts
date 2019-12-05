import {
    app,
    Menu,
    ipcMain,
    NamedEvent,
    dialog,
} from 'electron';
import HardwareWindowManager from './main/views/hardwareWindowManager';
import MainWindowManager from './main/views/mainWindowManager';
import AboutWindowManager from './main/views/aboutWindowManager';
import root from 'window-or-global';
import parseCommandLine from './main/utils/functions/parseCommandLine';
import configInitialize from './main/utils/functions/configInitialize';

import('./main/ipcMainHelper');
import('./main/utils/functions/globalShortCutRegister');

const commandLineOptions: Readonly<CommandLineOptions> = parseCommandLine(process.argv.slice(1));
const configurations: Readonly<FileConfigurations> = configInitialize(commandLineOptions.config);
const runtimeProperties: RuntimeGlobalProperties = {
    roomIds: [],
    mainWindowId: -1,
    workingPath: commandLineOptions.file || '',
    appName: 'entry',
};

global.sharedObject = Object.assign({}, runtimeProperties, configurations, commandLineOptions);

if (!app.requestSingleInstanceLock()) {
    app.quit();
} else {
    let mainWindow: MainWindowManager;
    app.commandLine.appendSwitch('disable-renderer-backgrounding');

    app.on('window-all-closed', function() {
        app.quit();
        process.exit(0);
    });

    app.on('open-file', function(event, pathToOpen) {
        if (process.platform === 'darwin') {
            global.sharedObject.workingPath = pathToOpen;
            if (mainWindow) {
                mainWindow.loadProjectFromPath(pathToOpen);
            }
        }
    });

    app.once('ready', () => {
        mainWindow = new MainWindowManager(commandLineOptions);
        const hardwareWindow = new HardwareWindowManager();
        const aboutWindow = new AboutWindowManager(mainWindow.window);

        app.on('second-instance', (event, commandLine, workingDirectory) => {
            // 어플리케이션을 중복 실행했습니다. 주 어플리케이션 인스턴스를 활성화 합니다.
            const option = parseCommandLine(commandLine);
            if (mainWindow) {
                mainWindow.activateWindow();
                mainWindow.loadProjectFromPath(option.file);
            }
        });

        ipcMain.on('forceClose', () => {
            mainWindow.close({ isForceClose: true });
        });

        ipcMain.on('reload', function(event: NamedEvent, arg: any) {
            if (event.sender.name !== 'entry') {
                return hardwareWindow.reloadHardwareWindow();
            }

            if (event.sender) {
                if (process.platform === 'darwin') {
                    const menu = Menu.buildFromTemplate([]);
                    Menu.setApplicationMenu(menu);
                } else {
                    mainWindow.window && mainWindow.window.setMenu(null);
                }
                event.sender.reload();
            }
        });

        ipcMain.on('openHardwareWindow', function(event: Electron.IpcMainEvent, arg: any) {
            hardwareWindow.openHardwareWindow();
        });

        ipcMain.on('openAboutWindow', function(event: Electron.IpcMainEvent, arg: any) {
            aboutWindow.openAboutWindow();
        });

        ipcMain.on('closeAboutWindow', function(event: Electron.IpcMainEvent, arg: any) {
            aboutWindow.closeAboutWindow();
        });
    });

    ipcMain.on('roomId', function(event: Electron.IpcMainEvent, arg: any) {
        event.returnValue = root.sharedObject.roomIds;
    });

    ipcMain.on('version', function(event: Electron.IpcMainEvent, arg: any) {
        event.returnValue = '99';
    });

    ipcMain.on('serverMode', function(event: Electron.IpcMainEvent, mode: string) {
        event.sender.send('serverMode', mode);
    });
}

process.on('uncaughtException', (error) => {
    const whichButtonClicked = dialog.showMessageBoxSync({
        type: 'error',
        title: 'Unexpected Error',
        message: 'Unexpected Error',
        detail: error.toString(),
        buttons: ['ignore', 'exit'],
    });
    console.error(error.message, error.stack);
    if (whichButtonClicked === 1) {
        process.exit(-1);
    }
});

