import { BrowserWindow, app, NamedBrowserWindow } from 'electron';
import path from 'path';
import HardwareMainRouter from 'entry-hw/app/src/main/mainRouter.build';
import HardwareEntryServer from '../utils/serverProcessManager';
import root from 'window-or-global';

export default class HardwareWindowManager {
    hardwareWindow?: NamedBrowserWindow;

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
        this.hardwareWindow.hardwareRouter = new HardwareMainRouter(this.hardwareWindow, new HardwareEntryServer());
        this.hardwareWindow.setMenu(null);
        this.hardwareWindow.setMenuBarVisibility(false);
        this.hardwareWindow.loadURL(`file:///${path.resolve(
            app.getAppPath(), 'node_modules', 'entry-hw', 'app', 'src', 'views', 'index.html')}`);
        this.hardwareWindow.on('closed', this.closeHardwareWindow.bind(this));

        this.hardwareWindow.webContents.name = 'hardware';
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
