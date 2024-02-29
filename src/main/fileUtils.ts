import path from 'path';
import fs, { PathLike } from 'fs';
import fse from 'fs-extra';
import rimraf from 'rimraf';
import tar, { CreateOptions, FileOptions } from 'tar';
import { nativeImage, NativeImage } from 'electron';
import createLogger from './utils/functions/createLogger';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import ffprobeInstaller from '@ffprobe-installer/ffprobe'
import get from 'lodash/get';

type tarCreateOption = FileOptions & CreateOptions;
type readFileOption = { encoding?: string | null; flag?: string } | string | undefined | null;
type Dimension = { width: number; height: number };

const logger = createLogger('main/fileUtils.ts');
const ffmpegPath = ffmpegInstaller.path.replace(
	'app.asar',
	'app.asar.unpacked'
);
const ffprobePath = ffprobeInstaller.path.replace(
	'app.asar',
	'app.asar.unpacked'
);
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

export const ImageResizeSize: { [key: string]: Dimension } = {
    thumbnail: { width: 96, height: 96 },
    picture: { width: 960, height: 540 },
};
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
                    logger.info(`directory ${target} created`);
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
        if (this.isDirectoryExistSync(dirname)) {
            return;
        }
        this.ensureDirectoryExistence(dirname);
        fs.mkdirSync(dirname);
    }

    static isDirectoryExistSync(dirname: string): boolean {
        return fs.existsSync(dirname);
    }

    /**
     * 디렉토리를 삭제한다.
     * @param dirPath 삭제할 디렉토리 명
     * @return {Promise<any>}
     */
    static removeDirectoryRecursive(dirPath: string) {
        return new Promise((resolve, reject) => {
            rimraf(dirPath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    logger.info(`directory ${dirPath} removed`);
                    resolve(dirPath);
                }
            });
        });
    }

    /**
     * 파일을 압축해제하여 디렉토리 위치에 저장한다.
     * @param sourcePath 압축해제할 파일. 일반적으로는 eo 확장자 파일.
     * @param targetPath 디렉
     * @param filterFunction 해당 함수가 존재하면, 해당 함수 내 true 를 반환하는 파일만 필터된다.
     * @return {Promise<>}
     */
    static unpack(
        sourcePath: string,
        targetPath: string,
        filterFunction?: (path: string) => boolean
    ) {
        return new Promise((resolve, reject) => {
            process.once('uncaughtException', function(e) {
                reject();
            });

            logger.info(`try to unpack ${sourcePath} to ${targetPath}`);
            tar.x({
                file: sourcePath,
                cwd: targetPath,
                strict: true,
                filter: (path, entry) => {
                    const { type } = entry;
                    // @ts-ignore
                    return type !== 'SymbolicLink' && (!filterFunction || filterFunction(path));
                },
            })
                .then(() => {
                    logger.verbose(`try to unpack ${sourcePath} is done`);
                    resolve(sourcePath);
                })
                .catch((err) => {
                    logger.error(`try to unpack ${sourcePath} failed. ${err.message}`);
                    reject(err);
                });
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
        fileList = ['.']
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

        logger.info(`try to pack ${sourcePath}`);
        await tar.c(Object.assign(defaultOption, options), fileList);
        logger.info('try to pack is done');
    }

    /**
     * 이미지 버퍼를 섬네일용으로 리사이징한다.
     * 섬네일은 width 96px 기준으로, png 파일 확장자를 가진다.
     */
    static createResizedImageBuffer(imageData: string | Buffer, dimension: Dimension) {
        let imageResizeNativeImage: NativeImage;
        if (imageData instanceof Buffer || typeof imageData !== 'string') {
            imageResizeNativeImage = nativeImage.createFromBuffer(imageData as any);
        } else {
            imageResizeNativeImage = nativeImage.createFromPath(imageData as string);
        }

        return imageResizeNativeImage
            .resize({
                quality: 'better',
                ...dimension,
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
    static writeFile(
        contents: any,
        filePath: string,
        option: fs.WriteFileOptions = {
            encoding: 'utf8',
            mode: '0777',
        }
    ) {
        return new Promise((resolve, reject) => {
            this.ensureDirectoryExistence(filePath);
            logger.info(`writeFile to ${filePath}..`);
            fs.writeFile(filePath, contents, option, (err) => {
                if (err) {
                    logger.error(`writeFile error ${err.message}`);
                    return reject(err);
                }
                logger.verbose('writeFile done');
                resolve(filePath);
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
        logger.info(`deleteFile ${filePath}`);
        return new Promise((resolve) => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    logger.info('deleteFile failed');
                    resolve(err);
                } else {
                    resolve(filePath);
                }
            });
        });
    }

    /**
     * 파일을 읽어서 데이터를 반환한다.
     */
    static readFile(filePath: PathLike, option?: readFileOption): Promise<any> {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, option, (err, data) => {
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
        logger.info(`copyFile ${src} to ${dest}..`);
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
                    logger.info(`copyFile failed ${err.message}`);
                    readStream.destroy();
                    writeStream.end();
                    reject(err);
                });
        });
    }

    static move(src: string, dest: string) {
        logger.info(`moveFile to ${src} to ${dest}`);
        fse.moveSync(src, dest, { overwrite: true });
    }

    static getSoundInfo = (filePath: string, isExtCheck = true): Promise<ProbeData> =>
        new Promise((resolve, reject) => {
            ffmpeg.ffprobe(filePath, (err: any, probeData: any) => {
                if (err) {
                    return reject(err);
                }
                const { format = {} } = probeData;
                const { format_name: formatName } = format;
                if (isExtCheck && formatName !== 'mp3') {
                    return reject(new Error('업로드 파일이 MP3 파일이 아닙니다.'));
                }
                resolve(probeData);
            });
        });

    static getDuration = (soundInfo: any) => {
        const duration = get(soundInfo, ['format', 'duration'], 0);
        return Number(duration).toFixed(1);
    };

    static convertStreamToMp3AndSave = (filePath: string, targetPath: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            // INFO : targetPath경로에 해당하는 디렉토리를 미리 만들어 줘야함
            this.ensureDirectoryExistence(targetPath);
            ffmpeg(filePath)
                .audioCodec('libmp3lame')
                .toFormat('mp3')
                .output(targetPath)
                .on('end', () => resolve(targetPath))
                .on('error', (err: any) => {
                    if (err && err.message) {
                        console.error(`Error: ${err.message}`);
                        logger.error(`Error: ${err.message}`);
                    }
                    reject(err);
                })
                .run();
        });
    };
}
