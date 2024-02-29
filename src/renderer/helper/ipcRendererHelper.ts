import RendererUtils from './rendererUtils';
import StorageManager from './storageManager';
import EntryModalHelper from './entry/entryModalHelper';

const { ipcInvoke } = window;

/**
 * electron main process 로 통신하기 위해 사용하는 클래스.
 * nodejs lib 사용 혹은 main 에 통신이 한번이상 필요한 경우 이쪽에 둔다.
 */

export default class {
    static loadProject(filePath: string) {
        return ipcInvoke<IEntry.Project>('loadProject', filePath);
    }

    static saveProject(project: IEntry.Project, targetPath: string) {
        return ipcInvoke<void>('saveProject', project, targetPath);
    }

    static resetDirectory() {
        return ipcInvoke<void>('resetDirectory');
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
        await ipcInvoke('saveExcel', filePath, array);
    }

    static staticDownload(unresolvedPath: string[], targetFilePath: string) {
        ipcInvoke('staticDownload', unresolvedPath, targetFilePath);
    }

    static tempResourceDownload(entryObject: IEntry.Object, type: string, targetFilePath: string) {
        const convertObject = { fileurl: entryObject.fileurl, filename: entryObject.name };
        ipcInvoke('tempResourceDownload', convertObject, type, targetFilePath);
    }

    static writeFile(data: any, filePath: string) {
        ipcInvoke('writeFile', data, filePath);
    }

    static importPictureFromCanvas(data: any) {
        return ipcInvoke<IEntry.Picture>('importPictureFromCanvas', data);
    }

    static captureBlockImage(images: any, savePath: string) {
        return ipcInvoke<string>('captureBlockImage', images, savePath);
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
    static exportObject(filePath: string, objectVariable: any) {
        return ipcInvoke<void>('exportObject', filePath, objectVariable);
    }

    static importObjects(filePaths: string[]) {
        return ipcInvoke<IEntry.Object[]>('importObjects', filePaths);
    }

    static importObjectsFromResource(objects: any) {
        return ipcInvoke<IEntry.Object[]>('importObjectsFromResource', objects);
    }

    /**
     * 업로드 파일 경로를 temp 로 가져온다.
     * @param {Array!}filePaths 이미지 파일 경로
     * @return {Promise<Object>} 신규생성된 오브젝트 메타데이터
     */
    static importPictures(filePaths: string[]) {
        return ipcInvoke<IEntry.Picture[]>('importPictures', filePaths);
    }

    /**
     * 리소스 디렉토리에서 파일을 temp 로 가져온다.
     * @param {Array}pictures DB 에서 가져온 이미지 정보 오브젝트
     * @return {Promise<Object>} 파일명이 변경된 이미지 정보 오브젝트
     */
    static importPicturesFromResource(pictures: string[]) {
        return ipcInvoke<IEntry.Picture[]>('importPicturesFromResource', pictures);
    }

    static importSounds(filePath: string[]) {
        return ipcInvoke<IEntry.Sound[]>('importSounds', filePath);
    }

    static importSoundsFromResource(sounds: any[]) {
        return ipcInvoke<IEntry.Sound[]>('importSoundsFromResource', sounds);
    }

    static createTableInfo(filePaths: string[]) {
        return ipcInvoke('createTableInfo', filePaths);
    }

    static getTable(hashId: string) {
        return ipcInvoke('getTable', hashId);
    }

    static openHardwarePage() {
        window.openHardwarePage();
    }

    static async checkUpdate() {
        const [currentVersion, { hasNewVersion, recentVersion: latestVersion }] = await ipcInvoke<
            [string, { hasNewVersion: string; recentVersion: string }]
        >('checkUpdate');
        /**
         latestVersion properties
         @property hasNewVersion{boolean} 요청을 보냈을때의 버전과 비교하여 업데이트가 필요한지 여부
         @property padded_version{string} ex) '0002.0000.0002' 비교를 위한 패딩
         @property version{string} ex) 2.0.2 원래 버전
         @property _id{string} ex) 저장된 mongoDB 오브젝트 ID
         */
        console.log(
            `currentVersion : ${currentVersion}\nrecentVersion: ${latestVersion}\nneedUpdate: ${hasNewVersion}`
        );
        const lastDontShowCheckedVersion = StorageManager.getLastDontShowVersion();
        // 다시보지않음을 클릭하지 않았거나, 클릭했지만 당시보다 더 높은 버전이 나온 경우 출력
        if (
            latestVersion > currentVersion &&
            (!lastDontShowCheckedVersion || latestVersion > lastDontShowCheckedVersion)
        ) {
            EntryModalHelper.showUpdateCheckModal(latestVersion);
            StorageManager.setLastCheckedVersion(latestVersion);
        }
    }

    static openEntryWebPage() {
        window.openEntryWebPage();
    }

    static checkAudioPermission() {
        return window.checkPermission('microphone');
    }
    static checkVideoPermission() {
        return window.checkPermission('camera');
    }

    static saveSoundBuffer(buffer: ArrayBuffer, prevFileUrl: string) {
        return ipcInvoke('saveSoundBuffer', buffer, prevFileUrl);
    }
}
