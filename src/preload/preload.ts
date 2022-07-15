import { ipcRenderer, shell } from 'electron';
import nativeMenu from './nativeMenu';
import get from 'lodash/get';
import path from 'path';
const remote = require('@electron/remote');

ipcRenderer.on('console', (event: Electron.IpcRendererEvent, ...args: any[]) => {
    console.log(...args);
});

type OptionalDimension = { x?: number; y?: number; width?: number; height?: number };

ipcRenderer.on(
    'convertPng',
    (
        event: Electron.IpcRendererEvent,
        base64String: string,
        mimeType: string,
        dimension?: OptionalDimension
    ) => {
        const canvas = document.createElement('canvas');
        const { x, y, width, height } = dimension || {};
        const imageElement = width && height ? new Image(width, height) : new Image();

        imageElement.onload = function() {
            canvas.width = imageElement.width;
            canvas.height = imageElement.height;

            x && (canvas.width += x);
            y && (canvas.height += y);

            canvas
                .getContext('2d')!
                .drawImage(imageElement, x || 0, y || 0, canvas.width, canvas.height);

            const pngImage = canvas.toDataURL('image/png');
            console.log('image to png processed');
            event.sender.send('convertPng', pngImage);
            canvas.remove();
        };
        imageElement.src = `data:${mimeType};base64,${base64String}`;
    }
);

window.onPageLoaded = (callback) => {
    ipcRenderer.on('showWindow', () => {
        callback();
    });
};

window.getSharedObject = () => remote.getGlobal('sharedObject');
window.dialog = remote.dialog;

window.initNativeMenu = () => {
    nativeMenu.init();
};

window.getLang = (key: string) => {
    const lang = Lang || {};
    return get(lang, key) || key;
};

window.ipcInvoke = (channel: string, ...args: any[]) => {
    return ipcRenderer.invoke(channel, ...args);
};

window.openEntryWebPage = () => {
    shell.openExternal('https://playentry.org/download/offline');
};

window.openHardwarePage = () => {
    ipcRenderer.send('openHardwareWindow');
};

window.weightsPath = () => {
    console.log(process.env.NODE_ENV);
    return process.env.NODE_ENV === 'production'
        ? path.resolve(process.resourcesPath, 'weights')
        : path.resolve(remote.app.getAppPath(), 'node_modules', 'entry-js', 'weights');
};

/**
 * external file => loadProjectFromMain event => loadProject => callback(project)
 */
window.onLoadProjectFromMain = (callback: (project: Promise<IEntry.Project>) => void) => {
    ipcRenderer.on('loadProjectFromMain', async (e, filePath: string) => {
        const project = await ipcRenderer.invoke('loadProject', filePath);
        callback(project);
    });
};

window.checkPermission = async (type: 'microphone' | 'camera') => {
    await ipcRenderer.invoke('checkPermission', type);
};

window.ipcListen = ipcRenderer.on.bind(ipcRenderer);

window.isOsx = process.platform === 'darwin';
