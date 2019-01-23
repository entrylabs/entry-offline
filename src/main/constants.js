import { app } from 'electron'

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

    static get resourcePath() {
        return 'renderer/resources/node_modules/uploads/';
    }

    static get tempPath() {
        return `${app.getPath('userData')}/temp`;
    }

    static tempImagePath(filename) {
        return `${this.tempPath}${filename.substr(0, 2)}/${filename.substr(2, 2)}/image/`;
    }

    static tempThumbnailPath(filename) {
        return `${this.tempPath}${filename.substr(0, 2)}/${filename.substr(2, 2)}/thumb/`;
    }

    // resourceSoundPath 와 다르다.
    static tempSoundPath(filename) {
        return `${this.tempPath}${filename.substr(0, 2)}/${filename.substr(2, 2)}/sound/`;
    }

    static resourceImagePath(filename) {
        return `${this.resourcePath}${filename.substr(0, 2)}/${filename.substr(2, 2)}/image/`;
    }

    static resourceThumbnailPath(filename) {
        return `${this.resourcePath}${filename.substr(0, 2)}/${filename.substr(2, 2)}/thumb/`;
    }

    static resourceSoundPath(filename) {
        return `${this.resourcePath}${filename.substr(0, 2)}/${filename.substr(2, 2)}/`;
    }
}
