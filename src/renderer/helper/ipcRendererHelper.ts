import { ipcRenderer } from 'electron';
import RendererUtils from './rendererUtils';
import StorageManager from './storageManager';
import EntryModalHelper from './entry/entryModalHelper';

/**
 * electron main process 로 통신하기 위해 사용하는 클래스.
 * nodejs lib 사용 혹은 main 에 통신이 한번이상 필요한 경우 이쪽에 둔다.
 */

export default class {
    static onPageLoaded(callback: () => void) {
        ipcRenderer.on('showWindow', () => {
            callback();
        });
    }

    static loadProject(filePath: string): Promise<IEntry.Project> {
        return ipcRenderer.invoke('loadProject', filePath);
    }

    /**
     * 커맨드라인의 filePath 에서 프로젝트를 로드하는 경우 발생하는 함수이다.
     * workspace.jsx 의 constructor 에서 이벤트를 수신한다.
     *
     * .ent 파일을 실행시키는 경우 발생하도록 되어있다.
     *
     * @param{Promise<function>} callback loadProject 프로미스
     */
    static loadProjectFromMain(callback: (project: Promise<IEntry.Project>) => void) {
        ipcRenderer.on('loadProjectFromMain', (e: Electron.IpcRendererEvent, filePath: string) => {
            callback(this.loadProject(filePath));
        });
    }

    static saveProject(project: IEntry.Project, targetPath: string): Promise<void> {
        return ipcRenderer.invoke('saveProject', project, targetPath);
    }

    static resetDirectory(): Promise<void> {
        return ipcRenderer.invoke('resetDirectory');
    }

    static async downloadExcel(filename: string, array: any[]) {
        const filePath = await RendererUtils.showSaveDialogAsync({
            title: RendererUtils.getLang('Workspace.file_save'),
            defaultPath: `${filename}.xlsx`,
            filters: [
                { name: 'Excel Files (*.xlsx)', extensions: ['xlsx'] },
                { name: 'All Files (*.*)', extensions: ['*'] },
            ],
        });
        await ipcRenderer.invoke('saveExcel', filePath, array);
    }

    static staticDownload(unresolvedPath: string[], targetFilePath: string) {
        ipcRenderer.invoke('staticDownload', unresolvedPath, targetFilePath);
    }

    static tempResourceDownload(entryObject: IEntry.Object, type: string, targetFilePath: string) {
        ipcRenderer.invoke('tempResourceDownload', entryObject, type, targetFilePath);
    }

    static writeFile(data: any, filePath: string) {
        ipcRenderer.invoke('writeFile', data, filePath);
    }

    static importPictureFromCanvas(data: any): Promise<IEntry.Picture> {
        return ipcRenderer.invoke('importPictureFromCanvas', data);
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
        return ipcRenderer.invoke('exportObject', filePath, objectVariable);
    }

    static importObjects(filePaths: string[]): Promise<IEntry.Object[]> {
        return ipcRenderer.invoke('importObjects', filePaths);
    }

    static importObjectsFromResource(objects: any): Promise<IEntry.Object[]> {
        return ipcRenderer.invoke('importObjectsFromResource', objects);
    }

    /**
     * 업로드 파일 경로를 temp 로 가져온다.
     * @param {Array!}filePaths 이미지 파일 경로
     * @return {Promise<Object>} 신규생성된 오브젝트 메타데이터
     */
    static importPictures(filePaths: string[]): Promise<IEntry.Picture[]> {
        return ipcRenderer.invoke('importPictures', filePaths);
    }

    /**
     * 리소스 디렉토리에서 파일을 temp 로 가져온다.
     * @param {Array}pictures DB 에서 가져온 이미지 정보 오브젝트
     * @return {Promise<Object>} 파일명이 변경된 이미지 정보 오브젝트
     */
    static importPicturesFromResource(pictures: string[]): Promise<IEntry.Picture[]> {
        return ipcRenderer.invoke('importPicturesFromResource', pictures);
    }

    static importSounds(filePath: string[]): Promise<IEntry.Sound[]> {
        return ipcRenderer.invoke('importSounds', filePath);
    }

    static importSoundsFromResource(sounds: any[]): Promise<IEntry.Sound[]> {
        return ipcRenderer.invoke('importSoundsFromResource', sounds);
    }

    static quitApplication() {
        ipcRenderer.invoke('quit');
    }

    static openAboutPage() {
        ipcRenderer.send('openAboutWindow');
    }

    static openHardwarePage() {
        ipcRenderer.send('openHardwareWindow');
    }

    static async checkUpdate() {
        const [
            currentVersion,
            { hasNewVersion, version: latestVersion },
        ]: [string, { hasNewVersion: string, version: string }] = await ipcRenderer.invoke('checkUpdate');

        /**
         latestVersion properties
         @property hasNewVersion{boolean} 요청을 보냈을때의 버전과 비교하여 업데이트가 필요한지 여부
         @property padded_version{string} ex) '0002.0000.0002' 비교를 위한 패딩
         @property version{string} ex) 2.0.2 원래 버전
         @property _id{string} ex) 저장된 mongoDB 오브젝트 ID
         */
        console.log(
            `currentVersion : ${currentVersion
            }\nrecentVersion: ${latestVersion
            }\nneedUpdate: ${hasNewVersion
            }`);
        const lastDontShowCheckedVersion = StorageManager.getLastDontShowVersion();
        // 다시보지않음을 클릭하지 않았거나, 클릭했지만 당시보다 더 높은 버전이 나온 경우 출력
        if (
            latestVersion > currentVersion &&
            (!lastDontShowCheckedVersion || (latestVersion > lastDontShowCheckedVersion))
        ) {
            EntryModalHelper.showUpdateCheckModal(latestVersion);
            StorageManager.setLastCheckedVersion(latestVersion);
        }
    }

    static openExternalUrl(url: string) {
        ipcRenderer.invoke('openUrl', url);
    }

    static checkAudioPermission() {
        return ipcRenderer.invoke('checkPermission', 'microphone');
    }
}
