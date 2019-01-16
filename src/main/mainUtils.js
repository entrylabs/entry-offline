import { app, ipcMain, BrowserWindow } from 'electron';
import fstream from 'fstream';
import archiver from 'archiver';
import fs from 'fs';
import zlib from 'zlib';
import path from 'path';
import { ProgressTypes } from './Constants';
import { default as Utils } from '../common/Utils';
import root from 'window-or-global';
import stream from "stream";
import tar from 'tar';

export default class {
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
                                        result = `${electronAppPath}/${result}`.replace(/\\/gi, '/');
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

    static ensureDirectoryExistence(filePath) {
        const dirname = path.dirname(filePath);
        if (fs.existsSync(dirname)) {
            return true;
        }
        this.ensureDirectoryExistence(dirname);
        fs.mkdirSync(dirname);
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

                result = result
                    .replace(af, '')
                    .replace(/^([\\/])/, '');

                if (result.startsWith('renderer')) {
                    result = result.replace('renderer', '.');
                }

                return result;
            });

            const projectString = JSON.stringify(project);
            const targetFilePath = path.join(sourcePath, 'temp', 'project.json');
            this.ensureDirectoryExistence(targetFilePath);

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
                            mainWindow.setProgressBar(ProgressTypes.DISABLE_PROGRESS);
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
                },
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

    lpad(str, len) {
        const strLen = str.length;
        if (strLen < len) {
            for (let i = 0; i < len - strLen; i++) {
                str = `0${  str}`;
            }
        }
        return String(str);
    }

    getPaddedVersion(version) {
        if (!version) {
            return '';
        }
        version = String(version);

        const padded = [];
        const splitVersion = version.split('.');
        splitVersion.forEach((item) => {
            padded.push(this.lpad(item, 4));
        });

        return padded.join('.');
    }

    static async exportObject(e, object) {
        const { objects } = object;
        const objectName = objects[0].name;
        const objectId = Utils.createFileId();
        const objectDirPath = path.join(
            app.getPath('userData'),
            'import',
            objectId,
            'object'
        );
        const objectJsonPath = path.join(objectDirPath, 'object.json');
        const exportFileName = `${objectName}.eo`;
        const exportFile = path.resolve(objectDirPath, '..', exportFileName);
        try {
            const savePath = await Utils.showSaveDialog({
                defaultPath: exportFileName,
                filters: [
                    {
                        name: 'Entry object file(.eo)',
                        extensions: ['eo'],
                    },
                ],
            });
            if (savePath) {
                await Utils.mkdirRecursive(objectDirPath);
                await Utils.copyObjectFiles({ object, objectDirPath });
                const objectData =
                    typeof object === 'string'
                        ? object
                        : JSON.stringify(object);
                await Utils.writeFile(objectJsonPath, objectData);
                await Utils.filePack({
                    source: exportFile,
                    target: savePath,
                    isRemove: true,
                });
            }
        } catch (e) {
            console.error(e);
        }
    }

    static async importObject(e, objectFiles) {
        try {
            const jobPromises = [];
            objectFiles.forEach((objectFile) => {
                const job = new Promise(async(resolve, reject) => {
                    try {
                        const objectId = Utils.createFileId();
                        const objectDirPath = path.join(
                            app.getPath('userData'),
                            'import',
                            objectId
                        );
                        const tempDirPath = path.join(
                            app.getPath('userData'),
                            'temp'
                        );
                        await Utils.mkdirRecursive(objectDirPath);
                        await Utils.fileUnPack({
                            source: objectFile.path,
                            target: objectDirPath,
                        });
                        const objectJson = await Utils.copyObject({
                            source: path.join(
                                objectDirPath,
                                'object',
                                'object.json'
                            ),
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
}
