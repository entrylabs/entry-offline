import { ipcRenderer } from 'electron';
import RendererUtils from './rendererUtils';
import StorageManager from './storageManager';
import EntryModalHelper from './entry/entryModalHelper';

/**
 * electron main process 로 통신하기 위해 사용하는 클래스.
 * nodejs lib 사용 혹은 main 에 통신이 한번이상 필요한 경우 이쪽에 둔다.
 */
export default class {
    static onPageLoaded(callback) {
        ipcRenderer.on('showWindow', () => {
            callback();
        });
    }

    static loadProject(filePath) {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('loadProject', filePath);
            ipcRenderer.once('loadProject', (e, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(result);
                }
            });
        });
    }

    /**
     * 커맨드라인의 filePath 에서 프로젝트를 로드하는 경우 발생하는 함수이다.
     * workspace.jsx 의 constructor 에서 이벤트를 수신한다.
     *
     * .ent 파일을 실행시키는 경우 발생하도록 되어있다.
     *
     * @param{Promise<function>} callback loadProject 프로미스
     */
    static loadProjectFromMain(callback) {
        ipcRenderer.on('loadProjectFromMain', (e, filePath) => {
            callback(this.loadProject(filePath));
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
        return new Promise((resolve) => {
            ipcRenderer.send('resetDirectory');
            ipcRenderer.once('resetDirectory', resolve);
        });
    }

    static downloadExcel(filename, array) {
        return new Promise((resolve, reject) => {
            RendererUtils.showSaveDialog(
                {
                    title: RendererUtils.getLang('Workspace.file_save'),
                    defaultPath: `${filename}.xlsx`,
                    filters: {
                        'application/vnd.ms-excel': [
                            { name: 'Excel Files (*.xlsx)', extensions: ['xlsx'] },
                            { name: 'All Files (*.*)', extensions: ['*'] },
                        ],
                    },
                },
                (filePath) => {
                    ipcRenderer.send('saveExcel', filePath, array);
                    ipcRenderer.once('saveExcel', (e, err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                }
            );
        });
    }

    static staticDownload(unresolvedPath, targetFilePath) {
        ipcRenderer.send('staticDownload', unresolvedPath, targetFilePath);
    }

    static tempResourceDownload(entryObject, type, targetFilePath) {
        ipcRenderer.send('tempResourceDownload', entryObject, type, targetFilePath);
    }

    static writeFile(data, filePath) {
        ipcRenderer.send('writeFile', data, filePath);
        ipcRenderer.once('writeFile', (e, err) => {
            if (err) {
                console.error(err);
            }
        });
    }

    static importPictureFromCanvas(data) {
        return new Promise((resolve) => {
            ipcRenderer.send('importPictureFromCanvas', data);
            ipcRenderer.once('importPictureFromCanvas', (e, object) => {
                resolve(object);
            });
        });
    }

    /**
     * 오브젝트를 eo 파일로 만들어서 외부로 저장한다.
     * 이 이벤트는 일반적으로 entryUtils 를 거쳐서 발생된다.
     * 인식가능한 형태로 만들기 전에 선처리 로직이 있기 때문이다.
     *
     * @see entryUtils.exportObject
     * @param filePath 저장할 파일 전체경로
     * @param objectVariable
     */
    static exportObject(filePath, objectVariable) {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('exportObject', filePath, objectVariable);
            ipcRenderer.once('exportObject', (e, result) => {
                //NOTE Entry.Toast 라도 주면 좋겠는데 real 에도 아무반응 없네요.
                resolve();
            });
        });
    }

    static importObjects(filePaths) {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('importObjects', filePaths);
            ipcRenderer.once('importObjects', (e, object) => {
                resolve(object);
            });
        });
    }

    static importObjectsFromResource(objects) {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('importObjectsFromResource', objects);
            ipcRenderer.once('importObjectsFromResource', (e, objects) => {
                resolve(objects);
            });
        });
    }

    /**
     * 업로드 파일 경로를 temp 로 가져온다.
     * @param {Array!}filePaths 이미지 파일 경로
     * @return {Promise<Object>} 신규생성된 오브젝트 메타데이터
     */
    static importPictures(filePaths) {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('importPictures', filePaths);
            ipcRenderer.once('importPictures', (e, object) => {
                resolve(object);
            });
        });
    }

    /**
     * 리소스 디렉토리에서 파일을 temp 로 가져온다.
     * @param {Array}pictures DB 에서 가져온 이미지 정보 오브젝트
     * @return {Promise<Object>} 파일명이 변경된 이미지 정보 오브젝트
     */
    static importPicturesFromResource(pictures) {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('importPicturesFromResource', pictures);
            ipcRenderer.once('importPicturesFromResource', (e, object) => {
                resolve(object);
            });
        });
    }

    static importSounds(filePath) {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('importSounds', filePath);
            ipcRenderer.once('importSounds', (e, object) => {
                resolve(object);
            });
        });
    }

    static importSoundsFromResource(sounds) {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('importSoundsFromResource', sounds);
            ipcRenderer.once('importSoundsFromResource', (e, object) => {
                resolve(object);
            });
        });
    }

    static quitApplication() {
        ipcRenderer.send('quit');
    }

    static openAboutPage() {
        ipcRenderer.send('openAboutWindow');
    }

    static openHardwarePage(curLang) {
        ipcRenderer.send('openHardwareWindow', curLang);
    }

    static checkUpdate() {
        return new Promise((resolve) => {
            ipcRenderer.send('checkUpdate');
            ipcRenderer.once('checkUpdate',(e, currentVersion, {
                hasNewVersion, version : latestVersion,
            }) => {
                /**
                 latestVersion properties
                 @property hasNewVersion{boolean} 요청을 보냈을때의 버전과 비교하여 업데이트가 필요한지 여부
                 @property padded_version{string} ex) '0002.0000.0002' 비교를 위한 패딩
                 @property version{string} ex) 2.0.2 원래 버전
                 @property _id{string} ex) 저장된 mongoDB 오브젝트 ID
                 */
                console.log(currentVersion, hasNewVersion, latestVersion);
                const lastDontShowCheckedVersion = StorageManager.getLastDontShowVersion();
                // 다시보지않음을 클릭하지 않았거나, 클릭했지만 당시보다 더 높은 버전이 나온 경우 출력
                if ((!lastDontShowCheckedVersion || (lastDontShowCheckedVersion < latestVersion)) && hasNewVersion) {
                    EntryModalHelper.showUpdateCheckModal(latestVersion);
                    StorageManager.setLastCheckedVersion(latestVersion);
                }
                resolve();
            });
        });
    }

    static openExternalUrl(url) {
        ipcRenderer.send('openUrl', url);
    }
}
