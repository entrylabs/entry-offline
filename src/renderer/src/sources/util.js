import path from 'path';
import mime from 'mime-types';
const tempDirPath = `${path.sep}temp${path.sep}`;
const imageDirName = `image`;
const thumbDirName = `${path.sep}thumb${path.sep}`;
const imageDirCnt = imageDirName.length;
const thumbDirCnt = thumbDirName.length;

class Util {
    static test() {
        console.log(fs);
    }

    static getMimeType(path) {
        return mime.lookup(path);
    }

    static getMediaDataURI(path) {
        return new Promise((resolve, reject)=> {
            if(fs.existsSync(path)) {
                fs.readFile(path, (err, file)=> {
                    if(err) {
                        reject(err);
                    }
                    let mimeType = this.getMimeType(path);
                    if(mimeType === 'audio/wave') {
                        mimeType = 'audio/wav';
                    }
                    const dataURI = `data:${mimeType};base64,${new Buffer(file).toString('base64')}`;
                    resolve(dataURI);                    
                });
            } else {
                reject('해당 경로에 파일이 없습니다.');
            }
        });
    }

    static showOpenDialog(option, callback) {
        if(isOsx) {
            dialog.showOpenDialog(option, callback);
        } else {
            dialog.showOpenDialog(_mainWindow, option, callback);
        }
    }

    static showSaveDialog(option, callback) {
        console.log('dasdas?')
        if(isOsx) {
            dialog.showSaveDialog(option, callback);
        } else {
            dialog.showSaveDialog(_mainWindow, option, callback);
        }
    }

    static saveFileDialog(source, name, callback) {
        if(isOsx) {
            dialog.showSaveDialog({
                title: Lang.Workspace.file_save,
                defaultPath: name,
            }, (target) => {
                this.copyFile(source, target, callback);
            });
        } else {
            dialog.showSaveDialog(_mainWindow, {
                title: Lang.Workspace.file_save,
                defaultPath: name,
            }, (target) => {
                this.copyFile(source, target, callback);
            });            
        }
    }

    static clearTempDir(target = `${_real_temp_path}${tempDirPath}`) {
        const stats = fs.lstatSync(target);

        if(stats.isDirectory()) {
            let fileList = fs.readdirSync(target);

            fileList.forEach((item)=> {
                this.clearTempDir(path.join(target, item));
            });

            fileList = fs.readdirSync(target);
            if(fileList.length === 0 && target !== `${_real_temp_path}${tempDirPath}`) {
                fse.removeSync(target);
            }
        }        
    }

    static removeFileByUrl(fileurl) {
        const lastImageIndex = fileurl.lastIndexOf(imageDirName);
        const thumbFileUrl = `${fileurl.substr(0, lastImageIndex)}${thumbDirName}${fileurl.substr(lastImageIndex+imageDirCnt)}`;
        fse.removeSync(fileurl);
        fse.removeSync(thumbFileUrl);
    }

    static copyFile(_source, target, callback) {
        let cbCalled = false;
        const source = decodeURI(_source);
        let sourcePath = source;

        if(!path.isAbsolute(source)) {
            sourcePath = path.resolve(__rendererPath, source);
        }

        const p = new Promise((resolve, reject)=> {
            var readStream = fs.createReadStream(sourcePath);
            readStream.on("error", reject);

            var writeStream = fs.createWriteStream(target);
            writeStream.on("error", reject);
            writeStream.on("close", resolve);
            readStream.pipe(writeStream);
        });

        p.then(()=> {
            callback();
        }).catch((e)=> {
            callback(e);
        });
    }
}

export default Util;
