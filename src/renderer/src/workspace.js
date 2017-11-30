'use strict';

angular.module('workspace').controller("WorkspaceController", ['$scope', '$rootScope', '$modal', '$http', '$timeout', 'myProject', function($scope, $rootScope, $modal, $http, $timeout, myProject) {
    $scope.saveFileName = '';
    $scope.project = myProject;
    window.isNowSaving = false;
    window.isNowLoading = false;
    $scope.myProject = myProject;
    $scope.spinnerTitle;
    $scope.failTitle;
    
    var isPracticalCourse;
    var beforeUnload;
    var supported = !(typeof storage == 'undefined' || typeof window.JSON == 'undefined');
    var storage = (typeof window.localStorage === 'undefined') ? undefined : window.localStorage;
    var TARGET_SIZE = 960;
    var THUMB_SIZE = 96;
    var defaultInitOption = {};
    var hwCategoryList = [];
    var lastHwName;
    
    //#region scope 영역
    $scope.initWorkspace = function() {
        window.lang = localStorage.getItem('lang');
        Entry.addEventListener('showLoadingPopup', $scope.showLoadingPopup);
        Entry.addEventListener('errorLoadingPopup', $scope.errorLoadingPopup);
        Entry.addEventListener('hideLoadingPopup', $scope.hideLoadingPopup);

        var playFunc = createjs.Sound.play;
        createjs.Sound.play = function(a, b) {
            if (b) b.pan = 0.01;
            else b = { pan: 0.01 };
            return playFunc(a, b);
        };

        if (!$scope.popupHelper) {
            $scope.popupHelper = new Entry.popupHelper(true);
        }
        addSpinnerPopup();
        addFailedPopup();
        addSelectModePopup();

        isPracticalCourse = localStorage.getItem('isPracticalCourse');
        if (isPracticalCourse === null) {
            isPracticalCourse = false;
            $scope.doPopupControl({
                type: 'mode'
            });
            return;
        } else if (isPracticalCourse === 'true') {
            isPracticalCourse = true;
            addPracticalNoticePopup();
            $('html').addClass('practical_course_mode');
            myProject.setMode('practical_course');
            settingForMini();
        } else {
            isPracticalCourse = false;
            $('html').addClass('default_mode');
            myProject.setMode('default');
        }

        // 기본 초기화를 수행수 동작한다.
        Entry.plugin.init(function(isPracticalCourseMode) {
            sharedObject.isInitEntry = true;
            if (isPracticalCourseMode === true) {
                isPracticalCourse = true;
                addPracticalNoticePopup();                
                myProject.setMode('practical_course');
                settingForMini();
            } else if (isPracticalCourseMode === false) {
                isPracticalCourse = false;
                myProject.setMode('default');
                settingForDefault();
            }

            myProject.isSavedPath = storage.getItem('defaultPath') || '';
            var workspace = document.getElementById("workspace");
            var initOptions = {
                type: 'workspace',
                libDir: './bower_components',
                defaultDir: './node_modules',
                blockInjectDir: './',
                textCodingEnable: !isPracticalCourse,
                fonts: [{
                    name: Lang.Fonts.batang,
                    family: 'KoPub Batang',
                }, {
                    name: Lang.Fonts.myeongjo,
                    family: 'Nanum Myeongjo',
                }, {
                    name: Lang.Fonts.gothic,
                    family: 'Nanum Gothic',
                }, {
                    name: Lang.Fonts.pen_script,
                    family: 'Nanum Pen Script',
                }, {
                    name: Lang.Fonts.jeju_hallasan,
                    family: 'Jeju Hallasan',
                }, {
                    name: Lang.Fonts.gothic_coding,
                    family: 'Nanum Gothic Coding',
                }]
            };

            initOptions = Object.assign(initOptions, defaultInitOption);
            Entry.init(workspace, initOptions);

            Entry.playground.downloadPicture = function (pictureId) {
                const picture = Entry.playground.object.getPicture(pictureId);
                let fileurl;

                if(picture.fileurl) {
                    fileurl = picture.fileurl;
                } else {
                    let url = picture.filename;
                    fileurl = path.resolve(__rendererPath, 'node_modules', 'uploads', url.substr(0, 2), url.substr(2, 2), 'image', `${url}.png`);
                }

                const pictureInfo = path.parse(fileurl);

                Util.saveFileDialog(fileurl, `${picture.name}${pictureInfo.ext}`, 'image/png', (err)=> {
                    if(err) {
                        console.log(err);
                    }
                })
            }

            Entry.playground.downloadSound = function (soundId) {
                var sound = Entry.playground.object.getSound(soundId);
                let fileurl;
                let ext = sound.ext || '.mp3';

                if (sound.fileurl) {
                    fileurl = sound.fileurl;
                } else {
                    let url = sound.filename;
                    fileurl = path.resolve(__rendererPath, 'node_modules', 'uploads', url.substr(0, 2), url.substr(2, 2), 'sound', `${url}${ext}`);
                }
                const soundInfo = path.parse(fileurl);

                Util.saveFileDialog(fileurl, `${sound.name}${soundInfo.ext}`, 'audio/mpeg3', (err)=> {
                    if(err) {
                        console.log(err);
                    }
                })
            }

            Entry.playground.board._contextOptions[3].option.callback = function() {
                Util.showOpenDialog({
                    properties: [
                        'openDirectory'
                    ],
                    filters: [
                        { name: 'Image', extensions: ['png'] }
                    ]
                }, function(paths) {
                    Entry.playground.board.code.getThreads().forEach(function(t, index) {
                        var topBlock = t.getFirstBlock();
                        if (!topBlock) return;
                        (function(i) {
                            topBlock.view.getDataUrl().then(function(data) {
                                var savePath = path.resolve(paths[0], i + '.png');
                                Entry.plugin.saveImage(data.src, savePath);
                            });
                        })(++index);
                    })
                })
            }


            ipcRenderer.on('mainClose', function () {
                if(!unloadCheckFunc()) {
                    return;
                }
                window.onbeforeunload = null;
                ipcRenderer.send('forceClose', true);
            });

            beforeUnload = window.onbeforeunload;

            // 아두이노 사용 (웹소켓이용)
            Entry.enableArduino();

            var project = storage.getItem('nativeLoadProject');
            var localStorageProject = storage.getItem('localStorageProject');
            if (localStorageProject) {
                project = localStorageProject;
                myProject.isModeChange = true;
            }

            if (project) {
                project = JSON.parse(project);
                storage.removeItem('nativeLoadProject');
                storage.removeItem('localStorageProject');
            }

            $scope.setWorkspace(project);

            // save 시 자동 stamp 기능 제거
            Entry.removeAllEventListener('saveWorkspace');
            Entry.addEventListener('hwChanged', $scope.hwChanged);
            Entry.addEventListener('saveWorkspace', $scope.saveWorkspace);
            Entry.addEventListener('saveAsWorkspace', $scope.saveAsWorkspace);
            Entry.addEventListener('loadWorkspace', $scope.loadWorkspace);
            Entry.addEventListener('loadProject', $scope.loadProject);
            Entry.addEventListener('openSpriteManager', $scope.openSpriteManager);
            Entry.addEventListener('openPictureManager', $scope.openPictureManager);
            Entry.addEventListener('openSoundManager', $scope.openSoundManager);
            Entry.addEventListener('changeVariableName', $scope.changeVariableName);
            Entry.addEventListener('deleteMessage', $scope.deleteMessage);
            Entry.addEventListener('saveCanvasImage', $scope.saveCanvasData);
            Entry.addEventListener('openPictureImport', $scope.openPictureImport);
            Entry.addEventListener('saveLocalStorageProject', saveLocalStorageProject);
            Entry.addEventListener('saveBlockImages', saveBlockImages);
            Entry.addEventListener('removeObject', removeObject);
            Entry.addEventListener('removePicture', removePicture);
            Entry.addEventListener('removeSound', removeSound);
            // if (!Entry.creationChangedEvent)
            //     Entry.creationChangedEvent = new Entry.Event(window);
            // Entry.creationChangedEvent.attach(this, saveLocalStorageProject);
            $scope.setOfflineHW();

            Entry.getMainWS().changeEvent.attach(this, ()=> {
                $timeout(()=> {
                    $scope.$apply(() => {
                        myProject.programmingMode = Number(Entry.getMainWS().mode);
                    });
                }, 0);
            });

            var $body = $('body');
            var $uploadWindow = $('.entryUploaderWindow');
            var actionDisplayNone;

            $body.on('dragover', function(e) {
                var dataTransfer = e.originalEvent.dataTransfer || { types: [] };
                
                var isFile = dataTransfer.types.indexOf('Files') >= 0;
                if(!isFile) {
                    return false;
                }
                $uploadWindow.css('opacity', 1);
                if (actionDisplayNone) {
                    clearTimeout(actionDisplayNone);
                    $uploadWindow.css('display', 'block');
                }
                return false;
            });
            
            $body.on('dragleave dragend', function(e) {
                $uploadWindow.css('opacity', 0);
                actionDisplayNone = setTimeout(function() {
                    $uploadWindow.css('display', 'none');
                }, 200);
                return false;
            });
            $body.on('drop', function(e) {
                $uploadWindow.css('opacity', 0);
                var file = e.originalEvent.dataTransfer.files[0];
                setTimeout(function() {
                    $uploadWindow.css('display', 'none');
                }, 200);
                e.preventDefault();
                if (!file) {
                    return false;
                }
                
                var fileInfo = path.parse(file.path);
                try {
                    if (fileInfo.ext === '.ent') {
                        if(!unloadCheckFunc()) {
                            return false;
                        }
                        $scope.doPopupControl({
                            'type': 'spinner',
                            'msg': Lang.Workspace.loading_msg
                        });
                        var filePath = file.path;
                        var parser = path.parse(filePath);
                        storage.setItem('defaultPath', parser.dir);
                        $scope.loadProject(filePath, true);
                    } else {
                        alert(Lang.Workspace.not_supported_file_msg);
                    }
                } catch (e) {
                    // alert(Lang.Workspace.broken_file_msg);
                    $scope.doPopupControl({
                        'type': 'hide'
                    });
                    $scope.doPopupControl({
                        'type': 'fail',
                        'msg': Lang.Workspace.loading_fail_msg
                    });
                }

                return false;
            });

            checkShowPracticalNoticePopup();
        });
    }

    $scope.setOfflineHW = function() {
        Entry.HW.prototype.downloadConnector = function() {
            remote.getGlobal('sharedObject').roomId = [ localStorage.getItem('entryhwRoomId') ];
            Entry.plugin.openHardwarePage();
            Entry.hw.initSocket();
        };

        Entry.HW.prototype.openHardwareProgram = function() {
            remote.getGlobal('sharedObject').roomId = [ localStorage.getItem('entryhwRoomId') ];
            Entry.plugin.openHardwarePage();
            Entry.hw.initSocket();
        };

        Entry.HW.prototype.downloadGuide = function() {
            Entry.plugin.getHardwareManual();
        };

        Entry.HW.prototype.downloadSource = function() {
            Util.showSaveDialog({
                defaultPath: 'board.ino',
                filters: [
                    { name: 'Arduino(*.ino)', extensions: ['ino'] }
                ]
            }, function(filePath) {
                if (filePath) {
                    var fs = require("fs");
                    fs.readFile(path.resolve(__dirname, 'static', 'source', 'board.ino'), function(err, stream) {
                        fs.writeFile(filePath, stream, 'utf8', function(err) {
                            if (err) {
                                alert("Unable to save file");
                            } else {
                                console.log("File Saved");
                            }

                            $("#saveArduinoCode").val('');
                        });
                    });
                } else {}
            });
        };
        $('#entryCategoryarduino').mouseup(function() {

            var user_lang = localStorage.getItem('lang');

            if (user_lang === 'ko') {
                Lang.Blocks.ARDUINO_download_connector = "하드웨어 플러그인 열기";
                Lang.Blocks.ARDUINO_download_source = "아두이노 소스코드 받기";
                Lang.Blocks.ARDUINO_reconnect = "하드웨어에 연결하기";
            } else {
                Lang.Blocks.ARDUINO_download_connector = "Open Hardware Plugin";
                Lang.Blocks.ARDUINO_download_source = "Get Arduino Code";
                Lang.Blocks.ARDUINO_reconnect = "Connect To Hardware";
            }

        });
    }

    $scope.doPopupControl = function(obj) {
        try{
            if (obj.type === 'spinner') {
                $scope.spinnerTitle.text(obj.msg);
                $scope.popupHelper.show('workspaceSpinner');
            } else if (obj.type === 'fail') {
                $scope.failTitle.html(obj.msg);
                $scope.popupHelper.show('workspaceFailed');
            } else if (obj.type === 'hide') {
                $scope.popupHelper.hide();
            } else if (obj.type === 'mode') {
                $scope.popupHelper.show('workspaceModeSelect');
            } 
        } catch(e) {}
    }

    $scope.showLoadingPopup = function() {
        $scope.doPopupControl({
            'type': 'spinner',
            'msg': Lang.Workspace.loading_msg
        });
    }

    $scope.hideLoadingPopup = function() {
        $scope.doPopupControl({
            'type': 'hide'
        });
    }

    $scope.errorLoadingPopup = function() {
        $scope.doPopupControl({
            'type': 'hide'
        });
        $scope.doPopupControl({
            'type': 'fail',
            'msg': Lang.Workspace.loading_fail_msg
        });
        window.isNowLoading = false;
    }

    // 프로젝트 세팅
    $scope.setWorkspace = function (project, b) {
        var project_name = "";

        if (!project) {
            project = Entry.getStartProject(Entry.mediaFilePath);
            project.objects[0] = getTranslatedObject(project.objects[0]);
            project.scenes[0] = getTranslatedScene(project.scenes[0]);
            var i = Math.floor(Math.random() * Lang.Workspace.PROJECTDEFAULTNAME.length);
            project_name = Lang.Workspace.PROJECTDEFAULTNAME[i] + ' ' + Lang.Workspace.project;
            sessionStorage.setItem('isDefaultProject', true);
        } else {
            project_name = project.name;
            if (project.path) {
                var parser = path.parse(project.path);
                if(parser.ext) {
                    myProject.isModeChange = false;
                    myProject.isSaved = true;
                    myProject.isSavedPath = project.path;
                }
            }
            sessionStorage.setItem('isDefaultProject', false);
            $scope.project.parent = project.parent;
        }

        Entry.loadProject(project);
        $scope.project.name = project_name || Lang.Workspace.new_project;
        myProject.name = project_name || Lang.Workspace.new_project;
        angular.element('#project_name').trigger('blur');

        // 자동 저장 기능
        myProject.runAutoSaveScheduler();
    }

    // 저장하기
    $scope.saveWorkspace = function () {
        if (checkTextModeCode()) {
            return;
        }
        if (getWorkspaceBusy()) {
            return;
        }
        window.isNowSaving = true;
        $scope.doPopupControl({
            'type': 'spinner',
            'msg': Lang.Workspace.saving_msg
        });
        const parseDir = path.parse(myProject.isSavedPath);
        if (myProject.isSaved && parseDir.ext === ".ent") {
            $scope.project.saveProject(myProject.isSavedPath, function () {
                Entry.stateManager.addStamp();
                Entry.toast.success(Lang.Workspace.saved, myProject.name + ' ' + Lang.Workspace.saved_msg);
                $scope.doPopupControl({
                    'type': 'hide'
                });
                window.isNowSaving = false;
            });
        } else {
            // Entry.stateManager.cancelLastCommand();
            saveAsProject(Lang.Workspace.file_save);
        }
    }

    // 새 이름으로 저장하기
    $scope.saveAsWorkspace = function () {
        if (checkTextModeCode()) {
            return;
        }
        if (getWorkspaceBusy()) {
            return;
        }
        window.isNowSaving = true;
        $scope.doPopupControl({
            'type': 'spinner',
            'msg': Lang.Workspace.saving_msg
        });
        var default_path = storage.getItem('defaultPath') || '';
        saveAsProject(Lang.Workspace.file_save);
    }

    $scope.loadProject = function (filePath, isUnloadCheck) {
        if (!isUnloadCheck && !unloadCheckFunc()) {
            return;
        }
        if (getWorkspaceBusy()) {
            return;
        }
        window.isNowLoading = true;
        $scope.doPopupControl({
            'type': 'spinner',
            'msg': Lang.Workspace.loading_msg
        });
        try {
            Entry.plugin.loadProject(filePath, function (e, data) {
                if (e) {
                    $scope.doPopupControl({
                        'type': 'hide'
                    });
                    $scope.doPopupControl({
                        'type': 'fail',
                        'msg': Lang.Workspace.loading_fail_msg
                    });
                    window.isNowLoading = false;
                } else {
                    var jsonObj = JSON.parse(data);
                    jsonObj.path = filePath;

                    jsonObj.objects.forEach(function (object) {
                        var sprite = object.sprite;
                        sprite.pictures.forEach(function (picture) {
                            if (picture.fileurl) {
                                picture.fileurl = picture.fileurl.replace(/\\/gi, '%5C');
                                picture.fileurl = picture.fileurl.replace(/%5C/gi, '/');
                                const tempIndex = picture.fileurl.lastIndexOf('temp');
                                let tempPath = picture.fileurl;

                                if (tempIndex > -1) {
                                    if (tempIndex > 0) {
                                        tempPath = picture.fileurl.substr(tempIndex - 1);
                                    }
                                    picture.fileurl = path.posix.join(_real_temp_path_posix, tempPath);
                                }
                            }
                        });
                        sprite.sounds.forEach(function (sound) {
                            if (sound.fileurl) {
                                sound.fileurl = sound.fileurl.replace(/\\/gi, '%5C');
                                sound.fileurl = sound.fileurl.replace(/%5C/gi, '/');
                                const tempIndex = sound.fileurl.lastIndexOf('temp');
                                let tempPath = sound.fileurl;

                                if (tempIndex > -1) {
                                    if (tempIndex > 0) {
                                        tempPath = sound.fileurl.substr(tempIndex - 1);
                                    }
                                    sound.fileurl = path.posix.join(_real_temp_path_posix, tempPath);
                                }
                            }
                        });
                    });

                    localStorage.setItem('isPracticalCourse', jsonObj.isPracticalCourse);
                    if (jsonObj.objects[0] &&
                        jsonObj.objects[0].script.substr(0, 4) === "<xml") {
                        blockConverter.convert(jsonObj, function (result) {
                            storage.setItem('nativeLoadProject', JSON.stringify(result));
                            Entry.plugin.reloadApplication();
                        });
                    } else {
                        storage.setItem('nativeLoadProject', JSON.stringify(jsonObj));
                        Entry.plugin.reloadApplication();
                    }
                }
            });
        } catch (e) {
            $scope.doPopupControl({
                'type': 'hide'
            });
            $scope.doPopupControl({
                'type': 'fail',
                'msg': Lang.Workspace.loading_fail_msg
            });
            window.isNowLoading = false;
        }

    }

    // 불러오기
    $scope.loadWorkspace = function () {
        if (!unloadCheckFunc()) {
            return;
        }
        $scope.doPopupControl({
            'type': 'spinner',
            'msg': Lang.Workspace.loading_msg
        });
        storage.removeItem('tempProject');
        Entry.plugin.beforeStatus = 'load';
        var default_path = storage.getItem('defaultPath') || '';
        Util.showOpenDialog({
            defaultPath: default_path,
            properties: [
                'openFile'
            ],
            filters: [
                { name: 'Entry File', extensions: ['ent'] }
            ]
        }, function (paths) {
            if (Array.isArray(paths)) {
                var filePath = paths[0];
                var pathInfo = path.parse(filePath);

                if (pathInfo.ext === '.ent') {
                    var parser = path.parse(filePath);
                    storage.setItem('defaultPath', parser.dir);
                    $scope.loadProject(filePath, true);
                } else {
                    alert(Lang.Workspace.check_entry_file_msg);
                    $scope.doPopupControl({
                        'type': 'hide'
                    });
                }
            } else {
                $scope.doPopupControl({
                    'type': 'hide'
                });
            }
        });
    }

    // 스프라이트 매니저 오픈.
    $scope.openSpriteManager = function () {
        // console.log('openSpriteManager');
        if (!Entry.engine.isState('stop')) {
            alert(Lang.Workspace.cannot_add_object);
            return false;
        }

        var modalInstance = $modal.open({
            templateUrl: './views/modal/sprite.html',
            controller: 'SpriteController',
            backdrop: false,
            keyboard: false,
            resolve: {
                parent: function () {
                    return "workspace";
                }
            }
        });

        modalInstance.result.then(function (selectedItems) {
            if (selectedItems.target === 'newSprite') {
                var object = {
                    id: Entry.generateHash(),
                    objectType: 'sprite'
                };
                object.sprite = {};
                object.sprite.name = Lang.Workspace.new_object + (Entry.container.getAllObjects().length + 1);
                object.sprite.pictures = [];
                object.sprite.pictures.push({
                    dimension: {
                        height: 540,
                        width: 960
                    },
                    filename: "_1x1",
                    name: Lang.Workspace.new_picture,
                    type: "_system_"
                });
                object.sprite.sounds = [];
                object.sprite.category = {};
                object.sprite.category.main = 'new';

                object = Entry.container.addObject(object, 0);
                Entry.playground.changeViewMode('picture');
            } else if (selectedItems.target === 'sprite') {
                const promiseList = [];

                selectedItems.data.forEach(function (items) {
                    const { pictures = [] } = items;
                    const images = pictures.map((item) => {
                        const fileurl = item.filename;
                        const url = path.resolve(__rendererPath, 'node_modules', 'uploads', fileurl.substr(0, 2), fileurl.substr(2, 2), 'image', `${fileurl}.png`);

                        return {
                            url,
                            filename: item.name,
                        };
                    });

                    const spritePromise = new Promise((resolve, reject) => {
                        try {
                            Entry.plugin.uploadTempImageFileByObject(images, resolve);
                        } catch (e) {
                            reject(e);
                        }
                    });

                    const mainPromise = new Promise((resolve, reject) => {
                        spritePromise.then((pictures) => {
                            items.pictures = pictures;
                            resolve(pictures);
                        }).catch((err) => {
                            console.error(err);
                            reject(err);
                        })
                    });
                    promiseList.push(mainPromise);
                });

                Promise.all(promiseList).then(() => {
                    selectedItems.data.forEach((items) => {
                        var object = {
                            id: Entry.generateHash(),
                            objectType: 'sprite',
                            sprite: items // 스프라이트 정보
                        };
                        Entry.container.addObject(object, 0);
                    });
                });
            } else if (selectedItems.target === 'upload') {
                selectedItems.data.forEach(function (item, index, array) {
                    if (!item.id) {
                        item.id = Entry.generateHash();
                    }
                    var object = {
                        id: Entry.generateHash(),
                        objectType: 'sprite',
                        sprite: {
                            name: item.name,
                            pictures: [item],
                            sounds: [],
                            category: {}
                        }
                    };
                    Entry.container.addObject(object, 0);
                });
            } else if (selectedItems.target == 'textBox') {
                var text = selectedItems.data ? selectedItems.data : Lang.Blocks.TEXT;
                var options = selectedItems.options;
                var object = {
                    id: Entry.generateHash(),
                    name: Lang.Workspace.textbox,
                    text: text,
                    options: options,
                    objectType: 'textBox',
                    sprite: { sounds: [], pictures: [] }
                };
                Entry.container.addObject(object, 0);
            } else {
                console.log('no sprite found');
            }
        });
    }

    $scope.openPictureManager = function () {
        if (!Entry.engine.isState('stop')) {
            alert(Lang.Workspace.cannot_add_picture);
            return false;
        }

        var modalInstance = $modal.open({
            templateUrl: './views/modal/picture.html',
            controller: 'PictureController',
            backdrop: false,
            keyboard: false,
            resolve: {
                parent: function () {
                    return "workspace";
                }
            }
        });

        modalInstance.result.then(function (selectedItems) {
            if (selectedItems.target === 'new') {
                selectedItems.data = [];
                selectedItems.data.push({
                    fileurl: './bower_components/entryjs/images/_1x1.png',
                    dimension: {
                        height: 540,
                        width: 960
                    },
                    filename: "_1x1",
                    name: Lang.Workspace.new_picture,
                });
            }

            if (selectedItems.data.length && !selectedItems.data[0].fileurl) {
                const images = selectedItems.data.map((item) => {
                    const fileurl = item.filename;
                    const url = path.resolve(__rendererPath, 'node_modules', 'uploads', fileurl.substr(0, 2), fileurl.substr(2, 2), 'image', `${fileurl}.png`);

                    return {
                        url,
                        filename: item.name,
                    };
                });

                Entry.plugin.uploadTempImageFileByObject(images, (data) => {
                    data.forEach((item) => {
                        Entry.playground.addPicture(item, true);
                    });
                });
            } else {
                selectedItems.data.forEach(function (item) {
                    item.id = Entry.generateHash();
                    Entry.playground.addPicture(item, true);
                });
            }
        });
    }

    //Adding Sound
    $scope.openSoundManager = function () {
        //console.log('openSoundManager');

        if (!Entry.engine.isState('stop')) {
            alert(Lang.Workspace.cannot_add_object);
            return false;
        }

        var modalInstance = $modal.open({
            templateUrl: './views/modal/sound.html',
            controller: 'SoundController',
            backdrop: false,
            keyboard: false,
            resolve: {
                parent: function () {
                    return "workspace";
                }
            }
        });

        modalInstance.result.then(function (selectedItems) {
            if (selectedItems.data.length && !selectedItems.data[0].fileurl) {
                const sounds = selectedItems.data.map((item) => {
                    const fileurl = item.filename;
                    const url = path.resolve(__rendererPath, 'node_modules', 'uploads', fileurl.substr(0, 2), fileurl.substr(2, 2), `${fileurl}.mp3`);

                    return {
                        url,
                        filename: item.name,
                    };
                });

                Entry.plugin.uploadTempSoundFileByObject(sounds, (data) => {
                    data.forEach((item) => {
                        Entry.playground.addSound(item, true);
                    });
                });
            } else {
                selectedItems.data.forEach(function (item) {
                    Entry.playground.addSound(item, true);
                });
            }
        });
    }

    $scope.changeVariableName = function () {
        // console.log('changeVariableName');
    }

    $scope.deleteMessage = function () {
        // console.log('deleteMessage');
    }

    $scope.showSpinner = function () {
        $('.entrySpinnerWindow').css('display', 'flex');
    }

    $scope.hideSpinner = function () {
        $('.entrySpinnerWindow').css('display', 'none');
    }

    $scope.saveCanvasData = function (data) {
        var file = data.file;

        cropImageFromCanvas(data.image).then(function (trim_image_data) {
            var tempImg = new Image();
            tempImg.src = trim_image_data;
            tempImg.onload = function () {
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext("2d");
                ctx.drawImage(this, 0, 0, canvas.width, canvas.height);

                // 이미지 TRIM
                var image_data_url = {};
                //일반 이미지
                image_data_url.org = Entry.plugin.getResizeImageFromBase64(tempImg, canvas, TARGET_SIZE);
                //섬네일 이미지
                image_data_url.thumb = Entry.plugin.getResizeImageFromBase64(tempImg, canvas, THUMB_SIZE);

                Entry.plugin.saveTempImageFile(image_data_url, function (picture) {
                    if (file.mode === 'new') {
                        picture.name = Lang.Workspace.new_picture;
                        Entry.playground.addPicture(picture, true);
                    } else {
                        picture.id = file.id;
                        picture.name = file.name;
                        Entry.playground.setPicture(picture);
                    }

                    var image = new Image();
                    image.src = picture.fileurl;
                    image.onload = function (e) {
                        Entry.container.cachePicture(picture.id + Entry.playground.object.entity.id, image);

                        if (Entry.playground.painter.file.id === picture.id) {
                            Entry.playground.selectPicture(picture);
                        }
                    };
                });
            };
        });
    }

    $scope.openPictureImport = function () {
        var modalInstance = $modal.open({
            templateUrl: './views/modal/picture_import.html',
            controller: 'PictureImportController',
            backdrop: false,
            keyboard: false,
            resolve: {
                parent: function () {
                    return "workspace";
                }
            }
        });

        modalInstance.result.then(function (selectedItems) {
            selectedItems.data.forEach(function (item) {
                item.id = Entry.generateHash();
                if (item.fileurl) {
                    item.fileurl = item.fileurl.replace(/%5C/gi, '/');
                }
                Entry.dispatchEvent('pictureImport', item);
            });
        });
    }

    $scope.hwChanged = function () {
        if ((Entry.hw.connected && Entry.hw.hwModule && lastHwName === Entry.hw.hwModule.name  && EntryStatic.isPracticalCourse) || !EntryStatic.isPracticalCourse) {
            return;
        }
        if (Entry.hw.connected && Entry.hw.hwModule) {
            if (EntryStatic.hwMiniSupportList.indexOf(Entry.hw.hwModule.name) > -1) {
                hwCategoryList.forEach(function (categoryName) {
                    Entry.playground.blockMenu.unbanCategory(categoryName);
                });
                Entry.playground.blockMenu.banCategory('arduino');
                Entry.playground.blockMenu.banCategory('hw_robot');
            } else {
                hwCategoryList.forEach(function (categoryName) {
                    Entry.playground.blockMenu.banCategory(categoryName);
                });
                Entry.playground.blockMenu.banCategory('hw_robot');
                Entry.playground.blockMenu.unbanCategory('arduino');
            }
            lastHwName = Entry.hw.hwModule.name;
        } else {
            hwCategoryList.forEach(function (categoryName) {
                Entry.playground.blockMenu.banCategory(categoryName);
            });
            Entry.playground.blockMenu.banCategory('arduino');
            Entry.playground.blockMenu.unbanCategory('hw_robot');
            lastHwName = undefined;
        }
    }

    //#endregion

    //#region 함수 영역
    function checkShowPracticalNoticePopup() {
        if (isPracticalCourse === true) {
            var practicalCourseNotice = localStorage.getItem('practicalCourseNotice');
            if (practicalCourseNotice === null) {
                showPracticalNoticePopup();
                localStorage.setItem('practicalCourseNotice', 'show');
            }
        }
    }

    function showPracticalNoticePopup() {
        $scope.practicalTooltip = new Entry.Tooltip([
            { content: Lang.Workspace.practical_course_tooltip, target: $(".modeLabel"), direction: "down" }
        ], { dimmed: false, indicator: true });
        setTimeout(function () {
            $scope.practicalTooltip.alignTooltips();
        }, 800);
        $scope.popupHelper.show('practicalCourseNotice');
    }

    function settingForMini() {
        defaultInitOption = EntryStatic.initOptions;
        hwCategoryList = EntryStatic.hwCategoryList;
    }

    function settingForDefault() {
        defaultInitOption = {};
        hwCategoryList = [];
    }

    function addSpinnerPopup() {
        $scope.popupHelper.addPopup('workspaceSpinner', {
            type: 'spinner',
            setPopupLayout: function(popup) {
                var content = Entry.Dom('div', {
                    class: 'contentArea'
                });
                var title = Entry.Dom('div', {
                    class: 'workspaceSpinnerTitle',
                    parent: content
                });
                var circle = Entry.Dom('div', {
                    class: 'workspaceSpinnerCircle',
                    parent: content
                });
                var inner1 = Entry.Dom('div', {
                    class: 'inner1',
                    parent: circle
                });
                var inner2 = Entry.Dom('div', {
                    class: 'inner2',
                    parent: circle
                });
                var inner3 = Entry.Dom('div', {
                    class: 'inner3',
                    parent: circle
                });
                Entry.Dom('div', {
                    class: 'workspaceSpinnerCharacter',
                    parent: circle
                });
                title.text(Lang.Workspace.uploading_msg);
                $scope.spinnerTitle = title;

                popup.append(content);
            }
        });
    }

    function addPracticalNoticePopup() {
        $scope.popupHelper.addPopup('practicalCourseNotice', {
            type: 'normal',
            setPopupLayout: function (popup) {
                var content = Entry.Dom('div', {
                    class: 'contentArea'
                });
                var text = Entry.Dom('div', {
                    class: 'contentText',
                    parent: content
                });
                text.html(Lang.Workspace.practical_course_desc);
                var text2 = Entry.Dom('div', {
                    class: 'contentText2',
                    parent: content
                });
                text2.html(Lang.Workspace.practical_course_desc2);
                popup.append(content);
            },
            closeEvent: function (popup) {
                if ($scope.practicalTooltip) {
                    $scope.practicalTooltip.dispose();
                    delete $scope.practicalTooltip;
                }
                $scope.popupHelper.remove('practicalCourseNotice');
            },
        });
    }

    function addFailedPopup() {
        $scope.popupHelper.addPopup('workspaceFailed', {
            setPopupLayout: function(popup) {
                var content = Entry.Dom('div', {
                    class: 'contentArea'
                });
                var title = Entry.Dom('div', {
                    class: 'workspaceFailedTitle',
                    parent: content
                });

                var close = Entry.Dom('div', {
                    class: 'workspaceFailedCloseBtn',
                    parent: content
                });

                var subTitle = Entry.Dom('div', {
                    class: 'workspaceFailedSubTitle',
                    parent: content
                });
                title.html(Lang.Workspace.upload_fail_msg);
                subTitle.html(Lang.Workspace.fail_contact_msg);
                $scope.failTitle = title;

                close.bindOnClick(function() {
                    popupHelper.hide();
                });

                popup.append(content);
            }
        });
    }

    function removeObject(sprite) {
        const { pictures = [] } = sprite;
        let { fileurl = '' } = sprite;
        fileurl = decodeURI(fileurl);

        pictures.forEach((picture)=> {
            if(fileurl && fileurl.indexOf('temp') > 1) {
                Util.removeFileByUrl(fileurl);
                Util.clearTempDir();
            }
        });
    }

    function removePicture(picture) {
        let { fileurl = '' } = picture;
        fileurl = decodeURI(fileurl);

        if(fileurl && fileurl.indexOf('temp') > 1) {
            Util.removeFileByUrl(fileurl);
            Util.clearTempDir();
        }
    }

    function removeSound(sound) {
        let { fileurl = '' } = sound;
        fileurl = decodeURI(fileurl);
        
        if(fileurl && fileurl.indexOf('temp') > 1) {
            Util.removeFileByUrl(fileurl);
            Util.clearTempDir();
        }
    }

    function getWorkspaceBusy(checkList) {
        if(window.isNowSaving) {
            return 'saving';
        } else if(window.isNowLoading) {
            return 'loading';
        } else if(window.isNewProject) {
            return 'new';
        } else {
            return undefined;
        }
    }

    function addSelectModePopup() {
        $scope.popupHelper.addPopup('workspaceModeSelect', {
            setPopupLayout: function (popup) {
                var content = Entry.Dom('div', {
                    class: 'contentArea'
                });
                var title = Entry.Dom('div', {
                    class: 'workspaceModeSelectTitle',
                    parent: content
                });
                var modeSelectArea = Entry.Dom('div', {
                    classes: ['workspaceModeSelectArea'],
                    parent: content
                });
                var modeDefault = Entry.Dom('div', {
                    classes: ['workspaceModeSelectDefault', 'active', 'workspaceModeSelectBox'],
                    parent: modeSelectArea
                });
                Entry.Dom('div', {
                    classes: ['modeTitle'],
                    parent: modeDefault,
                }).text(Lang.Workspace.select_mode_popup_lable1);
                Entry.Dom('div', {
                    classes: ['modeDesc'],
                    parent: modeDefault,
                }).html(Lang.Workspace.select_mode_popup_desc1);
                Entry.Dom('div', {
                    classes: ['modeButton'],
                    parent: modeDefault,
                });
                var modePracticalArts = Entry.Dom('div', {
                    classes: ['workspaceModeSelectPracticalArts', 'workspaceModeSelectBox'],
                    parent: modeSelectArea
                });
                Entry.Dom('div', {
                    classes: ['modeTitle'],
                    parent: modePracticalArts,
                }).text(Lang.Workspace.select_mode_popup_lable2);
                Entry.Dom('div', {
                    classes: ['modeDesc'],
                    parent: modePracticalArts,
                }).html(Lang.Workspace.select_mode_popup_desc2);
                Entry.Dom('div', {
                    classes: ['modeButton'],
                    parent: modePracticalArts,
                });
                Entry.Dom('div', {
                    class: 'workspaceModeSelectDivideLine',
                    parent: content
                });
                var close = Entry.Dom('div', {
                    class: 'workspaceModeSelectCloseBtn',
                    parent: content
                }).text(Lang.Menus.corporateConfirm);
                title.text(Lang.Workspace.select_mode_popup_title);

                var mode = 'default';
                modeDefault.bindOnClick(function () {
                    mode = 'default';
                    modePracticalArts.removeClass('active');
                    $(this).addClass('active');
                });
                modePracticalArts.bindOnClick(function () {
                    mode = 'practical_course';
                    modeDefault.removeClass('active');
                    $(this).addClass('active');
                });
                close.bindOnClick(function () {
                    if (mode === 'default') {
                        localStorage.setItem('isPracticalCourse', false);
                        EntryStatic = require('./bower_components/entryjs/extern/util/static.js').EntryStatic;
                    } else {
                        localStorage.setItem('isPracticalCourse', true);
                        EntryStatic = require('./bower_components/entryjs/extern/util/static_mini.js').EntryStatic;
                    }
                    $scope.initWorkspace();
                    popupHelper.hide();
                });

                popup.append(content);
            }
        });
    }    

    function saveAsProject(title) {
        var default_path = storage.getItem('defaultPath') || '';
        var projectName = $scope.project.name.replace(/[\\\/:*?"<>|]/gi, '');
        var savePath = path.join(default_path, projectName);
        Util.showSaveDialog({
            defaultPath: savePath,
            title: title,
            filters: [{
                name: 'Entry File',
                extensions: ['ent']
            }]
        }, function(filePath) {
            if (filePath) {
                var parser = path.parse(filePath);
                storage.setItem('defaultPath', parser.dir);

                try {
                    myProject.saveProject(filePath, function(e, project_name) {
                        window.isNowSaving = false;
                        if (e) {
                            $scope.doPopupControl({
                                'type': 'hide'
                            });
                            $scope.doPopupControl({
                                'type': 'fail',
                                'msg': Lang.Workspace.saving_fail_msg
                            });
                        } else {
                            Entry.stateManager.addStamp();
                            myProject.isModeChange = false;
                            myProject.isSaved = true;
                            myProject.isSavedPath = filePath;
                            Entry.toast.success(Lang.Workspace.saved, project_name + ' ' + Lang.Workspace.saved_msg);
                            $scope.doPopupControl({
                                'type': 'hide'
                            });
                        }
                    });
                } catch (e) {
                    $scope.doPopupControl({
                        'type': 'hide'
                    });
                    $scope.doPopupControl({
                        'type': 'fail',
                        'msg': Lang.Workspace.saving_fail_msg
                    });
                    window.isNowSaving = false;
                }
            } else {
                $scope.doPopupControl({
                    'type': 'hide'
                });
                window.isNowSaving = false;
            }
        });
    }

    function checkTextModeCode() {
        if(Entry.isTextMode) {
            var workspace = Entry.getMainWS();
            if(workspace) {
                if(workspace.mode == Entry.Workspace.MODE_VIMBOARD) {
                    try {
                        workspace._syncTextCode();
                    } catch(e){
                        if(workspace.vimBoard._parser._onError) {
                            var error = {};
                            var message = Lang.TextCoding[Entry.TextCodingError.ALERT_NO_SAVE_ON_ERROR];
                            alert(message);
                            return true;
                        }
                    }
                }
            }
        }
    }

    //임시 저장
    function saveLocalStorageProject() {
        if (Entry.engine.isState('run')) {
            return;
        }
        if (Entry.Func &&
            Entry.Func.workspace &&
            Entry.Func.workspace.visible) {
            return;
        }
        var project = {};
        (function(p) {
            Entry.exportProject(p);
            p.isPracticalCourse = !!EntryStatic.isPracticalCourse;
            p.name = document.getElementById('project_name').value;
            storage.setItem('tempProject', JSON.stringify(p));
        })(project);
    }

    function cropImageFromCanvas(image_data) {
        var defer = $.Deferred();

        var image = new Image();

        image.src = image_data;
        image.onload = function() {
            var canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0, canvas.width, canvas.height);

            var w = canvas.width,
                h = canvas.height,
                pix = { x: [], y: [] },
                imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
                x, y, index;

            for (y = 0; y < h; y++) {
                for (x = 0; x < w; x++) {
                    index = (y * w + x) * 4;
                    if (imageData.data[index + 3] > 0) {
                        pix.x.push(x);
                        pix.y.push(y);
                    }
                }
            }
            pix.x.sort(function(a, b) {
                return a - b
            });
            pix.y.sort(function(a, b) {
                return a - b
            });
            var n = pix.x.length - 1;

            var minx = 0;
            var miny = 0;
            var maxx = 0;
            var maxy = 0;

            if (pix.x.length > 0) {
                minx = pix.x[0];
                maxx = pix.x[n];
                w = maxx - minx;
                if (w % 2 != 0) {
                    w += 1;
                }
            } else {
                w = 1;
                minx = 0;
            }

            if (pix.y.length > 0) {
                miny = pix.y[0];
                maxy = pix.y[n]
                h = maxy - miny;
                if (h % 2 != 0) {
                    h += 1;
                }
            } else {
                h = 1;
                miny = 0;
            }

            var cut = ctx.getImageData(minx, miny, w, h);

            canvas.width = w;
            canvas.height = h;
            ctx.putImageData(cut, 0, 0);

            defer.resolve(canvas.toDataURL("image/png"));
        }

        return defer;
    }

    function getTranslatedObject(object) {
        object.name = EntryStatic.getName(object.name, 'sprite');
        if (object.sprite) {
            if (object.sprite.pictures && object.sprite.pictures.length > 0) {
                for (var i = 0, len = object.sprite.pictures.length; i < len; i++) {
                    object.sprite.pictures[i].name = EntryStatic.getName(object.sprite.pictures[i].name, 'picture');
                }
            }
            if (object.sprite.sounds && object.sprite.sounds.length > 0) {
                for (var i = 0, len = object.sprite.sounds.length; i < len; i++) {
                    object.sprite.sounds[i].name = EntryStatic.getName(object.sprite.sounds[i].name, 'sound');
                }
            }
        }

        return object;
    }

    function getTranslatedScene(scene) {
        // object
        scene.name = Lang.Blocks.SCENE + ' 1';
        return scene;
    }

    function saveBlockImages(data) {
        var default_path = storage.getItem('defaultPath') || '';
        var fileName = "엔트리블록.zip";
        var savePath = path.join(default_path, fileName);

        Util.showSaveDialog({
            defaultPath: savePath,
            title: '블록이미지 저장하기'
        }, function(filePath) {
            var baseName = path.parse(filePath).base;
            if (baseName.split(".").length < 2 ||
                baseName.split(".")[1].toLowerCase() != "zip") {
                filePath += ".zip";
            }
            Entry.plugin.zipBlockImages(filePath, data.images);
        });


    }

    function unloadCheckFunc() {
        if (getWorkspaceBusy() === 'saving') {
            alert(Lang.Workspace.quit_stop_msg);
            return false;
        }
        var canLoad = true;
        if (myProject.checkSavedProject()) {
            canLoad = confirm(Lang.Menus.save_dismiss);
        }
        
        if (canLoad) {
            myProject.isModeChange = false;
            Entry.plugin.closeAboutPage();
            storage.removeItem('tempProject');
            beforeUnload();
        } else {
            $scope.doPopupControl({
                'type': 'hide'
            });
        }

        return canLoad;
    }
    //#endregion

}]).service('myProject', function ($rootScope) {
    this.name = '';
    this.isModeChange = false;
    this.isSaved = false;
    this.isSavedPath = '';
    this.programmingMode = 0;
    this.autoSaveInterval = -1;
    this.mode;
    this.modeName;

    this.checkSavedProject = function () {
        return !Entry.stateManager.isSaved() || (this.isModeChange && !this.isSaved);
    }

    this.runAutoSaveScheduler = function () {
        this.runAutoSave();
        Entry.addEventListener('stop', function () {
            if(this.autoSaveInterval === -1) {
                this.runAutoSave();
            }
        }.bind(this));
    }

    this.runAutoSave = function () {
        this.saveTempProject();
        this.autoSaveInterval = setInterval(function () {
            if(Entry.engine.isState('stop')) {
                this.saveTempProject();
            } else {
                clearInterval(this.autoSaveInterval);
                this.autoSaveInterval = -1;
            }
        }.bind(this), 180000);        
    }

    this.saveTempProject = function () {
        var project_name = this.name;
        var parent = this.parent;

        Entry.stage.handle.setVisible(false);
        Entry.stage.update();

        var project = Entry.exportProject();
        project.isPracticalCourse = !!EntryStatic.isPracticalCourse;
        project.name = project_name;
        project.parent = parent;

        Entry.plugin.saveTempProject(project, (e)=> {
            console.log(`============================= ${new Date()} ::: 임시 저장 완료 =============================`);
        });
    };

    this.setMode = function (value) {
        this.mode = value;
        if (value === 'default') {
            this.modeName = Lang.Workspace.default_mode;
        } else {
            this.modeName = Lang.Workspace.practical_course_mode;
        }
        $rootScope.$broadcast('modeChange', this);
    }

    this.getMode = function () {
        return this.mode;
    }

    this.saveProject = function(path, cb) {

        var project_name = this.name;
        var parent = this.parent;
        //저장 수행
        Entry.stage.handle.setVisible(false);
        Entry.stage.update();

        var project = Entry.exportProject();
        project.isPracticalCourse = !!EntryStatic.isPracticalCourse;
        project.name = project_name;
        project.parent = parent;

        Entry.plugin.saveProject(path, project, function(e) {
            if ($.isFunction(cb)) {
                cb(e, project_name);
            };
        });
    };
});
