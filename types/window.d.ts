/// <reference types="Electron" />

declare interface Window {
    Entry: Entry;
    createjs: any;
    EntryStatic: any;
    Lang: any;

    isOsx: boolean;
    onPageLoaded: (callback: () => void) => void;
    getSharedObject: () => GlobalConfigurations;
    dialog: Electron.Dialog;
}

declare var entrylms: any;
declare var Lang: any;
declare var createjs: any;
declare var EntryStatic: any;
