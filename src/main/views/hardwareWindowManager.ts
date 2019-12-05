import { BrowserWindow, app, ipcMain, NamedBrowserWindow } from 'electron';
import path from 'path';
import HardwareMainRouter from '../../renderer/bower_components/entry-hw/app/src/main/mainRouter';
import HardwareEntryServer from '../utils/serverProcessManager';
import root from 'window-or-global';

export default class {
    hardwareWindow?: NamedBrowserWindow;
    requestLocalDataInterval?: NodeJS.Timeout;

    constructor() {
        this.hardwareWindow = undefined;
    }

    createHardwareWindow() {
        let title;
        if (app.getLocale() === 'ko') {
            title = '엔트리 하드웨어';
        } else {
            title = 'Entry HardWare';
        }

        this.hardwareWindow = new BrowserWindow({
            width: 800,
            height: 650,
            title,
            show: false,
            webPreferences: {
                backgroundThrottling: false,
                nodeIntegration: false,
                preload: path.resolve(
                    app.getAppPath(), 'src', 'renderer', 'bower_components', 'entry-hw', 'app', 'src', 'renderer', 'preload.js',
                ),
            },
        });
        this.hardwareWindow.hardwareRouter = new HardwareMainRouter(this.hardwareWindow, new HardwareEntryServer());
        this.hardwareWindow.setMenu(null);
        this.hardwareWindow.setMenuBarVisibility(false);
        this.hardwareWindow.loadURL(`file:///${path.resolve(
            app.getAppPath(), 'src', 'renderer', 'bower_components', 'entry-hw', 'app', 'src', 'renderer', 'views', 'index.html')}`);
        this.hardwareWindow.on('closed', this.closeHardwareWindow.bind(this));

        this.hardwareWindow.webContents.name = 'hardware';
        this.requestLocalDataInterval = undefined;
        ipcMain.on('startRequestLocalData', (event: Electron.IpcMainEvent, duration: number) => {
            this.requestLocalDataInterval = setInterval(() => {
                if (!event.sender.isDestroyed()) {
                    event.sender.send('sendingRequestLocalData');
                }
            }, duration);
        });
        ipcMain.on('stopRequestLocalData', () => {
            if (this.requestLocalDataInterval) {
                clearInterval(this.requestLocalDataInterval);
            }
        });
    }

    openHardwareWindow() {
        if (!this.hardwareWindow) {
            this.createHardwareWindow();
        }

        const offlineRoomIds = root.sharedObject.roomIds;
        if (offlineRoomIds && offlineRoomIds[0]) {
            this.hardwareWindow!.hardwareRouter.addRoomId(offlineRoomIds[0]);
        }

        const hardwareWindow = this.hardwareWindow as BrowserWindow;
        hardwareWindow.show();
        if (hardwareWindow.isMinimized()) {
            hardwareWindow.restore();
        }
        hardwareWindow.focus();
    }

    closeHardwareWindow() {
        if (this.hardwareWindow) {
            if (this.hardwareWindow.hardwareRouter) {
                const foo = this.hardwareWindow.hardwareRouter;
                foo.close();
                foo.server.close();
                delete this.hardwareWindow.hardwareRouter;
            }

            if (this.requestLocalDataInterval) {
                clearInterval(this.requestLocalDataInterval);
            }
            this.hardwareWindow.destroy();
            this.hardwareWindow = undefined;
        }
    }

    reloadHardwareWindow() {
        if (this.hardwareWindow) {
            this.hardwareWindow.reload();
        }
    }
}
