import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';
import fstream from 'fstream';
import archiver from 'archiver';
import zlib from 'zlib';
import Constants from './constants';
import CommonUtils from '../common/commonUtils';

/**
 * 파일 및 디렉토리의 생성 / 삭제와 압축등 IO 와 관련된 일을 담당한다.
 */
export default class {
    /**
     * 디렉토리를 생성한다.
     * ensureDirectoryExistence 와 다른점은 target directory 의 현재 경로까지 생성한다는 점이다.
     * @param {string}target 생성할 경로
     * @return {Promise<any>}
     */
    static mkdirRecursive(target) {
        return new Promise((resolve, reject) => {
            fs.stat(target, async(err) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        try {
                            const parser = path.parse(target);
                            await this.mkdirRecursive(parser.dir);
                            fs.mkdir(target, (err) => {
                                if (err && err.code !== 'EEXIST') {
                                    return reject(err);
                                }
                                resolve(target);
                            });
                        } catch (err) {
                            reject(err);
                        }
                    } else {
                        reject(err);
                    }
                } else {
                    resolve('exist');
                }
            });
        });
    }

    /**
     * 현재 경로 상위 디렉토리까지 폴더가 존재하는지 확인하고, 아닌 경우 생성한다.
     * @param {string}dirPath 파일 혹은 디렉토리 경로
     */
    static ensureDirectoryExistence(dirPath) {
        const dirname = path.dirname(dirPath);
        if (fs.existsSync(dirname)) {
            return;
        }
        this.ensureDirectoryExistence(dirname);
        fs.mkdirSync(dirname);
    }

    /**
     * 디렉토리를 삭제한다.
     * @param dirPath 삭제할 디렉토리 명
     * @return {Promise<any>}
     */
    static removeDirectoryRecursive(dirPath) {
        return new Promise((resolve, reject) => {
            rimraf(dirPath, (err) => {
                if (!err) {
                    resolve();
                } else {
                    reject(err);
                }
            });
        });
    }

    /**
     * 폴더를 압축하여 파일 하나로 압축해 저장한다.
     * @param sourcePath 압축할 폴더 위치
     * @param targetPath 저장될 파일 경로
     * @return {Promise<any>}
     */
    static compressDirectoryToFile(sourcePath, targetPath) {
        return new Promise((resolve, reject) => {
            const parser = path.parse(sourcePath);
            const fsWriter = fstream.Writer({ path: targetPath, type: 'File' });
            const archive = archiver('tar');
            const gzip = zlib.createGzip();

            fsWriter.on('error', reject);
            archive.on('error', reject);
            gzip.on('error', reject);

            fsWriter.on('end', () => {
                resolve();
            });

            archive.pipe(gzip)
                .pipe(fsWriter);

            archive.directory(parser.dir, false);
            archive.finalize();
        });
    }

    /**
     * 오브젝트에 관련된 picture, sound 전체 데이터를 복사한다.
     * @param {Object}object 엔트리 오브젝트 메타데이터
     * @param targetDir 저장할 위치
     * @return {Promise<any>}
     */
    static copyObjectResourceFileTo(object, targetDir) {
        return new Promise((resolve, reject) => {
            try {
                const copyObjectPromise = [];

                object.objects.forEach((object) => {
                    object.sprite.sounds.forEach((sound) => {
                        copyObjectPromise.push(this.copySoundResourceFileTo(sound, targetDir));
                    });
                    object.sprite.pictures.forEach((picture) => {
                        copyObjectPromise.push(this.copyPictureResourceFileTo(picture, targetDir));
                    });
                });

                Promise.all(copyObjectPromise)
                    .then(function() {
                        resolve(true);
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
     * resource 에 있는 소리파일을 targetDir 로 복사한다.
     * 가져오는 위치는 /ab/cd/fileName.mp3 이지만,
     * 복사 위치는 /ab/cd/sound/fileName.mp3 이다. (개발상 히스토리 있습니다.)
     * @param {Object}sound 복사할 파일
     * @param {string}targetDir 복사될 위치
     * @return {Promise<any>}
     */
    static copySoundResourceFileTo(sound, targetDir) {
        return new Promise(async(resolve, reject) => {
            if (Constants.defaultPicturePath.includes(sound.fileurl)) {
                resolve(sound);
            } else {
                const fileId = sound.filename;
                let ext = sound.ext || '.png';
                if (!ext.startsWith('.')) {
                    ext = `.${ext}`;
                }

                try {
                    const resourceImagePath = path.join(
                        Constants.resourceSoundPath(fileId),
                        `${fileId}${ext}`,
                    );

                    const newFileName = CommonUtils.createFileId();
                    const tempImagePath = path.join(
                        targetDir,
                        Constants.resourceSubDirectoryPath(newFileName),
                        'sound',
                        `${newFileName}${ext}`,
                    );

                    sound.filename = newFileName;

                    await this.copyFile(resourceImagePath, tempImagePath);
                    sound.fileurl = undefined;
                    resolve(sound);
                } catch (e) {
                    reject(e);
                }
            }
        });
    }

    /**
     * resource 에 있는 사진파일을 targetDir 로 복사한다.
     * @param {Object}picture 복사할 파일
     * @param {string}targetDir 복사 위치. [해당 경로]/ab/cd/abcd...png 식으로 저장된다.
     * @return {Promise<any>}
     */
    static copyPictureResourceFileTo(picture, targetDir) {
        return new Promise(async(resolve, reject) => {
            if (Constants.defaultPicturePath.includes(picture.fileurl)) {
                resolve(picture);
            } else {
                const fileId = picture.filename;
                let ext = picture.ext || '.png';
                if (!ext.startsWith('.')) {
                    ext = `.${ext}`;
                }

                try {
                    const resourceImagePath = `${Constants.resourceImagePath(fileId)}${fileId}${ext}`;
                    const resourceThumbnailPath = `${Constants.resourceThumbnailPath(fileId)}${fileId}${ext}`;

                    const newFileName = CommonUtils.createFileId();

                    const tempImagePath = `${targetDir}${Constants.resourceSubDirectoryPath(newFileName)
                    }image${path.sep}${newFileName}${ext}`;
                    const tempThumbnailPath = `${targetDir}${Constants.resourceSubDirectoryPath(newFileName)
                    }thumb${path.sep}${newFileName}${ext}`;

                    picture.filename = newFileName;

                    await this.copyFile(resourceImagePath, tempImagePath);
                    await this.copyFile(resourceThumbnailPath, tempThumbnailPath);
                    picture.fileurl = undefined;
                    resolve(picture);
                } catch (e) {
                    reject(e);
                }
            }
        });
    }


    /**
     * 파일을 생성한다.
     * @param {any}contents 작성할 내용
     * @param {string}filePath 파일명
     * @return {Promise<>}
     */
    static writeFile(contents, filePath) {
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, contents, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    /**
     * 파일을 복사한다.
     * @param {string}src 복사될 파일경로
     * @param {string}dest 저장할 파일경로
     * @return {Promise<any>}
     */
    static copyFile(src, dest) {
        return new Promise((resolve, reject) => {
            this.ensureDirectoryExistence(dest);
            const readStream = fs.createReadStream(src);
            const writeStream = fs.createWriteStream(dest);
            new Promise((res, rej) => {
                readStream.on('error', rej);
                writeStream.on('error', rej);
                writeStream.on('finish', res);
                readStream.pipe(writeStream);
            })
                .then(resolve)
                .catch((err) => {
                    readStream.destroy();
                    writeStream.end();
                    reject(err);
                });
        });
    }
}
