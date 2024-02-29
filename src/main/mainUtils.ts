import { app, ipcMain, WebContents, BrowserWindow } from 'electron';
import fs from 'fs';
import path from 'path';
import xl from 'excel4node';
import { imageSize } from 'image-size';
import * as musicMetadata from 'music-metadata';
import mime from 'mime-types';
import FileUtils, { ImageResizeSize } from './fileUtils';
import Constants, { ReplaceStrategy } from './constants';
import CommonUtils from './commonUtils';
import BlockConverter from './blockConverter';
import createLogger from './utils/functions/createLogger';

const logger = createLogger('main/mainUtils.ts');
const fsp = fs.promises;

type ConvertResult = { filePath: string; svgPath?: string | undefined };
/**
 * Main Process 에서 발생하는 로직들을 담당한다.
 * ipcMain 을 import 하여 사용하지 않는다. renderer Process 간 이벤트 관리는 ipcMainHelper 가 한다.
 */
export default class MainUtils {
    /**
     * ent 파일에서 프로젝트를 로드한다.
     * electron directory 에 압축해제 한 후,
     * project.json 의 object fileUrl 주소를 전부 오프라인용으로 수정한다.
     * 최종적으로는 workspace 에 project object 를 전달한다.
     * @param filePath ent file path
     * @return {Promise<Object>} 성공시 project, 실패시 {Error}err
     */
    static async loadProject(filePath: string) {
        const baseAppPath = Constants.appPath;
        const workingDirectoryPath = path.join(baseAppPath, 'temp');
        const tempDirectoryPath = path.join(baseAppPath, 'uploads', CommonUtils.createFileId());
        await FileUtils.mkdirRecursive(tempDirectoryPath);
        await FileUtils.unpack(filePath, tempDirectoryPath, (path) => path.startsWith('temp/'));

        const projectBuffer = await fsp.readFile(
            path.resolve(tempDirectoryPath, 'temp', 'project.json')
        );
        let project = JSON.parse(projectBuffer.toString('utf8'));

        if (project.objects[0] && project.objects[0].script.substr(0, 4) === '<xml') {
            project = await BlockConverter.convert(project);
        }

        MainUtils.changeObjectsPath(project.objects, Constants.replaceStrategy.fromExternal);

        project.savedPath = filePath; // real .ent file's path

        await MainUtils.resetSaveDirectory();
        await FileUtils.move(path.join(tempDirectoryPath, 'temp'), workingDirectoryPath);

        return project;
    }

    /**
     * 일렉트론 temp 디렉토리를 삭제한다.
     * 이는 새 엔트리 프로젝트를 만들거나 ent 파일이 새로 로드되는 경우 실행된다.
     */
    static resetSaveDirectory() {
        return FileUtils.removeDirectoryRecursive(path.resolve(app.getPath('userData'), 'temp'));
    }

    /**
     * electronPath/temp 내에 있는 프로젝트를 ent 파일로 압축하여 저장한다.
     * @param {Object}project 엔트리 프로젝트
     * @param {string}destinationPath 저장위치 (파일명까지 포함)
     * @return {Promise} 성공시 resolve(), 실패시 reject(err)
     */
    static async saveProject(project: ObjectLike, destinationPath: string) {
        const sourcePath = app.getPath('userData');
        if (destinationPath.indexOf('.ent') === -1) {
            throw new Error('.ent only accepted');
        }

        MainUtils.changeObjectsPath(project.objects, Constants.replaceStrategy.toExternal);

        const projectString = JSON.stringify(project);
        const targetFilePath = path.resolve(sourcePath, 'temp', 'project.json');
        FileUtils.ensureDirectoryExistence(targetFilePath);
        await FileUtils.writeFile(projectString, targetFilePath);
        await FileUtils.pack(path.resolve(sourcePath, 'temp'), destinationPath, undefined, [
            'temp',
        ]);
    }

    /**
     * 오프라인 <-> 엔트리 간 파일경로 동기화.
     * @param {Array<object>} objects 엔트리 프로젝트 내 오브젝트목록.
     * @param {function}replaceStrategy(fileUrl) 변경방법. 기본 전략패턴이 Constants 에 존재
     * @see Constants.replaceStrategy
     * @return {object} 인자로 받은 project 를 그대로 반환한다.
     */
    static changeObjectsPath(objects: any[] = [], replaceStrategy: ReplaceStrategy) {
        objects.forEach((object) => {
            if (!object.sprite) {
                return;
            }

            const { pictures = [], sounds = [] } = object.sprite;
            pictures.forEach((picture: any) => {
                const fileUrl = picture.fileurl;
                if (!fileUrl) {
                    return;
                }
                picture.fileurl = replaceStrategy(fileUrl);
            });
            sounds.forEach((sound: any) => {
                const fileUrl = sound.fileurl;
                if (!fileUrl) {
                    return;
                }
                sound.fileurl = replaceStrategy(fileUrl);
            });
        });
    }

    static exportObject(filePath: string, object: any) {
        return new Promise(async (resolve, reject) => {
            const { objects } = object;

            const objectId = CommonUtils.createFileId();
            const objectName = objects[0].name;
            // renderer/bower_components 를 ./bower_components 로 치환
            MainUtils.changeObjectsPath(objects, Constants.replaceStrategy.toExternalDeleteUrl);
            const exportDirectoryPath = path.resolve(
                Constants.tempPathForExport(objectId),
                'object'
            );
            const objectJsonPath = path.join(exportDirectoryPath, 'object.json');

            const exportFileName = `${objectName}.eo`;
            const exportFile = path.resolve(exportDirectoryPath, '..', exportFileName);

            try {
                FileUtils.ensureDirectoryExistence(objectJsonPath);
                await MainUtils.exportObjectTempFileTo(object, exportDirectoryPath);

                const objectData = typeof object === 'string' ? object : JSON.stringify(object);
                await FileUtils.writeFile(objectData, objectJsonPath);
                await FileUtils.pack(exportFile, filePath);
                await FileUtils.removeDirectoryRecursive(path.join(exportDirectoryPath, '..'));
                resolve(filePath);
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * temp 에 있는 picture, sound 전체 데이터를 복사한다.
     * @param {Object}object 엔트리 오브젝트 메타데이터
     * @param targetDir 저장할 위치
     * @return {Promise<any>}
     */
    static exportObjectTempFileTo(object: ObjectLike, targetDir: string) {
        return new Promise((resolve, reject) => {
            try {
                const copyObjectPromise: Promise<any>[] = [];

                object.objects.forEach((object: ObjectLike) => {
                    object.sprite.sounds.forEach((sound: any) => {
                        copyObjectPromise.push(MainUtils.exportSoundTempFileTo(sound, targetDir));
                    });
                    object.sprite.pictures.forEach((picture: any) => {
                        copyObjectPromise.push(
                            MainUtils.exportPictureTempFileTo(picture, targetDir)
                        );
                    });
                });

                Promise.all(copyObjectPromise)
                    .then(function() {
                        resolve('success');
                    })
                    .catch(function(err) {
                        reject(err);
                    });
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * temp 에 있는 sound 데이터를 target 으로 복사한다.
     * @param sound 엔트리 사운드 오브젝트. filename, ext 가 필요하다.
     * @param targetDir 복사할 경로. 해당 경로 아래 /ab/cd/sound 가 생성된다.
     * @return {Promise<Object>} filename 이 변환된 sound object
     */
    static async exportSoundTempFileTo(sound: ObjectLike, targetDir: string) {
        if (Constants.defaultSoundPath.includes(sound.fileurl)) {
            return sound;
        }
        const fileId = sound.filename;
        const ext = CommonUtils.sanitizeExtension(sound.ext, '.mp3');
        const fileName = `${fileId}${ext}`;
        const newFileId = CommonUtils.createFileId();
        const newFileName = `${newFileId}${ext}`;

        const tempSoundPath = path.resolve(Constants.tempSoundPath(fileId), fileName);

        const targetSoundPath = path.resolve(
            targetDir,
            Constants.subDirectoryPath(newFileId),
            'sound',
            newFileName
        );

        await FileUtils.copyFile(tempSoundPath, targetSoundPath);

        sound.filename = newFileId;
        return sound;
    }

    /**
     * temp 에 있는 picture 데이터를 target 으로 복사한다.
     * @param picture 엔트리 이미지 오브젝트. filename, ext 가 필요하다.
     * @param targetDir 복사할 경로. 해당 경로 아래 /ab/cd/images 와 thumb 가 생성된다.
     * @return {Promise<Object>} filename 이 변환된 picture object
     */
    static async exportPictureTempFileTo(picture: ObjectLike, targetDir: string) {
        if (Constants.defaultPicturePath.includes(picture.fileurl)) {
            return picture;
        }
        const fileId = picture.filename;
        const ext = CommonUtils.sanitizeExtension(picture.ext, '.png');
        const pngFileName = `${fileId}${ext}`;
        const newFileId = CommonUtils.createFileId();
        const newFileName = `${newFileId}${ext}`;

        const tempImagePath = path.join(Constants.tempImagePath(fileId), pngFileName);
        const tempThumbnailPath = path.join(Constants.tempThumbnailPath(fileId), pngFileName);

        const targetImagePath = path.resolve(
            targetDir,
            Constants.subDirectoryPath(newFileId),
            'image',
            newFileName
        );
        const targetThumbnailPath = path.resolve(
            targetDir,
            Constants.subDirectoryPath(newFileId),
            'thumb',
            newFileName
        );

        await FileUtils.copyFile(tempImagePath, targetImagePath);
        await FileUtils.copyFile(tempThumbnailPath, targetThumbnailPath);

        if (picture.imageType === 'svg') {
            const tempSvgImagePath = path.join(Constants.tempImagePath(fileId), `${fileId}.svg`);
            const targetSvgImagePath = path.resolve(
                targetDir,
                Constants.subDirectoryPath(newFileId),
                'image',
                `${newFileId}.svg`
            );
            await FileUtils.copyFile(tempSvgImagePath, targetSvgImagePath);
        }

        picture.filename = newFileId;
        return picture;
    }

    static async importObjects(objectPaths: string[]) {
        return Promise.all(
            objectPaths.map((objectPath) => {
                return MainUtils.importObject(objectPath);
            })
        );
    }

    static importObject(objectPath: string) {
        return new Promise(async (resolve, reject) => {
            const newObjectId = CommonUtils.createFileId();
            const unpackDirectoryPath = Constants.tempPathForExport(newObjectId);
            const unpackedDirectoryPath = path.join(unpackDirectoryPath, 'object');

            try {
                await FileUtils.mkdirRecursive(unpackDirectoryPath); // import 용 디렉토리 생성
                await FileUtils.unpack(objectPath, unpackDirectoryPath); // 압축 해제
                // object.json 읽어오기
                const objectResult = JSON.parse(
                    await FileUtils.readFile(
                        path.join(unpackedDirectoryPath, 'object.json'),
                        'utf8'
                    )
                );

                // 파일 복사 로직
                await Promise.all(
                    objectResult.objects.map(async (object: ObjectLike) => {
                        const { sprite = {} } = object;
                        const { pictures = [], sounds = [] } = sprite;

                        // 이미지 파일 옮김
                        const newPictures = await Promise.all(
                            pictures.map(async (picture: ObjectLike) => {
                                if (Constants.defaultPicturePath.includes(picture.fileurl)) {
                                    // selectedPicture 체크로직
                                    const selectedPictureId = object.selectedPictureId;
                                    if (picture.id === selectedPictureId) {
                                        object.selectedPicture = picture;
                                    }

                                    return picture;
                                }

                                const ext = CommonUtils.sanitizeExtension(picture.ext, '.png');
                                let newSvgImageFilePath;
                                if (picture.imageType === 'svg') {
                                    newSvgImageFilePath = path.join(
                                        unpackedDirectoryPath,
                                        Constants.subDirectoryPath(picture.filename),
                                        'image',
                                        `${picture.filename}.svg`
                                    );
                                }

                                const newImageFilePath = path.join(
                                    unpackedDirectoryPath,
                                    Constants.subDirectoryPath(picture.filename),
                                    'image',
                                    `${picture.filename}${ext}`
                                );
                                const newThumbnailFilePath = path.join(
                                    unpackedDirectoryPath,
                                    Constants.subDirectoryPath(picture.filename),
                                    'thumb',
                                    `${picture.filename}${ext}`
                                );

                                const newPicture = await MainUtils.importPictureToTemp(
                                    newImageFilePath,
                                    {
                                        thumbnailPath: newThumbnailFilePath,
                                        svgPath: newSvgImageFilePath,
                                    }
                                );
                                newPicture.name = picture.name;
                                newPicture.id = picture.id;
                                //TODO _id 가 없는 경우 entry-tool 에서 난리가 나는 듯 합니다.

                                // selectedPicture 체크로직
                                const selectedPictureId = object.selectedPictureId;
                                if (picture.id === selectedPictureId) {
                                    object.selectedPicture = newPicture;
                                    object.selectedPictureId = newPicture.id;
                                }

                                return newPicture;
                            })
                        );

                        // 사운드 파일 옮김
                        const newSounds = await Promise.all(
                            sounds.map(async (sound: ObjectLike) => {
                                if (Constants.defaultSoundPath.includes(sound.fileurl)) {
                                    return sound;
                                }

                                const ext = CommonUtils.sanitizeExtension(sound.ext, '.mp3');

                                const newSound = await MainUtils.importSoundToTemp(
                                    path.join(
                                        unpackedDirectoryPath,
                                        Constants.subDirectoryPath(sound.filename),
                                        'sound',
                                        `${sound.filename}${ext}`
                                    )
                                );
                                newSound.name = sound.name;
                                newSound.id = sound.id;

                                return newSound;
                            })
                        );

                        // 경로 동기화
                        object.sprite.pictures = newPictures;
                        object.sprite.sounds = newSounds;
                        MainUtils.changeObjectsPath(
                            [object],
                            Constants.replaceStrategy.fromExternal
                        );
                        return object;
                    })
                );

                await FileUtils.removeDirectoryRecursive(path.join(unpackDirectoryPath));
                resolve(objectResult);
            } catch (err) {
                reject(err);
            }
        });
    }

    static importObjectsFromResource(objects: ObjectLike[]) {
        return Promise.all(
            objects.map((object) => {
                return MainUtils.importObjectFromResource(object);
            })
        );
    }

    static importObjectFromResource(object: ObjectLike) {
        return new Promise(async (resolve, reject) => {
            const { pictures = [], sounds = [] } = object;
            try {
                const newPictures = await MainUtils.importPicturesFromResource(pictures);
                const newSounds = await MainUtils.importSoundsFromResource(sounds);

                object.pictures = newPictures;
                object.sounds = newSounds;

                resolve(object);
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * 여러 picture 들을 가져온다. 이 경우 thumbnail 을 개별설정 하지 못한다.
     * 로직 수정을 통해 구현할 수 있다.
     * @param {Array<string>}filePaths
     * @param sender
     * @return {Promise<any[]>}
     */
    static async importPicturesToTemp(filePaths: string[], sender: Electron.WebContents) {
        const results = [];
        for (let i = 0; i < filePaths.length; i++) {
            const filePath = filePaths[i];
            const { filePath: newFilePath, svgPath } = await MainUtils.convertPng(filePath, sender);
            if (svgPath) {
                results.push(await MainUtils.importPictureToTemp(newFilePath, { svgPath }));
            } else {
                results.push(await MainUtils.importPictureToTemp(newFilePath));
            }
        }
        return results;
    }

    /**
     * filePath 에 있는 파일을 가져와 temp 에 담는다. 이후 Entry object 프로퍼티 스펙대로 맞춰
     * 오브젝트를 생성한뒤 전달한다.
     */
    static async importPictureToTemp(
        filePath: string,
        extraPath?: { thumbnailPath?: string | undefined; svgPath?: string | undefined }
    ) {
        const originalFileExt = path.extname(filePath);
        const originalFileName = path.basename(filePath, originalFileExt);
        const newFileId = CommonUtils.createFileId();
        let imageType = 'png';

        const newPicturePath = path.join(
            Constants.tempImagePath(newFileId),
            `${newFileId}${originalFileExt}`
        );

        const { width, height } = imageSize(filePath);
        const { width: defaultWidth, height: defaultHeight } = ImageResizeSize.picture;
        await FileUtils.writeFile(
            FileUtils.createResizedImageBuffer(filePath, {
                width: width || defaultWidth,
                height: height || defaultHeight,
            }),
            newPicturePath
        );

        const { thumbnailPath, svgPath } = extraPath || {};

        // 섬네일 이미지가 이미 있는 경우는 해당 이미지를 가져다 쓰고, 없는 경우 원본을 리사이징
        const newThumbnailPath = path.join(
            Constants.tempThumbnailPath(newFileId),
            `${newFileId}${originalFileExt}`
        );
        if (thumbnailPath) {
            await FileUtils.copyFile(thumbnailPath, newThumbnailPath);
        } else {
            await FileUtils.writeFile(
                FileUtils.createResizedImageBuffer(filePath, ImageResizeSize.thumbnail),
                newThumbnailPath
            );
        }

        if (svgPath) {
            imageType = 'svg';
            const newSvgPath = path.join(Constants.tempImagePath(newFileId), `${newFileId}.svg`);
            await FileUtils.copyFile(svgPath, newSvgPath);
        }

        return {
            _id: CommonUtils.generateHash(),
            id: CommonUtils.generateHash(),
            type: 'user',
            name: originalFileName,
            filename: newFileId,
            fileurl: newPicturePath.replace(/\\/gi, '/'),
            extension: originalFileExt,
            dimension: imageSize(newPicturePath),
            imageType,
        };
    }

    /**
     * 여러 picture object 들을 resource 에서 추가한다.
     * @param {Array<Object>}pictures
     * @return {Promise<Array>}
     */
    static importPicturesFromResource(pictures: ObjectLike[]) {
        return Promise.all(
            pictures.map(async (picture) => {
                const pngFileName = picture.filename + (picture.ext || '.png');
                const imageResourcePath = path.join(
                    Constants.resourceImagePath(picture.filename),
                    pngFileName
                );
                const thumbnailResourcePath = path.join(
                    Constants.resourceThumbnailPath(picture.filename),
                    pngFileName
                );

                let svgPath;
                if (picture.imageType === 'svg') {
                    svgPath = path.join(
                        Constants.resourceImagePath(picture.filename),
                        `${picture.filename}.svg`
                    );
                }

                const newObject = await MainUtils.importPictureToTemp(imageResourcePath, {
                    thumbnailPath: thumbnailResourcePath,
                    svgPath,
                });

                picture.filename = newObject.filename;
                picture.fileurl = newObject.fileurl;

                return picture;
            })
        );
    }

    /**
     * 코드블럭을 이미지로 저장한다. svg파일을 그리기위한 임시 브라우저윈도우를 띄우고 캡쳐해서 저장한다.
     * @param image 이미지의 가로세로크기(width, height)와 svg데이터(data)를 string값으로 가지고 있다.
     * @param filePath 캡쳐한 이미지를 저장할 경로
     */
    static async captureBlockImage(images: any, filePath: string) {
        const FREE_SPACE = 25;
        const WAITING_TIME = 50;

        try {
            images.forEach((image: any, index: number) => {
                const { width, height, data } = image;

                // 캡쳐용 임시 브라우저 captureWindow 생성
                // 임시 브라우저이므로 별도 클래스로 관리하지 않음
                const remoteMain = require('@electron/remote/main');
                const captureWindow = new BrowserWindow({
                    width: Math.ceil(width) + FREE_SPACE,
                    height: Math.ceil(height) + FREE_SPACE,
                    useContentSize: true,
                    center: true,
                    webPreferences: {
                        nodeIntegration: true,
                        contextIsolation: false,
                        preload: path.resolve(
                            app.getAppPath(),
                            'src',
                            'preload_build',
                            'preload.bundle.js'
                        ),
                    },
                });
                const windowId = captureWindow.id;
                remoteMain.enable(captureWindow.webContents);
                captureWindow.loadURL(
                    `file:///${path.resolve(
                        app.getAppPath(),
                        'src',
                        'main',
                        'views',
                        'capture.html'
                    )}`
                );

                // captureWindow의 송수신 및 라이프사이클 관련 함수
                ipcMain.handle(`getImageString_${windowId}`, () => {
                    return image;
                });
                ipcMain.on(`captureAndSave_${windowId}`, async () => {
                    // 렌더러에서 svg를 그리는데 다소 시간이 걸리므로 대기 후 실행
                    await setTimeout(async () => {
                        const capturedImage = await captureWindow.webContents.capturePage({
                            x: 0,
                            y: 0,
                            width,
                            height,
                        });
                        await FileUtils.writeFile(
                            capturedImage.toPNG(),
                            `${filePath}${index}${'.png'}`
                        );
                        captureWindow.close();
                    }, WAITING_TIME);
                });
                captureWindow.addListener('closed', () => {
                    ipcMain.removeAllListeners(`captureAndSave_${windowId}`);
                    ipcMain.removeHandler(`getImageString_${windowId}`);
                });
            });
        } catch (error) {
            console.error(error);
        }
    }

    static importPictureFromCanvas(data: ObjectLike) {
        return new Promise(async (resolve, reject) => {
            const { file, image } = data;
            const { prevFilename, mode, svg, ext = 'png' } = file;
            const pictureId = CommonUtils.createFileId();

            try {
                const imagePath = path.join(Constants.tempImagePath(pictureId), `${pictureId}.png`);
                const thumbnailPath = path.join(
                    Constants.tempThumbnailPath(pictureId),
                    `${pictureId}.png`
                );
                let svgWritePromise;

                if (svg) {
                    const svgImagePath = path.join(
                        Constants.tempImagePath(pictureId),
                        `${pictureId}.svg`
                    );
                    svgWritePromise = FileUtils.writeFile(svg, svgImagePath);
                }

                // 편집된 이미지를 저장한다
                await Promise.all([
                    FileUtils.writeFile(image, imagePath),
                    FileUtils.writeFile(
                        FileUtils.createResizedImageBuffer(image, ImageResizeSize.thumbnail),
                        thumbnailPath
                    ),
                    svgWritePromise,
                ]);

                // 편집모드이며 리소스 기본이미지가이 아닌, temp 내 원본 이미지가 있는 경우 이전 이미지를 삭제한다.
                if (prevFilename && mode === 'edit') {
                    const prevImageFilePath = path.join(
                        Constants.tempImagePath(prevFilename),
                        `${prevFilename}.${ext}`
                    );
                    const prevThumbnailPath = path.join(
                        Constants.tempThumbnailPath(prevFilename),
                        `${prevFilename}.png`
                    );
                    let secondImageFilePath;

                    if (svg) {
                        // svg 타입이면 prevImageFileName 은 svg 확장자일 것이므로, secondary 는 png 이다.
                        // svg 타입이 아니라면 prevImageFileName 의 확장자는 객체 프로퍼티에 맡긴다.
                        secondImageFilePath = path.join(
                            Constants.tempImagePath(prevFilename),
                            `${prevFilename}.png`
                        );
                    }

                    await Promise.all([
                        prevImageFilePath && FileUtils.deleteFile(prevImageFilePath),
                        prevThumbnailPath && FileUtils.deleteFile(prevThumbnailPath),
                        secondImageFilePath && FileUtils.deleteFile(secondImageFilePath),
                    ]);
                }

                //TODO 빈 폴더인지 검사한 후, 삭제하기 (앞 4자리가 같은 다른 파일이 있을 수 있음)
                resolve({
                    type: 'user',
                    name: pictureId,
                    filename: pictureId,
                    fileurl: imagePath.replace(/\\/gi, '/'),
                    dimension: imageSize(imagePath),
                    imageType: ext,
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    static importSoundsToTemp(filePaths: string[]) {
        return Promise.all(filePaths.map(MainUtils.importSoundToTemp));
    }

    /**
     * 사운드 파일을 temp 로 복사하고, 신규생성된 엔트리 사운드 오브젝트를 반환한다.
     * 이때 이름은 결정할 수 없으며 외부에서 수정해야 한다.
     *
     * @param filePath 사운드 파일 경로
     * @return {Promise<Object>} 엔트리 사운드 오브젝트
     */
    static async importSoundToTemp(filePath: string): Promise<any> {
        const originalFileExt = path.extname(filePath);
        const originalFileName = path.basename(filePath, originalFileExt);
        const newFileId = CommonUtils.createFileId();
        const newFileName = newFileId + originalFileExt;
        const newSoundPath = path.join(Constants.tempSoundPath(newFileId), newFileName);

        await FileUtils.copyFile(filePath, newSoundPath);

        const metadata = await musicMetadata.parseFile(newSoundPath, { duration: true });

        return {
            _id: CommonUtils.generateHash(),
            type: 'user',
            name: originalFileName,
            filename: newFileId,
            ext: originalFileExt,
            fileurl: newSoundPath,
            path: newSoundPath, //See EntryUtils#loadSound
            duration: Math.round((metadata.format.duration || 0) * 10) / 10,
        };
    }

    static importSoundsFromResource(sounds: ObjectLike[]) {
        return Promise.all(
            sounds.map(async (sound) => {
                const fileName = sound.filename + (sound.ext || '.mp3');
                const soundResourcePath = path.join(
                    Constants.resourceSoundPath(sound.filename),
                    fileName
                );
                const newObject = await MainUtils.importSoundToTemp(soundResourcePath);

                sound.filename = newObject.filename;
                sound.fileurl = newObject.fileurl;

                return sound;
            })
        );
    }

    /**
     * 파일을 복사한다.
     * 단순 복사 기능이지만 ipcMainHelper -> mainUtils -> fileUtils depth 를 지키기위해 만들었다.
     * @param srcFilePath
     * @param targetFilePath
     * @return {Promise<any>}
     */
    static downloadFile(srcFilePath: string, targetFilePath: string) {
        return FileUtils.copyFile(srcFilePath, targetFilePath);
    }

    static writeFile(data: any, targetFilePath: string) {
        return FileUtils.writeFile(data, targetFilePath);
    }

    static saveExcel(filePath: string, array: any[]) {
        return new Promise((resolve, reject) => {
            const workbook = new xl.Workbook();
            const sheet = workbook.addWorksheet('sheet1');

            for (let i = 0; i < array.length; i++) {
                sheet.cell(i + 1, 1).string(array[i]);
            }

            workbook.write(filePath, (err: Error, stats: any) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('excel file saved.', stats);
                    resolve(stats);
                }
            });
        });
    }

    /**
     * 모든 이미지 파일을 png 로 전환한다.
     * svg 의 경우는 원본 파일도 같이 필요하므로 이쪽도 전달한다.
     * @param filePath
     * @param sender
     */
    static convertPng(filePath: string, sender: WebContents): Promise<ConvertResult> {
        return new Promise(async (resolve) => {
            try {
                const newFileName = path.basename(filePath).replace(/\..*$/, '');
                const fileData = await FileUtils.readFile(filePath, 'base64');
                const newFilePath = path.join(
                    Constants.tempPathForExport('convert'),
                    `${newFileName}.png`
                );
                const mimeType = mime.lookup(filePath);

                // svg 의 경우 viewBox 에서 뽑아서 전달하지 않으면 코딱지만한 크기로 잡혀버린다.
                const dimension =
                    mimeType &&
                    mimeType.includes('svg') &&
                    MainUtils.getDimensionFromSvg(Buffer.from(fileData, 'base64').toString('utf8'));

                sender.send('convertPng', fileData, mimeType, dimension);
                ipcMain.once('convertPng', (_: Electron.IpcMainEvent, buffer: any) => {
                    FileUtils.writeFile(buffer.split(';base64,').pop(), newFilePath, 'base64').then(
                        () => {
                            const result: ConvertResult = { filePath: newFilePath };

                            // svg 의 경우 svg 파일과 png 파일 둘다 제공되어야 한다. 그림판이 쓰기 때
                            if (mimeType && mimeType.includes('svg')) {
                                result.svgPath = filePath;
                            }
                            resolve(result);
                        }
                    );
                });
            } catch (e) {
                console.error('image convert error:', e);
                resolve({ filePath });
            }
        });
    }

    static getDimensionFromSvg(
        svgElementString: string
    ): { x: number; y: number; width: number; height: number } | undefined {
        // ex. viewBox="0 0 100 100" 처럼 4개가 온전한 숫자여야 한다.
        const result = /viewBox=['"](\d+(?:\s)?)?(\d+(?:\s)?)?(\d+(?:\s)?)?(\d+(?:\s)?)?['"]/.exec(
            svgElementString
        );
        if (result && result.length === 5) {
            return {
                x: Number(result[1]),
                y: Number(result[2]),
                width: Number(result[3]),
                height: Number(result[4]),
            };
        }
    }

    static saveSoundBuffer(arrayBuffer: ArrayBuffer, prevFileUrl: string) {
        return new Promise(async (resolve, reject) => {
            let tempBufferPath;
            let saveFilePath;
            try {
                // 1. buffer상태로 임시 저장
                const tempBufferId = CommonUtils.createFileId();
                tempBufferPath = path.join(
                    Constants.tempSoundPath(tempBufferId),
                    `${tempBufferId}`
                );
                const buffer = Buffer.from(arrayBuffer);
                await FileUtils.writeFile(buffer, tempBufferPath);

                // 2. 최종저장 경로 생성
                const filename = CommonUtils.createFileId();
                const filePath = path.join(Constants.tempSoundPath(filename), `${filename}.mp3`);

                // 3. 유효성 검사
                const soundInfo = await FileUtils.getSoundInfo(tempBufferPath, false);
                if (soundInfo?.format?.format_name !== 'wav') {
                    throw new Error('sound not supported');
                }

                // 5. buffer파일 mp3로 변환 후 저장
                saveFilePath = await FileUtils.convertStreamToMp3AndSave(tempBufferPath, filePath);

                // 6. response 작성
                const sound = {
                    duration: FileUtils.getDuration(soundInfo),
                    filename,
                    filePath: saveFilePath,
                };
                resolve(sound);
            } catch (err) {
                console.error(err);
                reject(err);
            } finally {
                try {
                    // INFO: 기존파일과 임시버퍼 제거, fileurl이 temp로 시작하는 경우에만 제거됨
                    const prevTempPath = path.join(Constants.appPath, prevFileUrl);
                    saveFilePath && (await FileUtils.deleteFile(prevTempPath));
                    tempBufferPath && (await FileUtils.deleteFile(tempBufferPath));
                } catch (e) {
                    console.error('sound file unlink fail', e);
                    reject(e);
                }
            }
        });
    }
}
