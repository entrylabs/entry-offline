import { ipcRenderer } from 'electron';

export default class {
    static loadProject(filePath) {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('decompress', filePath);
            ipcRenderer.once('decompress', (e, result) => {
                if (result instanceof Error) {
                    reject(result);
                } else {
                    resolve(result);
                }
            });
        });
    }
}
