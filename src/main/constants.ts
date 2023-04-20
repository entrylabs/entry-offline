import { app } from 'electron';
import path from 'path';

export type ReplaceStrategy = (fileUrl: string) => string | undefined;
export default class {
    static get replaceStrategy(): { [key: string]: ReplaceStrategy } {
        return {
            fromExternal: (fileUrl) => {
                let result = fileUrl.replace(/%5C/gi, '\\'); // 1.6.x 버전 대응
                if (result.startsWith('./bower_components')) { // 웹 기본 오브젝트 대응
                    result = result
                        .replace('./bower_components', '../../../node_modules')
                        .replace('entryjs', 'entry-js'); // 과거 웹 WS 대응
                } else if (result.startsWith('/lib')) { // 신규 웹 기본 오브젝트 대응
                    result = result.replace('/lib', '../../../node_modules');
                } else if (result.indexOf('temp') > -1) { // 일반 오브젝트 대응
                    result = result.substring(result.indexOf('temp'));
                    result = path.join(this.appPath, result)
                        .replace(/\\/gi, '/');
                }

                // TODO: 히스토리 파악 후 완전 제거
                // if (fileUrl.endsWith('.svg')) {
                //     // svg 파일의 경우 png 파일로 교체한다.
                //     result = result.replace('.svg', '.png');
                // }

                result = result.replace(/.*\/\//, ''); // 외부 접속 프로토콜 스키마 보안 대응
                return result;
            },
            toExternal(fileUrl) {
                let result = fileUrl;

                if (result.startsWith('renderer')) {
                    result = result.replace('renderer', '.');
                }

                // 웹 업로드시 bower 에서 받던 구조 그대로 사용할 것이므로, 그 사이에 혼동을 주지 않기 위해
                // node_modules 로 링크되는 구조를 과거 로직으로 재치환 하여 export 함
                if (result.startsWith('../../../node_modules')) {
                    result = result.replace('../../../node_modules','./bower_components');
                }

                return result.substring(result.indexOf('temp'))
                    .replace(/\\/gi, '/')
                    .replace(/.*\/\//, ''); // 외부 접속 프로토콜 스키마 보안 대응
            },
            toExternalDeleteUrl(fileUrl) {
                let result: string | undefined = fileUrl;
                result = result.replace(/.*\/\//, ''); // 외부 접속 프로토콜 스키마 보안 대응
                if (result.startsWith('renderer')) {
                    result = result.replace('renderer', '.');
                } else if (result.startsWith('../../../node_modules')) {
                    result = result.replace('../../../node_modules','./bower_components');
                } else {
                    result = undefined;
                }
                return result;
            },
        };
    }

    static get defaultSoundPath() {
        return [
            './bower_components/entry-js/images/media/bark.mp3',
            './bower_components/entryjs/images/media/bark.mp3',
        ];
    }

    static get defaultPicturePath() {
        return [
            './bower_components/entry-js/images/media/entrybot1.png',
            './bower_components/entryjs/images/media/entrybot1.png',
            './bower_components/entry-js/images/media/entrybot2.png',
            './bower_components/entryjs/images/media/entrybot2.png',
            './bower_components/entry-js/images/_1x1.png',
            './bower_components/entryjs/images/_1x1.png',

            './bower_components/entry-js/images/media/entrybot1.svg',
            './bower_components/entryjs/images/media/entrybot1.svg',
            './bower_components/entry-js/images/media/entrybot2.svg',
            './bower_components/entryjs/images/media/entrybot2.svg',
            './bower_components/entry-js/images/_1x1.svg',
            './bower_components/entryjs/images/_1x1.svg',

            './lib/entry-js/images/media/entrybot1.png',
            './lib/entryjs/images/media/entrybot1.png',
            './lib/entry-js/images/media/entrybot2.png',
            './lib/entryjs/images/media/entrybot2.png',
            './lib/entry-js/images/_1x1.png',
            './lib/entryjs/images/_1x1.png',

            './lib/entry-js/images/media/entrybot1.svg',
            './lib/entryjs/images/media/entrybot1.svg',
            './lib/entry-js/images/media/entrybot2.svg',
            './lib/entryjs/images/media/entrybot2.svg',
            './lib/entry-js/images/_1x1.svg',
            './lib/entryjs/images/_1x1.svg',
        ];
    }

    // 사용위치는 join 을 사용 (프로젝트 외 경로)
    static get appPath() {
        return app.getPath('userData');
    }

    static tempPathForExport(objectId: string) {
        return path.join(
            this.appPath,
            'import',
            objectId,
            path.sep,
        );
    }

    // 사용위치는 join 을 사용 (프로젝트 외 경로)
    static get tempPath() {
        return path.join(
            this.appPath,
            'temp',
            path.sep,
        );
    }

    static tempImagePath(filename: string) {
        return path.join(
            this.tempPath,
            this.subDirectoryPath(filename),
            'image',
            path.sep,
        );
    }

    static tempThumbnailPath(filename: string) {
        return path.join(
            this.tempPath,
            this.subDirectoryPath(filename),
            'thumb',
            path.sep,
        );
    }

    static tempSoundPath(filename: string) {
        return path.join(
            this.tempPath,
            this.subDirectoryPath(filename),
            'sound',
            path.sep,
        );
    }

    static get resourcePath() {
        return path.resolve(
            app.getAppPath(), 'src', 'renderer', 'resources', 'uploads',
        );
    }

    static resourceImagePath(filename: string) {
        return path.join(
            this.resourcePath,
            this.subDirectoryPath(filename),
            'image',
            path.sep,
        );
    }

    static resourceThumbnailPath(filename: string) {
        return path.join(
            this.resourcePath,
            this.subDirectoryPath(filename),
            'thumb',
            path.sep,
        );
    }

    static resourceSoundPath(filename: string) {
        return path.join(
            this.resourcePath,
            this.subDirectoryPath(filename),
            path.sep,
        );
    }

    static subDirectoryPath(filename: string) {
        return path.join(
            filename.substr(0, 2),
            filename.substr(2, 2),
            path.sep,
        );
    }
}
