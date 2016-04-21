'use strict';

angular.module('workspace').controller('HeaderController',
    ['$scope', '$rootScope', '$cookies', 'myProject',
    function ($scope, $rootScope, $cookies, myProject) {
        $scope.user_language = localStorage.getItem('lang') || 'ko';
        $scope.project = myProject;
        var supported = !(typeof storage == 'undefined' || typeof window.JSON == 'undefined');
        var storage = (typeof window.localStorage === 'undefined') ? undefined : window.localStorage;

        $scope.init = function() {
                if(hwGuidePopup) {
                    hwGuidePopup.close();
                    hwGuidePopup = null;
                }
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

        $scope.setLanguage = function(language) {
            storage.setItem('lang', language);
            var project = Entry.exportProject();
            project.name = myProject.name;
            storage.setItem('localStorageProject', JSON.stringify(project));
            // location.reload(true);
            Entry.plugin.reloadApplication();
        };

        $scope.blockHelperOn = function(){
            Entry.helper.blockHelperOn();
        };

        var hwGuidePopup = null;
        $scope.startHWGuide = function(url, title, options) {
            Entry.plugin.openHwGuidePopup();
            // try{
            //     if(hwGuidePopup == null) {
            //         hwGuidePopup = new BrowserWindow({
            //             width: 1200,
            //             height: 800
            //         });
            //         hwGuidePopup.setMenu(null);
            //         hwGuidePopup.loadURL('file:///' + path.resolve(__dirname, 'hardware', 'guide', 'hwguide.html'));
            //         hwGuidePopup.on('closed', function(e) {
            //             try{
            //                 hwGuidePopup = null;
            //             } catch(e){}
            //         });
            //     }
            // } catch(e) {

            // }
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
                Entry.stateManager.addStamp();
                storage.removeItem('tempProject');
                Entry.plugin.beforeStatus = 'new';
                Entry.plugin.initProjectFolder(function () {
                    Entry.plugin.reloadApplication();
                });
            }           
        }
    }]);
