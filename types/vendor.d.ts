declare module 'entry-hw-server' {
    const value: any;
    export = value;
}

declare module 'entry-hw/*' {
    const value: any;
    export = value;
}

declare module 'winston-daily-rotate-file' {
    const value: any;
    export default value;
}

declare module '@entrylabs/tool' {
    export const Popup: any;
    export const ListTool: any;
}

declare module '@entrylabs/tool/component' {
    export const Dropdown: any;
    export const ModalProgress: any;
}

declare module '@entrylabs/modal/dist/entry-modal.js' {
    export const Confirm: any;
    export const Alert: any;
    export const Prompt: any;
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

declare module 'async-csv' {
    const value: {
        parse(csvString: string): Promise<string[][]>;
    };
    export = value;
}
