import { app, ipcMain, shell } from 'electron';
import root from 'window-or-global';
import path from 'path';
import MainUtils from './mainUtils';
import Constants from './constants';
import CommonUtils from './commonUtils';
import checkUpdateRequest from './utils/network/checkUpdate';

/**
 * ipc process 의 이벤트를 등록한다.
 * 실제 로직은 mainUtils 에서 동작한다.
 * MVC 의 Controller 와 비슷한 역할을 한다.
 * 추가하는 로직은 일반적으로 다음 프로세스에 들어갈 인자의 가공이다.
 *
 * main.js 에서 선언되어있다.
 * 이 클래스의 ipc event 들은 mainWindow, workspace 와 관련이 있다.
 */
class IpcMainHelper {
    constructor() {
        ipcMain.on('saveProject', this.saveProject.bind(this));
        ipcMain.on('loadProject', this.loadProject.bind(this));
        ipcMain.on('resetDirectory', this.resetSaveDirectory.bind(this));
        ipcMain.on('exportObject', this.exportObject.bind(this));
        ipcMain.on('importObjects', this.importObjects.bind(this));
        ipcMain.on('importObjectsFromResource', this.importObjectsFromResource.bind(this));
        ipcMain.on('importPictures', this.importPictures.bind(this));
        ipcMain.on('importPicturesFromResource', this.importPicturesFromResource.bind(this));
        ipcMain.on('importPictureFromCanvas', this.importPictureFromCanvas.bind(this));
        ipcMain.on('importSounds', this.importSounds.bind(this));
        ipcMain.on('importSoundsFromResource', this.importSoundsFromResource.bind(this));
        ipcMain.on('staticDownload', this.staticDownload.bind(this));
        ipcMain.on('tempResourceDownload', this.tempResourceDownload.bind(this));
        ipcMain.on('saveExcel', this.saveExcel.bind(this));
        ipcMain.on('writeFile', this.writeFile.bind(this));
        ipcMain.on('openUrl', this.openUrl.bind(this));
        ipcMain.on('checkUpdate', this.checkUpdate.bind(this));
        ipcMain.on('quit', this.quitApplication.bind(this));
    }

    saveProject(event: Electron.Event, project: ObjectLike, targetPath: string) {
        MainUtils.saveProject(project, targetPath)
            .then(() => {
                event.sender.send('saveProject');
            })
            .catch((err) => {
                event.sender.send('saveProject', err);
            });
    }

    loadProject(event: Electron.Event, filePath: string) {
        MainUtils.loadProject(filePath)
            .then((project) => {
                event.sender.send('loadProject', project);
            })
            .catch((err) => {
                console.error(err);
                event.sender.send('loadProject');
            });
    }

    resetSaveDirectory(event: Electron.Event) {
        MainUtils.resetSaveDirectory()
            .then(() => {
                event.sender.send('resetDirectory');
            })
            .catch((err) => {
                console.error(err);
            });
    }

    exportObject(event: Electron.Event, filePath: string, object: any) {
        MainUtils.exportObject(filePath, object)
            .then(() => {
                event.sender.send('exportObject');
            })
            .catch((err) => {
                console.error(err);
            });
    }

    importObjects(event: Electron.Event, filePaths: string[]) {
        if (!filePaths || filePaths.length === 0) {
            event.sender.send('importObjects', []);
        }

        MainUtils.importObjects(filePaths)
            .then((objects) => {
                event.sender.send('importObjects', objects);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    importObjectsFromResource(event: Electron.Event, objects: ObjectLike[]) {
        if (!objects || objects.length === 0) {
            event.sender.send('importObjectsFromResource', []);
        }

        MainUtils.importObjectsFromResource(objects)
            .then((objects) => {
                event.sender.send('importObjectsFromResource', objects);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    // 외부 이미지 업로드시.
    importPictures(event: Electron.Event, filePaths: string[]) {
        if (!filePaths || filePaths.length === 0) {
            event.sender.send('importPictures', []);
        }

        MainUtils.importPicturesToTemp(filePaths)
            .then((object) => {
                event.sender.send('importPictures', object);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    importPicturesFromResource(event: Electron.Event, pictures: ObjectLike[]) {
        MainUtils.importPicturesFromResource(pictures)
            .then((object) => {
                event.sender.send('importPicturesFromResource', object);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    importPictureFromCanvas(event: Electron.Event, data: ObjectLike[]) {
        MainUtils.importPictureFromCanvas(data)
            .then((object) => {
                event.sender.send('importPictureFromCanvas', object);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    importSounds(event: Electron.Event, filePaths: string[]) {
        if (!filePaths || filePaths.length === 0) {
            event.sender.send('importSounds', []);
        }

        MainUtils.importSoundsToTemp(filePaths)
            .then((object) => {
                event.sender.send('importSounds', object);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    importSoundsFromResource(event: Electron.Event, sounds: ObjectLike[]) {
        MainUtils.importSoundsFromResource(sounds)
            .then((object) => {
                event.sender.send('importSoundsFromResource', object);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    /**
     * main/static 아래의 데이터를 다운로드 한다.
     * @param event
     * @param {Array<string>}unresolvedFilePathArray separator 가 없는 경로 목록
     * @param targetFilePath
     */
    staticDownload(event: Electron.Event, unresolvedFilePathArray: string[], targetFilePath: string) {
        const resolvedFilePath = path.join(...unresolvedFilePathArray);
        const staticFilePath = path.resolve(app.getAppPath(), 'src', 'main', 'static', resolvedFilePath);
        MainUtils.downloadFile(staticFilePath, targetFilePath)
            .catch((err) => {
                console.error(err);
            });
    }

    /**
     * temp 에 있는 리소스를 다운로드 한다. fileurl 이 있는 경우 이를 우선한다.
     * 이미지, 사운드 개별 다운로드에 사용된다.
     *
     * @param event
     * @param {Object}entryObject 다운로드할 엔트리 오브젝트 정보. fileurl 이 존재하면 이 경로를 우선한다.
     * @param {string=}type 경로를 결정할 타입. image, sound 중 하나
     * @param {string}targetFilePath
     */
    tempResourceDownload(event: Electron.Event, entryObject: ObjectLike, type: string, targetFilePath: string) {
        let typedPath = '';
        if (entryObject.fileurl) {
            typedPath = entryObject.fileurl;
            // 기본 이미지 및 사운드인 경우 상대경로이므로 기준 위치 수정
            if (typedPath.startsWith('renderer')) {
                typedPath = path.resolve(app.getAppPath(), 'src', typedPath);
            }
        } else {
            switch (type) {
                case 'image':
                    typedPath = path.join(
                        Constants.tempImagePath(entryObject.filename),
                        CommonUtils.getFileNameWithExtension(entryObject, 'png'),
                    );
                    break;
                case 'sound':
                    typedPath = path.join(
                        Constants.tempSoundPath(entryObject.filename),
                        CommonUtils.getFileNameWithExtension(entryObject, 'mp3'),
                    );
                    break;
            }
        }

        if (typedPath === '') {
            event.sender.send('tempResourceDownload', new Error('invalid Type'));
        } else {
            MainUtils.downloadFile(typedPath, targetFilePath)
                .then(() => {
                    event.sender.send('tempResourceDownload');
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }

    saveExcel(event: Electron.Event, filePath: string, array: any[]) {
        MainUtils.saveExcel(filePath, array)
            .then(() => {
                event.sender.send('saveExcel');
            })
            .catch((err) => {
                event.sender.send('saveExcel', err);
            });
    }

    writeFile(event: Electron.Event, data: any, filePath: string) {
        MainUtils.writeFile(data, filePath)
            .then(() => {
                event.sender.send('writeFile');
            })
            .catch((err) => {
                event.sender.send('writeFile', err);
            });
    }

    quitApplication() {
        app.quit();
    }

    checkUpdate(event: Electron.Event) {
        checkUpdateRequest()
            .then((data) => {
                event.sender.send('checkUpdate', root.sharedObject.version, data);
            })
            .catch((e) => {
                console.error(e);
            });
    }

    openUrl(event: Electron.Event, url: string) {
        shell.openExternal(url);
    }
}

const helper = new IpcMainHelper();
export default helper;
