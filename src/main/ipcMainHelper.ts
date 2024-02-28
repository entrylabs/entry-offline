import { app, ipcMain, IpcMainInvokeEvent, shell, systemPreferences } from 'electron';
import path from 'path';
import MainUtils from './mainUtils';
import DataTableManager from './dataTable/dataTableManager';
import Constants from './constants';
import CommonUtils from './commonUtils';
import checkUpdateRequest from './utils/network/checkUpdate';
import createLogger from './utils/functions/createLogger';
import isValidAsarFile from './utils/functions/isValidAsarFile';
require('@electron/remote/main').initialize();

const logger = createLogger('main/ipcMainHelper.ts');
/**
 * ipc process 의 이벤트를 등록한다.
 * 실제 로직은 mainUtils 에서 동작한다.
 * MVC 의 Controller 와 비슷한 역할을 한다.
 * 추가하는 로직은 일반적으로 다음 프로세스에 들어갈 인자의 가공이다.
 *
 * main.js 에서 선언되어있다.
 * 이 클래스의 ipc event 들은 mainWindow, workspace 와 관련이 있다.
 */
new (class {
    constructor() {
        ipcMain.handle('saveProject', this.saveProject.bind(this));
        ipcMain.handle('loadProject', this.loadProject.bind(this));
        ipcMain.handle('resetDirectory', this.resetSaveDirectory.bind(this));
        ipcMain.handle('exportObject', this.exportObject.bind(this));
        ipcMain.handle('importObjects', this.importObjects.bind(this));
        ipcMain.handle('importObjectsFromResource', this.importObjectsFromResource.bind(this));
        ipcMain.handle('importPictures', this.importPictures.bind(this));
        ipcMain.handle('importPicturesFromResource', this.importPicturesFromResource.bind(this));
        ipcMain.handle('importPictureFromCanvas', this.importPictureFromCanvas.bind(this));
        ipcMain.handle('captureBlockImage', this.captureBlockImage.bind(this));
        ipcMain.handle('importSounds', this.importSounds.bind(this));
        ipcMain.handle('importSoundsFromResource', this.importSoundsFromResource.bind(this));
        ipcMain.handle('createTableInfo', this.createTables.bind(this));
        ipcMain.handle('getTable', this.getTable.bind(this));
        ipcMain.handle('staticDownload', this.staticDownload.bind(this));
        ipcMain.handle('tempResourceDownload', this.tempResourceDownload.bind(this));
        ipcMain.handle('saveExcel', this.saveExcel.bind(this));
        ipcMain.handle('writeFile', this.writeFile.bind(this));
        ipcMain.handle('openUrl', this.openUrl.bind(this));
        ipcMain.handle('checkUpdate', this.checkUpdate.bind(this));
        ipcMain.handle('quit', this.quitApplication.bind(this));
        ipcMain.handle('checkPermission', this.checkPermission.bind(this));
        ipcMain.handle('getOpenSourceText', () => ''); // 별다른 표기 필요없음
        ipcMain.handle('isValidAsarFile', this.checkIsValidAsarFile.bind(this));
        ipcMain.handle('saveSoundBuffer', this.saveSoundBuffer.bind(this));
    }

    async saveProject(event: IpcMainInvokeEvent, project: ObjectLike, targetPath: string) {
        logger.verbose(`saveProject called, ${targetPath}`);
        return await MainUtils.saveProject(project, targetPath);
    }

    async loadProject(event: IpcMainInvokeEvent, filePath: string) {
        logger.verbose(`loadProject called, ${filePath}`);
        try {
            return await MainUtils.loadProject(filePath);
        } catch (e) {
            logger.error('loadProject failed, ${e.message}');
            throw e;
        }
    }

    async resetSaveDirectory() {
        logger.verbose('resetSaveDirectory called');
        await MainUtils.resetSaveDirectory();
    }

    async exportObject(event: IpcMainInvokeEvent, filePath: string, object: any) {
        logger.verbose(`exportObject called, ${filePath}`);
        await MainUtils.exportObject(filePath, object);
    }

    async importObjects(event: IpcMainInvokeEvent, filePaths: string[]) {
        logger.verbose(`importObjects called, ${filePaths}`);
        if (!filePaths || filePaths.length === 0) {
            return [];
        }

        return await MainUtils.importObjects(filePaths);
    }

    async importObjectsFromResource(event: IpcMainInvokeEvent, objects: ObjectLike[]) {
        if (!objects || objects.length === 0) {
            logger.warn('importObjectsFromResource event called with no objects argument');
            return [];
        }

        return await MainUtils.importObjectsFromResource(objects);
    }

    // 외부 이미지 업로드시.
    async importPictures(event: IpcMainInvokeEvent, filePaths: string[]) {
        logger.verbose(`importPictures called ${filePaths}`);
        if (!filePaths || filePaths.length === 0) {
            return [];
        }

        return await MainUtils.importPicturesToTemp(filePaths, event.sender);
    }

    async importPicturesFromResource(event: IpcMainInvokeEvent, pictures: ObjectLike[]) {
        return await MainUtils.importPicturesFromResource(pictures);
    }

    async importPictureFromCanvas(event: IpcMainInvokeEvent, data: ObjectLike[]) {
        logger.verbose('importPictureFromCanvas called');
        return await MainUtils.importPictureFromCanvas(data);
    }

    async captureBlockImage(event: IpcMainInvokeEvent, images: any, filePath: string) {
        return await MainUtils.captureBlockImage(images, filePath);
    }

    async importSounds(event: IpcMainInvokeEvent, filePaths: string[]) {
        logger.verbose(`importSounds called ${filePaths}`);
        if (!filePaths || filePaths.length === 0) {
            return [];
        }

        return await MainUtils.importSoundsToTemp(filePaths);
    }

    async importSoundsFromResource(event: IpcMainInvokeEvent, sounds: ObjectLike[]) {
        return await MainUtils.importSoundsFromResource(sounds);
    }

    async createTables(event: IpcMainInvokeEvent, filePaths: string[]) {
        return await Promise.all(
            filePaths.map(DataTableManager.makeTableInfo.bind(DataTableManager))
        );
    }

    async getTable(event: IpcMainInvokeEvent, hashId: string) {
        return DataTableManager.getTable(hashId);
    }

    /**
     * main/static 아래의 데이터를 다운로드 한다.
     * @param event
     * @param {Array<string>}unresolvedFilePathArray separator 가 없는 경로 목록
     * @param targetFilePath
     */
    async staticDownload(
        event: IpcMainInvokeEvent,
        unresolvedFilePathArray: string[],
        targetFilePath: string
    ) {
        const resolvedFilePath = path.join(...unresolvedFilePathArray);
        const staticFilePath = path.resolve(
            app.getAppPath(),
            'src',
            'main',
            'static',
            resolvedFilePath
        );
        await MainUtils.downloadFile(staticFilePath, targetFilePath).catch((err) => {
            console.error(err);
        });
    }

    /**
     * temp 에 있는 리소스를 다운로드 한다. fileurl 이 있는 경우 이를 우선한다.
     * 이미지, 사운드 개별 다운로드에 사용된다.
     *
     * @param event
     * @param {Object}entryObject 다운로드할 엔트리 오브젝트 정보. fileurl 이 존재하면 이 경로를 우선한다.
     * @param {string=}type 경로를 결정할 타입. image, sound 중 하나
     * @param {string}targetFilePath
     */
    async tempResourceDownload(
        event: IpcMainInvokeEvent,
        entryObject: any,
        type: string,
        targetFilePath: string
    ) {
        let typedPath = '';
        if (entryObject.fileurl) {
            typedPath = entryObject.fileurl;
            // 기본 이미지 및 사운드인 경우 상대경로이므로 기준 위치 수정
            if (typedPath.startsWith('renderer')) {
                typedPath = path.resolve(app.getAppPath(), 'src', typedPath);
            } else if (typedPath.startsWith('../../..')) {
                typedPath = typedPath.replace('../../../', '');
                typedPath = path.resolve(app.getAppPath(), typedPath);
            }
        } else {
            switch (type) {
                case 'image':
                    typedPath = path.join(
                        Constants.tempImagePath(entryObject.filename),
                        CommonUtils.getFileNameWithExtension(entryObject, 'png')
                    );
                    break;
                case 'sound':
                    typedPath = path.join(
                        Constants.tempSoundPath(entryObject.filename),
                        CommonUtils.getFileNameWithExtension(entryObject, 'mp3')
                    );
                    break;
            }
        }

        if (typedPath === '') {
            throw new Error('invalid Type');
        } else {
            return await MainUtils.downloadFile(typedPath, targetFilePath);
        }
    }

    async saveExcel(event: IpcMainInvokeEvent, filePath: string, array: any[]) {
        return await MainUtils.saveExcel(filePath, array);
    }

    async writeFile(event: IpcMainInvokeEvent, data: any, filePath: string) {
        return await MainUtils.writeFile(data, filePath);
    }

    quitApplication() {
        app.quit();
    }

    async checkPermission(event: IpcMainInvokeEvent, type: 'microphone' | 'camera') {
        if (process.platform === 'darwin') {
            logger.info(`[MacOS] input Media ${type} permission requested,`);
            const accessStatus = systemPreferences.getMediaAccessStatus(type);
            if (accessStatus !== 'granted') {
                await systemPreferences.askForMediaAccess('microphone');
                await systemPreferences.askForMediaAccess('camera');
            }
        }
    }

    async checkIsValidAsarFile(event: IpcMainInvokeEvent) {
        try {
            const result = await isValidAsarFile();
            console.log('isValidAsarFile', result);
            return result;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async checkUpdate() {
        const data = await checkUpdateRequest();
        return [global.sharedObject.version, data];
    }

    async saveSoundBuffer(event: IpcMainInvokeEvent, buffer: ArrayBuffer, prevFileUrl: string) {
        return MainUtils.saveSoundBuffer(buffer, prevFileUrl);
    }

    openUrl(event: IpcMainInvokeEvent, url: string) {
        logger.info(`openUrl called : ${url}`);
        shell.openExternal(url);
    }
})();
