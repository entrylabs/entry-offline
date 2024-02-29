export default class {
    static get sep() {
        return window.isOsx ? '/' : '\\';
    }

    static get resourcePath() {
        return `renderer${this.sep}resources${this.sep}uploads${this.sep}`;
    }

    static resourceImagePath(filename: string) {
        return `..${this.sep}..${this.sep}${this.resourcePath}${this.resourceSubDirectoryPath(
            filename
        )}image${this.sep}`;
    }

    static resourceThumbnailPath(filename: string) {
        return `${this.resourcePath}${this.resourceSubDirectoryPath(filename)}thumb${this.sep}`;
    }

    static resourceSoundPath(filename: string) {
        return `..${this.sep}..${this.sep}${this.resourcePath}${this.resourceSubDirectoryPath(
            filename
        )}`;
    }

    static tempSoundPath(filename: string) {
        return `temp${this.sep}${this.tempSubDirectoryPath(filename)}sound${
            this.sep
        }${filename}.mp3`;
    }

    static resourceSubDirectoryPath(filename: string) {
        return `${filename.substr(0, 2)}${this.sep}${filename.substr(2, 2)}${this.sep}`;
    }

    static tempSubDirectoryPath(filename: string) {
        return `${filename.substr(0, 2)}${this.sep}${filename.substr(2, 2)}${this.sep}`;
    }
}
