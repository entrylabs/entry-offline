import { ipcMain, app } from 'electron';
import zlib from 'zlib';
import fs from 'fs';
import tar from 'tar';
import stream from 'stream';
import path from 'path';
import fstream from 'fstream';

/* eslint-disable new-cap */
class IpcMainHelper {
    constructor() {
        console.log('ipcMainHelper created');
        ipcMain.on('decompress', (e, filePath) => {
            const rs = fs.createReadStream(filePath);
            const gunzip = zlib.createGunzip();
            const electronAppPath = app.getPath('userData');

            gunzip.on('error', function(err) {
                e.sender.send('decompress',err);
            });

            const buffers = [];
            gunzip.on('data', (data) => {
                buffers.push(data);
            });

            gunzip.on('end', () => {
                const bufferStream = new stream.PassThrough();
                this.deleteFolderRecursive(path.join(electronAppPath, 'temp'));
                const fsWriter = fstream.Writer({
                    path: electronAppPath,
                    mode: '0777',
                    type: 'Directory',
                });
                fsWriter.on('entry', function(list) {
                    list.props.mode = '0777';
                });
                fsWriter.on('error', function(err) {
                    e.sender.send('decompress', err);
                });
                fsWriter.on('end', function() {
                    fs.readFile(
                        path.resolve(electronAppPath, 'temp', 'project.json'),
                        'utf8',
                        function(err, data) {
                            if (err) {
                                e.sender.send('decompress', err);
                            } else {
                                const project = JSON.parse(data);
                                project.basePath = electronAppPath; // electron save path
                                project.savedPath = filePath; // real .ent file's path
                                e.sender.send('decompress', project);
                            }
                        },
                    );
                });

                bufferStream.end(Buffer.concat(buffers));
                bufferStream.pipe(tar.Parse())
                    .pipe(fsWriter);
            });

            rs.pipe(gunzip);
        });
    }

    deleteFolderRecursive(localPath) {
        if (fs.existsSync(localPath)) {
            fs.readdirSync(localPath)
                .forEach((file) => {
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
}

new IpcMainHelper();
export default IpcMainHelper;
