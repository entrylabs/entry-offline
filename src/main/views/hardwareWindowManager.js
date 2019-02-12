import { BrowserWindow, app } from 'electron';
import path from 'path';

export default class {
    constructor(win) {
        this.mainWindow = win;
        this.hardwareWindow = null;
    }

    createHardwareWindow() {
        let title;
        if (app.getLocale() === 'ko') {
            title = '엔트리 하드웨어';
        } else {
            title = 'Entry HardWare';
        }

        this.hardwareWindow = new BrowserWindow({
            parent: this.mainWindow,
            width: 800,
            height: 650,
            title,
            show: false,
            webPreferences: {
                backgroundThrottling: false,
            },
        });

        this.hardwareWindow.setMenu(null);
        this.hardwareWindow.setMenuBarVisibility(false);
        this.hardwareWindow.loadURL(`file:///${path.join(
            __dirname, '..', 'renderer', 'bower_components', 'entry-hw', 'app', 'index.html')}`);
        this.hardwareWindow.on('closed', () => {
            this.hardwareWindow = null;
        });

        this.hardwareWindow.webContents.name = 'hardware';
    }

    openHardwareWindow() {
        if (!this.hardwareWindow) {
            this.createHardwareWindow();
        }

        this.hardwareWindow.show();
        if (this.hardwareWindow.isMinimized()) {
            this.hardwareWindow.restore();
        }
        this.hardwareWindow.focus();
    }

    closeHardwareWindow() {
        if (this.hardwareWindow) {
            this.hardwareWindow.destroy();
        }
    }

    reloadHardwareWindow() {
        this.hardwareWindow.reload();
    }
}
