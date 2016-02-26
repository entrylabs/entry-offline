'use strict';

const electron = require('electron');
const app = electron.app;  // 어플리케이션 기반을 조작 하는 모듈.
const BrowserWindow = electron.BrowserWindow;  // 네이티브 브라우저 창을 만드는 모듈.
const path = require('path');


var mainWindow = null;

app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function() {

    var protocol = electron.protocol;
    protocol.registerFileProtocol('file', function(request, callback) {
    var url = request.url.substr(7);  
        callback({path: path.normalize(__dirname + '/' + url)});
    }, function (error) {
      if (error)
        console.error('Failed to register protocol')
    });

    mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.loadURL('file:///entry_offline.html');

    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});