'use strict';

angular.module('workspace').controller('HeaderController',
    ['$scope', '$rootScope', '$cookies', 'myProject',
    function ($scope, $rootScope, $cookies, myProject) {
        $scope.user_language = localStorage.getItem('lang') || 'ko';
        $scope.project = myProject;
        var supported = !(typeof storage == 'undefined' || typeof window.JSON == 'undefined');
        var storage = (typeof window.localStorage === 'undefined') ? undefined : window.localStorage;

        // $scope.init = function() {
        //     $('.dropdown-menu').find('form').click(function (e) {
        //         e.stopPropagation();
        //     });

        //     if (!$scope.global.user)
        //         $scope.global.user = {};
        //    // $scope.global.user.language = $cookies.get("lang");

        //     if (!$scope.global.user.language)
        //         $scope.global.user.language = 'ko';

        //     $(".page-header").find('a').on("touchstart", function(event) {
        //         var dropdown = $(this).attr("class");
        //         if (dropdown.indexOf("dropdown-toggle") > -1) {
        //             var display = $(this).next('ul.dropdown-menu').css("display");
        //             if (display != 'none')
        //                 $(this).next('ul.dropdown-menu').css("display", "none");
        //             else
        //                 $(this).next('ul.dropdown-menu').css("display", "block");
        //         } else {
        //             var href = $(this).attr("href");
        //             if (href && href != '')
        //                 window.location.href = $(this).attr("href");
        //         }

        //         e.stopPropagation();
        //     });

        // };

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
            storage.setItem("lang", language);
            location.reload(true);
        };

        $scope.blockHelperOn = function(){
            Entry.helper.blockHelperOn();
        };

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
            Entry.plugin.initProjectFolder(function () {
                location.reload(true);
            });
        }

        // 프로젝트 불러오기
        $scope.loadProject = function (data) {
            storage.setItem('nativeLoadProject', data);
            location.reload(true);
        }
    }]);
