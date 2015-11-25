'use strict';

angular.module('workspace').controller('HeaderController',
    ['$scope', '$rootScope', '$cookies', 'myProject',
    function ($scope, $rootScope, $cookies, myProject) {
        $scope.user_language = localStorage.getItem('lang') || 'ko';
        $scope.project = myProject;
        var supported = !(typeof storage == 'undefined' || typeof window.JSON == 'undefined');
        var storage = (typeof window.localStorage === 'undefined') ? undefined : window.localStorage;

        $scope.init = function() {
            

        };

        $rootScope.$on('loadProject', function(event, data) {
            $scope.loadProject(data);
        });

        // 저장
        $scope.saveWorkspace = function() {
            Entry.dispatchEvent('saveWorkspace');
        };

        // 새이름으로 저장
        $scope.saveAsWorkspace = function() {
            Entry.dispatchEvent('saveAsWorkspace')
        };

        // 불러오
        $scope.loadWorkspace = function() {
            Entry.dispatchEvent('loadWorkspace')
        };

        $scope.stopPropagation = function (e) {
            e.stopPropagation();
        }

        var WorkspaceSaveCtrl = function($scope, $modalInstance) {
            $scope.name = myProject.name;

            // 적용
            $scope.ok = function () {
                var newName = document.getElementById('name').value;
                if (newName === '') {
                    alert('프로젝트 이름을 입력하십시요.');
                } else {
                    $modalInstance.close(newName);
                }
            };

            // 취소
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

        }

        var WorkspaceLoadCtrl = function($scope, $modalInstance) {
            var url = '/api/project/browse';
            $scope.projects = [];

            $http({method: 'GET', url: url}).
                success(function(data,status) {
                    $scope.projects = data;
                    console.log($scope.projects);
                }).
                error(function(data, status) {
                    $scope.status = status;
                });

            $scope.ok = function (project) {
                $modalInstance.close(project);
            };

            // 취소
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }

        $scope.setLanguage = function(language) {
            storage.setItem('lang', language);
            var project = Entry.exportProject();
            project.name = myProject.name;
            storage.setItem('localStorageProject', JSON.stringify(project));
            // location.reload(true);
            nwWindow.reloadDev();
        };

        $scope.blockHelperOn = function(){
            Entry.helper.blockHelperOn();
        };
        
        $scope.startHWGuide = function(url, title, options) {
            gui.Window.open(url, {
                position: 'center',
                width: 1200,
                height:800
            });
        }

        $scope.showPopup = function (target) {
            var popup = $('#' + target);
            var body = $('body').eq(0);
            body.css('overflow', 'hidden');
            popup.css('display', 'block');
            popup.css('top', $(document).scrollTop() + 'px');
        };

        $scope.hidePopup = function (target) {
            var popup = $('#' + target);
            var body = $('body').eq(0);
            body.css('overflow', 'auto');
            popup.css('display', 'none');
        };

        //새 프로젝트
        $scope.newProject = function () {
            var canLoad = false;
            if(!Entry.stateManager.isSaved()) {
                canLoad = !confirm(Lang.Menus.save_dismiss);
            }

            if(!canLoad) {
                Entry.plugin.initProjectFolder(function () {
                // location.reload(true);
                nwWindow.reloadDev();
            });
            }
           
        }

        // 프로젝트 불러오기
        $scope.loadProject = function (data) {
            storage.setItem('nativeLoadProject', data);
            // location.reload(true);
            nwWindow.reloadDev();
        }
    }]);
