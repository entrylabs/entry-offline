import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';
import decompress from 'decompress';
import { dialog, app } from 'electron';
import FileUtils from '../main/fileUtils';

export const STATIC_PATH = {
    get TEMP_DIR_POSIX() {
        const regex = new RegExp(`\\${path.win32.sep}`, 'gi');
        const userDataPath = app.getPath('userData').replace(regex, path.posix.sep);
        return path.posix.join(userDataPath, 'temp');
    },
};

class CommonUtils {
    createFileId() {
        const randomStr = `${Math.random().toString(16)}000000000`.substr(2, 8);
        return require('crypto')
            .createHash('md5')
            .update(randomStr)
            .digest('hex');
    }

    /**
     * 4자리 랜덤값을 생성한다. 이 함수는 Entry.generateHash 와 완전동일하다.
     * Import 된 오브젝트를 엔트리 오브젝트 메타데이터로 만들 때 사용한다.
     * entryjs 의 해당 유틸함수 로직이 바뀌면 같이 바뀌어야 한다.
     *
     * @see Entry.generateHash
     * @return {string} 4자리 값
     */
    generateHash() {
        return Math.random()
            .toString(36)
            .substr(2, 4);
    }

    mkdirRecursive(target) {
        return new Promise((resolve, reject) => {
            fs.stat(target, async(err, stats) => {
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

    readDir(target) {
        return new Promise((resolve, reject) => {
            fs.readdir(target, (err, files) => {
                if (err) {
                    return reject(err);
                }
                resolve(files);
            });
        });
    }

    rename(source, target) {
        return new Promise((resolve, reject) => {
            fs.rename(source, target, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    readFileSync(target, enc = 'utf8', isParse) {
        return new Promise((resolve, reject) => {
            fs.readFile(target, (err, data) => {
                if (err) {
                    reject(err);
                } else if (isParse) {
                    resolve(JSON.parse(data));
                } else {
                    resolve(data);
                }
            });
        });
    }

    getStatsByPath(target) {
        return new Promise(function(resolve, reject) {
            fs.stat(target, function(err, stat) {
                if (err) {
                    if (err.code === 'ENOENT') {
                        resolve(false);
                    } else {
                        return reject(err);
                    }
                } else {
                    resolve(stat);
                }
            });
        });
    }

    fileUnPack({ source, target, isRemove }) {
        return new Promise((resolve, reject) => {
            decompress(source, target)
                .then((files) => {
                    if (isRemove) {
                        rimraf(source, '..', (err) => {
                            if (err) {
                                return reject(err);
                            }
                            resolve();
                        });
                    } else {
                        resolve();
                    }
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }

    showSaveDialog({ defaultPath, filters }) {
        return new Promise((resolve, reject) => {
            dialog.showSaveDialog(
                {
                    defaultPath,
                    filters,
                },
                (filePath) => {
                    if (filePath) {
                        resolve(filePath);
                    } else {
                        reject();
                    }
                }
            );
        });
    }

    copyObject({ source, target }) {
        return new Promise((resolve, reject) => {
            fs.readFile(source, 'utf8', (err, stringData) => {
                if (err) {
                    reject(err);
                }
                const data = JSON.parse(stringData);

                data.objects.forEach(async(object) => {
                    const { sprite = {} } = object;
                    const { pictures = [] } = sprite;
                    const { sounds = [] } = sprite;

                    this.copyPictureFilesForTemp({
                        pictures,
                        object,
                    });
                    this.copySoundFilesForTemp({
                        sounds,
                    });
                    const parser = path.parse(source);
                    this.copyRecursiveAsync(parser.dir, target, ['object.json'])
                        .then(() => {
                            rimraf(path.join(parser.dir, '..'), (err) => {
                                if (err) {
                                    return reject(err);
                                }
                                resolve(data);
                            });
                        })
                        .catch((err) => {
                            reject(err);
                        });
                });
            });
        });
    }

    copyPictureFilesForTemp({ pictures, object }) {
        pictures.forEach((picture) => {
            const { filename } = picture;
            if (picture.fileurl && picture.fileurl.match('/lib') !== null) {
                picture.fileurl = picture.fileurl.replace('/lib', './bower_components');
            } else if (filename) {
                const { dimension = {} } = picture;
                const { type } = dimension;
                const ext = type ? `.${type}` : '.png';
                picture.fileurl = path.posix.join(
                    STATIC_PATH.TEMP_DIR_POSIX,
                    filename.substr(0, 2),
                    filename.substr(2, 2),
                    'image',
                    filename + ext
                );
            }
            picture._id = undefined;

            const { name, selectedPictureId } = object;
            if (picture.id === selectedPictureId) {
                const pictureInfo = {
                    filename: picture.filename,
                    width: picture.dimension.width,
                    height: picture.dimension.height,
                };
                object.selectedPicture = Object.assign({}, picture, {
                    _id: this.createFileId(),
                    name,
                    origin: pictureInfo,
                    trimmed: pictureInfo,
                });
            }
        });
    }

    copySoundFilesForTemp({ sounds }) {
        const soundRenameJob = [];
        sounds.forEach((sound) => {
            const { filename, ext } = sound;
            if (ext && !ext.startsWith('.')) {
                sound.ext = `.${ext}`;
            }
            if (sound.fileurl && sound.fileurl.match('/lib') !== null) {
                sound.fileurl = sound.fileurl.replace('/lib', './bower_components');
            } else if (filename) {
                sound.fileurl = path.posix.join(
                    STATIC_PATH.TEMP_DIR_POSIX,
                    filename.substr(0, 2),
                    filename.substr(2, 2),
                    'sound',
                    filename + sound.ext
                );
            }
            sound._id = undefined;
        });
    }

    copyRecursiveAsync(source, target, ignore = []) {
        return new Promise(async(resolve, reject) => {
            try {
                const stats = await this.getStatsByPath(source);
                const isDirectory = stats ? stats.isDirectory() : false;
                if (isDirectory) {
                    await this.mkdirRecursive(target);
                    const files = await this.readDir(source);
                    const copyJobs = [];
                    files.forEach((file) => {
                        copyJobs.push(
                            this.copyRecursiveAsync(
                                path.join(source, file),
                                path.join(target, file),
                                ignore
                            )
                        );
                    });

                    Promise.all(copyJobs)
                        .then(() => {
                            resolve(true);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                } else {
                    const parser = path.parse(source);
                    if (ignore.indexOf(parser.base) > -1) {
                        resolve();
                    } else {
                        const result = await FileUtils.copyFile(source, target);
                        resolve(result);
                    }
                }
            } catch (e) {
                reject(e);
            }
        });
    }
}

export default new CommonUtils();
