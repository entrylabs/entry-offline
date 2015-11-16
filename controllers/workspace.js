'use strict';

angular.module('workspace').controller("WorkspaceController", 
	['$scope', '$rootScope', 'myProject', function ($scope, $rootScope, myProject) {
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
   //          Entry.addEventListener('openSpriteManager', $scope.openSpriteManager);
   //          Entry.addEventListener('openPictureManager', $scope.openPictureManager);
   //          Entry.addEventListener('openSoundManager', $scope.openSoundManager);
   //          Entry.addEventListener('changeVariableName', $scope.changeVariableName);
   //          Entry.addEventListener('deleteMessage', $scope.deleteMessage);
   //          Entry.addEventListener('saveCanvasImage', $scope.saveCanvasData);
   //          Entry.addEventListener('openPictureImport', $scope.openPictureImport);
   //          Entry.addEventListener('saveLocalStorageProject', saveLocalStorageProject);
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







