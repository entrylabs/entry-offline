import { app, BrowserWindow } from 'electron';
import fstream from 'fstream';
import archiver from 'archiver';
import fs from 'fs';
import zlib from 'zlib';
import path from 'path';
import { default as Utils } from '../common/commonUtils';
import FileUtils from './fileUtils';
import root from 'window-or-global';
import stream from "stream";
import tar from 'tar';

/**
 * Main Process 에서 발생하는 로직들을 담당한다.
 * ipcMain 을 import 하여 사용하지 않는다. renderer Process 간 이벤트 관리는 ipcMainHelper 가 한다.
 */
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

    //TODO 개선필요
    static async exportObject(e, filePath, object) {
        const { objects } = object;

        const objectId = Utils.createFileId();
        const objectName = objects[0].name;
        // renderer/bower_components 를 ./bower_components 로 치환
        this.changeObjectPath(object, (fileUrl) => {
            let result = fileUrl;
            if (result.startsWith('renderer')) {
                result = result.replace('renderer', '.');
            }
            return result;
        });
        const objectData = typeof object === 'string' ? object : JSON.stringify(object);

        const objectTempDirPath = path.join(app.getPath('userData'), 'import', objectId, 'object');
        const objectJsonPath = path.join(objectTempDirPath, 'object.json');

        const exportFileName = `${objectName}.eo`;
        const exportFile = path.resolve(objectTempDirPath, '..', exportFileName);

        try {
            await FileUtils.mkdirRecursive(objectTempDirPath);
            await Utils.copyObjectFiles(object, objectTempDirPath);
            await FileUtils.writeFile(objectData, objectJsonPath);
            await FileUtils.compressDirectoryToFile(exportFile, filePath);
            // FileUtils.removeDirectoryRecursive(path.join(app.getPath('userData'), 'import'));
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

    static staticDownload(srcFilePath, targetFilePath) {
        const fullStaticFilePath = path.resolve(__dirname, 'static', srcFilePath);

        const readStream = fs.createReadStream(fullStaticFilePath);
        const writeStream = fs.createWriteStream(targetFilePath);

        readStream.pipe(writeStream);
    }
}
