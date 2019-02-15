import { app, BrowserWindow, dialog } from 'electron';
import root from 'window-or-global';
import MainUtils from '../mainUtils';
import path from 'path';

export default class {
    get window() {
        return this.mainWindow;
    }

    get downloadFilterList() {
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

    constructor(option) {
        const language = app.getLocale();
        let title = app.getVersion();
        const crashedMsg = {};

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

        let mainWindow = new BrowserWindow({
            width: 1024,
            height: 768,
            useContentSize: true,
            title,
            show: false,
            backgroundColor: '#e5e5e5',
            nodeIntegration: false,
            webPreferences: {
                backgroundThrottling: false,
            },
            icon: path.join(__dirname, '..', 'main', 'static', 'icon.png'),
        });
        this.mainWindow = mainWindow;

        root.sharedObject.mainWindowId = mainWindow.id;

        mainWindow.once('ready-to-show', () => {
            mainWindow.show();
        });

        mainWindow.webContents.on('did-finish-load', () => {
            mainWindow.webContents.send('showWindow');
        });

        mainWindow.webContents.session.on('will-download', (event, downloadItem, webContents) => {
            const filename = downloadItem.getFilename();
            const option = {
                defaultPath: filename,
            };
            const filters = this.downloadFilterList[downloadItem.getMimeType()];
            if (filters) {
                option.filters = filters;
            }
            const fileName = dialog.showSaveDialog(option);
            if (typeof fileName == 'undefined') {
                downloadItem.cancel();
            } else {
                downloadItem.setSavePath(fileName);
            }
        });


        mainWindow.webContents.on('crashed', () => {
            dialog.showErrorBox(crashedMsg.title, crashedMsg.content);
            dialog.showSaveDialog(
                mainWindow,
                {
                    filters: [
                        {
                            name: 'Entry File',
                            extensions: ['ent'],
                        },
                    ],
                },
                async(destinationPath) => {
                    let err;
                    try {
                        await MainUtils.saveProject(root.sharedObject.workingPath, destinationPath);
                    } catch (error) {
                        console.log(error);
                        err = error;
                    }
                    mainWindow.reload();
                },
            );
        });

        mainWindow.setMenu(null);
        mainWindow.loadURL(`file:///${path.join(__dirname, '..', 'main.html')}`);

        if (option.debug) {
            mainWindow.webContents.openDevTools();
        }

        mainWindow.webContents.name = 'entry';

        mainWindow.on('page-title-updated', function(e) {
            e.preventDefault();
        });

        mainWindow.on('closed', function() {
            mainWindow = null;
            app.quit();
            process.exit(0);
        });
    }

    close({ isForceClose = false }) {
        if (!isForceClose && root.sharedObject.isInitEntry) {
            // cwm.closeHardwareWindow();
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

    loadProjectFromPath(projectPath) {
        if (projectPath) {
            this.mainWindow.webContents.send('loadProjectFromMain', projectPath);
        }
    }
}

