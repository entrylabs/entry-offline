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

    static get tempPath() {
        return path.join(
            app.getPath('userData'),
            'temp'
        );
    }

    static tempImagePath(filename) {
        return path.join(
            this.tempPath,
            this.resourceSubDirectoryPath(filename),
            'image',
            path.sep
        );
    }

    static tempThumbnailPath(filename) {
        return path.join(
            this.tempPath,
            this.resourceSubDirectoryPath(filename),
            'thumb',
            path.sep
        );
    }

    static tempSoundPath(filename) {
        return path.join(
            this.tempPath,
            this.resourceSubDirectoryPath(filename),
            path.sep
        );
    }

    static get resourcePath() {
        return path.join(
            __dirname, '..', 'renderer', 'resources', 'node_modules', 'uploads', path.sep
        );
    }

    static resourceImagePath(filename) {
        return path.join(
            this.resourcePath,
            this.resourceSubDirectoryPath(filename),
            'image',
            path.sep
        );
    }

    static resourceThumbnailPath(filename) {
        return path.join(
            this.resourcePath,
            this.resourceSubDirectoryPath(filename),
            'thumb',
            path.sep
        );
    }

    static resourceSoundPath(filename) {
        return path.join(
            this.resourcePath,
            this.resourceSubDirectoryPath(filename),
            path.sep
        );
    }

    static resourceSubDirectoryPath(filename) {
        return path.join(
            filename.substr(0, 2),
            filename.substr(2, 2),
            path.sep
        );
    }
}
