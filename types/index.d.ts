// TODO ObjectLike 로 표기된 구문은 나중에 인터페이스로 따로 만들어주어야 한다.
declare interface ObjectLike extends Object {
    [key: string]: any
}

declare type WorkspaceMode = 'practical_course' | 'workspace';

declare module '@entrylabs/tool' {
    export const Popup: any;
}
declare module '@entrylabs/tool/component' {
    export const Dropdown: any;
}

/* eslint-disable */
declare module 'puid' {
    const value: any;
    export = value;
}

/* eslint-disable */
declare module 'window-or-global' {
    const value: any;
    export = value;
}

/* eslint-disable */
declare module 'uid' {
    const value: any;
    export = value;
}

/* eslint-disable */
declare module 'mp3-duration' {
    const value: any;
    export = value;
}

/* eslint-disable */
declare module 'fstream' {
    const value: any;
    export = value;
}

/* eslint-disable */
declare module 'excel4node' {
    const value: any;
    export = value;
}

/* eslint-disable */
declare module 'xml2js' {
    const value: any;
    export = value;
}
