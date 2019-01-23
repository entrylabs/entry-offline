import path from 'path';
import fs from 'fs';
import archiver from 'archiver';
import fstream from 'fstream';
import tar from 'tar';
import zlib from 'zlib';
import rimraf from 'rimraf';
import decompress from 'decompress';
import { dialog, app } from 'electron';
import Constants from '../main/constants';
import FileUtils from '../main/fileUtils';

export const STATIC_PATH = {
    get UPLOADS_DIR() {
        return path.join(path.dirname(__dirname), 'renderer', 'node_modules', 'uploads');
    },
    get TEMP_DIR() {
        return path.join(app.getPath('userData'), 'temp');
    },
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

    writeFile(destination, source) {
        return new Promise((resolve, reject) => {
            fs.writeFile(destination, source, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve(true);
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

    copySoundFiles({ sound, objectDirPath }) {
        return new Promise(async(resolve, reject) => {
            try {
                console.log(sound.fileurl);
                if (Constants.defaultSoundPath.indexOf(sound.fileurl) >= 0) {
                    resolve(sound);
                } else {
                    const fileId = sound.filename;
                    let extname = sound.ext || '.mp3';
                    if (!extname.startsWith('.')) {
                        extname = `.${extname}`;
                    }
                    const filePath = path.join(
                        fileId.substr(0, 2),
                        fileId.substr(2, 2),
                        'sound',
                        fileId + extname
                    );
                    const source = path.join(STATIC_PATH.TEMP_DIR, filePath);

                    const filename = this.createFileId();
                    const soundPath = path.join(
                        filename.substr(0, 2),
                        filename.substr(2, 2),
                        'sound'
                    );
                    const uploadDir = path.join(objectDirPath, soundPath);
                    sound.filename = filename;
                    await this.copyObjectFile({ uploadDir, source, filename });
                    sound.fileurl = undefined;
                    resolve(sound);
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    async copyPictureFiles({ picture, objectDirPath }) {
        return new Promise(async(resolve, reject) => {
            console.log(picture.fileurl);
            if (Constants.defaultPicturePath.indexOf(picture.fileurl) >= 0) {
                resolve(picture);
            } else {
                try {
                    const fileId = picture.filename;
                    let extname = picture.ext || '.png';
                    if (!extname.startsWith('.')) {
                        extname = `.${extname}`;
                    }
                    const imageSource = path.join(
                        STATIC_PATH.TEMP_DIR,
                        fileId.substr(0, 2),
                        fileId.substr(2, 2),
                        'image',
                        fileId + extname
                    );
                    const thumbSource = path.join(
                        STATIC_PATH.TEMP_DIR,
                        fileId.substr(0, 2),
                        fileId.substr(2, 2),
                        'thumb',
                        fileId + extname
                    );

                    const filename = this.createFileId();
                    const imageUploadDir = path.join(
                        objectDirPath,
                        filename.substr(0, 2),
                        filename.substr(2, 2),
                        'image'
                    );
                    const thumbUploadDir = path.join(
                        objectDirPath,
                        filename.substr(0, 2),
                        filename.substr(2, 2),
                        'thumb'
                    );
                    picture.filename = filename;
                    await this.copyObjectFile({
                        uploadDir: imageUploadDir,
                        source: imageSource,
                        filename,
                    });
                    await this.copyObjectFile({
                        uploadDir: thumbUploadDir,
                        source: thumbSource,
                        filename,
                    });
                    picture.fileurl = undefined;
                    resolve(picture);
                } catch (e) {
                    reject(e);
                }
            }
        });
    }

    async copyObjectFile({ uploadDir, source, filename }) {
        return new Promise(async(resolve, reject) => {
            try {
                await this.mkdirRecursive(uploadDir);
                fs.stat(source, function(err, stats) {
                    if (err && err.errno == -2) {
                        source = path.resolve(
                            path.dirname(__dirname),
                            'renderer',
                            'bower_components',
                            'entryjs',
                            'images',
                            '_1x1.png'
                        );
                    }
                    const extname = path.extname(source);
                    const rStream = fs.createReadStream(source);
                    rStream.pipe(fs.createWriteStream(path.resolve(uploadDir, filename + extname)));
                    rStream.on('error', function(err) {
                        reject(err);
                    });
                    rStream.on('close', function(err) {
                        resolve();
                    });
                });
            } catch (e) {
                reject(e);
            }
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
