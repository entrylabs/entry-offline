const lru = require('lru-cache')({ max: 256, maxAge: 250 });
const fs = require('fs');
var origLstat = fs.lstatSync.bind(fs);
fs.lstatSync = function(p) {
    let r = lru.get(p);
    if (r) return r;

    r = origLstat(p);
    lru.set(p, r);
    return r;
};
const fse = require('fs-extra');
const sizeOf = require('image-size');
const path = require('path');
const stream = require('stream');
const fstream = require('fstream');
const tar = require('tar');
const zlib = require('zlib');
const electron = require('electron');
const webFrame = electron.webFrame;
const ipcRenderer = electron.ipcRenderer;
const remote = electron.remote;
const dialog = remote.dialog;
const app = remote.app;
const Menu = remote.Menu;
const BrowserWindow = remote.BrowserWindow;
const mainWindow = BrowserWindow.getAllWindows()[0];
window.$ = window.jQuery = require('./bower_components/jquery/dist/jquery.min.js');
window.BigNumber = require('./bower_components/entryjs/extern/util/bignumber.min.js');
const entry = require('./bower_components/entryjs/src/workspace/block_entry.js');
const blockConverter = require('./src/block_converter.js');
const blocklyConverter = require('./src/blockly_converter.js');
const JSZip = require("jszip");
const isOffline = true;
const __rendererPath = path.resolve(__dirname);
const sharedObject = remote.getGlobal('sharedObject');
const mainWindowId = sharedObject.mainWindowId;
const _mainWindow = BrowserWindow.fromId(mainWindowId);
const archiver = require('archiver');

import parser from './bower_components/entryjs/extern/util/filbert.js';
const filbert = parser;

import util from './src/sources/util';
const Util = util;

document.fonts.ready.then(()=> {
    try{
        if(Entry) {
            Entry.requestUpdate = true;
        }
    } catch(e) {}
});
document.fonts.onloadingdone = (fontFaceSetEvent)=> {
    try{
        if(Entry) {
            Entry.requestUpdate = true;
        }
    } catch(e) {}
};

const isOsx = process.platform === 'darwin';

window.entrylms = {
    alert: function (text) {
        alert(text);
    },
    confirm: function (text) {
        var isConfirm = confirm(text);
        var defer = new $.Deferred;
        return defer.resolve(isConfirm);
        // 기본 Promise로 동작시키면 then이 비동기로 동작하여 타이밍 문제 발생
        // return new Promise((resolve, reject) => {
        //     resolve(isConfirm);
        // });
    },
}
