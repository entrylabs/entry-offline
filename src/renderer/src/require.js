const lru = require('lru-cache')({ max: 256, maxAge: 250 });
const fs = require('fs');
const _real_path = __dirname;
window._real_path = _real_path;
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
const { webFrame, ipcRenderer, remote, shell } = require('electron');
const { dialog, app, Menu, BrowserWindow } = remote;
const mainWindow = BrowserWindow.getAllWindows()[0];
window.$ = window.jQuery = require('./bower_components/jquery/dist/jquery.min.js');
window.BigNumber = require('./bower_components/entryjs/extern/util/bignumber.min.js');
// const entry = require('./bower_components/entryjs/src/workspace/block_entry.js');
const blockConverter = require('./src/block_converter.js');
const blocklyConverter = require('./src/blockly_converter.js');
const JSZip = require('jszip');
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

document.fonts.ready.then(() => {
    try {
        if (Entry) {
            Entry.requestUpdate = true;
        }
    } catch (e) {}
});
document.fonts.onloadingdone = (fontFaceSetEvent) => {
    try {
        if (Entry) {
            Entry.requestUpdate = true;
        }
    } catch (e) {}
};

const isOsx = process.platform === 'darwin';

window.entrylms = {
    alert: function(text) {
        alert(text);
    },
    confirm: function(text) {
        var isConfirm = confirm(text);
        var defer = new $.Deferred();
        return defer.resolve(isConfirm);
    },
};
