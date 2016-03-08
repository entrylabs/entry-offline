'use strict';

angular.module('workspace').controller("WorkspaceController",
	['$scope', '$rootScope', '$modal', '$http', 'myProject', function ($scope, $rootScope, $modal, $http, myProject) {
		$scope.saveFileName = '';
		$scope.project = myProject;
		var supported = !(typeof storage == 'undefined' || typeof window.JSON == 'undefined');
        var storage = (typeof window.localStorage === 'undefined') ? undefined : window.localStorage;

		$scope.initWorkspace = function () {
			// 기본 초기화를 수행수 동작한다.
			Entry.plugin.init(function () {
				myProject.isSavedPath = storage.getItem('defaultPath') || '';
				var workspace = document.getElementById("workspace");
				var initOptions = {
					type: 'workspace',
					libDir: './bower_components',
					defaultDir: '.',
					fonts: [{
						name: '바탕체',
						family: 'KoPub Batang',
						url: './css/kopubbatang.css'
					}, {
						name: '명조체',
						family: 'Nanum Myeongjo',
						url: './css/nanummyeongjo.css'
					}, {
						name: '고딕체',
						family: 'Nanum Gothic',
						url: './css/nanumgothic.css'
					}, {
						name: '필기체',
						family: 'Nanum Pen Script',
						url: './css/nanumpenscript.css'
					}, {
						name: '한라산체',
						family: 'Jeju Hallasan',
						url: './css/jejuhallasan.css'
					}, {
						name: '코딩고딕체',
						family: 'Nanum Gothic Coding',
						url: './css/nanumgothiccoding.css'
					}]
				};

				Entry.init(workspace, initOptions);

				var beforeUnload = window.onbeforeunload;
				window.onbeforeunload = function(e) {
					if(['new', 'load'].indexOf(Entry.plugin.beforeStatus) > -1) {
						Entry.plugin.beforeStatus = '';
						return;
					}
					var canLoad = true;
		        	if(!Entry.stateManager.isSaved()) {
		        		canLoad = confirm(Lang.Menus.save_dismiss);
		        	}

		        	if(canLoad) {
		        		beforeUnload();
		        	} else {
						console.log('I do not want to be closed');
						e.preventDefault()
						e.returnValue = false;
		        	}
				};

				Entry.playground.setBlockMenu();
				//아두이노 사용 (웹소켓이용)
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
				Entry.addEventListener('openSpriteManager', $scope.openSpriteManager);
				Entry.addEventListener('openPictureManager', $scope.openPictureManager);
				Entry.addEventListener('openSoundManager', $scope.openSoundManager);
				Entry.addEventListener('changeVariableName', $scope.changeVariableName);
				Entry.addEventListener('deleteMessage', $scope.deleteMessage);
				Entry.addEventListener('saveCanvasImage', $scope.saveCanvasData);
				Entry.addEventListener('openPictureImport', $scope.openPictureImport);
				// Entry.addEventListener('saveLocalStorageProject', saveLocalStorageProject);
				if(Entry.plugin.isOsx()) {
                    var category_list = Entry.playground.categoryView_.getElementsByTagName("li");
                    category_list['entryCategoryarduino'].addClass('entryRemove');
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
					var child = $uploadWindow.find(e.target);
					if(child.length === 0)  {
						$uploadWindow.css('opacity', 0);
						actionDisplayNone = setTimeout(function () {
							$uploadWindow.css('display', 'none');
						}, 200);
					}
					return false;
				});
				$body.on('drop', function (e) {
					$('.uploader-window').css('opacity', 0);
					setTimeout(function () {
						$uploadWindow.css('display', 'none');
					}, 200);
				    e.preventDefault();
				    var file = e.originalEvent.dataTransfer.files[0];
				    var fileInfo = path.parse(file.path);
				    try {
					    if(fileInfo.ext === '.ent') {
					    	var filePath = file.path;
			        		var pathArr = filePath.split('/');
			        		pathArr.pop();
			        		storage.setItem('defaultPath', pathArr.join('/'));

			        		Entry.plugin.loadProject(filePath, function (data) {
			        			var jsonObj = JSON.parse(data);
			        			jsonObj.path = filePath;
	    			            storage.setItem('nativeLoadProject', JSON.stringify(jsonObj));
					            Entry.plugin.reloadApplication();
			        		});
					    } else {
					    	alert('지원하지 않은 형식의 파일입니다.');
					    }
				    } catch(e) {
				    	alert('파일이 깨졌거나 잘못된 파일을 불러왔습니다.');
				    }
				    return false;
				});
			});
		};

		$scope.setOfflineHW = function() {
			$('#entryCategoryarduino').mouseup(function() {
					Entry.HW.prototype.downloadConnector = function() {
						$('#saveArduinoPlugin').attr('nwsaveas', 'Entry_HW_v1.1.2.exe').trigger('click');
						$("#saveArduinoPlugin").on("change", function () {
							var filePath = $('#saveArduinoPlugin').val();
							if (filePath !== "") {
								var fs = require("fs");
									fs.readFile("./hardware/plugin/Entry_HW_v1.1.2.exe", function (err, stream) {
										fs.writeFile(filePath, stream, 'utf8', function (err) {
											if (err)
												alert("Unable to save file");
											else
												console.log("File Saved");

                                            $("#saveArduinoPlugin").val('');
										});

									});
							}
							else {
								// User cancelled
							}
       					 });
					};


					Entry.HW.prototype.downloadSource = function() {
						 $('#saveArduinoCode').attr('nwsaveas', 'board.ino').trigger('click');
						 $("#saveArduinoCode").on("change", function () {
							var filePath = $('#saveArduinoCode').val();
							//alert("File Path : " + filePath);
							if (filePath !== "") {
								var fs = require("fs");
									fs.readFile("./hardware/source/board.ino", function (err, stream) {
										fs.writeFile(filePath, stream, 'utf8', function (err) {
											if (err)
												alert("Unable to save file");
											else
												console.log("File Saved");

											$("#saveArduinoCode").val('');
										});
									});
							}
							else {
								// User cancelled
							}
       					 });
					};

					var user_lang = localStorage.getItem('lang');

					if(user_lang === 'ko' || null) {
						Lang.Blocks.ARDUINO_download_connector = "하드웨어 플러그인 받기";
						Lang.Blocks.ARDUINO_download_source = "아두이노 소스코드 받기";
						Lang.Blocks.ARDUINO_reconnect = "하드웨어에 연결하기";
					} else if(user_lang === 'en') {
						Lang.Blocks.ARDUINO_download_connector = "Get Hardware Plugin";
						Lang.Blocks.ARDUINO_download_source = "Get Arduino Code";
						Lang.Blocks.ARDUINO_reconnect = "Connect To Hardware";
					} else if(user_lang === 'vn') {
						Lang.Blocks.ARDUINO_download_connector = "Get Hardware Plugin";
						Lang.Blocks.ARDUINO_download_source = "Get Arduino Code";
						Lang.Blocks.ARDUINO_reconnect = "Connect To Hardware";
					}

			});
	    };

		// 프로젝트 세팅
		$scope.setWorkspace = function(project) {
			Entry.loadProject(project);

			var project_name = "";
			if($.isPlainObject(project)) {
				project_name = project.name;
				myProject.isSaved = true;
				myProject.isSavedPath = project.path;
			} else {
				var i = Math.floor(Math.random() * Lang.Workspace.PROJECTDEFAULTNAME.length);
                project_name = Lang.Workspace.PROJECTDEFAULTNAME[i] + ' ' + Lang.Workspace.project;
			}


			$scope.project.name = project_name || '새 프로젝트';

			myProject.name = project_name || '새 프로젝트';

			angular.element('#project_name').trigger('blur');

		}

		function saveAsProject(title) {
			var default_path = storage.getItem('defaultPath') || '';
			dialog.showSaveDialog({
				defaultPath: default_path,
				title: title,
				filters: [
				    { 
				    	name: 'Entry File', 
				    	extensions: ['ent'] 
				    }
				]
			}, function (filePath) {	
	        	if(filePath) {
	        		var pathArr = filePath.split('/');
	        		pathArr.pop();
	        		storage.setItem('defaultPath', pathArr.join('/'));

	        		try{
		        		myProject.saveProject(filePath, function (project_name) {
			            	myProject.isSaved = true;
			            	myProject.isSavedPath = filePath;
			            	Entry.toast.success(Lang.Workspace.saved, project_name + ' ' + Lang.Workspace.saved_msg);
							$scope.hideSpinner();
			            });
	        		} catch(e) {
		            	Entry.toast.success(Lang.Workspace.saved, project_name + ' ' + Lang.Workspace.saved_msg);
						$scope.hideSpinner();	        			
	        		}
	        	} else {
	        		$scope.hideSpinner();
	        	}
			});
		}

		// 저장하기
		$scope.saveWorkspace = function() {
			$scope.showSpinner();
			if(myProject.isSaved) {
				$scope.project.saveProject(myProject.isSavedPath, function () {
	            	Entry.toast.success(Lang.Workspace.saved, myProject.name + ' ' + Lang.Workspace.saved_msg);
	            	$scope.hideSpinner();
	            });
			} else {
				saveAsProject(Lang.Workspace.file_save);
			}
        };

        // 새 이름으로 저장하기
		$scope.saveAsWorkspace = function() {
			$scope.showSpinner();
			var default_path = storage.getItem('defaultPath') || '';
			Entry.stateManager.addStamp();
			saveAsProject(Lang.Workspace.file_save);
        };

        // 불러오기
        $scope.loadWorkspace = function() {
        	var canLoad = false;
        	if(!Entry.stateManager.isSaved()) {
        		canLoad = !confirm(Lang.Menus.save_dismiss);
        	}

        	if(!canLoad) {
        		Entry.plugin.beforeStatus = 'load';
        		dialog.showOpenDialog({
        			properties: [
        				'openFile'
        			], filters: [
					    { name: 'Entry File', extensions: ['ent'] }
					]
        		}, function (paths) {
		        	if(Array.isArray(paths)) {
		        		var filePath = paths[0];
		        		var pathArr = filePath.split('/');
		        		pathArr.pop();
		        		storage.setItem('defaultPath', pathArr.join('/'));

		        		Entry.plugin.loadProject(filePath, function (data) {
		        			var jsonObj = JSON.parse(data);
		        			jsonObj.path = filePath;
    			            storage.setItem('nativeLoadProject', JSON.stringify(jsonObj));
				            Entry.plugin.reloadApplication();
		        		});
		        	}
        		});
        	}
        };

        // 스프라이트 매니저 오픈.
        $scope.openSpriteManager = function() {
        	console.log('openSpriteManager');
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
        	console.log('openPictureManager');

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
        	console.log('changeVariableName');
        };
        $scope.deleteMessage = function () {
        	console.log('deleteMessage');
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

            Entry.plugin.saveProject(path, project, function () {
            	if($.isFunction(cb)) {
            		cb(project_name);
            	};
            });
		};
	});
