import { ipcRenderer } from 'electron';

export default class {
    static loadProject(filePath) {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('loadProject', filePath);
            ipcRenderer.once('loadProject', (e, result) => {
                if (result instanceof Error) {
                    reject(result);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static saveProject(project, targetPath) {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('saveProject', project, targetPath);
            ipcRenderer.once('saveProject', (e, err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    static resetDirectory() {
        ipcRenderer.send('resetDirectory');
    }
}
