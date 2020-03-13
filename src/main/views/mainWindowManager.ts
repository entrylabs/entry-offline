import { app, BrowserWindow, dialog, FileFilter, SaveDialogOptions } from 'electron';
import path from 'path';

type CrashMessage = {
    title: string;
    content: string;
}

export default class {
    private mainWindow?: BrowserWindow;
    private readonly webContentsId: number = -1;

    get window() {
        return this.mainWindow;
    }

    get downloadFilterList(): { [key: string]: FileFilter[] } {
        return {
            'image/png': [
                {
                    name: 'PNG Image (*.png)',
                    extensions: ['png'],
                },
                {
                    name: 'All Files (*.*)',
                    extensions: ['*'],
                },
            ],
        };
    }

    constructor(option: CommandLineOptions) {
        const language = app.getLocale();
        let title = global.sharedObject.version;
        const crashedMsg: CrashMessage = {
            title: '',
            content: '',
        };

        if (language === 'ko') {
            title = `엔트리 v${title}`;
            crashedMsg.title = '오류 발생';
            crashedMsg.content =
                '프로그램이 예기치 못하게 종료되었습니다. 작업 중인 파일을 저장합니다.';
        } else {
            title = `Entry v${title}`;
            crashedMsg.title = 'Error occurs';
            crashedMsg.content =
                'This program has been shut down unexpectedly. Save the file you were working on.';
        }

        const mainWindow = new BrowserWindow({
            width: 1080,
            height: 824,
            title,
            show: false,
            backgroundColor: '#e5e5e5',
            webPreferences: {
                backgroundThrottling: false,
                nodeIntegration: false,
                preload: path.resolve(app.getAppPath(), 'src', 'preload_build', 'preload.bundle.js'),
            },
            icon: path.resolve(app.getAppPath(), 'src', 'main', 'static', 'icon.png'),
        });
        this.mainWindow = mainWindow;
        this.webContentsId = mainWindow.webContents.id;

        mainWindow.once('ready-to-show', () => {
            mainWindow.show();
        });

        mainWindow.webContents.on('did-finish-load', () => {
            mainWindow.webContents.send('showWindow');
        });

        mainWindow.webContents.session.on('will-download', (
            event: Electron.Event,
            downloadItem: Electron.DownloadItem,
        ) => {
            const filename = downloadItem.getFilename();
            const option: SaveDialogOptions = {
                defaultPath: filename,
            };
            const filters = this.downloadFilterList[downloadItem.getMimeType()];
            if (filters) {
                option.filters = filters;
            }
            const fileName = dialog.showSaveDialogSync(option);
            if (typeof fileName == 'undefined') {
                downloadItem.cancel();
            } else {
                downloadItem.setSavePath(fileName);
            }
        });

        mainWindow.setMenu(null);
        mainWindow.loadURL(`file://${path.resolve(app.getAppPath(), 'src', 'main', 'views', 'main.html')}`);

        mainWindow.on('page-title-updated', function(e) {
            e.preventDefault();
        });

        mainWindow.on('show', () => {
            if (option.debug) {
                mainWindow.webContents.openDevTools();
            }
        });

        mainWindow.on('closed', () => {
            this.mainWindow = undefined;
            app.quit();
            process.exit(0);
        });
    }

    close({ isForceClose = false }) {
        if (!this.mainWindow) {
            return;
        }

        if (!isForceClose) {
            this.mainWindow.webContents.send('mainClose');
        } else {
            this.mainWindow.close();
        }
    }

    activateWindow() {
        const mainWindow = this.mainWindow;
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.focus();
        }
    }

    loadProjectFromPath(projectPath?: string) {
        if (this.mainWindow && !this.mainWindow.isDestroyed() && projectPath) {
            this.mainWindow.webContents.send('loadProjectFromMain', projectPath);
        }
    }

    isCurrentWebContentsId(webContentsId: number) {
        return this.webContentsId === webContentsId;
    }
}

