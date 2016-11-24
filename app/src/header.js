'use strict';

angular.module('workspace').controller('HeaderController', ['$scope', '$rootScope', '$cookies', 'myProject',
    function($scope, $rootScope, $cookies, myProject) {
        $scope.user_language = localStorage.getItem('lang') || 'ko';
        $scope.PracticalModeName = '';
        $scope.project = myProject;
        $scope.headerButtonImageSet = {
            new: './images/top_icon_new_b_nor.png',
            save: './images/top_icon_save_b_nor.png',
            help: './images/block_help.png',
            undo: './images/top_icon_left_b_nor.png',
            redo: './images/top_icon_right_b_nor.png',
        };
        var headerImageList = {
            default: {
                new: './images/top_icon_new_b_nor.png',
                save: './images/top_icon_save_b_nor.png',
                help: './images/block_help.png',
                undo: './images/top_icon_left_b_nor.png',
                redo: './images/top_icon_right_b_nor.png',
            },
            practical_course: {
                new: './images/ic_new.png',
                save: './images/top_icon_save_b_nor.png',
                help: './images/ic_q.png',
                undo: './images/top_icon_left_b_nor.png',
                redo: './images/top_icon_right_b_nor.png',  
            }
        }
        var supported = !(typeof storage == 'undefined' || typeof window.JSON == 'undefined');
        var storage = (typeof window.localStorage === 'undefined') ? undefined : window.localStorage;
        $scope.init = function() {
            $scope.PracticalModeName = myProject.modeName;

            if (hwGuidePopup) {
                hwGuidePopup.close();
                hwGuidePopup = null;
            }
        };

        $rootScope.$on('loadProject', function(event, data) {
            $scope.loadProject(data);
        });

        $rootScope.$on('modeChange', function(event, data) {
            $scope.PracticalModeName = data.modeName;
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

        $scope.showBlockHelper = function() {
            Entry.dispatchEvent('showBlockHelper');
        };

        $scope.stopPropagation = function(e) {
            e.stopPropagation();
        }

        $scope.setLanguage = function(language) {
            storage.setItem('lang', language);
            var isDefaultProject = sessionStorage.getItem('isDefaultProject');

            if (Entry.stateManager.canUndo() || isDefaultProject !== 'true') {
                var project = Entry.exportProject();
                project.name = myProject.name;
                project.path = myProject.isSavedPath;
                storage.setItem('localStorageProject', JSON.stringify(project));
            }

            Entry.plugin.reloadApplication(true);
        };

        $scope.setWorkspaceMode = function(type) {
            var isMiniMode = localStorage.getItem('isMiniMode') === 'true';

            if(isMiniMode && type === 'default')  {
                localStorage.setItem('isMiniMode', 'false');
                Entry.plugin.reloadApplication(true);
            } else if (!isMiniMode && type !== 'default') {
                localStorage.setItem('isMiniMode', 'true');
                Entry.plugin.reloadApplication(true);
            }
        };

        $scope.blockHelperOn = function() {
            Entry.helper.blockHelperOn();
        };

        var hwGuidePopup = null;
        $scope.startHWGuide = function(url, title, options) {
            Entry.plugin.getHardwareManual(function() {
                $("#saveArduinoCode").val('');
            });
        }

        $scope.showPopup = function(target) {
            var popup = $('#' + target);
            var body = $('body').eq(0);
            body.css('overflow', 'hidden');
            popup.css('display', 'block');
            popup.css('top', $(document).scrollTop() + 'px');
        };

        $scope.hidePopup = function(target) {
            var popup = $('#' + target);
            var body = $('body').eq(0);
            body.css('overflow', 'auto');
            popup.css('display', 'none');
        };

        //새 프로젝트
        $scope.newProject = function() {
            var canLoad = false;
            if (!Entry.stateManager.isSaved()) {
                canLoad = !confirm(Lang.Menus.save_dismiss);
            }

            if (!canLoad) {
                Entry.stateManager.addStamp();
                storage.removeItem('tempProject');
                Entry.plugin.beforeStatus = 'new';
                Entry.plugin.initProjectFolder(function() {
                    Entry.plugin.reloadApplication();
                });
            }
        }
    }
]);
