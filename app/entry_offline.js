'use strict';

const electron = require('electron');
const app = electron.app;  // 어플리케이션 기반을 조작 하는 모듈.
const BrowserWindow = electron.BrowserWindow;  // 네이티브 브라우저 창을 만드는 모듈.
const path = require('path');
const Menu     = electron.Menu;


var handleStartupEvent = function() {
    if (process.platform !== 'win32') {
        return false;
    }

    var squirrelCommand = process.argv[1];
    switch (squirrelCommand) {
        case '--squirrel-install':
        case '--squirrel-updated':

          // Optionally do things such as:
          //
          // - Install desktop and start menu shortcuts
          // - Add your .exe to the PATH
          // - Write to the registry for things like file associations and
          //   explorer context menus

          // Always quit when done
          app.quit();

          return true;
        case '--squirrel-uninstall':
          // Undo anything you did in the --squirrel-install and
          // --squirrel-updated handlers

          // Always quit when done
          app.quit();

          return true;
        case '--squirrel-obsolete':
          // This is called on the outgoing version of your app before
          // we update to the new version - it's the opposite of
          // --squirrel-updated
          app.quit();
          return true;
    }
};

if (handleStartupEvent()) {
  return;
}

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
    var protocol = electron.protocol;

    mainWindow = new BrowserWindow({width: 1024, height: 700});
    // mainWindow.loadUrl('custom:///index.html');
    // console.log('file:///' + path.join(__dirname, 'entry_offline.html'))
    mainWindow.loadURL('file:///' + path.join(__dirname, 'entry_offline.html'));
    // mainWindow.loadURL('file:///entry_offline.html');

    if(option.debug) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});