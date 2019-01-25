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
        ipcMain.on('staticDownload', this.staticDownload.bind(this));
        ipcMain.on('resetDirectory', this.resetSaveDirectory.bind(this));
        ipcMain.on('loadProject', this.loadProject.bind(this));
        ipcMain.on('saveProject', this.saveProject.bind(this));
        ipcMain.on('exportObject', async(e, filePath, object) => {
            await MainUtils.exportObject(e, filePath, object);
        });
        ipcMain.on('importObject', MainUtils.importObject);
        ipcMain.on('importPicture', this.importPicture.bind(this));
        ipcMain.on('importSound', this.importSound.bind(this));
        ipcMain.on('importPictureFromResource', this.importPictureFromResource.bind(this));
    }

    resetSaveDirectory() {
        MainUtils.resetSaveDirectory();
    }

    staticDownload(event, unresolvedFilePathArray, targetFilePath) {
        const resolvedFilePath = path.join(...unresolvedFilePathArray);
        MainUtils.staticDownload(resolvedFilePath, targetFilePath);
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

    saveProject(event, project, targetPath) {
        MainUtils.saveProject(project, targetPath)
            .then(() => {
                event.sender.send('saveProject');
            })
            .catch((err) => {
                event.sender.send('saveProject', err);
            });
    }

    // 외부 이미지 업로드시.
    importPicture(event, filePath) {
        MainUtils.importPictureToTemp(filePath)
            .then((object) => {
                event.sender.send('importPicture', object);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    importPictureFromResource(event, picture) {
        MainUtils.importPictureFromResource(picture)
            .then((object) => {
                event.sender.send('importPictureFromResource', object);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    importSound(event, filePath) {
        MainUtils.importSound(filePath)
            .then((object) => {
                event.sender.send('importSound', object);
            })
            .catch((err) => {
                console.error(err);
            });
    }
}

new IpcMainHelper();
export default IpcMainHelper;
