import { ipcRenderer } from 'electron';
import RendererUtils from './rendererUtils';
import StorageManager from './storageManager';
import EntryModalHelper from './entry/entryModalHelper';

/**
 * electron main process 로 통신하기 위해 사용하는 클래스.
 * nodejs lib 사용 혹은 main 에 통신이 한번이상 필요한 경우 이쪽에 둔다.
 */
ipcRenderer.on('console', (event: Electron.Event, ...args: any[]) => {
    console.log(...args);
});

export default class {
    static onPageLoaded(callback: () => void) {
        ipcRenderer.on('showWindow', () => {
            callback();
        });
    }

    static loadProject(filePath: string): Promise<Entry.Project> {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('loadProject', filePath);
            ipcRenderer.once('loadProject', (e: Electron.Event, result: Entry.Project) => {
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
    static loadProjectFromMain(callback: (project: Promise<Entry.Project>) => void) {
        ipcRenderer.on('loadProjectFromMain', (e: Electron.Event, filePath: string) => {
            callback(this.loadProject(filePath));
        });
    }

    static saveProject(project: Entry.Project, targetPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('saveProject', project, targetPath);
            ipcRenderer.once('saveProject', (e: Electron.Event, err: Error) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    static resetDirectory(): Promise<void> {
        return new Promise((resolve) => {
            ipcRenderer.send('resetDirectory');
            ipcRenderer.once('resetDirectory', resolve);
        });
    }

    static downloadExcel(filename: string, array: any[]) {
        return new Promise((resolve, reject) => {
            RendererUtils.showSaveDialog(
                {
                    title: RendererUtils.getLang('Workspace.file_save'),
                    defaultPath: `${filename}.xlsx`,
                    filters: [
                        { name: 'Excel Files (*.xlsx)', extensions: ['xlsx'] },
                        { name: 'All Files (*.*)', extensions: ['*'] },
                    ],
                },
                (filePath: string) => {
                    ipcRenderer.send('saveExcel', filePath, array);
                    ipcRenderer.once('saveExcel', (e: Electron.Event, err: Error) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                },
            );
        });
    }

    static staticDownload(unresolvedPath: string[], targetFilePath: string) {
        ipcRenderer.send('staticDownload', unresolvedPath, targetFilePath);
    }

    static tempResourceDownload(entryObject: Entry.Object, type: string, targetFilePath: string) {
        ipcRenderer.send('tempResourceDownload', entryObject, type, targetFilePath);
    }

    static writeFile(data: any, filePath: string) {
        ipcRenderer.send('writeFile', data, filePath);
        ipcRenderer.once('writeFile', (e: Electron.Event, err: Error) => {
            if (err) {
                console.error(err);
            }
        });
    }

    static importPictureFromCanvas(data: any): Promise<Entry.Picture> {
        return new Promise((resolve) => {
            ipcRenderer.send('importPictureFromCanvas', data);
            ipcRenderer.once('importPictureFromCanvas', (e: Electron.Event, object: Entry.Picture) => {
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
    static exportObject(filePath: string, objectVariable: any): Promise<void> {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('exportObject', filePath, objectVariable);
            ipcRenderer.once('exportObject', (e: Electron.Event, result: any) => {
                //NOTE Entry.Toast 라도 주면 좋겠는데 real 에도 아무반응 없네요.
                resolve();
            });
        });
    }

    static importObjects(filePaths: string[]): Promise<Entry.Object[]> {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('importObjects', filePaths);
            ipcRenderer.once('importObjects', (e: Electron.Event, object: Entry.Object[]) => {
                resolve(object);
            });
        });
    }

    static importObjectsFromResource(objects: any): Promise<Entry.Object[]> {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('importObjectsFromResource', objects);
            ipcRenderer.once('importObjectsFromResource', (e: Electron.Event, objects: Entry.Object[]) => {
                resolve(objects);
            });
        });
    }

    /**
     * 업로드 파일 경로를 temp 로 가져온다.
     * @param {Array!}filePaths 이미지 파일 경로
     * @return {Promise<Object>} 신규생성된 오브젝트 메타데이터
     */
    static importPictures(filePaths: string[]): Promise<Entry.Picture[]> {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('importPictures', filePaths);
            ipcRenderer.once('importPictures', (e: Electron.Event, object: Entry.Picture[]) => {
                resolve(object);
            });
        });
    }

    /**
     * 리소스 디렉토리에서 파일을 temp 로 가져온다.
     * @param {Array}pictures DB 에서 가져온 이미지 정보 오브젝트
     * @return {Promise<Object>} 파일명이 변경된 이미지 정보 오브젝트
     */
    static importPicturesFromResource(pictures: string[]): Promise<Entry.Picture[]> {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('importPicturesFromResource', pictures);
            ipcRenderer.once('importPicturesFromResource', (e: Electron.Event, object: Entry.Picture[]) => {
                resolve(object);
            });
        });
    }

    static importSounds(filePath: string[]): Promise<Entry.Sound[]> {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('importSounds', filePath);
            ipcRenderer.once('importSounds', (e: Electron.Event, object: Entry.Sound[]) => {
                resolve(object);
            });
        });
    }

    static importSoundsFromResource(sounds: any[]): Promise<Entry.Sound[]> {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('importSoundsFromResource', sounds);
            ipcRenderer.once('importSoundsFromResource', (e: Electron.Event, object: Entry.Sound[]) => {
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

    static openHardwarePage() {
        ipcRenderer.send('openHardwareWindow');
    }

    static checkUpdate() {
        return new Promise((resolve) => {
            ipcRenderer.send('checkUpdate');
            ipcRenderer.once('checkUpdate', (e: Electron.Event, currentVersion: string, {
                hasNewVersion, version: latestVersion,
            }: { hasNewVersion: string, version: string }) => {
                /**
                 latestVersion properties
                 @property hasNewVersion{boolean} 요청을 보냈을때의 버전과 비교하여 업데이트가 필요한지 여부
                 @property padded_version{string} ex) '0002.0000.0002' 비교를 위한 패딩
                 @property version{string} ex) 2.0.2 원래 버전
                 @property _id{string} ex) 저장된 mongoDB 오브젝트 ID
                 */
                console.log(`currentVersion : ${currentVersion}\nrecentVersion: ${latestVersion}\nneedUpdate: ${hasNewVersion}`);
                const lastDontShowCheckedVersion = StorageManager.getLastDontShowVersion();
                // 다시보지않음을 클릭하지 않았거나, 클릭했지만 당시보다 더 높은 버전이 나온 경우 출력
                if (
                    latestVersion > currentVersion &&
                    (!lastDontShowCheckedVersion || (latestVersion > lastDontShowCheckedVersion))
                ) {
                    EntryModalHelper.showUpdateCheckModal(latestVersion);
                    StorageManager.setLastCheckedVersion(latestVersion);
                }
                resolve();
            });
        });
    }

    static openExternalUrl(url: string) {
        ipcRenderer.send('openUrl', url);
    }
}
