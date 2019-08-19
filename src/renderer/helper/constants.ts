import root from 'window-or-global';

export default class {
    static get sep() {
        return root.isOsx ? '/' : '\\';
    }

    static get resourcePath() {
        return `renderer${this.sep}resources${this.sep}uploads${this.sep}`;
    }

    static resourceImagePath(filename: string) {
        return `${this.resourcePath}${this.resourceSubDirectoryPath(filename)}image${this.sep}`;
    }

    static resourceThumbnailPath(filename: string) {
        return `${this.resourcePath}${this.resourceSubDirectoryPath(filename)}thumb${this.sep}`;
    }

    static resourceSoundPath(filename: string) {
        return `${this.resourcePath}${this.resourceSubDirectoryPath(filename)}`;
    }

    static resourceSubDirectoryPath(filename: string) {
        return `${filename.substr(0, 2)}${this.sep}${filename.substr(2, 2)}${this.sep}`;
    }
}
