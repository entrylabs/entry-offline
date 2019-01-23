import path from "path";
import fs from "fs";
import fstream from 'fstream';
import archiver from 'archiver';
import zlib from "zlib";
import Constants from './constants';
import CommonUtils from '../common/commonUtils';

/**
 * 파일 및 디렉토리의 생성 / 삭제와 압축등 IO 와 관련된 일을 담당한다.
 */
export default class {
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

    static ensureDirectoryExistence(dirPath) {
        const dirname = path.dirname(dirPath);
        if (fs.existsSync(dirname)) {
            return true;
        }
        this.ensureDirectoryExistence(dirname);
        fs.mkdirSync(dirname);
    }

    static removeDirectoryRecursive(dirPath) {
        const list = fs.readdirSync(dirPath);
        for (let i = 0; i < list.length; i++) {
            const filename = path.join(dirPath, list[i]);
            const stat = fs.statSync(filename);

            if (filename === '.' || filename === '..') {
                continue;
            }

            if (stat.isDirectory()) {
                this.removeDirectoryRecursive(filename);
            } else {
                fs.unlinkSync(filename);
            }
        }
        fs.rmdirSync(dirPath);
    }

    /**
     * 파일을 생성한다.
     * @param contents 작성할 내용
     * @param filePath 파일명
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

            archive.pipe(gzip).pipe(fsWriter);

            archive.directory(parser.dir, false);
            archive.finalize();
        });
    }

    static copyPictureFileToTemp(picture) {
        return new Promise(async(resolve, reject) => {
            console.log(picture.fileurl);
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
                    const tempImagePath = `${Constants.tempImagePath(newFileName)}${newFileName}${ext}`;
                    const tempThumbnailPath = `${Constants.tempThumbnailPath(newFileName)}${newFileName}${ext}`;

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

    static copyFile(src, dest) {
        return new Promise((resolve, reject) => {
            this.ensureDirectoryExistence(dest);
            const crs = fs.createReadStream(src);
            const cws = fs.createWriteStream(dest);
            new Promise((res, rej) => {
                crs.on('error', rej);
                cws.on('error', rej);
                cws.on('finish', res);
                crs.pipe(cws);
            })
                .then(resolve)
                .catch((err) => {
                    crs.destroy();
                    cws.end();
                    reject(err);
                });
        });
    }
}
