'use strict';

angular.module('workspace').controller("WorkspaceController", 
	['$scope', '$rootScope', '$modal', 'myProject', function ($scope, $rootScope, $modal, myProject) {
		$scope.saveFileName = '';
		$scope.project = myProject;
		var supported = !(typeof storage == 'undefined' || typeof window.JSON == 'undefined');
        var storage = (typeof window.localStorage === 'undefined') ? undefined : window.localStorage;

		$scope.initWorkspace = function () {
			if(!sessionStorage.getItem('isFirst')) {
				Entry.plugin.initProjectFolder(function() {
					sessionStorage.setItem('isFirst', true);
				});
			}
			myProject.isSavedPath = storage.getItem('defaultPath') || '';
			var workspace = document.getElementById("workspace");
			var initOptions = {
				type: 'workspace',
				libDir: './bower_components',
				fonts: [{
				    name: '나눔바른고딕',
				    family: 'Nanum Barun Gothic',
				    url: './css/nanumbarungothic.css'
			    }, {
				    name: '나눔고딕',
				    family: 'Nanum Gothic',
				    url: './css/nanumgothic.css'
			    }]
			};
			Entry.init(workspace, initOptions);
			Entry.playground.setBlockMenu();
			//아두이노 사용 (웹소켓이용)
			Entry.enableArduino();

			var project = storage.getItem('nativeLoadProject');

			if(project) {
				project = JSON.parse(project);
				storage.removeItem('nativeLoadProject');
			}

			// Entry.loadProject(project);
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
		}

		// 저장하기
		$scope.saveWorkspace = function() {
			if(myProject.isSaved) {
				$scope.project.saveProject(myProject.isSavedPath, function () {
	            	Entry.toast.success(Lang.Workspace.saved, myProject.name + ' ' + Lang.Workspace.saved_msg)
	            });

	            var project = Entry.exportProject();

			} else {
				var default_path = storage.getItem('defaultPath') || '';

            	$('#save_as_project').attr('nwworkingdir', default_path).trigger('click');		
			}
        };

        // 새 이름으로 저장하기
		$scope.saveAsWorkspace = function() {
			var default_path = storage.getItem('defaultPath') || '';

            $('#save_as_project').attr('nwworkingdir', default_path).trigger('click');
        };

        // 불러오기
        $scope.loadWorkspace = function() {
            $('#load_project').trigger('click');
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
            project.name = this.name;

            Entry.plugin.saveProject(path, project, function () {
            	if($.isFunction(cb)) {
            		cb(project_name);
            	};
            });
		};
	}).directive('saveAsProject', ['myProject', function(myProject){
		return {
		    controller: function($parse, $element, $attrs, $scope){
		    	var supported = !(typeof storage == 'undefined' || typeof window.JSON == 'undefined');
		        var storage = (typeof window.localStorage === 'undefined') ? undefined : window.localStorage;

		        $element.on('change', function(){
		        	var path = this.value;

		        	if(path) {
		        		var pathArr = path.split('/');
		        		pathArr.pop();
		        		storage.setItem('defaultPath', pathArr.join('/'));
		        		
		        		myProject.saveProject(path, function (project_name) {
			            	myProject.isSaved = true;
			            	myProject.isSavedPath = path;
			            	Entry.toast.success(Lang.Workspace.saved, project_name + ' ' + Lang.Workspace.saved_msg)
			            });

			            this.value = '';
		        	}

		            $scope.$apply();
		        });
		    }
	    };
	}]).directive('loadProject', function (){
		return {
		    controller: function($parse, $element, $attrs, $scope){
		    	var supported = !(typeof storage == 'undefined' || typeof window.JSON == 'undefined');
		        var storage = (typeof window.localStorage === 'undefined') ? undefined : window.localStorage;

		        $element.on('change', function(){
		        	var path = this.value;

		        	if(path) {
		        		var pathArr = path.split('/');
		        		pathArr.pop();
		        		storage.setItem('defaultPath', pathArr.join('/'));

		        		Entry.plugin.loadProject(path, function (data) {
		        			var jsonObj = JSON.parse(data);
		        			jsonObj.path = path;
		        			$scope.$root.$emit('loadProject', JSON.stringify(jsonObj));
		        		});

			            this.value = '';
		        	}

		            $scope.$apply();
		        });
		    }
	    };
	});	;	







