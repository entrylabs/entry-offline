import { ipcRenderer } from 'electron';

ipcRenderer.on('console', (event: Electron.IpcRendererEvent, ...args: any[]) => {
    console.log(...args);
});

type OptionalDimension = { x?: number; y?: number; width?: number; height?: number };

ipcRenderer.on('convertPng',
    (event: Electron.IpcRendererEvent, base64String: string, mimeType: string, dimension?: OptionalDimension) => {
        const canvas = document.createElement('canvas');
        const { x, y, width, height } = dimension || {};
        const imageElement = (width && height) ? new Image(width, height) : new Image();

        console.log('hello convertPng');
        imageElement.onload = function() {
            canvas.width = imageElement.width;
            canvas.height = imageElement.height;

            x && (canvas.width += x);
            y && (canvas.height += y);

            canvas.getContext('2d')!.drawImage(imageElement, x || 0, y || 0, canvas.width, canvas.height);

            console.log(canvas.width, canvas.height, imageElement.width, imageElement.height);

            const pngImage = canvas.toDataURL('image/png');
            event.sender.send('convertPng', pngImage);
            canvas.remove();
        };
        imageElement.src = `data:${mimeType};base64,${base64String}`;
    });

window.onPageLoaded = (callback) => {
    ipcRenderer.on('showWindow', () => {
        callback();
    });
};
