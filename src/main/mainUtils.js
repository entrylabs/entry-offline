import { app, nativeImage, BrowserWindow } from 'electron';
import fstream from 'fstream';
import archiver from 'archiver';
import fs from 'fs';
import zlib from 'zlib';
import path from 'path';
import FileUtils from './fileUtils';
import Constants from './constants';
import imageSizeOf from 'image-size';
import soundDuration from 'mp3-duration';
import root from 'window-or-global';
import stream from 'stream';
import tar from 'tar';
import CommonUtils from '../common/commonUtils';

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
    static loadProject(filePath) {
        return new Promise((resolve, reject) => {
            const rs = fs.createReadStream(filePath);
            const gunzip = zlib.createGunzip();
            const electronAppPath = app.getPath('userData');

            gunzip.on('error', function(err) {
                reject(err);
            });

            const buffers = [];
            gunzip.on('data', (data) => {
                buffers.push(data);
            });

            gunzip.on('end', () => {
                const bufferStream = new stream.PassThrough();
                this.resetSaveDirectory();
                const fsWriter = fstream.Writer({
                    path: electronAppPath,
                    mode: '0777',
                    type: 'Directory',
                });
                fsWriter.on('entry', function(list) {
                    list.props.mode = '0777';
                });
                fsWriter.on('error', function(err) {
                    reject(err);
                });
                fsWriter.on('end', () => {
                    fs.readFile(
                        path.resolve(electronAppPath, 'temp', 'project.json'),
                        'utf8',
                        (err, data) => {
                            if (err) {
                                reject(err);
                            } else {
                                const project = JSON.parse(data);
                                this.changeObjectPath(project, (fileUrl) => {
                                    let result = fileUrl;
                                    if (result.startsWith('.')) {
                                        // ./bower_components/.. => renderer/bower_components/..
                                        result = result.replace(/\./, 'renderer');
                                    } else if (result.startsWith('temp')) {
                                        // temp/fo/ba/.. => [ElectronAppData 경로]/temp/fo/ba/..
                                        result = `${electronAppPath}/${result}`.replace(
                                            /\\/gi,
                                            '/'
                                        );
                                    }
                                    return result;
                                });
                                project.savedPath = filePath; // real .ent file's path
                                resolve(project);
                            }
                        }
                    );
                });

                bufferStream.end(Buffer.concat(buffers));
                bufferStream.pipe(tar.Parse()).pipe(fsWriter);
            });
            rs.pipe(gunzip);
        });
    }

    /**
     * 일렉트론 temp 디렉토리를 삭제한다.
     * 이는 새 엔트리 프로젝트를 만들거나 ent 파일이 새로 로드되는 경우 실행된다.
     */
    static resetSaveDirectory() {
        this.deleteFolderRecursive(path.resolve(app.getPath('userData'), 'temp'));
    }

    static deleteFolderRecursive(localPath) {
        if (fs.existsSync(localPath)) {
            fs.readdirSync(localPath).forEach((file) => {
                const curPath = path.resolve(localPath, file);
                if (fs.lstatSync(curPath).isDirectory()) {
                    // recurse
                    this.deleteFolderRecursive(curPath);
                } else {
                    // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(localPath);
        }
    }

    /**
     * electronPath/temp 내에 있는 프로젝트를 ent 파일로 압축하여 저장한다.
     * @param {Object}project 엔트리 프로젝트
     * @param {string}destinationPath 저장위치 (파일명까지 포함)
     * @return {Promise} 성공시 resolve(), 실패시 reject(err)
     */
    static saveProject(project, destinationPath) {
        const mainWindow = BrowserWindow.fromId(root.sharedObject.mainWindowId);
        const sourcePath = app.getPath('userData');

        return new Promise((resolve, reject) => {
            if (destinationPath.indexOf('.ent') === -1) {
                reject(Error('.ent only accepted'));
                return;
            }

            this.changeObjectPath(project, (fileUrl) => {
                let result = fileUrl;

                const af = sourcePath.replace(/\\/gi, '/');
                result = result.replace(af, '').replace(/^([\\/])/, '');

                if (result.startsWith('renderer')) {
                    result = result.replace('renderer', '.');
                }
                result = result.substring(result.indexOf('temp'));

                return result;
            });

            const projectString = JSON.stringify(project);
            const targetFilePath = path.join(sourcePath, 'temp', 'project.json');
            FileUtils.ensureDirectoryExistence(targetFilePath);

            fs.writeFile(
                targetFilePath,
                projectString,
                { encoding: 'utf8', mode: '0777' },
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        const archive = archiver('tar');
                        const gzip = zlib.createGzip();
                        const fsWriter = fstream.Writer({
                            path: destinationPath,
                            mode: '0777',
                            type: 'File',
                        });

                        fsWriter.on('error', (e) => {
                            reject(e);
                        });

                        fsWriter.on('end', () => {
                            mainWindow.setProgressBar(-1);
                            resolve();
                        });
                        archive.on('error', (e) => {
                            reject(e);
                        });
                        archive.on('entry', () => {});
                        archive.on('progress', ({ fs }) => {
                            const { totalBytes, processedBytes } = fs;
                            mainWindow.setProgressBar(processedBytes / totalBytes);
                        });

                        archive.pipe(gzip).pipe(fsWriter);

                        archive.file(targetFilePath, {
                            name: 'temp/project.json',
                        });
                        archive.glob(
                            '**',
                            {
                                cwd: path.resolve(sourcePath, 'temp'),
                                ignore: ['project.json'],
                            },
                            {
                                prefix: 'temp',
                            }
                        );
                        archive.finalize();
                    }
                }
            );
        });
    }

    /**
     * ent 파일로 만들어지기 전, 오프라인 프로젝트 경로에 맞춰놨던 오브젝트 경로들을
     * 전부 엔트리 온라인 경로로 변경한다.
     * @param {object}project 엔트리 프로젝트
     * @param {function}replaceStrategy(fileUrl) 변경방법
     * @return {object} 인자로 받은 project 를 그대로 반환한다.
     */
    static changeObjectPath(project, replaceStrategy) {
        project.objects.forEach((object) => {
            const { pictures, sounds } = object.sprite;
            pictures.forEach((picture) => {
                const fileUrl = picture.fileurl;
                if (!fileUrl) {
                    return;
                }
                picture.fileurl = replaceStrategy(fileUrl);
            });
            sounds.forEach((sound) => {
                const fileUrl = sound.fileurl;
                if (!fileUrl) {
                    return;
                }
                sound.fileurl = replaceStrategy(fileUrl);
            });
        });
    }

    static exportObject(filePath, object) {
        return new Promise(async(resolve, reject) => {
            const { objects } = object;

            const objectId = CommonUtils.createFileId();
            const objectName = objects[0].name;
            // renderer/bower_components 를 ./bower_components 로 치환
            this.changeObjectPath(object, (fileUrl) => {
                let result = fileUrl;
                if (result.startsWith('renderer')) {
                    result = result.replace('renderer', '.');
                } else {
                    result = undefined;
                }
                return result;
            });
    
            const objectData = typeof object === 'string' ? object : JSON.stringify(object);
    
            const exportDirectoryPath = Constants.tempPathForExport(objectId);
            const objectJsonPath = path.join(exportDirectoryPath, 'object.json');
    
            const exportFileName = `${objectName}.eo`;
            const exportFile = path.resolve(exportDirectoryPath, '..', exportFileName);
    
            try {
                await FileUtils.ensureDirectoryExistence(objectJsonPath);
                await this.exportObjectTempFileTo(object, exportDirectoryPath);
                await FileUtils.writeFile(objectData, objectJsonPath);
                await FileUtils.compressDirectoryToFile(exportFile, filePath);
                await FileUtils.removeDirectoryRecursive(path.join(exportDirectoryPath, '..'));
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * 오브젝트를 외부에 내보낼 수 있도록 정리한다.
     * 예를들어 기본 에셋의 경로 를 ./bower_component 로 시작하도록 수정하고,
     * 추가된 오브젝트들의 이미지, 사운드의 fileurl 을 삭제하고 filename 을 재정의한다.
     * 이 재정의된 filename 은 export 시 동일 데이터임에도 겹치지 않도록 만드는 용도이다.
     * @param {Object}object 엔트리 오브젝트
     */
    static sanitizeProjectForExport(object) {
        this.changeObjectPath(object, (fileUrl) => {
            let result = fileUrl;
            if (result.startsWith('renderer')) {
                result = result.replace('renderer', '.');
            } else {
                result = undefined;
            }
            return result;
        });

        object.sprite.sounds.forEach((sound) => {
            sound.filename = CommonUtils.createFileId();
            sound.fileurl = undefined;
        });
        object.sprite.pictures.forEach((picture) => {
            picture.filename = CommonUtils.createFileId();
            picture.fileurl = undefined;
        });
    }

    /**
     * temp 에 있는 picture, sound 전체 데이터를 복사한다.
     * @param {Object}object 엔트리 오브젝트 메타데이터
     * @param targetDir 저장할 위치
     * @return {Promise<any>}
     */
    static exportObjectTempFileTo(object, targetDir) {
        return new Promise((resolve, reject) => {
            try {
                const copyObjectPromise = [];

                object.objects.forEach((object) => {
                    // object.sprite.sounds.forEach((sound) => {
                    //     copyObjectPromise.push(this.copySoundTempFileTo(
                    //         sound, targetDir, { deleteFileUrl: true }
                    //     ));
                    // });
                    object.sprite.pictures.forEach((picture) => {
                        copyObjectPromise.push(this.exportPictureTempFileTo(picture, targetDir));
                    });
                });

                Promise.all(copyObjectPromise)
                    .then(function() {
                        resolve();
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
     * temp 에 있는 picture 데이터를 target 으로 복사한다.
     * @param picture 엔트리 이미지 오브젝트. filename, ext 가 필요하다.
     * @param targetDir 복사할 경로. 해당 경로 아래 /ab/cd/images 와 thumb 가 생성된다.
     * @return {Promise<void>} 반환값 없음
     */
    static async exportPictureTempFileTo(picture, targetDir) {
        if (Constants.defaultPicturePath.includes(picture.fileurl)) {
            return;
        }
        const fileId = picture.filename;
        let ext = picture.ext || '.png';
        if (!ext.startsWith('.')) {
            ext = `.${ext}`;
        }
        const fileName = `${fileId}${ext}`;
        const newFileId = CommonUtils.createFileId();
        const newFileName = `${newFileId}${ext}`;

        const tempImagePath = `${Constants.tempImagePath(fileId)}${fileName}`;
        const tempThumbnailPath = `${Constants.tempThumbnailPath(fileId)}${fileName}`;

        const targetImagePath = `${targetDir}${Constants.subDirectoryPath(newFileId)
        }image${path.sep}${newFileName}`;
        const targetThumbnailPath = `${targetDir}${Constants.subDirectoryPath(newFileId)
        }thumb${path.sep}${newFileName}`;

        await FileUtils.copyFile(tempImagePath, targetImagePath);
        await FileUtils.copyFile(tempThumbnailPath, targetThumbnailPath);

        picture.filename = newFileId;
        return picture;
    }

    //TODO 개선 필요. MainUtils 는 e.sender 를 쓰지 않아야 한다.
    static async importObject(e, objectFiles) {
        try {
            const jobPromises = [];
            objectFiles.forEach((objectFile) => {
                const job = new Promise(async(resolve, reject) => {
                    try {
                        const objectId = CommonUtils.createFileId();
                        const objectDirPath = path.join(
                            app.getPath('userData'),
                            'import',
                            objectId
                        );
                        const tempDirPath = path.join(app.getPath('userData'), 'temp');
                        await CommonUtils.mkdirRecursive(objectDirPath);
                        await CommonUtils.fileUnPack({
                            source: objectFile.path,
                            target: objectDirPath,
                        });
                        const objectJson = await CommonUtils.copyObject({
                            source: path.join(objectDirPath, 'object', 'object.json'),
                            target: tempDirPath,
                        });
                        resolve(objectJson);
                    } catch (e) {
                        reject(e);
                    }
                });
                jobPromises.push(job);
            });
            Promise.all(jobPromises)
                .then((data) => {
                    e.sender.send('importObject', data);
                })
                .catch((err) => {
                    e.sender.send('importObject', false);
                });
        } catch (e) {
            console.error(e);
            e.sender.send('importObject', false);
        }
    }

    /**
     * 여러 picture 들을 가져온다. 이 경우 thumbnail 을 개별설정 하지 못한다.
     * 로직 수정을 통해 구현할 수 있다.
     * @param {Array<string>}filePaths
     * @return {Promise<any[]>}
     */
    static importPicturesToTemp(filePaths) {
        return Promise.all(filePaths.map(async(filePath) => {
            return await this.importPictureToTemp(filePath);
        }));
    }

    /**
     * filePath 에 있는 파일을 가져와 temp 에 담는다. 이후 Entry object 프로퍼티 스펙대로 맞춰
     * 오브젝트를 생성한뒤 전달한다.
     * @param {string}filePath 이미지 파일 경로
     * @param {string=}thumbnailPath 섬네일 파일 경로. 없으면 이미지에서 만들어낸다.
     * @return {Promise<Object>}
     */
    static async importPictureToTemp(filePath, thumbnailPath) {
        const originalFileExt = path.extname(filePath);
        const originalFileName = path.basename(filePath, originalFileExt);
        const newFileId = CommonUtils.createFileId();
        const newFileName = newFileId + originalFileExt;
        const newPicturePath = path.join(Constants.tempImagePath(newFileId), newFileName);
        const newThumbnailPath = path.join(Constants.tempThumbnailPath(newFileId), newFileName);

        await FileUtils.copyFile(filePath, newPicturePath);
        if (thumbnailPath) {
            await FileUtils.copyFile(thumbnailPath, newThumbnailPath);
        } else {
            // 이미지를 리사이즈 한다.
            // 카피파일한다
            const thumbnailBuffer = nativeImage.createFromPath(filePath)
                .resize({
                    width: 96,
                    quality: 'better',
                })
                .toPNG();
            await FileUtils.writeFile(thumbnailBuffer, newThumbnailPath);
        }

        return {
            _id: CommonUtils.generateHash(),
            type: 'user',
            name: originalFileName,
            filename: newFileId,
            fileurl: newPicturePath.replace(/\\/gi, '/'),
            extension: originalFileExt,
            dimension: imageSizeOf(newPicturePath),
        };
    }
    /**
     * 여러 picture object 들을 resource 에서 추가한다.
     * @param {Array<Object>}pictures
     * @return {Promise<Array>}
     */
    static importPicturesFromResource(pictures) {
        return Promise.all(pictures.map(async(picture) => {
            const fileName = picture.filename + (picture.ext || '.png');
            const imageResourcePath = path.join(Constants.resourceImagePath(picture.filename), fileName);
            const thumbnailResourcePath = path.join(Constants.resourceThumbnailPath(picture.filename), fileName);
            const newObject = await MainUtils.importPictureToTemp(imageResourcePath, thumbnailResourcePath);

            picture.filename = newObject.filename;
            picture.fileurl = newObject.fileurl;

            return picture;
        }));
    }

    static importSoundsToTemp(filePaths) {
        return Promise.all(filePaths.map(this.importSoundToTemp));
    }

    static importSoundToTemp(filePath) {
        return new Promise(async(resolve, reject) => {
            const originalFileExt = path.extname(filePath);
            const originalFileName = path.basename(filePath, originalFileExt);
            const newFileId = CommonUtils.createFileId();
            const newFileName = newFileId + originalFileExt;
            const newSoundPath = path.join(Constants.tempSoundPath(newFileId), newFileName);

            try {
                await FileUtils.copyFile(filePath, newSoundPath);

                soundDuration(newSoundPath, (err, duration) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve({
                        _id: CommonUtils.generateHash(),
                        type: 'user',
                        name: originalFileName,
                        filename: newFileId,
                        ext: originalFileExt,
                        fileurl: newSoundPath,
                        path: newSoundPath, //See EntryUtils#loadSound
                        duration: Math.floor(duration * 10) / 10,
                    });
                });
            } catch (err) {
                console.error(err);
                reject(err);
            }
        });
    }

    static importSoundsFromResource(sounds) {
        return Promise.all(sounds.map(async(sound) => {
            const fileName = sound.filename + (sound.ext || '.mpg');
            const soundResourcePath = path.join(Constants.resourceSoundPath(sound.filename), fileName);
            const newObject = await MainUtils.importSoundToTemp(soundResourcePath);

            sound.filename = newObject.filename;
            sound.fileurl = newObject.fileurl;

            return sound;
        }));
    }

    static staticDownload(srcFilePath, targetFilePath) {
        const fullStaticFilePath = path.resolve(__dirname, 'static', srcFilePath);

        const readStream = fs.createReadStream(fullStaticFilePath);
        const writeStream = fs.createWriteStream(targetFilePath);

        readStream.pipe(writeStream);
    }
}
