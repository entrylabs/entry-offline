/// <reference types="Electron" />

declare interface Window extends Preload {
    Entry: Entry;
    createjs: any;
    EntryStatic: any;
    Lang: any;
    isOsx: boolean;
}

declare interface Preload {
    dialog: Electron.Dialog;
    onPageLoaded(callback: () => void): void;
    getSharedObject(): GlobalConfigurations;
    initNativeMenu(): void;
    getLang(key: string): string;
    ipcInvoke<T = any>(channel: string, ...args: any[]): Promise<T>
    openEntryWebPage(): void;
    onLoadProjectFromMain(callback: (project: Promise<IEntry.Project>) => void): void;
    openHardwarePage(): void;
    checkPermission(type: 'microphone' | 'camera'): Promise<void>;
}

declare var entrylms: any;
declare var Lang: any;
declare var createjs: any;
declare var EntryStatic: any;
