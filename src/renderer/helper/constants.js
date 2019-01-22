export default class {
    static get resourcePath() {
        return 'renderer/resources/node_modules/uploads/';
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
