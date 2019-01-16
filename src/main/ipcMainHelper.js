import { ipcMain, app } from 'electron';
import zlib from 'zlib';
import fs from 'fs';
import tar from 'tar';
import stream from 'stream';
import path from 'path';
import fstream from 'fstream';
import MainUtils from './MainUtils';

/* eslint-disable new-cap */
class IpcMainHelper {
    constructor() {
        ipcMain.on('resetDirectory', this.resetSaveDirectory.bind(this));
        ipcMain.on('loadProject', this.loadProject.bind(this));
        ipcMain.on('saveProject', this.saveProject.bind(this));
    }

    resetSaveDirectory() {
        MainUtils.deleteFolderRecursive(path.resolve(app.getPath('userData'), 'temp'));
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
