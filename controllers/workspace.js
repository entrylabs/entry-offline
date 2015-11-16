'use strict';

angular.module('workspace').controller("WorkspaceController", 
	['$scope', '$rootScope', '$modal', 'myProject', function ($scope, $rootScope, $modal, myProject) {
		$scope.saveFileName = '';
		$scope.isSaved = false;
		$scope.isSavedPath = '';
		$scope.project = myProject;
		var supported = !(typeof storage == 'undefined' || typeof window.JSON == 'undefined');
        var storage = (typeof window.localStorage === 'undefined') ? undefined : window.localStorage;

		$scope.initWorkspace = function () {
			$scope.isSavedPath = storage.getItem('defaultPath') || '';
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
				$scope.isSaved = true;
				$scope.isSavedPath = project.path;
			} else {
				var i = Math.floor(Math.random() * Lang.Workspace.PROJECTDEFAULTNAME.length);
                project_name = Lang.Workspace.PROJECTDEFAULTNAME[i] + ' ' + Lang.Workspace.project;
			}

			$scope.project.name = project_name || '새 프로젝트';
		}

		// 저장하기
		$scope.saveWorkspace = function() {
			if($scope.isSaved) {
	            Entry.stage.handle.setVisible(false);
	            Entry.stage.update();

	            $scope.project_name = document.getElementById('project_name').value;
	            var project = Entry.exportProject();
	            project.name = $scope.project_name;

	            Entry.plugin.writeFile($scope.isSavedPath, JSON.stringify(project), function () {
	            	Entry.toast.success(Lang.Workspace.saved, $scope.project_name + ' ' + Lang.Workspace.saved_msg)
	            });

			} else {
				$('#save_as_project').trigger('click');				
			}
        };

        // 새 이름으로 저장하기
		$scope.saveAsWorkspace = function() {
            $('#save_as_project').trigger('click');
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
        	console.log('openSoundManager');
            
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
           
        };
        
        
        $scope.changeVariableName = function () {
        	console.log('changeVariableName');
        };
        $scope.deleteMessage = function () {
        	console.log('deleteMessage');
        };
        $scope.saveCanvasData = function (data) {
        	console.log('saveCanvasData');

        	var file = data.file;
		    var formData = new FormData();
		    formData.append("data", data.image);

		    var image_data = data.image.split(',')[1];
		    var picture = {};
		    var fileurl = './temp/images/' + file.name + '.png';
		    

            

		    Entry.plugin.saveTempImageFile(fileurl, image_data, function (dimensions) {
		    	console.log('이후 작업');
		    	picture.dimension = dimensions;
		    	picture.fileurl = fileurl;

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
	            var fileName = picture.filename;
	            picture.fileurl = '/temp/images/' + file.name + '.png';
	            image.src = '/temp/images/' + file.name + '.png';
	            image.onload = function(e) {
	                Entry.container.cachePicture(picture.id, image);
	                Entry.playground.selectPicture(picture);
	            };
		    });

		    return;

		    $.ajax({
		        url: '/api/picture/canvas',
		        data: formData,
		        cache: false,
		        contentType: false,
		        processData: false,
		        type: 'POST',
		        success: function(picture, status) {
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
		            var fileName = picture.filename;
		            image.src = '/uploads/' + fileName.substring(0, 2) + '/' +
		                fileName.substring(2, 4) + '/image/' + fileName + '.png';
		            image.onload = function(e) {
		                Entry.container.cachePicture(picture.id, image);
		                Entry.playground.selectPicture(picture);
		            };
		        },
		        error : function(data, status) {
		            console.log('error data:', data);
		        }
		    });
        };
        $scope.openPictureImport = function () {
        	console.log('openPictureImport');
        };


	}]).service('myProject', function () {
		this.name = "";
	}).directive('saveAsProject', function (){
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
		        		//저장 수행
		        		Entry.stage.handle.setVisible(false);
			            Entry.stage.update();

			            $scope.project_name = document.getElementById('project_name').value;
			            var project = Entry.exportProject();
			            project.name = $scope.project_name;

			            Entry.plugin.writeFile(path, JSON.stringify(project), function () {
			            	$scope.isSaved = true;
			            	$scope.isSavedPath = path;
			            	Entry.toast.success(Lang.Workspace.saved, $scope.project_name + ' ' + Lang.Workspace.saved_msg)
			            });

			            this.value = '';
		        	}

		            $scope.$apply();
		        });
		    }
	    };
	}).directive('loadProject', function (){
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

		        		Entry.plugin.readFile(path, function (data) {
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







