/// <reference types="Electron" />

declare interface Window extends Preload {
    Entry: Entry;
    createjs: any;
    EntryStatic: any;
    Lang: any;
    isOsx: boolean;
    modulePath: string;
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
    sendSync(channel: string, ...args: any[]): string | undefined;
    openEntryWebPage(): void;
    onLoadProjectFromMain(callback: (project: Promise<IEntry.Project>) => void): void;
    openHardwarePage(): void;
    checkPermission(type: 'microphone' | 'camera'): Promise<void>;
}

declare var entrylms: any;
declare var Lang: any;
declare var createjs: any;
declare var EntryStatic: any;
