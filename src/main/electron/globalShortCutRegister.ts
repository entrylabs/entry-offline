import { app, globalShortcut, webContents } from 'electron';

app.once('ready', () => {
    const inspectorShortcut = process.platform === 'darwin' ?
        'Command+Alt+i' : 'Control+Shift+i';

    globalShortcut.register(inspectorShortcut, () => {
        webContents.getFocusedWebContents() &&
        webContents.getFocusedWebContents()
            .openDevTools();
    });
});

