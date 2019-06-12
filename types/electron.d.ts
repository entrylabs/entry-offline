declare module 'electron' {
    import { BrowserWindow, webContents } from 'electron';

    interface NamedWebContents extends webContents {
        name?: string;
    }

    export interface NamedBrowserWindow extends BrowserWindow {
        webContents: NamedWebContents
    }
}
