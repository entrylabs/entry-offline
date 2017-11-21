'use strict';

angular.module('workspace').controller('HeaderController', ['$scope', '$rootScope', '$cookies', 'myProject',
    function($scope, $rootScope, $cookies, myProject) {
        $scope.user_language = localStorage.getItem('lang') || 'ko';
        $scope.PracticalModeName = '';
        $scope.PracticalMode = '';
        $scope.myProject = myProject;
        
        var supported = !(typeof storage == 'undefined' || typeof window.JSON == 'undefined');
        var storage = (typeof window.localStorage === 'undefined') ? undefined : window.localStorage;
        var applied = false;
        
        Entry.Vim.MAZE_MODE = 1;
        Entry.Vim.WORKSPACE_MODE = 2;
        Entry.Workspace.MODE_BOARD = 0;
        Entry.Workspace.MODE_VIMBOARD = 1;
        Entry.Workspace.MODE_OVERLAYBOARD = 2;
        Entry.Vim.TEXT_TYPE_JS = 0;
        Entry.Vim.TEXT_TYPE_PY = 1;        

        //#region rootScope
        $rootScope.$on('loadProject', function(event, data) {
            $scope.loadProject(data);
        })

        $rootScope.$on('modeChange', function (event, data) {
            $scope.PracticalModeName = data.modeName;
            $scope.PracticalMode = data.mode;
        })
        //#endregion

        //#region scope영역
        $scope.init = function() {
            $scope.PracticalModeName = myProject.modeName;
            $scope.PracticalMode = myProject.mode;
            $scope.isPracticalCourse = EntryStatic.isPracticalCourse;
        }

        // 저장
        $scope.saveWorkspace = function() {
            Entry.dispatchEvent('saveWorkspace');
        }

        // 새이름으로 저장
        $scope.saveAsWorkspace = function() {
            Entry.dispatchEvent('saveAsWorkspace')
        }

        // 불러오기
        $scope.loadWorkspace = function() {
            Entry.dispatchEvent('loadWorkspace')
        }

        $scope.showBlockHelper = function() {
            Entry.dispatchEvent('showBlockHelper');
        }

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
        }

        $scope.setWorkspaceMode = function (type) {
            var isPracticalCourse = localStorage.getItem('isPracticalCourse') === 'true';
            saveLocalStorageProject();
            if (isPracticalCourse && type === 'default') {
                localStorage.setItem('isPracticalCourse', false);
                Entry.plugin.reloadApplication(true);
            } else if (!isPracticalCourse && type !== 'default') {
                localStorage.setItem('isPracticalCourse', true);
                Entry.plugin.reloadApplication(true);
            }
        }

        $scope.blockHelperOn = function() {
            Entry.helper.blockHelperOn();
        }

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
        }

        $scope.hidePopup = function(target) {
            var popup = $('#' + target);
            var body = $('body').eq(0);
            body.css('overflow', 'auto');
            popup.css('display', 'none');
        }

        //새 프로젝트
        $scope.newProject = function () {
            if (getWorkspaceBusy()) {
                return;
            }
            var canLoad = false;
            if (myProject.checkSavedProject()) {
                canLoad = !confirm(Lang.Menus.save_dismiss);
            }

            if (!canLoad) {
                myProject.isModeChange = false;
                Entry.stateManager.addStamp();
                storage.removeItem('tempProject');
                Entry.plugin.beforeStatus = 'new';
                Entry.plugin.initProjectFolder(function () {
                    Entry.plugin.reloadApplication();
                });
            }
        }

        $scope.setMode = function (mode) {
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

        $scope._setMode = function (mode) {
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

        $scope.showPythonTooltip = function () {
            new Entry.Tooltip([
                { content: Lang.Workspace.textcoding_tooltip1, target: $(".workspaceModeSelector"), direction: "left", style: "offline" },
                { content: Lang.Workspace.textcoding_tooltip2, target: $(".propertyTabconsole"), direction: "right" },
                { content: Lang.Workspace.textcoding_tooltip3, target: $("#helpBtn"), direction: "down" }
            ], { dimmed: true });
        };

        //#endregion

        //#region function 영역
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

        function saveLocalStorageProject() {
            var engine = Entry.engine;
            if (engine && engine.isState('run')) {
                return;
            }

            var project = {};
            var ret = Entry.exportProject(project);
            if (!ret) {
                return;
            }
            project.name = $scope.myProject.name;
            var scopeProject = $scope.myProject;
            project.parent = scopeProject && scopeProject.parent;
            project._id = scopeProject && scopeProject._id;
            project.path = $scope.myProject.isSavedPath;
            storage.setItem('localStorageProject', JSON.stringify(project));
        }
        //#endregion
    }
]);
