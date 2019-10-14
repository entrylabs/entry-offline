import path from 'path';
import fs, { PathLike } from 'fs';
import rimraf from 'rimraf';
// @ts-ignore
import tar, { CreateOptions, FileOptions } from 'tar';
import { nativeImage } from 'electron';

type tarCreateOption = FileOptions & CreateOptions;
/**
 * 파일 및 디렉토리의 생성 / 삭제와 압축등 IO 와 관련된 일을 담당한다.
 */
export default class {
    /**
     * 디렉토리를 생성한다.
     * ensureDirectoryExistence 와 다른점은 target directory 의 현재 경로까지 생성한다는 점이다.
     * @param {string}target 생성할 경로
     * @return {Promise<any>}
     */
    static mkdirRecursive(target: string) {
        return new Promise((resolve, reject) => {
            fs.stat(target, async (err) => {
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

    /**
     * 현재 경로 상위 디렉토리까지 폴더가 존재하는지 확인하고, 아닌 경우 생성한다.
     * @param {string}dirPath 파일 혹은 디렉토리 경로
     */
    static ensureDirectoryExistence(dirPath: string) {
        const dirname = path.dirname(dirPath);
        if (fs.existsSync(dirname)) {
            return;
        }
        this.ensureDirectoryExistence(dirname);
        fs.mkdirSync(dirname);
    }

    /**
     * 디렉토리를 삭제한다.
     * @param dirPath 삭제할 디렉토리 명
     * @return {Promise<any>}
     */
    static removeDirectoryRecursive(dirPath: string) {
        return new Promise((resolve, reject) => {
            rimraf(dirPath, (err) => {
                if (!err) {
                    resolve();
                } else {
                    reject(err);
                }
            });
        });
    }

    /**
     * 파일을 압축해제하여 디렉토리 위치에 저장한다.
     * @param sourcePath 압축해제할 파일. 일반적으로는 eo 확장자 파일.
     * @param targetPath 디렉
     * @return {Promise<>}
     */
    static unpack(sourcePath: string, targetPath: string) {
        return new Promise((resolve, reject) => {
            process.once('uncaughtException', function(e) {
                reject();
            });

            tar.x({
                file: sourcePath,
                cwd: targetPath,
                strict: true,
                filter: (path, entry) => {
                    const { type } = entry;
                    // @ts-ignore
                    return type !== 'SymbolicLink' && path.startsWith('temp/');
                },
            })
                .then(resolve)
                .catch(reject);
        });
    }

    /**
     * 폴더를 압축하여 파일 하나로 압축해 저장한다.
     * @param sourcePath 압축할 폴더 위치
     * @param targetPath 저장될 파일 경로
     * @param {tarCreateOption?}options
     * @param {string[]?}fileList default: sourcePath 경로기준 동일 depth 내 모든 파일
     * @return {Promise<any>}
     */
    static async pack(
        sourcePath: string,
        targetPath: string,
        options: tarCreateOption = {},
        fileList = ['.'],
    ) {
        const srcDirectoryPath = path.parse(sourcePath).dir;
        const defaultOption: tarCreateOption = {
            file: targetPath,
            gzip: {
                level: 6,
                memLevel: 9,
            },
            cwd: srcDirectoryPath,
            filter: (path, stat) => {
                try {
                    // @ts-ignore
                    return !stat.isSymbolicLink();
                } catch (e) {
                    return false;
                }
            },
            portable: true,
        };
        await tar.c(
            Object.assign(defaultOption, options),
            fileList,
        );
    }

    /**
     * 이미지 버퍼를 섬네일용으로 리사이징한다.
     * 섬네일은 width 96px 기준으로, png 파일 확장자를 가진다.
     * @param {Buffer||string}imageData 원본 이미지 버퍼 혹은 원본 이미지 주소
     */
    static createThumbnailBuffer(imageData: string | Buffer) {
        let imageResizeNativeImage: nativeImage;
        if (imageData instanceof Buffer) {
            imageResizeNativeImage = nativeImage.createFromBuffer(imageData);
        } else {
            imageResizeNativeImage = nativeImage.createFromPath(imageData);
        }

        return imageResizeNativeImage
            .resize({
                width: 96,
                quality: 'better',
            })
            .toPNG();
    }

    /**
     * 파일을 생성한다.
     * @param contents 작성할 내용
     * @param {string}filePath 파일 경로
     * @param {fs.WriteFileOptions}option 파일 옵션
     * @return {Promise<>}
     */
    static writeFile(contents: any, filePath: string, option: fs.WriteFileOptions = {
        encoding: 'utf8',
        mode: '0777',
    }) {
        return new Promise((resolve, reject) => {
            this.ensureDirectoryExistence(filePath);
            fs.writeFile(filePath, contents, option, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    /**
     * 파일을 삭제한다.
     * 삭제상 에러가 발생한 경우는 로그만 출력 후 종료된다.
     * 삭제가 되지 않은 케이스는 크리티컬하지 않아서이다.
     * @param filePath
     */
    static deleteFile(filePath: string) {
        return new Promise((resolve) => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(err);
                    resolve();
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * 파일을 읽어서 데이터를 반환한다.
     * @param {string}filePath 파일 경로
     * @return {Promise<any>}
     */
    static readFile(filePath: PathLike): Promise<any> {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    /**
     * 파일을 복사한다.
     * @param {string}src 복사될 파일경로
     * @param {string}dest 저장할 파일경로
     * @return {Promise<any>}
     */
    static copyFile(src: string, dest: string) {
        return new Promise((resolve, reject) => {
            this.ensureDirectoryExistence(dest);
            const readStream = fs.createReadStream(src);
            const writeStream = fs.createWriteStream(dest);
            new Promise((res, rej) => {
                readStream.on('error', rej);
                writeStream.on('error', rej);
                writeStream.on('finish', res);
                readStream.pipe(writeStream);
            })
                .then(resolve)
                .catch((err) => {
                    readStream.destroy();
                    writeStream.end();
                    reject(err);
                });
        });
    }
}
