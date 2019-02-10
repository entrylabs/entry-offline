import { BrowserWindow } from "electron";
import path from 'path';

export default class {
    constructor(parentWindow) {
        this.parentWindow = parentWindow;
        this.createAboutWindow();
    }
    createAboutWindow() {
        this.aboutWindow = new BrowserWindow({
            parent: this.parentWindow,
            width: 380,
            height: 290,
            resizable: false,
            movable: false,
            center: true,
            frame: false,
            modal: true,
            show: false,
        });

        this.aboutWindow.on('closed', () => {
            this.aboutWindow = null;
        });

        this.aboutWindow.loadURL(`file:///${path.resolve(
            __dirname,
            'about.html',
        )}`);
    }

    openAboutWindow() {
        if (!this.aboutWindow) {
            this.createAboutWindow();
        }

        this.aboutWindow.show();
    }

    closeAboutWindow() {
        if (this.aboutWindow) {
            this.aboutWindow.hide();
        }
    }
}
