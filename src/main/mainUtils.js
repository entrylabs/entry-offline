import { app, ipcMain, BrowserWindow } from 'electron';
import fstream from 'fstream';
import archiver from 'archiver';
import fs from 'fs';
import zlib from 'zlib';
import path from 'path';
import { ProgressTypes } from './Constants';
import { default as Utils } from '../common/Utils';
import stream from "stream";
import tar from 'tar';

export default class {
    // constructor(window) {
    //     this.window = window;
    //     ipcMain.on('exportObject', this.exportObject);
    //     ipcMain.on('importObject', this.importObject);
    // }

    static loadProject(filePath) {
        return new Promise((resolve, reject) => {

        });
    }

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
        const focusedWindow = BrowserWindow.getFocusedWindow();
        const sourcePath = app.getPath('userData');

        this.changeObjectPath(project, (fileUrl) => {
            let result = fileUrl;
            result = result.replace(`${sourcePath}`, '').replace(/^(\\)/, '');

            if (result.startsWith('renderer')) {
                result = result.replace('renderer', '.');
            }

            return result;
        });

        const projectString = JSON.stringify(project);

        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(sourcePath, 'temp', 'project.json'),
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
                            focusedWindow.setProgressBar(ProgressTypes.DISABLE_PROGRESS);
                            resolve();
                        });
                        archive.on('error', (e) => {
                            reject(e);
                        });
                        archive.on('entry', () => {});
                        archive.on('progress', ({ fs }) => {
                            const { totalBytes, processedBytes } = fs;
                            focusedWindow.setProgressBar(processedBytes / totalBytes);
                        });

                        archive.pipe(gzip).pipe(fsWriter);

                        archive.file(path.join(sourcePath, 'temp', 'project.json'), {
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

    async exportObject(e, object) {
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

    async importObject(e, objectFiles) {
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
