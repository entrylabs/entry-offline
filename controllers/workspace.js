//var context = {};
angular.module('workspace', ['ngCookies']).controller("WorkspaceController", 
	['$scope', function ($scope) {
		$scope.initWorkspace = function () {
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
			Entry.loadProject();

			// Entry.addEventListener('saveWorkspace', $scope.saveWorkspace);
   //          Entry.addEventListener('saveAsWorkspace', $scope.saveAsWorkspace);
   //          Entry.addEventListener('openSpriteManager', $scope.openSpriteManager);
   //          Entry.addEventListener('openPictureManager', $scope.openPictureManager);
   //          Entry.addEventListener('openSoundManager', $scope.openSoundManager);
   //          Entry.addEventListener('changeVariableName', $scope.changeVariableName);
   //          Entry.addEventListener('deleteMessage', $scope.deleteMessage);
   //          Entry.addEventListener('saveCanvasImage', $scope.saveCanvasData);
   //          Entry.addEventListener('openPictureImport', $scope.openPictureImport);
   //          Entry.addEventListener('saveLocalStorageProject', saveLocalStorageProject);
		};

	}]);	







