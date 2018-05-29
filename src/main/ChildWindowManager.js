import { BrowserWindow, app } from 'electron';
import path from 'path';

class ChildWindowManager {
    constructor(win) {
        this.mainWindow = win;
        this.aboutWindow = null;
        this.hardwareWindow = null;
    }

    createAboutWindow() {
        this.aboutWindow = new BrowserWindow({
            parent: this.mainWindow,
            width: 380,
            height: 290,
            resizable: false,
            movable: false,
            center: true,
            frame: false,
            modal: true,
            show: false,
        });

        this.aboutWindow.loadURL('file:///' + path.resolve(__dirname, '..', 'renderer','views', 'about.html'));

        this.aboutWindow.on('closed', ()=> {
            this.aboutWindow = null;
        });
    }

    openAboutWindow() {
        if(!this.aboutWindow) {
            this.createAboutWindow();
        }

        this.aboutWindow.show();
    }

    closeAboutWindow() {
        if(this.aboutWindow) {
            this.aboutWindow.hide();
        }
    }

    createHardwareWindow() {
        let title;
        if(app.getLocale() === 'ko') {
            title = '엔트리 하드웨어';
        } else {
            title = 'Entry HardWare'
        }

        this.hardwareWindow = new BrowserWindow({   
            width: 800, 
            height: 650,
            title: title,
            show: false,
            webPreferences: {
                backgroundThrottling: false
            }
        });

        this.hardwareWindow.setMenu(null);
        this.hardwareWindow.setMenuBarVisibility(false);
        this.hardwareWindow.loadURL('file:///' + path.join(__dirname, '..', 'renderer', 'bower_components', 'entry-hw', 'app', 'index.html'));
        this.hardwareWindow.on('closed', ()=> {
            this.hardwareWindow = null;
        });

        this.hardwareWindow.webContents.name = 'hardware';
    }

    openHardwareWindow() {
        if(!this.hardwareWindow) {
            this.createHardwareWindow();
        }

        this.hardwareWindow.show();
        if (this.hardwareWindow.isMinimized()) {
            this.hardwareWindow.restore();
        }
        this.hardwareWindow.focus();
    }

    closeHardwareWindow() {
        if(this.hardwareWindow) {
            this.hardwareWindow.destroy();
        }
    }

    reloadHardwareWindow() {
        this.hardwareWindow.reload();
    }
}

export default ChildWindowManager;