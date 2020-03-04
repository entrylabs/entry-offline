import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import HardwareMainRouter from 'entry-hw/app/src/main/mainRouter.build';
import HardwareEntryServer from '../utils/serverProcessManager';

export default class HardwareWindowManager {
    private hardwareWindow?: BrowserWindow;
    private hardwareRouter?: any;
    private windowCloseConfirmed = false;
    private windowId: number = -1;

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
                    app.getAppPath(), 'node_modules', 'entry-hw', 'app', 'src', 'preload', 'preload.bundle.js',
                ),
            },
        });
        this.hardwareRouter = new HardwareMainRouter(this.hardwareWindow, new HardwareEntryServer(), {
            moduleDownloadHandler: (moduleName: string) => {
                console.log('hello offline download', moduleName);
            },
        });
        this.hardwareWindow.setMenu(null);
        this.hardwareWindow.setMenuBarVisibility(false);
        this.hardwareWindow.loadURL(`file:///${path.resolve(
            app.getAppPath(), 'node_modules', 'entry-hw', 'app', 'src', 'views', 'index.html')}`);
        this.hardwareWindow.on('closed', this.closeHardwareWindow.bind(this));
        this._bindHardwareCloseEvent();

        this.windowId = this.hardwareWindow.webContents.id;
    }

    openHardwareWindow() {
        if (!this.hardwareWindow) {
            this.createHardwareWindow();
        }

        const offlineRoomIds = global.sharedObject.roomIds;
        if (offlineRoomIds && offlineRoomIds[0]) {
            this.hardwareRouter.addRoomId(offlineRoomIds[0]);
        }

        const hardwareWindow = this.hardwareWindow as BrowserWindow;
        hardwareWindow.show();
        if (hardwareWindow.isMinimized()) {
            hardwareWindow.restore();
        }
        hardwareWindow.focus();
    }

    closeHardwareWindow() {
        this.windowCloseConfirmed = false;
        this._unbindHardwareCloseEvent();
        if (this.hardwareWindow) {
            if (this.hardwareRouter) {
                this.hardwareRouter.close();
                this.hardwareRouter.server.close();
                delete this.hardwareRouter;
            }

            this.hardwareWindow.destroy();
            this.hardwareWindow = undefined;
        }
    }

    isCurrentWebContentsId(webContentsId: number) {
        return this.windowId === webContentsId;
    }

    private _bindHardwareCloseEvent() {
        this.hardwareWindow?.on('close', (e) => {
            if (!this.windowCloseConfirmed) {
                e.preventDefault();
                this.hardwareWindow?.webContents.send('hardwareCloseConfirm');
            }
        });
        ipcMain.on('hardwareForceClose', () => {
            this.windowCloseConfirmed = true;
            this.hardwareWindow?.close();
        });
    }

    private _unbindHardwareCloseEvent() {
        this.hardwareWindow?.removeAllListeners('close');
        ipcMain.removeAllListeners('hardwareForceClose');
    }
}
