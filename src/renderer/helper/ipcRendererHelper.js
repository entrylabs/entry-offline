import { ipcRenderer } from 'electron';

export default class {
    static loadProject(filePath) {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('decompress', filePath);
            ipcRenderer.once('decompress', (e, result) => {
                console.log('decompressOnComplete', e, result);
                if (result instanceof Error) {
                    reject(result);
                } else {
                    resolve(result);
                }
            });
        });
    }

    /**
     * 프로젝트를 ent 파일로 저장한다.
     * @param {Object}project 저장할 프로젝트
     * @param {string}targetPath 저장할 위치
     * @return {Promise} 성공시 resolve(), 실패시 reject(error)
     */
    static saveProject(project, targetPath) {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('saveProject', [project, targetPath]);
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
