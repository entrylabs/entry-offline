import { app, BrowserWindow } from 'electron';
import path from 'path';
import createLogger from '../utils/functions/createLogger';

const logger = createLogger('main/aboutWindowManager.ts');

export default class {
    parentWindow?: BrowserWindow;
    aboutWindow?: BrowserWindow;

    constructor(parentWindow?: BrowserWindow) {
        this.parentWindow = parentWindow;
        this.aboutWindow = undefined;
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
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true,
                contextIsolation: false,
            },
        });

        this.aboutWindow.on('closed', () => {
            this.aboutWindow = undefined;
        });

        this.aboutWindow.loadURL(
            `file:///${path.resolve(app.getAppPath(), 'src', 'main', 'views', 'about.html')}`
        );

        logger.verbose('about window created');
    }

    openAboutWindow() {
        if (!this.aboutWindow) {
            this.createAboutWindow();
        }

        (this.aboutWindow as BrowserWindow).show();
    }

    closeAboutWindow() {
        if (this.aboutWindow) {
            this.aboutWindow.hide();
        }
    }
}
