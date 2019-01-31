import { ipcMain } from 'electron';
import path from 'path';
import MainUtils from './MainUtils';

/**
 * ipc process 의 이벤트를 등록한다.
 * 실제 로직은 mainUtils 에서 동작한다.
 * TODO 추가적으로 MainUtils 에서 더 공통으로 뺄 수 있는 부분은 common.utils 를 활용하도록 할 예정
 */
class IpcMainHelper {
    constructor() {
        ipcMain.on('saveProject', this.saveProject.bind(this));
        ipcMain.on('loadProject', this.loadProject.bind(this));
        ipcMain.on('resetDirectory', this.resetSaveDirectory.bind(this));
        ipcMain.on('exportObject', this.exportObject.bind(this));
        ipcMain.on('importObjects', this.importObjects.bind(this));
        ipcMain.on('importPictures', this.importPictures.bind(this));
        ipcMain.on('importPicturesFromResource', this.importPicturesFromResource.bind(this));
        ipcMain.on('importSounds', this.importSounds.bind(this));
        ipcMain.on('importSoundsFromResource', this.importSoundsFromResource.bind(this));
        ipcMain.on('staticDownload', this.staticDownload.bind(this));
        ipcMain.on('saveExcel', this.saveExcel.bind(this));
    }

    saveProject(event, project, targetPath) {
        MainUtils.saveProject(project, targetPath)
            .then(() => {
                event.sender.send('saveProject');
            })
            .catch((err) => {
                event.sender.send('saveProject', err);
            });
    }

    loadProject(event, filePath) {
        MainUtils.loadProject(filePath)
            .then((project) => {
                event.sender.send('loadProject', project);
            })
            .catch((err) => {
                event.sender.send('loadProject', err);
            });
    }

    resetSaveDirectory() {
        MainUtils.resetSaveDirectory();
    }

    exportObject(event, filePath, object) {
        MainUtils.exportObject(filePath, object)
            .then(() => {
                event.sender.send('exportObject');
            })
            .catch((err) => {
                console.error(err);
            });
    }

    importObjects(event, filePaths) {
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

    // 외부 이미지 업로드시.
    importPictures(event, filePaths) {
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

    importPicturesFromResource(event, pictures) {
        MainUtils.importPicturesFromResource(pictures)
            .then((object) => {
                event.sender.send('importPicturesFromResource', object);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    importSounds(event, filePaths) {
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

    importSoundsFromResource(event, sounds) {
        MainUtils.importSoundsFromResource(sounds)
            .then((object) => {
                event.sender.send('importSoundsFromResource', object);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    staticDownload(event, unresolvedFilePathArray, targetFilePath) {
        const resolvedFilePath = path.join(...unresolvedFilePathArray);
        MainUtils.staticDownload(resolvedFilePath, targetFilePath);
    }

    saveExcel(event, filePath, array) {
        MainUtils.saveExcel(filePath, array)
            .then(() => {
                event.sender.send('saveExcel');
            })
            .catch((err) => {
                event.sender.send('saveExcel', err);
            });
    }
}

new IpcMainHelper();
export default IpcMainHelper;
