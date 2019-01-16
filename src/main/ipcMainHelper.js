import { ipcMain, app } from 'electron';
import zlib from 'zlib';
import fs from 'fs';
import tar from 'tar';
import stream from 'stream';
import path from 'path';
import fstream from 'fstream';
import MainUtils from './MainUtils';

/* eslint-disable new-cap */
class IpcMainHelper {
    constructor() {
        ipcMain.on('resetDirectory', () => this.resetSaveDirectory);
        ipcMain.on('decompress', (e, filePath) => this.loadProject(e, filePath));
        // ipcMain.on('saveProject', (event, arg) => {/*this.saveProject(event, arg)*/});
    }

    resetSaveDirectory() {
        MainUtils.deleteFolderRecursive(path.resolve(app.getPath('userData'), 'temp'));
    }

    loadProject(event, filePath) {
        const rs = fs.createReadStream(filePath);
        const gunzip = zlib.createGunzip();
        const electronAppPath = app.getPath('userData');

        gunzip.on('error', function(err) {
            event.sender.send('decompress', err);
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
                event.sender.send('decompress', err);
            });
            fsWriter.on('end', () => {
                fs.readFile(
                    path.resolve(electronAppPath, 'temp', 'project.json'),
                    'utf8',
                    (err, data) => {
                        if (err) {
                            event.sender.send('decompress', err);
                        } else {
                            const project = JSON.parse(data);
                            MainUtils.changeObjectPath(project, (fileUrl) => {
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
                            project.basePath = electronAppPath; // electron save path
                            project.savedPath = filePath; // real .ent file's path
                            event.sender.sender('decompress', project);
                        }
                    }
                );
            });

            bufferStream.end(Buffer.concat(buffers));
            bufferStream.pipe(tar.Parse()).pipe(fsWriter);
        });
        rs.pipe(gunzip);
    }
}

new IpcMainHelper();
export default IpcMainHelper;
