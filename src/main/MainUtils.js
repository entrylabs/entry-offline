import { app, ipcMain } from 'electron';
import fstream from 'fstream';
import archiver from 'archiver';
import zlib from 'zlib';
import path from 'path';
import { ProgressTypes } from './Constants';
import { default as Utils } from '../common/Utils';

class MainUtils {
    constructor(window) {
        this.window = window;
        this.ipcManagement();
    }

    ipcManagement() {
        ipcMain.on('exportObject', this.exportObject);
        ipcMain.on('importObject', this.importObject);
    }

    async saveProject({ sourcePath, destinationPath }) {
        return new Promise((resolve, reject) => {
            var archive = archiver('tar');
            var gzip = zlib.createGzip();
            var fs_writer = fstream.Writer({
                path: destinationPath,
                mode: '0777',
                type: 'File',
            });

            fs_writer.on('error', (e) => {
                reject(e);
            });

            fs_writer.on('end', () => {
                this.window.setProgressBar(ProgressTypes.DISABLE_PROGRESS);
                resolve();
            });
            archive.on('error', (e) => {
                reject(e);
            });
            archive.on('entry', () => {});
            archive.on('progress', ({ fs }) => {
                const { totalBytes, processedBytes } = fs;
                this.window.setProgressBar(processedBytes / totalBytes);
            });

            archive.pipe(gzip).pipe(fs_writer);

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
        });
    }

    lpad(str, len) {
        var strLen = str.length;
        if (strLen < len) {
            for (var i = 0; i < len - strLen; i++) {
                str = '0' + str;
            }
        }
        return String(str);
    };

    getPaddedVersion(version) {
        if (!version) {
            return '';
        }
        version = String(version);

        var padded = [];
        var splitVersion = version.split('.');
        splitVersion.forEach((item) => {
            padded.push(this.lpad(item, 4));
        });

        return padded.join('.');
    };

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
                const job = new Promise(async (resolve, reject) => {
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

export default MainUtils;
