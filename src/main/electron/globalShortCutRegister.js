const { app, globalShortcut, webContents } = require('electron');

app.once('ready', () => {
    const inspectorShortcut = process.platform === 'darwin' ?
        'Command+Alt+i' : 'Control+Shift+i';

    globalShortcut.register(inspectorShortcut, (e) => {
        const content = webContents.getFocusedWebContents();
        if (content) {
            webContents.getFocusedWebContents()
                .openDevTools();
        }
    });
});

