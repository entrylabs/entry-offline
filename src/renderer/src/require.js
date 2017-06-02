const fs = require('fs');
const fse = require('fs-extra');
const sizeOf = require('image-size');
const path = require('path');
const Q = require('q');
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
const originalFs = require('original-fs');
window.$ = window.jQuery = require('./bower_components/jquery/dist/jquery.min.js');
const entry = require('./bower_components/entryjs/src/workspace/block_entry.js');
const blockConverter = require('./src/block_converter.js');
const blocklyConverter = require('./src/blockly_converter.js');
const JSZip = require("jszip");
const isOffline = true;
const __rendererPath = path.resolve(__dirname);
const mainWindowId = remote.getGlobal('sharedObject').mainWindowId;
const _mainWindow = BrowserWindow.fromId(mainWindowId);

import parser from './src/textmode/python/parser/filbert.js';
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