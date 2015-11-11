'use strict';

angular.module('workspace').controller('HeaderController',
        ['$scope', '$cookies',
        function ($scope, $cookies) {
	var Global = {};
    $scope.global = Global;

    var supported = !(typeof storage == 'undefined' || typeof window.JSON == 'undefined');
    var storage = (typeof window.localStorage === 'undefined') ? undefined : window.localStorage;

    $scope.init = function() {
        $('.dropdown-menu').find('form').click(function (e) {
            e.stopPropagation();
        });

        if (!$scope.global.user)
            $scope.global.user = {};
       // $scope.global.user.language = $cookies.get("lang");

        if (!$scope.global.user.language)
            $scope.global.user.language = 'ko';

        $(".page-header").find('a').on("touchstart", function(event) {
            var dropdown = $(this).attr("class");
            if (dropdown.indexOf("dropdown-toggle") > -1) {
                var display = $(this).next('ul.dropdown-menu').css("display");
                if (display != 'none')
                    $(this).next('ul.dropdown-menu').css("display", "none");
                else
                    $(this).next('ul.dropdown-menu').css("display", "block");
            } else {
                var href = $(this).attr("href");
                if (href && href != '')
                    window.location.href = $(this).attr("href");
            }

            e.stopPropagation();
        });

    };

    $scope.saveWorkspace = function() {
        Entry.dispatchEvent('saveWorkspace');
    };

    $scope.saveAsWorkspace = function() {
        Entry.dispatchEvent('saveAsWorkspace')
    };

    $scope.stopPropagation = function (e) {
        e.stopPropagation();
    }

    $scope.project = {};

    $scope.loadWorkspace = function() {
        var modalInstance = $modal.open({
            templateUrl: '../views/workspace/modal/load.html',
            controller: WorkspaceLoadCtrl,
            backdrop: false,
            keyboard: false
        });
        modalInstance.result.then(function (project) {


        });

    };

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
        var url = $location.absUrl();
        var idx = url.lastIndexOf('/');
        var len = url.length;

        var reloadUrl = '/ws?lang='+language+'#!/';
        var projectId = null;
        if (len > idx+1) {
            projectId = url.substring(idx+1, len);
            reloadUrl += projectId;
        }

        storage.setItem("lang", language);
        Entry.dispatchEvent('saveLocalStorageProject');

        window.location.href = reloadUrl;
    };

    $scope.blockHelperOn = function(){
        Entry.helper.blockHelperOn();
    };

    $scope.showLogin = function (target) {
        $.event.trigger({
            type: 'showLogin'
        });
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

    $scope.sendBug = function () {
        var $content = $('#bugContent');
        var $email = $('#bugEmail');
        var email = $email.val().trim();
        var content = $content.val().trim();
        if (!content || content.length==0) {
            alert('내용을 입력해주세요.');
            $content.val('');
            $content.focus();
            return;
        }


        var project = new Projects({});
        project.name = document.getElementById('project_name').value;
        //project.thumbnail = document.getElementById('entryCanvas').toDataURL('image/jpeg', 0.1);
        project.objects = Entry.container.toJSON();
        project.scenes = Entry.scene.toJSON();
        project.variables = Entry.variableContainer.getVariableJSON();
        project.messages = Entry.variableContainer.getMessageJSON();
        project.functions = Entry.variableContainer.getFunctionJSON();
        project.scenes = Entry.scene.toJSON();
        project.speed = Entry.FPS;


        $http.post('/api/feedbackProject', project).
            success(function(project) {
                var feedbackProjectId = project._id;
                $http.post('/api/project/thumbnail/'+project._id, {
                    "thumbnail": document.getElementById('entryCanvas').toDataURL('image/jpeg', 0.1)
                }).success(function() {
                    $http.post('/api/feedback', {
                        title: 'workspace bug',
                        content: content,
                        email:email,
                        category: 'workspace',
                        project:{
                            _id: feedbackProjectId,
                            username: 'entry'
                        }}).
                        success(function(result, status) {
                            $content.val('');
                            $email.val('');
                            alert('소중한 의견 감사합니다.');
                            $scope.hidePopup('bugReport');
                        }).
                        error(function(result, status) {
                            alert('에러가 발생했습니다.');
                        });
                });
        }).error(function(result, status){
            console.log(result);
            console.log(status);
        });
    };

    $scope.showSignUp = function () {
        $.event.trigger({
            type: 'showSignUp'
        });
    };

    $scope.goPath = function(path) {
        $window.location.href= '/' + path;
    };
}]);
