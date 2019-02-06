import { BrowserWindow } from "electron";
import path from 'path';

export default class {
    static createAboutWindow(parentWindow) {
        this.aboutWindow = new BrowserWindow({
            parent: parentWindow,
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
            '..',
            '..',
            'renderer',
            'views',
            'about.html',
        )}`);
    }

    static openAboutWindow(parentWindow) {
        if (!this.aboutWindow) {
            this.createAboutWindow(parentWindow);
        }

        this.aboutWindow.show();
    }

    static closeAboutWindow() {
        if (this.aboutWindow) {
            this.aboutWindow.hide();
        }
    }
}
