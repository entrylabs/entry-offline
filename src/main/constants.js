import { app } from 'electron';
import path from 'path';

export default class {
    static get defaultSoundPath() {
        return ['./bower_components/entry-js/images/media/bark.mp3'];
    }

    static get defaultPicturePath() {
        return [
            './bower_components/entry-js/images/media/entrybot1.png',
            './bower_components/entry-js/images/media/entrybot2.png',
            './bower_components/entry-js/images/_1x1.png',
        ];
    }

    static tempPathForExport(objectId) {
        return path.join(
            app.getPath('userData'),
            'import',
            objectId,
            'object',
            path.sep,
        );
    }

    static get tempPath() {
        return path.join(
            app.getPath('userData'),
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
            __dirname, '..', 'renderer', 'resources', 'node_modules', 'uploads', path.sep,
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
