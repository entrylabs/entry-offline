import { app, dialog, ipcMain, Menu } from 'electron';
import HardwareWindowManager from './views/hardwareWindowManager';
import MainWindowManager from './views/mainWindowManager';
import AboutWindowManager from './views/aboutWindowManager';
import parseCommandLine from './utils/functions/parseCommandLine';
import configInitialize from './utils/functions/configInitialize';
import createLogger from './utils/functions/createLogger';
import isValidAsarFile from './utils/functions/isValidAsarFile';

import('./ipcMainHelper');
import('./utils/functions/globalShortCutRegister');

const logger = createLogger('main/main.ts');
const commandLineOptions: Readonly<CommandLineOptions> = parseCommandLine(process.argv.slice(1));
const configurations: Readonly<FileConfigurations> = configInitialize(commandLineOptions.config);
const runtimeProperties: RuntimeGlobalProperties = {
    roomIds: [],
    file: commandLineOptions.file || '',
    appName: 'entry',
};

global.sharedObject = Object.assign({}, runtimeProperties, configurations, commandLineOptions);

if (!app.requestSingleInstanceLock()) {
    logger.verbose('App is already running');
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
            logger.info(`[MacOS] open file event fired with ${pathToOpen}`);
            global.sharedObject.file = pathToOpen;
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
            logger.info(`'second instance' event fired`);
        });

        ipcMain.on('forceClose', () => {
            mainWindow.close({ isForceClose: true });
        });

        ipcMain.on('reload', function(event: Electron.IpcMainEvent, arg: any) {
            if (!hardwareWindow.isCurrentWebContentsId(event.sender.id)) {
                if (process.platform === 'darwin') {
                    const menu = Menu.buildFromTemplate([]);
                    Menu.setApplicationMenu(menu);
                } else {
                    mainWindow.window && mainWindow.window.setMenu(null);
                }
            }
            event.sender.reload();
        });

        ipcMain.on('openHardwareWindow', function() {
            hardwareWindow.openHardwareWindow();
        });

        ipcMain.on('openAboutWindow', function() {
            aboutWindow.openAboutWindow();
        });

        ipcMain.on('closeAboutWindow', function() {
            aboutWindow.closeAboutWindow();
        });

        setTimeout(async () => {
            try {
                const result = await isValidAsarFile();
                console.log('isValidAsarFile', result);
                if (!result) {
                    mainWindow?.window?.webContents.send('invalidAsarFile');
                }
            } catch (e) {
                console.log(e);
                mainWindow?.window?.webContents.send('invalidAsarFile');
            }
        }, 2000);
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
    logger.error(`uncaughtException, ${error.message} ${error.stack}`);
    if (whichButtonClicked === 1) {
        process.exit(-1);
    }
});

