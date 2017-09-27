'use strict';

angular.module('workspace').controller('HeaderController', ['$scope', '$rootScope', '$cookies', 'myProject',
    function($scope, $rootScope, $cookies, myProject) {
        window.isNewProject = false;
        $scope.user_language = localStorage.getItem('lang') || 'ko';
        $scope.project = myProject;
        var supported = !(typeof storage == 'undefined' || typeof window.JSON == 'undefined');
        var storage = (typeof window.localStorage === 'undefined') ? undefined : window.localStorage;

        $scope.myProject = myProject;

        Entry.Vim.MAZE_MODE = 1;
        Entry.Vim.WORKSPACE_MODE = 2;

        Entry.Workspace.MODE_BOARD = 0;
        Entry.Workspace.MODE_VIMBOARD = 1;
        Entry.Workspace.MODE_OVERLAYBOARD = 2;

        Entry.Vim.TEXT_TYPE_JS = 0;
        Entry.Vim.TEXT_TYPE_PY = 1;
        var applied = false;

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
            // location.reload(true);
            Entry.plugin.reloadApplication(true);
        };

        $scope.blockHelperOn = function() {
            Entry.helper.blockHelperOn();
        };

        $scope.getHardwareManual = function() {
            Entry.plugin.getHardwareManual();
        }

        $scope.getPythonManual = function() {
            Entry.plugin.getPythonManual();
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

        function getWorkspaceBusy() {
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

        //새 프로젝트
        $scope.newProject = function() {
            if(getWorkspaceBusy()) {
                return;
            }
            var canLoad = false;
            if (!Entry.stateManager.isSaved()) {
                canLoad = !confirm(Lang.Menus.save_dismiss);
            }

            if (!canLoad) {
                window.isNewProject = true;
                Entry.stateManager.addStamp();
                storage.removeItem('tempProject');
                Entry.plugin.beforeStatus = 'new';
                Entry.plugin.initProjectFolder(function() {
                    Entry.plugin.reloadApplication();
                });
            }
        }

        $scope.setMode = function(mode) {
            if (myProject.programmingMode === mode) return;
            applied = true;
            if (mode === 1) {
                var isShown = localStorage.getItem('python_manual');
                if (!isShown) {
                    $scope.showPythonTooltip();
                    localStorage.setItem('python_manual', true);
                }
            }
            $scope._setMode(mode);
            applied = false;
        };
        
        $scope._setMode = function(mode) {
            var pMode = mode;
            var mode = {};

            if (pMode == 0) {
                mode.boardType = Entry.Workspace.MODE_BOARD;
                mode.textType = -1;
            } else if (pMode == 1) { // Python in Text Coding
                mode.boardType = Entry.Workspace.MODE_VIMBOARD;
                mode.textType = Entry.Vim.TEXT_TYPE_PY;
                mode.runType = Entry.Vim.WORKSPACE_MODE;
            } else if (pMode == 2) { // Javascript in Text Coding
                mode.boardType = Entry.Workspace.MODE_VIMBOARD;
                mode.textType = Entry.Vim.TEXT_TYPE_JS;
                mode.runType = Entry.Vim.MAZE_MODE;
            }

            if (Entry.getMainWS()) {
                Entry.getMainWS().setMode(mode);
            }
        };

        $scope.showPythonTooltip = function() {
            new Entry.Tooltip([
                { content: Lang.Workspace.textcoding_tooltip1, target: $(".workspaceModeSelector"), direction: "left", style: "offline" }, 
                { content: Lang.Workspace.textcoding_tooltip2, target: $(".propertyTabconsole"), direction: "right" }, 
                { content: Lang.Workspace.textcoding_tooltip3, target: $("#helpBtn"), direction: "down" }
            ], { dimmed: true });
        };

        $scope.dict = {
            'KO': Lang.ko,
            'EN': Lang.en,
            'VN': Lang.vn,
            'CODE': Lang.code,
            'MENUS_LOGIN': Lang.Menus.login,
            'MENUS_JOIN': Lang.Menus.Join,
            'USERS_PROJECT_LIST': Lang.Users.project_list,
            'USERS_EDIT_PERSONAL': Lang.Users.edit_personal,
            'MENUS_LOGOUT': Lang.Menus.logout,
            'WORKSPACE_FILE_NEW': Lang.Workspace.file_new,
            'WORKSPACE_FILE_OPEN': Lang.Workspace.file_open,
            'WORKSPACE_FILE_UPLOAD': Lang.Workspace.file_upload,
            'WORKSPACE_FILE_SAVE': Lang.Workspace.file_save,
            'WORKSPACE_FILE_SAVE_AS': Lang.Workspace.file_save_as,
            'WORKSPACE_FILE_SAVE_DOWNLOAD': Lang.Workspace.file_save_download,
            'WORKSPACE_BLOCK_HELPER': Lang.Workspace.block_helper,
            'WORKSPACE_HARDWARE_GUIDE': Lang.Workspace.hardware_guide,
            'WORKSPACE_PYTHON_GUIDE': Lang.Workspace.python_guide,
            'WORKSPACE_BLOCK_CODING': Lang.Menus.block_coding,
            'WORKSPACE_PYTHON_CODING': Lang.Menus.python_coding,
        }
    }
]);
