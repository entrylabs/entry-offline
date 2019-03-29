import { app, BrowserWindow } from 'electron';
import fstream from 'fstream';
import archiver from 'archiver';
import fs from 'fs';
import zlib from 'zlib';
import path from 'path';
import xl from 'excel4node';
import imageSizeOf from 'image-size';
import soundDuration from 'mp3-duration';
import { performance } from 'perf_hooks';
import root from 'window-or-global';
import stream from 'stream';
import tar from 'tar';
import crypto from 'crypto';
import FileUtils from './fileUtils';
import Constants from './constants';
import CommonUtils from './commonUtils';
import BlockConverter from './blockConverter';
/**
 * Main Process 에서 발생하는 로직들을 담당한다.
 * ipcMain 을 import 하여 사용하지 않는다. renderer Process 간 이벤트 관리는 ipcMainHelper 가 한다.
 */
export default class MainUtils {
    /**
     * 16진수의 랜덤값을 설정한다. 이 값은 겹치지 않은 신규 파일명을 생성하는데 쓴다.
     * @return {string}
     */
    static createFileId() {
        const randomStr = `${Math.random().toString(16)}000000000`.substr(2, 8);
        return crypto
            .createHash('md5')
            .update(randomStr)
            .digest('hex');
    }

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
            const baseAppPath = Constants.appPath;

            gunzip.on('error', function(err) {
                reject(err);
            });

            const buffers = [];
            gunzip.on('data', (data) => {
                buffers.push(data);
            });

            gunzip.on('end', async() => {
                const bufferStream = new stream.PassThrough();
                try {
                    await MainUtils.resetSaveDirectory();
                } catch (e) {
                    console.log(e);
                }

                const fsWriter = fstream.Writer({
                    path: baseAppPath,
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
                        path.resolve(baseAppPath, 'temp', 'project.json'),
                        'utf8',
                        (err, data) => {
                            if (err) {
                                reject(err);
                            } else {
                                const project = JSON.parse(data);
                                if (project.objects[0] && project.objects[0].script.substr(0, 4) === '<xml') {
                                    BlockConverter.convert(project, (convertedProject) => {
                                        MainUtils.changeObjectsPath(
                                            convertedProject.objects,
                                            Constants.replaceStrategy.fromExternal,
                                        );
                                        convertedProject.savedPath = filePath; // real .ent file's path
                                        resolve(convertedProject);
                                    });
                                } else {
                                    MainUtils.changeObjectsPath(
                                        project.objects,
                                        Constants.replaceStrategy.fromExternal,
                                    );
                                    project.savedPath = filePath; // real .ent file's path
                                    resolve(project);
                                }
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
        return FileUtils.removeDirectoryRecursive(path.resolve(app.getPath('userData'), 'temp'));
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

            MainUtils.changeObjectsPath(project.objects, Constants.replaceStrategy.toExternal);

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
     * 오프라인 <-> 엔트리 간 파일경로 동기화.
     * @param {Array<object>} objects 엔트리 프로젝트 내 오브젝트목록.
     * @param {function}replaceStrategy(fileUrl) 변경방법. 기본 전략패턴이 Constants 에 존재
     * @see Constants.replaceStrategy
     * @return {object} 인자로 받은 project 를 그대로 반환한다.
     */
    static changeObjectsPath(objects = [], replaceStrategy) {
        objects.forEach((object) => {
            if (!object.sprite) {
                return;
            }

            const { pictures = [], sounds = [] } = object.sprite;
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

            const objectId = MainUtils.createFileId();
            const objectName = objects[0].name;
            // renderer/bower_components 를 ./bower_components 로 치환
            MainUtils.changeObjectsPath(objects, Constants.replaceStrategy.toExternalDeleteUrl);
            const exportDirectoryPath = path.join(Constants.tempPathForExport(objectId), 'object');
            const objectJsonPath = path.join(exportDirectoryPath, 'object.json');

            const exportFileName = `${objectName}.eo`;
            const exportFile = path.resolve(exportDirectoryPath, '..', exportFileName);

            try {
                await FileUtils.ensureDirectoryExistence(objectJsonPath);
                await MainUtils.exportObjectTempFileTo(object, exportDirectoryPath);

                const objectData = typeof object === 'string' ? object : JSON.stringify(object);
                await FileUtils.writeFile(objectData, objectJsonPath);
                await FileUtils.pack(exportFile, filePath);
                await FileUtils.removeDirectoryRecursive(path.join(exportDirectoryPath, '..'));
                resolve();
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
    static exportObjectTempFileTo(object, targetDir) {
        return new Promise((resolve, reject) => {
            try {
                const copyObjectPromise = [];

                object.objects.forEach((object) => {
                    object.sprite.sounds.forEach((sound) => {
                        copyObjectPromise.push(MainUtils.exportSoundTempFileTo(sound, targetDir));
                    });
                    object.sprite.pictures.forEach((picture) => {
                        copyObjectPromise.push(MainUtils.exportPictureTempFileTo(picture, targetDir));
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
     * temp 에 있는 sound 데이터를 target 으로 복사한다.
     * @param sound 엔트리 사운드 오브젝트. filename, ext 가 필요하다.
     * @param targetDir 복사할 경로. 해당 경로 아래 /ab/cd/sound 가 생성된다.
     * @return {Promise<Object>} filename 이 변환된 sound object
     */
    static async exportSoundTempFileTo(sound, targetDir) {
        if (Constants.defaultSoundPath.includes(sound.fileurl)) {
            return sound;
        }
        const fileId = sound.filename;
        const ext = CommonUtils.sanitizeExtension(sound.ext, '.mp3');
        const fileName = `${fileId}${ext}`;
        const newFileId = MainUtils.createFileId();
        const newFileName = `${newFileId}${ext}`;

        const tempSoundPath = path.join(Constants.tempSoundPath(fileId), fileName);

        const targetSoundPath = path.join(targetDir,
            Constants.subDirectoryPath(newFileId), 'sound', newFileName);

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
    static async exportPictureTempFileTo(picture, targetDir) {
        if (Constants.defaultPicturePath.includes(picture.fileurl)) {
            return picture;
        }
        const fileId = picture.filename;
        const ext = CommonUtils.sanitizeExtension(picture.ext, '.png');
        const fileName = `${fileId}${ext}`;
        const newFileId = MainUtils.createFileId();
        const newFileName = `${newFileId}${ext}`;

        const tempImagePath = path.join(Constants.tempImagePath(fileId), fileName);
        const tempThumbnailPath = path.join(Constants.tempThumbnailPath(fileId), fileName);

        const targetImagePath = path.join(targetDir,
            Constants.subDirectoryPath(newFileId), 'image', newFileName);
        const targetThumbnailPath = path.join(targetDir,
            Constants.subDirectoryPath(newFileId), 'thumb', newFileName);

        await FileUtils.copyFile(tempImagePath, targetImagePath);
        await FileUtils.copyFile(tempThumbnailPath, targetThumbnailPath);

        picture.filename = newFileId;
        return picture;
    }

    static async importObjects(objectPaths) {
        return Promise.all(objectPaths.map((objectPath) => {
            return MainUtils.importObject(objectPath);
        }));
    }

    static importObject(objectPath) {
        return new Promise(async(resolve, reject) => {
            const newObjectId = MainUtils.createFileId();
            const unpackDirectoryPath = Constants.tempPathForExport(newObjectId);
            const unpackedDirectoryPath = path.join(unpackDirectoryPath, 'object');

            try {
                await FileUtils.mkdirRecursive(unpackDirectoryPath); // import 용 디렉토리 생성
                await FileUtils.unpack(objectPath, unpackDirectoryPath); // 압축 해제
                // object.json 읽어오기
                const objectResult = JSON.parse(
                    await FileUtils.readFile(path.join(unpackedDirectoryPath, 'object.json'))
                );

                // 파일 복사 로직
                await Promise.all(objectResult.objects.map(async(object) => {
                    const { sprite = {} } = object;
                    const { pictures = [], sounds = [] } = sprite;

                    // 이미지 파일 옮김
                    const newPictures = await Promise.all(
                        pictures.map(async(picture) => {
                            if (Constants.defaultPicturePath.includes(picture.fileurl)) {
                                // selectedPicture 체크로직
                                const selectedPictureId = object.selectedPictureId;
                                if (picture.id === selectedPictureId) {
                                    object.selectedPicture = picture;
                                }

                                return picture;
                            }

                            const ext = CommonUtils.sanitizeExtension(picture.ext, '.png');
                            const newImageFilePath = path.join(
                                unpackedDirectoryPath,
                                Constants.subDirectoryPath(picture.filename),
                                'image',
                                `${picture.filename}${ext}`,
                            );
                            const newThumbnailFilePath = path.join(
                                unpackedDirectoryPath,
                                Constants.subDirectoryPath(picture.filename),
                                'thumb',
                                `${picture.filename}${ext}`,
                            );

                            const newPicture = await MainUtils.importPictureToTemp(
                                newImageFilePath, newThumbnailFilePath,
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
                        }));

                    // 사운드 파일 옮김
                    const newSounds = await Promise.all(
                        sounds.map(async(sound) => {
                            if (Constants.defaultSoundPath.includes(sound.fileurl)) {
                                return sound;
                            }

                            const ext = CommonUtils.sanitizeExtension(sound.ext, '.mp3');

                            const newSound = await MainUtils.importSoundToTemp(path.join(
                                unpackedDirectoryPath,
                                Constants.subDirectoryPath(sound.filename),
                                'sound',
                                `${sound.filename}${ext}`,
                            ));
                            newSound.name = sound.name;
                            newSound.id = sound.id;

                            return newSound;
                        }),
                    );

                    // 경로 동기화
                    object.sprite.pictures = newPictures;
                    object.sprite.sounds = newSounds;
                    MainUtils.changeObjectsPath([object], Constants.replaceStrategy.fromExternal);
                    return object;
                }));

                await FileUtils.removeDirectoryRecursive(path.join(unpackDirectoryPath));
                resolve(objectResult);
            } catch (err) {
                reject(err);
            }
        });
    }

    static importObjectsFromResource(objects) {
        return Promise.all(objects.map((object) => {
            return MainUtils.importObjectFromResource(object);
        }));
    }

    static importObjectFromResource(object) {
        return new Promise(async(resolve, reject) => {
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
     * @return {Promise<any[]>}
     */
    static importPicturesToTemp(filePaths) {
        return Promise.all(filePaths.map(async(filePath) => {
            return await MainUtils.importPictureToTemp(filePath);
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
        const newFileId = MainUtils.createFileId();
        const newFileName = newFileId + originalFileExt;
        const newPicturePath = path.join(Constants.tempImagePath(newFileId), newFileName);
        const newThumbnailPath = path.join(Constants.tempThumbnailPath(newFileId), newFileName);

        await FileUtils.copyFile(filePath, newPicturePath);

        // 섬네일 이미지가 이미 있는 경우는 해당 이미지를 가져다 쓰고, 없는 경우 원본을 리사이징
        if (thumbnailPath) {
            await FileUtils.copyFile(thumbnailPath, newThumbnailPath);
        } else {
            await FileUtils.writeFile(
                FileUtils.createThumbnailBuffer(filePath),
                newThumbnailPath,
            );
        }

        return {
            _id: CommonUtils.generateHash(),
            id: CommonUtils.generateHash(),
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

    static importPictureFromCanvas(data) {
        return new Promise(async(resolve, reject) => {
            const { file,  image } = data;
            const { prevFilename, mode } = file;
            let pictureId = MainUtils.createFileId();

            try {
                if (prevFilename && mode === 'edit') {
                    pictureId = prevFilename;
                }

                const imagePath = path.join(Constants.tempImagePath(pictureId), `${pictureId}.png`);
                const thumbnailPath = path.join(Constants.tempThumbnailPath(pictureId), `${pictureId}.png`);

                // 편집된 이미지를 저장한다
                await Promise.all([
                    FileUtils.writeFile(image, imagePath),
                    FileUtils.writeFile(
                        FileUtils.createThumbnailBuffer(image),
                        thumbnailPath),
                ]);

                //TODO 빈 폴더인지 검사한 후, 삭제하기 (앞 4자리가 같은 다른 파일이 있을 수 있음)
                resolve({
                    type: 'user',
                    name: pictureId,
                    filename: pictureId,
                    fileurl: `${imagePath.replace(/\\/gi, '/')}?t=${performance.now()}`,
                    dimension: imageSizeOf(imagePath),
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    static importSoundsToTemp(filePaths) {
        return Promise.all(filePaths.map(MainUtils.importSoundToTemp));
    }

    /**
     * 사운드 파일을 temp 로 복사하고, 신규생성된 엔트리 사운드 오브젝트를 반환한다.
     * 이때 이름은 결정할 수 없으며 외부에서 수정해야 한다.
     *
     * @param filePath 사운드 파일 경로
     * @return {Promise<Object>} 엔트리 사운드 오브젝트
     */
    static importSoundToTemp(filePath) {
        return new Promise(async(resolve, reject) => {
            const originalFileExt = path.extname(filePath);
            const originalFileName = path.basename(filePath, originalFileExt);
            const newFileId = MainUtils.createFileId();
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

    /**
     * 파일을 복사한다.
     * 단순 복사 기능이지만 ipcMainHelper -> mainUtils -> fileUtils depth 를 지키기위해 만들었다.
     * @param srcFilePath
     * @param targetFilePath
     * @return {Promise<any>}
     */
    static downloadFile(srcFilePath, targetFilePath) {
        return FileUtils.copyFile(srcFilePath, targetFilePath);
    }

    static writeFile(data, targetFilePath) {
        return FileUtils.writeFile(data, targetFilePath);
    }

    static saveExcel(filePath, array) {
        return new Promise((resolve, reject) => {
            const workbook = new xl.Workbook();
            const sheet = workbook.addWorksheet('sheet1');

            for (let i = 0 ; i < array.length ; i++) {
                sheet.cell(i + 1, 1).string(array[i]);
            }

            workbook.write(filePath, (err, stats) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('excel file saved.', stats);
                    resolve();
                }
            });
        });
    }
}
