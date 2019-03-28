import { app } from 'electron';
import path from 'path';

export default  class {
    static get replaceStrategy() {
        return {
            fromExternal: (fileUrl) => {
                let result = fileUrl.replace(/%5C/gi, '\\'); // 1.6.x 버전 대응
                if (result.startsWith('./bower_components')) { // 웹 기본 오브젝트 대응
                    result = result
                        .replace(/\./, 'renderer')
                        .replace('entryjs', 'entry-js'); // 과거 웹 WS 대응
                } else if (result.indexOf('temp') > -1) { // 일반 오브젝트 대응
                    result = result.substring(result.indexOf('temp'));
                    result = path.join(this.appPath, result)
                        .replace(/\\/gi, '/');
                }
                return result;
            },
            toExternal(fileUrl) {
                let result = fileUrl;

                if (result.startsWith('renderer')) {
                    result = result.replace('renderer', '.');
                }
                result = result.substring(result.indexOf('temp'));
                result = result.replace(/\\/gi, '/');

                return result;
            },
            toExternalDeleteUrl(fileUrl) {
                let result = fileUrl;
                if (result.startsWith('renderer')) {
                    result = result.replace('renderer', '.');
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
        ];
    }

    static get appPath() {
        return app.getPath('userData');
    }

    static tempPathForExport(objectId) {
        return path.join(
            this.appPath,
            'import',
            objectId,
            path.sep,
        );
    }

    static get tempPath() {
        return path.join(
            this.appPath,
            'temp',
            path.sep,
        );
    }

    static tempImagePath(filename) {
        return path.join(
            this.tempPath,
            this.subDirectoryPath(filename),
            'image',
            path.sep,
        );
    }

    static tempThumbnailPath(filename) {
        return path.join(
            this.tempPath,
            this.subDirectoryPath(filename),
            'thumb',
            path.sep,
        );
    }

    static tempSoundPath(filename) {
        return path.join(
            this.tempPath,
            this.subDirectoryPath(filename),
            'sound',
            path.sep,
        );
    }

    static get resourcePath() {
        return path.join(
            __dirname, '..', 'renderer', 'resources', 'uploads', path.sep,
        );
    }

    static resourceImagePath(filename) {
        return path.join(
            this.resourcePath,
            this.subDirectoryPath(filename),
            'image',
            path.sep,
        );
    }

    static resourceThumbnailPath(filename) {
        return path.join(
            this.resourcePath,
            this.subDirectoryPath(filename),
            'thumb',
            path.sep,
        );
    }

    static resourceSoundPath(filename) {
        return path.join(
            this.resourcePath,
            this.subDirectoryPath(filename),
            path.sep,
        );
    }

    static subDirectoryPath(filename) {
        return path.join(
            filename.substr(0, 2),
            filename.substr(2, 2),
            path.sep,
        );
    }
}
