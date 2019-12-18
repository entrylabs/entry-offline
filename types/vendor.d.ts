declare module '@entrylabs/tool' {
    export const Popup: any;
}

declare module '@entrylabs/tool/component' {
    export const Dropdown: any;
    export const ModalProgress: any;
}

declare module 'puid' {
    const value: any;
    export = value;
}

declare module 'fontfaceonload' {
    const value: any;
    export = value;
}

declare module 'uid' {
    const value: any;
    export = value;
}

declare module 'mp3-duration' {
    const value: any;
    export = value;
}

/* eslint-disable */
declare module 'fstream' {
    const value: any;
    export = value;
}

declare module 'excel4node' {
    const value: any;
    export = value;
}

declare module 'xml2js' {
    const value: any;
    export = value;
}

declare module 'electron' {
    /**
     * TODO
     *  Named.. 관련 인터페이스는 모두 런타임에서의 프로퍼티 추가가 있던 로직에 의해 만들어졌다.
     *  그러므로 추후 해당 프로퍼티를 삭제하고도 로직을 실행시킬 수 있도록 변경해야 할 것이다.
     */
    interface NamedWebContents extends Electron.webContents {
        name?: string;
    }

    export interface NamedBrowserWindow extends Electron.BrowserWindow {
        webContents: NamedWebContents
        hardwareRouter?: any;
        hardwareEntryServer?: any;
    }

    export interface NamedEvent extends Electron.Event {
        sender: NamedWebContents
    }
}
