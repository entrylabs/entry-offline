'use strict';

const electron = require('electron');
const app = electron.app;  // 어플리케이션 기반을 조작 하는 모듈.
const BrowserWindow = electron.BrowserWindow;  // 네이티브 브라우저 창을 만드는 모듈.
const path = require('path');
const Menu     = electron.Menu;


var mainWindow = null;
var isClose = true;

app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// Parse command line options.
var argv = process.argv.slice(1);
var option = { file: null, help: null, version: null, webdriver: null, modules: [] };
for (var i = 0; i < argv.length; i++) {
  if (argv[i] == '--version' || argv[i] == '-v') {
    option.version = true;
    break;
  } else if (argv[i].match(/^--app=/)) {
    option.file = argv[i].split('=')[1];
    break;
  } else if (argv[i] == '--help' || argv[i] == '-h') {
    option.help = true;
    break;
  } else if (argv[i] == '--test-type=webdriver') {
    option.webdriver = true;
  } else if (argv[i] == '--debug' || argv[i] == '-d') {
    option.debug = true;
    continue;
  } else if (argv[i] == '--require' || argv[i] == '-r') {
    option.modules.push(argv[++i]);
    continue;
  } else if (argv[i][0] == '-') {
    continue;
  } else {
    option.file = argv[i];
    break;
  }
}

app.once('ready', function() {
    mainWindow = new BrowserWindow({width: 1024, height: 700});
    mainWindow.loadURL('file:///entry_offline.html');

    if(option.debug) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', function() {
        console.log('closed');
        mainWindow = null;
    });
});