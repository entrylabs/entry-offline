'use strict';

const electron = require('electron');
const ipcMain = electron.ipcMain;
const app = electron.app;  // 어플리케이션 기반을 조작 하는 모듈.
const BrowserWindow = electron.BrowserWindow;  // 네이티브 브라우저 창을 만드는 모듈.
const path = require('path');
const Menu     = electron.Menu;
const packageJson     = require('./package.json');
const ChildProcess = require('child_process');    

var language;

function spawn(command, args, callback) {
    var error, spawnedProcess, stdout;
    stdout = '';
    try {
        spawnedProcess = ChildProcess.spawn(command, args);
    } catch (_error) {
        error = _error;
        process.nextTick(function() {
            return typeof callback === "function" ? callback(error, stdout) : void 0;
        });
        return;
    }
    spawnedProcess.stdout.on('data', function(data) {
        return stdout += data;
    });
    error = null;
    spawnedProcess.on('error', function(processError) {
        return error != null ? error : error = processError;
    });
    return spawnedProcess.on('close', function(code, signal) {
        if (code !== 0) {
            if (error == null) {
                error = new Error("Command failed: " + (signal != null ? signal : code));
            }
        }
    if (error != null) {
        if (error.code == null) {
            error.code = code;
        }
    }
    if (error != null) {
        if (error.stdout == null) {
            error.stdout = stdout;
        }
    }
    return typeof callback === "function" ? callback(error, stdout) : void 0;
    });
};

var extensionPath = 'HKCU\\Software\\Classes\\.ent';
var entryPath = 'HKCU\\Software\\Classes\\Entry';
var defaultIconPath = 'HKCU\\Software\\Classes\\Entry\\DefaultIcon';
var entryShellPath = 'HKCU\\Software\\Classes\\Entry\\Shell\\Open';
var entryShellCommandPath = 'HKCU\\Software\\Classes\\Entry\\Shell\\Open\\Command';
var mimeTypePath = 'HKCU\\Software\\Classes\\MIME\\DataBase\\Content Type\\application/x-entryapp';
var system32Path, regPath, setxPath;

if (process.env.SystemRoot) {
    system32Path = path.join(process.env.SystemRoot, 'System32');
    regPath = path.join(system32Path, 'reg.exe');
    setxPath = path.join(system32Path, 'setx.exe');
} else {
    regPath = 'reg.exe';
    setxPath = 'setx.exe';
}

function spawnReg(args, callback) {
    return spawn(regPath, args, callback);
};

function addToRegistry(args, callback) {
    args.unshift('add');
    args.push('/f');
    return spawnReg(args, callback);
};

function deleteFromRegistry (keyPath, callback) {
    return spawnReg(['delete', keyPath, '/f'], callback);
};

function installRegistry(callback) {
    var args = [extensionPath, '/ve', '/d', 'Entry'];
    addToRegistry(args, function () {
        args = [extensionPath, '/v', 'Content Type', '/d', 'application/x-entryapp'];
        addToRegistry(args, function () {
            args = [defaultIconPath, '/ve', '/d', path.join(__dirname, 'icon', 'icon.ico')];
            addToRegistry(args, function () {
                args = [entryShellPath, '/ve', '/d', '&Open'];
                addToRegistry(args, function () {
                    args = [entryShellCommandPath, '/ve', '/d', '"' + path.join(__dirname, '..', '..', 'Entry.exe') + '" "%1"'];
                    addToRegistry(args, function () {
                        args = [mimeTypePath, '/v', 'Extestion', '/d', '.ent'];
                        addToRegistry(args, function () {
                            callback();
                        });
                    });
                });
            });
        });
    });
}

function unInstallRegistry(callback) {
    deleteFromRegistry(extensionPath, function () {
        deleteFromRegistry(entryPath, function () {
            deleteFromRegistry(mimeTypePath, function () {
                callback();
            });
        });
    });
}


var deleteRecursiveSync = function(target) {
    try{
        var exists = fs.existsSync(target);
        console.log(target);
        console.log(exists);
        if (exists) {
            if(fs.lstatSync(target).isDirectory()) { // recurse
                fs.readdirSync(target).forEach(function(file) {
                    var curPath = path.join(target, file);
                    deleteRecursiveSync(curPath);
                });
                fs.rmdirSync(target);
            } else { // delete file
                fs.unlinkSync(target);
            }           
        }
    } catch(e) {}
};

function run(args, done) {
    const updateExe = path.resolve(path.dirname(process.execPath), "..", "Update.exe")
    // log("Spawning `%s` with args `%s`", updateExe, args)
    spawn(updateExe, args, {
        detached: true
    }).on("close", done)
}

function createShortcut(locations, done) {
    var updateExe = path.resolve(path.dirname(process.execPath), "..", "Update.exe"); 
    var target = path.basename(process.execPath);
    var args = ['--createShortcut', target, '-l', locations];
    var child = ChildProcess.spawn(updateExe, args, { detached: true });
    child.on('close', function () {
        language = app.getLocale();
        if(language === 'ko') {
            var sourcePath = path.resolve(process.env.USERPROFILE, 'Desktop', 'Entry.lnk');
            var destPath = path.resolve(process.env.USERPROFILE, 'Desktop', '엔트리.lnk');
            fs.rename(sourcePath, destPath, function (err) {
                sourcePath = path.resolve(process.env.APPDATA, 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'EntryLabs', 'Entry.lnk');
                destPath = path.resolve(process.env.APPDATA, 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'EntryLabs', '엔트리.lnk');
                fs.rename(sourcePath, destPath, function (err) {
                    if(done) {
                        done();
                    }
                });
            });
        }
    });
}

function removeShortcut(locations, done) {
    var updateExe = path.resolve(path.dirname(process.execPath), "..", "Update.exe"); 
    var target = path.basename(process.execPath);
    var args = ['--removeShortcut', target, '-l', locations];
    var child = ChildProcess.spawn(updateExe, args, { detached: true });
    child.on('close', function () {
        var desktopEng = path.resolve(process.env.USERPROFILE, 'Desktop', 'Entry.lnk');
        var desktopKo = path.resolve(process.env.USERPROFILE, 'Desktop', '엔트리.lnk');
        var startMenuEng = path.resolve(process.env.APPDATA, 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'EntryLabs', 'Entry.lnk');
        var startMenuKo = path.resolve(process.env.APPDATA, 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'EntryLabs', '엔트리.lnk');
        deleteRecursiveSync(desktopEng);
        deleteRecursiveSync(desktopKo);
        deleteRecursiveSync(startMenuEng);
        deleteRecursiveSync(startMenuKo);

        if(done) {
            done();
        }
    });
}

var handleStartupEvent = function() {
    if (process.platform !== 'win32') {
        return false;
    }

    var defaultLocations = 'Desktop,StartMenu';
    const target = path.basename(process.execPath);
    var squirrelCommand = process.argv[1];
    switch (squirrelCommand) {
        case '--squirrel-install':
        case '--squirrel-updated':
            installRegistry(function () {
                createShortcut(defaultLocations, app.quit);
            });
          return true;
        case '--squirrel-uninstall':
            unInstallRegistry(function () {
                removeShortcut(defaultLocations, app.quit);
            });
            return true;
        case '--squirrel-obsolete':
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
    app.quit();
    // if (process.platform != 'darwin') {
    // }
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
    language = app.getLocale();
    var title = packageJson.version;
    
    if(language === 'ko') {
        title = '엔트리 v' + title;
    } else {
        title = 'Entry v' + title;
    }

    mainWindow = new BrowserWindow({
        width: 1024, 
        height: 700,
        title: title
    });

    mainWindow.setMenu(null);
    // mainWindow.loadUrl('custom:///index.html');
    // console.log('file:///' + path.join(__dirname, 'entry_offline.html'))
    mainWindow.loadURL('file:///' + path.join(__dirname, 'entry_offline.html'));
    // mainWindow.loadURL('file:///entry_offline.html');

    if(option.debug) {
        mainWindow.webContents.openDevTools();
    }
    mainWindow.on('page-title-updated', function(e) {
        e.preventDefault();
    });
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});

ipcMain.on('reload', function(event, arg) {
    mainWindow.reload(true);
});