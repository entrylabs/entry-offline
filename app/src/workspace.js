'use strict';

angular.module('workspace').controller("WorkspaceController",
    ['$scope', '$rootScope', '$modal', '$http', 'myProject', function ($scope, $rootScope, $modal, $http, myProject) {
        $scope.saveFileName = '';
        $scope.project = myProject;
        $scope.isNowSaving = false;
        var supported = !(typeof storage == 'undefined' || typeof window.JSON == 'undefined');
        var storage = (typeof window.localStorage === 'undefined') ? undefined : window.localStorage;

        $scope.initWorkspace = function () {
            window.lang = localStorage.getItem('lang');
            Entry.addEventListener('showLoadingPopup', $scope.showLoadingPopup);
            Entry.addEventListener('hideLoadingPopup', $scope.hideLoadingPopup);

            var playFunc = createjs.Sound.play;
            createjs.Sound.play = function (a, b) {
                if (b) b.pan = 0.01;
                else b = {pan: 0.01};
                return playFunc(a, b);
            };

            if(!$scope.popupHelper) {
                $scope.popupHelper = new Entry.popupHelper(true);
            }
            addSpinnerPopup();
            addFailedPopup();

            // 기본 초기화를 수행수 동작한다.
            Entry.plugin.init(function () {
                myProject.isSavedPath = storage.getItem('defaultPath') || '';
                var workspace = document.getElementById("workspace");
                var initOptions = {
                    type: 'workspace',
                    libDir: './bower_components',
                    defaultDir: '.',
                    blockInjectDir: './',
                    fonts: [{
                        name: Lang.Fonts.batang,
                        family: 'KoPub Batang',
                        url: './css/kopubbatang.css'
                    }, {
                        name: Lang.Fonts.myeongjo,
                        family: 'Nanum Myeongjo',
                        url: './css/nanummyeongjo.css'
                    }, {
                        name: Lang.Fonts.gothic,
                        family: 'Nanum Gothic',
                        url: './css/nanumgothic.css'
                    }, {
                        name: Lang.Fonts.pen_script,
                        family: 'Nanum Pen Script',
                        url: './css/nanumpenscript.css'
                    }, {
                        name: Lang.Fonts.jeju_hallasan,
                        family: 'Jeju Hallasan',
                        url: './css/jejuhallasan.css'
                    }, {
                        name: Lang.Fonts.gothic_coding,
                        family: 'Nanum Gothic Coding',
                        url: './css/nanumgothiccoding.css'
                    }]
                };

                Entry.init(workspace, initOptions);

                var beforeUnload = window.onbeforeunload;
                window.onbeforeunload = function(e) {
                    if($scope.isNowSaving === true) {
                        alert(Lang.Workspace.quit_stop_msg);
                        e.preventDefault();
                        e.returnValue = false;
                        return;
                    }
                    var canLoad = true;
                    if(!Entry.stateManager.isSaved()) {
                        canLoad = confirm(Lang.Menus.save_dismiss);
                    }

                    if(canLoad) {
                        Entry.plugin.closeAboutPage();
                        Entry.plugin.closeHwGuidePage();

		        		storage.removeItem('tempProject');
		        		beforeUnload();
		        	} else {
                        $scope.doPopupControl({
                            'type':'hide'
                        });
						e.preventDefault();
						e.returnValue = false;
		        	}
				};

                // 아두이노 사용 (웹소켓이용)
                Entry.enableArduino();

                var project = storage.getItem('nativeLoadProject') || storage.getItem('localStorageProject');

                if(project) {
                    project = JSON.parse(project);
                    storage.removeItem('nativeLoadProject');
                    storage.removeItem('localStorageProject');
                }

                $scope.setWorkspace(project);

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
                if(Entry.plugin.isOsx()) {
                    var category_list = Entry.playground.mainWorkspace.blockMenu._categoryElems;
                    category_list['arduino'].addClass('entryRemove');
                }
                $scope.setOfflineHW();

				var $body = $('body');
				var $uploadWindow = $('.entryUploaderWindow');
				var actionDisplayNone;

				$body.on('dragover', function () {
					$uploadWindow.css('opacity', 1);
					if(actionDisplayNone) {
						clearTimeout(actionDisplayNone);
						$uploadWindow.css('display', 'block');
					}
					return false;
				});
				$body.on('dragleave dragend', function (e) {
					$uploadWindow.css('opacity', 0);
					actionDisplayNone = setTimeout(function () {
						$uploadWindow.css('display', 'none');
					}, 200);
					return false;
				});
				$body.on('drop', function (e) {
					$uploadWindow.css('opacity', 0);
					setTimeout(function () {
						$uploadWindow.css('display', 'none');
					}, 200);
				    e.preventDefault();
				    var file = e.originalEvent.dataTransfer.files[0];
				    var fileInfo = path.parse(file.path);
				    try {
					    if(fileInfo.ext === '.ent') {
					    	$scope.doPopupControl({
				                'type':'spinner',
				                'msg': Lang.Workspace.loading_msg
				            });

                            var filePath = file.path;
                            var parser = path.parse(filePath);
                            storage.setItem('defaultPath', parser.dir);

                            $scope.loadProject(filePath);
                        } else {
                            alert(Lang.Workspace.not_supported_file_msg);
                        }
                    } catch(e) {
                        alert(Lang.Workspace.broken_file_msg);
                    }
                    return false;
                });
            });
        };

        $scope.setOfflineHW = function() {
            Entry.HW.prototype.downloadConnector = function() {
                Entry.plugin.openHardwarePage();
            };

			Entry.HW.prototype.downloadSource = function() {

                dialog.showSaveDialog({
                    defaultPath: 'board.ino',
                    filters: [
                        { name: 'Arduino(*.ino)', extensions: ['ino'] }
                    ]
                }, function (filePath) {    
                    if(filePath) {
                        var fs = require("fs");
                        fs.readFile(path.resolve(__dirname, 'hardware', 'source', 'board.ino'), function (err, stream) {
                            fs.writeFile(filePath, stream, 'utf8', function (err) {
                                if (err)
                                    alert("Unable to save file");
                                else
                                    console.log("File Saved");

                                $("#saveArduinoCode").val('');
                            });
                        });
                    } else {
                    }
                });
            };
            $('#entryCategoryarduino').mouseup(function() {

                var user_lang = localStorage.getItem('lang');

                if(user_lang === 'ko') {
                    Lang.Blocks.ARDUINO_download_connector = "하드웨어 플러그인 열기";
                    Lang.Blocks.ARDUINO_download_source = "아두이노 소스코드 받기";
                    Lang.Blocks.ARDUINO_reconnect = "하드웨어에 연결하기";
                } else {
                    Lang.Blocks.ARDUINO_download_connector = "Open Hardware Plugin";
                    Lang.Blocks.ARDUINO_download_source = "Get Arduino Code";
                    Lang.Blocks.ARDUINO_reconnect = "Connect To Hardware";
                }

            });
        };

        $scope.spinnerTitle;
        $scope.failTitle;

        $scope.doPopupControl = function (obj) {
            if(obj.type === 'spinner') {
                $scope.spinnerTitle.text(obj.msg);
                $scope.popupHelper.show('workspaceSpinner');
            } else if (obj.type === 'fail') {
                $scope.failTitle.html(obj.msg);
                $scope.popupHelper.show('workspaceFailed');
            } else if (obj.type === 'hide') {
                $scope.popupHelper.hide();
            }
        }

        $scope.showLoadingPopup = function () {
            $scope.doPopupControl({
                'type':'spinner',
                'msg': Lang.Workspace.loading_msg
            });
        }
        
        $scope.hideLoadingPopup = function () {
            $scope.doPopupControl({
                'type':'hide'
            });
        }

        function addSpinnerPopup() {
            $scope.popupHelper.addPopup('workspaceSpinner', {
                type: 'spinner',
                setPopupLayout : function (popup) {
                    var content = Entry.Dom('div', {
                        class: 'contentArea'
                    });
                    var title = Entry.Dom('div', {
                        class : 'workspaceSpinnerTitle',
                        parent: content
                    });
                    var circle = Entry.Dom('div', {
                        class : 'workspaceSpinnerCircle',
                        parent: content
                    });
                    var inner1 = Entry.Dom('div', {
                        class : 'inner1',
                        parent: circle
                    });
                    var inner2 = Entry.Dom('div', {
                        class : 'inner2',
                        parent: circle
                    });
                    var inner3 = Entry.Dom('div', {
                        class : 'inner3',
                        parent: circle
                    });
                    Entry.Dom('div', {
                        class : 'workspaceSpinnerCharacter',
                        parent: circle
                    });
                    title.text(Lang.Workspace.uploading_msg);
                    $scope.spinnerTitle = title;

                    popup.append(content);
                }
            });
        }

        function addFailedPopup() {
            $scope.popupHelper.addPopup('workspaceFailed', {
                setPopupLayout : function (popup) {
                    var content = Entry.Dom('div', {
                        class: 'contentArea'
                    });
                    var title = Entry.Dom('div', {
                        class : 'workspaceFailedTitle',
                        parent: content
                    });

                    var close = Entry.Dom('div', {
                        class : 'workspaceFailedCloseBtn',
                        parent: content
                    });

                    var subTitle = Entry.Dom('div', {
                        class : 'workspaceFailedSubTitle',
                        parent: content
                    });
                    title.html(Lang.Workspace.upload_fail_msg);
                    subTitle.html(Lang.Workspace.fail_contact_msg);
                    $scope.failTitle = title;

                    close.bindOnClick(function () {
                        popupHelper.hide();
                    });

                    popup.append(content);
                }
            });
        }

        // 프로젝트 세팅
        $scope.setWorkspace = function(project, b) {
            var project_name = "";

            if(!project) {
                project = Entry.getStartProject(Entry.mediaFilePath);
                project.objects[0] = getTranslatedObject(project.objects[0]);
                project.scenes[0] = getTranslatedScene(project.scenes[0]);
                var i = Math.floor(Math.random() * Lang.Workspace.PROJECTDEFAULTNAME.length);
                project_name = Lang.Workspace.PROJECTDEFAULTNAME[i] + ' ' + Lang.Workspace.project;
                sessionStorage.setItem('isDefaultProject', true);
            } else {
                project_name = project.name;
                if(project.path) {
                    myProject.isSaved = true;
                    myProject.isSavedPath = project.path;
                }
                sessionStorage.setItem('isDefaultProject', false);
            }

            Entry.loadProject(project);

			$scope.project.name = project_name || Lang.Workspace.new_project;

            myProject.name = project_name || Lang.Workspace.new_project;

            angular.element('#project_name').trigger('blur');
        }

        function saveAsProject(title) {
            var default_path = storage.getItem('defaultPath') || '';
            var projectName = $scope.project.name.replace(/[\\\/:*?"<>|]/gi, '');
            var savePath = path.join(default_path, projectName);
            dialog.showSaveDialog({
                defaultPath: savePath,
                title: title,
                filters: [
                    {
                        name: 'Entry File',
                        extensions: ['ent']
                    }
                ]
            }, function (filePath) {    
                if(filePath) {
                    var parser = path.parse(filePath);
                    storage.setItem('defaultPath', parser.dir);

	        		try{
		        		myProject.saveProject(filePath, function (e, project_name) {
                            $scope.isNowSaving = false;
                            if(e) {
                                $scope.doPopupControl({
                                    'type':'hide'
                                });
                                $scope.doPopupControl({
                                    'type':'fail',
                                    'msg': Lang.Workspace.saving_fail_msg
                                });        
                            } else {
    		        			Entry.stateManager.addStamp();
    			            	myProject.isSaved = true;
    			            	myProject.isSavedPath = filePath;
    			            	Entry.toast.success(Lang.Workspace.saved, project_name + ' ' + Lang.Workspace.saved_msg);
    							$scope.doPopupControl({
    				                'type':'hide'
    				            });
                            }
			            });
	        		} catch(e) {
						$scope.doPopupControl({
			                'type':'hide'
			            });
						$scope.doPopupControl({
			                'type':'fail',
			                'msg': Lang.Workspace.saving_fail_msg
			            });        			
						$scope.isNowSaving = false;
	        		}
	        	} else {
	        		$scope.doPopupControl({
		                'type':'hide'
		            });
	        		$scope.isNowSaving = false;
	        	}
			});
		}

        // 저장하기
        $scope.saveWorkspace = function() {
            $scope.isNowSaving = true;
            $scope.doPopupControl({
                'type':'spinner',
                'msg': Lang.Workspace.saving_msg
            });
            const parseDir = path.parse(myProject.isSavedPath);
            if(myProject.isSaved && parseDir.ext === ".ent") {
				$scope.project.saveProject(myProject.isSavedPath, function () {
					Entry.stateManager.addStamp();
	            	Entry.toast.success(Lang.Workspace.saved, myProject.name + ' ' + Lang.Workspace.saved_msg);
	            	$scope.doPopupControl({
		                'type':'hide'
		            });
	            	$scope.isNowSaving = false;
	            });
			} else {
				Entry.stateManager.cancelLastCommand();
				saveAsProject(Lang.Workspace.file_save);
			}
        };

        // 새 이름으로 저장하기
        $scope.saveAsWorkspace = function() {
            $scope.isNowSaving = true;
            $scope.doPopupControl({
                'type':'spinner',
                'msg': Lang.Workspace.saving_msg
            });
            var default_path = storage.getItem('defaultPath') || '';
            saveAsProject(Lang.Workspace.file_save);
        };

        //임시 저장
        var saveLocalStorageProject = function () {
            if(Entry.engine.isState('run')) {
                return;
            }
            if (Entry.Func &&
                Entry.Func.workspace &&
                Entry.Func.workspace.visible ) {
                return;
            }
            var project = {};
            (function (p) {
                Entry.exportProject(p);
                p.name = document.getElementById('project_name').value;
                storage.setItem('tempProject', JSON.stringify(p));
            })(project);
        };

        $scope.loadProject = function (filePath) {
            $scope.doPopupControl({
                'type':'spinner',
                'msg': Lang.Workspace.loading_msg
            });
            Entry.plugin.loadProject(filePath, function (e, data) {
                if(e) {
                    $scope.doPopupControl({
                        'type':'hide'
                    });
                    $scope.doPopupControl({
                        'type':'fail',
                        'msg': Lang.Workspace.loading_fail_msg
                    }); 
                } else {                         
                    var jsonObj = JSON.parse(data);
                    jsonObj.path = filePath;

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
                            storage.setItem('nativeLoadProject', JSON.stringify(result));
                            Entry.plugin.reloadApplication();
                        });
                    } else {
                        storage.setItem('nativeLoadProject', JSON.stringify(jsonObj));
                        Entry.plugin.reloadApplication();
                    }
                }
            });
        }

        $scope.loadWorkspaceTest = function (filePath) {
            // $scope.showSpinner();
            $scope.doPopupControl({
                'type':'spinner',
                'msg': Lang.Workspace.loading_msg
            });
            var canLoad = false;
            if(!Entry.stateManager.isSaved()) {
                canLoad = !confirm(Lang.Menus.save_dismiss);
            }

            if(!canLoad) {
                Entry.stateManager.addStamp();
                storage.removeItem('tempProject');
                Entry.plugin.beforeStatus = 'load';
                var default_path = storage.getItem('defaultPath') || '';
              
                var pathInfo = path.parse(filePath);

                if(pathInfo.ext === '.ent') {
                    var parser = path.parse(filePath);
                    storage.setItem('defaultPath', parser.dir);
                    $scope.loadProject(filePath);
                } else {
                    alert(Lang.Workspace.check_entry_file_msg);
                    $scope.doPopupControl({
                        'type':'hide'
                    });
                }
            } else {
                $scope.doPopupControl({
                    'type':'hide'
                });
            }
        }

        // 불러오기
        $scope.loadWorkspace = function() {
        	// $scope.showSpinner();
        	$scope.doPopupControl({
                'type':'spinner',
                'msg': Lang.Workspace.loading_msg
            });
        	var canLoad = false;
        	if(!Entry.stateManager.isSaved()) {
        		canLoad = !confirm(Lang.Menus.save_dismiss);
        	}

            if(!canLoad) {
                Entry.stateManager.addStamp();
                storage.removeItem('tempProject');
                Entry.plugin.beforeStatus = 'load';
                var default_path = storage.getItem('defaultPath') || '';
                dialog.showOpenDialog({
                    defaultPath: default_path,
                    properties: [
                        'openFile'
                    ], filters: [
                        { name: 'Entry File', extensions: ['ent'] }
                    ]
                }, function (paths) {
                    if(Array.isArray(paths)) {
                        var filePath = paths[0];
                        var pathInfo = path.parse(filePath);

                        if(pathInfo.ext === '.ent') {
                            var parser = path.parse(filePath);
                            storage.setItem('defaultPath', parser.dir);
                            $scope.loadProject(filePath);
                        } else {
                            alert(Lang.Workspace.check_entry_file_msg);
                            $scope.doPopupControl({
                                'type':'hide'
                            });
                        }
                    } else {
                        $scope.doPopupControl({
                            'type':'hide'
                        });
                    }
                });
            } else {
                $scope.doPopupControl({
                    'type':'hide'
                });
            }
        };

        // 스프라이트 매니저 오픈.
        $scope.openSpriteManager = function() {
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
                    parent: function() {
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
                    object.sprite.name = Lang.Workspace.new_object+(Entry.container.getAllObjects().length+1);
                    object.sprite.pictures = [];
                    object.sprite.pictures.push({
                        dimension: {
                            height: 1,
                            width: 1
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
                    selectedItems.data.forEach(function(item) {
                        var object = {
                            id: Entry.generateHash(),
                            objectType: 'sprite',
                            sprite: item // 스프라이트 정보
                        };
                        object = Entry.container.addObject(object, 0);
                    });
                } else if (selectedItems.target === 'upload') {
                    selectedItems.data.forEach(function(item, index, array) {
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
                } else if (selectedItems.target=='textBox') {
                    var text = selectedItems.data ? selectedItems.data : Lang.Blocks.TEXT;
                    var options = selectedItems.options;
                    var object = {
                        id: Entry.generateHash(),
                        name: Lang.Workspace.textbox,
                        text: text,
                        options: options,
                        objectType: 'textBox',
                        sprite: {sounds:[], pictures:[]}
                    };
                    Entry.container.addObject(object, 0);
                } else {
                    console.log('no sprite found');
                }
            });
        };

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
                    parent: function() {
                        return "workspace";
                    }
                }
            });

            modalInstance.result.then(function (selectedItems) {
                if (selectedItems.target === 'new') {
                    selectedItems.data = [];
                    selectedItems.data.push({
                        fileurl : './bower_components/entryjs/images/_1x1.png',
                        dimension: {
                            height: 1,
                            width: 1
                        },
                        filename: "_1x1",
                        name: Lang.Workspace.new_picture,
                    });
                }

	            selectedItems.data.forEach(function(item) {
	                item.id = Entry.generateHash();
	                Entry.playground.addPicture(item, true);
	            });

	        });
        };

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
                    parent: function() {
                        return "workspace";
                    }
                }
            });

            modalInstance.result.then(function (selectedItems) {
                selectedItems.data.forEach(function(item) {
                    item.id = Entry.generateHash();
                    console.log("item duration ws: " + JSON.stringify(item.duration));
                    Entry.playground.addSound(item, true);
                });
            });
        };

        $scope.changeVariableName = function () {
            // console.log('changeVariableName');
        };
        $scope.deleteMessage = function () {
            // console.log('deleteMessage');
        };

        $scope.showSpinner = function () {
            $('.entrySpinnerWindow').css('display', 'flex');
        }
        $scope.hideSpinner = function () {
            $('.entrySpinnerWindow').css('display', 'none');
        }

        function cropImageFromCanvas(image_data) {
            var defer = $.Deferred();

            var image = new Image();

            image.src = image_data;
            image.onload = function () {
                var canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(this, 0, 0, canvas.width, canvas.height);

                var w = canvas.width,
                h = canvas.height,
                pix = {x:[], y:[]},
                imageData = ctx.getImageData(0,0,canvas.width,canvas.height),
                x, y, index;

                for (y = 0; y < h; y++) {
                    for (x = 0; x < w; x++) {
                        index = (y * w + x) * 4;
                        if (imageData.data[index+3] > 0) {
                            pix.x.push(x);
                            pix.y.push(y);
                        }
                    }
                }
                pix.x.sort(function(a,b){return a-b});
                pix.y.sort(function(a,b){return a-b});
                var n = pix.x.length-1;

                w = pix.x[n] - pix.x[0];
                h = pix.y[n] - pix.y[0];
                var cut = ctx.getImageData(pix.x[0], pix.y[0], w, h);

                canvas.width = w;
                canvas.height = h;
                ctx.putImageData(cut, 0, 0);

                defer.resolve(canvas.toDataURL());
            }

            return defer;
        }

        var TARGET_SIZE = 960;
        var THUMB_SIZE = 96;

        $scope.saveCanvasData = function (data) {
            console.log('saveCanvasData');
            var file = data.file;

            cropImageFromCanvas(data.image).then(function(trim_image_data) {
                var tempImg = new Image();
                tempImg.src = trim_image_data;
                tempImg.onload = function() {
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
                            Entry.playground.setPicture(picture);
                        } else { //edit
                            picture.id = file.id;
                            picture.name = file.name;
                            Entry.playground.setPicture(picture);
                        }

                        var image = new Image();
                        image.src = picture.fileurl;
                        image.onload = function(e) {
                            Entry.container.cachePicture(picture.id, image);
                            Entry.playground.selectPicture(picture);
                        };
                    });
                };
            });
        };
        $scope.openPictureImport = function () {
            console.log('openPictureImport');
        };


        /* Function Area Start*/
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
        };

        function getTranslatedScene(scene) {
            // object
            scene.name = Lang.Blocks.SCENE + ' 1';
            return scene;
        };
        /* Function Area End*/

    }]).service('myProject', function () {
        this.name = '';
        this.isSaved = false;
        this.isSavedPath = '';
        this.saveProject = function (path, cb) {
            var project_name = this.name;
            //저장 수행
            Entry.stage.handle.setVisible(false);
            Entry.stage.update();

            var project = Entry.exportProject();
            project.name = project_name;

            Entry.plugin.saveProject(path, project, function (e) {
                if($.isFunction(cb)) {
                    cb(e, project_name);
                };
            });
        };
    });
