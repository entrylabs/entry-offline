'use strict';
var isOsx = false;
var nowLocale = app.getLocale();
var options = {};
var _real_path = __dirname;
var _real_path_with_protocol = '';

if (process.platform != 'darwin') {
    isOsx = false;
} else {
    isOsx = true;
}

var _webContents = remote.getCurrentWebContents();
var startFile = _webContents.startFile;

if(startFile && path.isAbsolute(startFile)){
    options.path = startFile || undefined;
}

var orgAlert = alert;
alert = function (msg) {
    orgAlert(msg || '', Lang.Menus.Entry);
}
var orgConfirm = confirm;
confirm = function (msg) {
    return orgConfirm(msg || '', Lang.Menus.Entry);
}

// console.log = function () {};
console.fslog = function (text) {
    // var data = fs.readFileSync(_real_path + '/debug.log', 'utf8');
    // data += '\n\r' + new Date() + ' : ' + text;
    // fs.writeFileSync(_real_path + '/debug.log', data, 'utf8');
};
console.debug = function () {};
console.warn = function () {};
console.error = function () {};

// 16진수 little Endian 을 16진수 Big Endian으로 변환
function getLittleToBigEndian(hex_string) {
    var big_endian = '';
    for(var i = 0; i < hex_string.length; i+=2) {
        big_endian = hex_string.substr(i, 2) + big_endian;
    }
    return big_endian;
}

//wav의 헤더를 판단하여 duration을 구한다.
function calcDurationForWav(audioHex) {
    var header = audioHex.substr(44,28);
    var channel = parseInt(getLittleToBigEndian(header.substr(0, 4)), 16);
    var sample_rate = parseInt(getLittleToBigEndian(header.substr(4, 8)), 16);
    var bit_per_sample = parseInt(getLittleToBigEndian(header.substr(24, 4)), 16);

    return (audioHex.length * 4) / (channel * sample_rate * bit_per_sample);
}

//mp3의 헤더를 판단하여 duration을 구한다.
function calcDurationForMp3(audioHex) {
    var index = audioHex.indexOf('00fffb');
    if(index < 0) {
        index = audioHex.indexOf('00fff3');
    }
    var header = audioHex.substr(index + 2, 8)

    var mpeg1 = {
        '1' : 32,
        '2' : 40,
        '3' : 48,
        '4' : 56,
        '5' : 64,
        '6' : 80,
        '7' : 96 ,
        '8' : 112,
        '9' : 128,
        'a' : 160,
        'b' : 192,
        'c' : 224,
        'd' : 256,
        'e' : 320
    };
    var mpeg2 = {
        '1' : 8,
        '2' : 16,
        '3' : 24,
        '4' : 32,
        '5' : 40,
        '6' : 48,
        '7' : 56,
        '8' : 64,
        '9' : 80,
        'a' : 96,
        'b' : 112,
        'c' : 128,
        'd' : 144,
        'e' : 160
    };

    var type = header.substr(3,1);
    var bitrate_key = header.substr(4,1);
    var bitrate = 0;
    switch(type) {
        case '3':
            bitrate = mpeg2[bitrate_key];
        break;
        case 'b':
            bitrate = mpeg1[bitrate_key];
        break;
    }

    return (audioHex.length * 4) / (bitrate * 1000);
}

ipcRenderer.on('loadProject', function (e, projectPath) {
    Entry.dispatchEvent('loadProject', projectPath);
});

// plugin
Entry.plugin = (function () {
    var that = {};

    var TARGET_SIZE = 960;
    var THUMB_SIZE = 96;

    that.beforeStatus = '';

    var getUploadPath = function(fileId, option) {

        if(option === undefined) {
            option = 'image';
        }

        // prepare upload directory
        var baseDir = _real_path + '/temp';
        var uploadDir = path.join(baseDir, fileId.substr(0,2), fileId.substr(2,2));

        if (!fs.existsSync(path.join(baseDir, fileId.substr(0,2))))
            fs.mkdirSync(path.join(baseDir, fileId.substr(0,2)), '0777');

        if (!fs.existsSync(path.join(baseDir, fileId.substr(0,2), fileId.substr(2,2))))
            fs.mkdirSync(path.join(baseDir, fileId.substr(0,2), fileId.substr(2,2)), '0777'); // uploadDir

        if (!fs.existsSync(path.join(uploadDir, 'thumb')))
            fs.mkdirSync(path.join(uploadDir, 'thumb'), '0777');

        if (!fs.existsSync(path.join(uploadDir, 'image')))
            fs.mkdirSync(path.join(uploadDir, 'image'), '0777');

        //Path of upload folder where you want to upload fies/
        if(option === 'image') {
            var thumbPath = path.join(uploadDir, 'thumb', fileId); // thumbnail
            var imagePath = path.join(uploadDir, 'image', fileId); // main image
        } else if(option === 'sound') {
            if (!fs.existsSync(path.join(uploadDir, 'sound')))
                fs.mkdirSync(path.join(uploadDir, 'sound'), '0777');

            var soundPath = path.join(uploadDir, 'sound'); // for sound file
        }

        var baseUrl = path.join(fileId.substr(0,2), fileId.substr(2,2)); // uploads/xx/yy/[tmp/thumb/image]/[hashkey].png

        return {
            uploadDir: uploadDir,
            thumbPath: thumbPath,
            imagePath: imagePath,
            soundPath: soundPath,
            baseUrl: baseUrl
        }

    };

    var deleteFolderRecursive = function(local_path) {
        if( fs.existsSync(local_path) ) {
            fs.readdirSync(local_path).forEach(function(file,index){
                var curPath = path.resolve(local_path, file);
                if(fs.lstatSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(local_path);
        }
    };

    var createFileId = function() {
        var randomStr = (Math.random().toString(16)+"000000000").substr(2,8);
        return require('crypto').createHash('md5').update(randomStr).digest("hex");
    };

    that.reloadApplication = function () {
        // remote.getCurrentWindow().reload();
        ipcRenderer.send('reload');
        // location.reload();
    }

    that.findObject = function (object, key) {
        var r = [];
        Object.keys(object).forEach(function (item_key) {
            if($.isPlainObject(object[item_key])) {
                r = r.concat(that.findObject(object[item_key], key));
            } else {
                if(object[item_key].indexOf(key) >= 0) {
                    var a = {};
                    a[item_key] = object[item_key];
                    r.push(a);
                }
            }
        });
        return r;
    };


    that.setZoomInPage = function () {
        var zoomLevel = localStorage.getItem('window_zoomlevel') || 0;
        zoomLevel = (++zoomLevel > 5) ? 5 : zoomLevel;
        Entry.plugin.setZoomLevel(zoomLevel);
    };
    that.setZoomOutPage = function () {
        var zoomLevel = localStorage.getItem('window_zoomlevel') || 0;
        zoomLevel = (--zoomLevel < -2) ? -2 : zoomLevel;
        Entry.plugin.setZoomLevel(zoomLevel);
    };

    var view_menus;
    that.setZoomMenuState = function (state) {
        if(!view_menus) {
            if(isOsx) {
                view_menus = menu.items[3].submenu.items;
            } else {
                view_menus = menu.items[2].submenu.items;
            }
        }

        switch(state) {
            case 'default':
                view_menus[0].enabled = false;
                view_menus[1].enabled = true;
                view_menus[2].enabled = true;
            break;
            case 'min':
                view_menus[0].enabled = true;
                view_menus[1].enabled = true;
                view_menus[2].enabled = false;
            break;
            case 'max':
                view_menus[0].enabled = true;
                view_menus[1].enabled = false;
                view_menus[2].enabled = true;
            break;
            default:
                view_menus[0].enabled = true;
                view_menus[1].enabled = true;
                view_menus[2].enabled = true;
            break;
        }
    }

    that.setZoomLevel = function (level) {
        localStorage.setItem('window_zoomlevel', level);
        webFrame.setZoomLevel(+level);

        var state = '';
        switch (Number(level)) {
            case 0:
                state = 'default'
                break;
            case -2:
                state = 'min'
                break;
            case 5:
                state = 'max'
                break;
            default:

        }
        that.setZoomMenuState(state);
    }

    var hardwarePopup = null;
    that.openHardwarePage = function () {
        try{
            ipcRenderer.send('openHardware');
        } catch(e) {}
    }

    that.closeHardwarePage = function () {
        if(hardwarePopup) {
            hardwarePopup.close();
            hardwarePopup = null;
        }
    }

    var aboutPopup = null;
    that.openAboutPage = function () {
        if(aboutPopup) {
            return;
        }
        aboutPopup = new BrowserWindow({
            width: 300,
            height: 200,
            resizable: false,
            movable: false,
            center: true,
            frame: false,
            alwaysOnTop: true
        });

        aboutPopup.loadURL('file:///' + path.join(__dirname, 'views', 'about.html'));
        aboutPopup.on('closed', function() {
            aboutPopup = null;
        });
        aboutPopup.show();
    }

    that.closeAboutPage = function() {
        if(aboutPopup) {
            aboutPopup.close();
            aboutPopup = null;
        }
    }

    var hwGuidePopup = null;
    that.openHwGuidePopup = function () {
        if(hwGuidePopup) {
            return;
        }
        hwGuidePopup = new BrowserWindow({
            width: 1200,
            height: 800
        });
        hwGuidePopup.setMenu(null);
        hwGuidePopup.loadURL('file:///' + path.resolve(__dirname, 'hardware', 'guide', 'hwguide.html'));
        hwGuidePopup.on('closed', function(e) {
            try{
                hwGuidePopup = null;
            } catch(e){}
        });
    }

    that.closeHwGuidePage = function() {
        if(hwGuidePopup) {
            hwGuidePopup.close();
            hwGuidePopup = null;
        }
    }

    that.isOsx = function () {
        return isOsx;
    }

    that.init = function (cb) {
        // NanumBarunGothic 폰트 로딩 시간까지 기다린다.
        var font = new FontFace("nanumBarunRegular", "url(./fonts/NanumBarunGothic.woff2)");
        font.load();
        font.loaded.then(function() {
            var zoom_level = localStorage.getItem("window_zoomlevel") || 0;
            that.setZoomLevel(zoom_level);
            var isNotFirst = sessionStorage.getItem('isNotFirst');

            if(!isNotFirst) {
                var isTempRecovery = false;
                var isExistFolder;
                var tempProject = path.join(__dirname, 'temp');

                if( fs.existsSync(tempProject) ) {
                    isExistFolder = fs.readdirSync(tempProject).length > 0;
                }

                if(localStorage.hasOwnProperty('tempProject') && isExistFolder) {
                    isTempRecovery = confirm(Lang.Workspace.restore_project_msg);
                }

                if(!isTempRecovery) {
                    that.initProjectFolder(function() {
                        sessionStorage.setItem('isNotFirst', true);
                    });
                } else {
                    var jsonObj = JSON.parse(localStorage.getItem('tempProject'));
                    localStorage.setItem('nativeLoadProject', JSON.stringify(jsonObj));
                    if($.isFunction(cb)) {
                        cb();
                    }
                    return;
                }
            }

            if(options.path && !isNotFirst) {
                if(options.path !== '.') {
                    Entry.dispatchEvent('showLoadingPopup');
                    try{
                        var load_path = options.path;
                        var parser = path.parse(load_path);
                        localStorage.setItem('defaultPath', parser.dir);

                        that.loadProject(load_path, function (err, data) {
                            if(err) {
                                throw err;
                            }

                            var jsonObj = JSON.parse(data);
                            jsonObj.path = load_path;

                            jsonObj.objects.forEach(function (object) {
                                var sprite = object.sprite;
                                sprite.pictures.forEach(function (picture) {
                                    if(picture.fileurl) {
                                        picture.fileurl = picture.fileurl.replace(/\\/gi, '%5C');
                                        picture.fileurl = picture.fileurl.replace(/%5C/gi, '/');
                                        if(picture.fileurl && picture.fileurl.indexOf('bower_components') === -1) {
                                            picture.fileurl = picture.fileurl.substr(picture.fileurl.lastIndexOf('temp'));
                                        }
                                    }
                                });
                                sprite.sounds.forEach(function (sound) {
                                    if(sound.fileurl) {
                                        sound.fileurl = sound.fileurl.replace(/\\/gi, '%5C');
                                        sound.fileurl = sound.fileurl.replace(/%5C/gi, '/');
                                        if(sound.fileurl && sound.fileurl.indexOf('bower_components') === -1) {
                                            sound.fileurl = sound.fileurl.substr(sound.fileurl.lastIndexOf('temp'));
                                        }
                                    }
                                });
                            });

                            if (jsonObj.objects[0] &&
                                jsonObj.objects[0].script.substr(0,4) === "<xml") {
                                blockConverter.convert(jsonObj, function(result) {
                                    localStorage.setItem('nativeLoadProject', JSON.stringify(result));
                                    Entry.dispatchEvent('hideLoadingPopup');
                                    if($.isFunction(cb)) {
                                        cb();
                                    }
                                });
                            } else {
                                localStorage.setItem('nativeLoadProject', JSON.stringify(jsonObj));
                                Entry.dispatchEvent('hideLoadingPopup');
                                if($.isFunction(cb)) {
                                    cb();
                                }
                            }

                        });
                    } catch(e) {
                        Entry.dispatchEvent('hideLoadingPopup');
                    }
                } else {
                    if($.isFunction(cb)) {
                        cb();
                    }
                }
            } else {
                if($.isFunction(cb)) {
                    cb();
                }
            }
        });

    }

    // 프로젝트 저장
    that.saveProject = function(filePath, data, cb, enc) {
        blocklyConverter.convert(data, function (data) {
            var string_data = JSON.stringify(data);
            that.mkdir(_real_path + '/temp', function () {
                fs.writeFile(_real_path + '/temp/project.json', string_data, {encoding: (enc || 'utf8'), mode: '0777'}, function (err) {
                    if(err) {
                        throw err;
                    }

                    var fs_reader = fstream.Reader({ 'path': path.resolve(_real_path, 'temp'), 'type': 'Directory' });

                    var fs_writer = fstream.Writer({ 'path': filePath, 'mode': '0777', 'type': 'File',  });

                    fs_writer.on('entry', function (list) {
                        list.props.mode = '0777';
                        // console.log('entry');
                    });
                    fs_writer.on('error', function (e) {
                        if($.isFunction(cb)){
                            cb(e);
                        }
                    });
                    fs_writer.on('end', function () {

                        if($.isFunction(cb)){
                            cb();
                        }
                    });

                    fs_reader.pipe(tar.Pack())
                        .pipe(zlib.Gzip())
                        .pipe(fs_writer)

                });
            });
        });
    }

    that.loadTempProject = function(cb, enc) {
        fs.readFile(_real_path + '/temp/project.json', enc || 'utf8', function (err, data) {
            if(err) {
                throw err;
            }

            if($.isFunction(cb)) {
                cb(data);
            }
        });
    }

    // 프로젝트 불러오기
    that.loadProject = function(filePath, cb, enc) {
        deleteFolderRecursive(_real_path + '/temp/');

        var fs_reader = fstream.Reader({ 'path': filePath, 'type': 'File' });
        var fs_writer = fstream.Writer({ 'path': _real_path, 'mode': '0777', 'type': 'Directory' });

        fs_writer.on('entry', function (list) {
            list.props.mode = '0777';
        });
        fs_writer.on('error', function (e) {
            if($.isFunction(cb)) {
                cb(e);
            }
        });
        fs_writer.on('end', function () {
            fs.readFile(path.resolve(_real_path, 'temp', 'project.json'), enc || 'utf8', function (err, data) {
                if(err) {
                    cb(err);
                } else if($.isFunction(cb)) {
                    cb(null, data);
                }
            });
        });

        fs_reader.pipe(zlib.Gunzip())
            .pipe(tar.Parse())
            .pipe(fs_writer);
    }

    that.initProjectFolder = function (cb) {
        deleteFolderRecursive(_real_path + '/temp/');
        that.mkdir(_real_path + '/temp/', function () {
            if($.isFunction(cb)) {
                cb();
            };
        });
    };


    // 파일 저장
    that.writeFile = function(filePath, data, cb, enc) {
        fs.writeFile(filePath, data, {
            encoding: enc || 'utf8',
            mode: '0777'
        }, function (err) {
            if(err) {
                throw err;
            }

            if($.isFunction(cb)) {
                cb();
            }
        });
    }

    // 파일 열기
    that.readFile = function(filePath, cb, enc) {
        fs.readFile(filePath, enc || 'utf8', function (err, data) {
            if(err) {
                throw err;
            }

            if($.isFunction(cb)) {
                cb(data);
            }
        });
    }

    that.mkdir = function(filePath, cb) {
        var exists = fs.existsSync(filePath);
        if (!exists) {
            var parser = path.parse(filePath);
            that.mkdir(parser.dir);
            fs.mkdirSync(filePath, '0777');
        }
        if(typeof cb === 'function') {
            cb();
        }
    }

    that.exists = function (filePath, cb) {
        fs.exists(filePath, function (err, isExists) {
            if(err){
                throw err;
            } else if($.isFunction(cb)) {
                cb(isExists);
            }
        });
    }

    //임시 이미지 저장
    that.saveTempImageFile = function (data, cb) {
        var fileId = createFileId();
        var dest = getUploadPath(fileId);
        that.mkdir(dest.uploadDir + '/image', function () {
            fs.writeFile(dest.imagePath + '.png', data.org, { encoding: 'base64', mode: '0777' }, function (err) {
                that.mkdir(dest.uploadDir + '/thumb', function () {
                    fs.writeFile(dest.thumbPath + '.png', data.thumb, { encoding: 'base64', mode: '0777' }, function (err) {
                        if(err) {
                            throw err;
                        }

                        var dimensions = sizeOf(dest.imagePath + '.png');
                        var picture = {
                            type : 'user',
                            name : fileId,
                            filename : fileId,
                            fileurl : (dest.imagePath + '.png').replace(/\\/gi, '/'),
                            dimension : dimensions
                        }

                        if($.isFunction(cb)) {
                            cb(picture);
                        }
                    });
                });
            });
        });
    }

    that.getResizeImageFromBase64 = function (image, canvas, max_size) {
        var tempW = image.width;
        var tempH = image.height;
        if (tempW > tempH) {
            if (tempW > max_size) {
               tempH *= max_size / tempW;
               tempW = max_size;
            }
        } else {
            if (tempH > max_size) {
               tempW *= max_size / tempH;
               tempH = max_size;
            }
        }

        canvas.width = tempW;
        canvas.height = tempH;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, tempW, tempH);

        return canvas.toDataURL().split(',')[1];
    }

    that.uploadTempImageFile = function (images, cb) {
        var images_cnt = images.length;
        var run_cnt = 0;
        var pictures = [];
        images.forEach(function (url, index) {
            var fileId = createFileId();
            var dest = getUploadPath(fileId);
            var url_split = url.split(path.sep);
            var extension = '.png';// + url_split[url_split.length-1].split('.')[1];
            var file_name = url_split[url_split.length-1].split('.')[0].normalize('NFC');
            var imagePath = dest.imagePath + extension;
            var fs_reader = fs.createReadStream(url);
            var fs_writer = fs.createWriteStream(imagePath);

            that.mkdir(dest.uploadDir + '/image', function () {
                var orgImage = new Image();
                orgImage.src = url;
                orgImage.onload = function () {
                    var orgCanvas = document.createElement('canvas');
                    orgCanvas.width = orgImage.width;
                    orgCanvas.height = orgImage.height;
                    var orgData = that.getResizeImageFromBase64(orgImage, orgCanvas, 960);
                    fs_writer.write(orgData, 'base64');
                    fs_writer.end(function () {
                        orgCanvas = null;
                        orgImage = null;

                        var image = new Image();
                        image.src = imagePath;
                        image.onload = function () {
                            var canvas = document.createElement('canvas');
                            canvas.width = image.width;
                            canvas.height = image.height;
                            var ctx = canvas.getContext("2d");
                            ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
                            var thumb = that.getResizeImageFromBase64(image, canvas, THUMB_SIZE);

                            fs.writeFile(dest.thumbPath + extension, thumb, { encoding: 'base64' }, function (err) {
                                if(err) {
                                    throw err;
                                }

                                canvas = null;

                                var dimensions = sizeOf(imagePath);
                                var picture = {
                                    _id : Entry.generateHash(),
                                    type : 'user',
                                    name : file_name,
                                    filename : fileId,
                                    fileurl : encodeURI(imagePath),
                                    extension : extension,
                                    dimension : dimensions
                                }

                                pictures.push(picture);

                                if($.isFunction(cb) && ++run_cnt === images_cnt) {
                                    cb(pictures);
                                }
                            });
                        };
                    });
                };
            });

        });
    };

    //사운드 파일 로컬 업로드
    that.uploadTempSoundFile = function (files, cb) {
        var sounds_cnt = files.length;
        var run_cnt = 0;
        var soundList = [];
        // console.log("file list : " + JSON.stringify(files));
        for(var i = 0; i < files.length; i++) {
            (function (i) {
                var data = files[i];
                var src = data.path;
                var fileId = createFileId();
                var dest = getUploadPath(fileId, 'sound');
                var name = data.name.normalize("NFC");

                // console.log("name : " + name);
                var fileName = fileId;
                var extension = name.split('.')[1];
                var dirPath = dest.soundPath;
                var soundPath = dirPath + path.sep + fileName + "." + extension;

                // console.log("dest sound path : " + dest.soundPath);
                //var fs_reader = fs.createReadStream(url);
                //var fs_writer = fs.createWriteStream(soundPath);

                that.mkdir(dest.uploadDir + '/sound', function () {
                    // console.log("create!! dir ");
                    fs.readFile(src, function (err, stream) {
                        if(err) {
                            throw err;
                        }
                        // console.log("readFile!! sound ");
                        fs.writeFile(soundPath, stream, {encoding:'utf8', mode: '0777'}, function (err) {
                            if(err) {
                                throw err;
                            }
                            // console.log("writeFile!! sound ");

                            var audioStream = fs.createReadStream(soundPath);

                            var audioHex = '';
                            audioStream.on('data', function(buffer) {
                                audioHex += buffer.toString('hex');
                            });
                            audioStream.on('end', function() {
                                var duration = 0;
                                if(extension === 'mp3') {
                                    duration = calcDurationForMp3(audioHex);
                                } else {
                                    duration = calcDurationForWav(audioHex);
                                }

                                var sound = {
                                    _id : Entry.generateHash(),
                                    type : 'user',
                                    name : name.split('.')[0],
                                    filename : fileName,
                                    ext : extension,
                                    path : soundPath,
                                    fileurl : soundPath,
                                    duration : Math.ceil(duration * 10) / 10
                                }

                                soundList.push(sound);

                                if($.isFunction(cb) && ++run_cnt === sounds_cnt) {
                                    cb(soundList);
                                }
                            });
                        });
                    });
                });
            })(i);
        }
    }

    that.getRealPath = function (path, cb) {
        var cache = {};
        fs.realpath(path, function (err, resolvedPath) {
            if (err) throw err;
            // console.log(resolvedPath);
            if($.isFunction(cb)) {
                cb(resolvedPath);
            }
        });
    }

    that.testPath = function() {
        that.getRealPath('./');
    }

    return that;
})();
