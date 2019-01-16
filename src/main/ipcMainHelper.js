import { ipcMain } from 'electron';
import MainUtils from './MainUtils';

class IpcMainHelper {
    constructor() {
        ipcMain.on('resetDirectory', this.resetSaveDirectory.bind(this));
        ipcMain.on('loadProject', this.loadProject.bind(this));
        ipcMain.on('saveProject', this.saveProject.bind(this));
        ipcMain.on('exportObject', MainUtils.exportObject);
        ipcMain.on('importObject', MainUtils.importObject);
    }

    resetSaveDirectory() {
        MainUtils.resetSaveDirectory();
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
}

new IpcMainHelper();
export default IpcMainHelper;
