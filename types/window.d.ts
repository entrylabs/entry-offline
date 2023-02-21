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
    ipcListen: (
        channel: string,
        listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
    ) => Electron.IpcRenderer;
    onPageLoaded(callback: () => void): void;
    getSharedObject(): GlobalConfigurations;
    initNativeMenu(): void;
    getLang(key: string): string;
    ipcInvoke<T = any>(channel: string, ...args: any[]): Promise<T>;
    ipcSend<T = any>(channel: string, ...args: any[]): void;
    sendSync<T = any>(channel: string, ...args: any[]): any;
    openEntryWebPage(): void;
    onLoadProjectFromMain(callback: (project: Promise<IEntry.Project>) => void): void;
    openHardwarePage(): void;
    checkPermission(type: 'microphone' | 'camera'): Promise<void>;
    weightsPath: () => string;
    getAppPathWithParams: (...params: string[]) => string;
}

declare var entrylms: any;
declare var EntryModal: any;
declare var Lang: any;
declare var createjs: any;
declare var EntryStatic: any;
