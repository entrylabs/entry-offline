'use strict';

angular.module('common').directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown", function(event) {
            if(event.which === 13) {
                scope.$eval(attrs.ngEnter, {'event': event});
            }
            else {
                if (attrs.ngAutocomplete) {
                    scope.$eval(attrs.ngAutocomplete, {'event': event});
                }
            }
        });
    };
});

angular.module('common').directive('onLastRepeatForDiscuss', function() {
    return {
        restrict: 'A',
        link : function(scope, element, attrs) {
            if ( scope.$last ) {
                setTimeout(function() {
                    scope.$emit('onLastRepeatForDiscuss');
                }, 1);
            }
        }
    }
});

angular.module('common').directive('context', [function() {
    return {
        restrict    : 'A',
        scope       : '@&',
        compile: function compile(tElement, tAttrs, transclude) {
            return {
                post: function postLink(scope, iElement, iAttrs, controller) {
                    var ul = $('#' + iAttrs.context),
                        last = null;

                    ul.css({ 'display' : 'none'});

                    $(iElement).bind('contextmenu', function(event) {
//                        console.log('scope.state='+scope.state);
                        if (scope.state != 'stop') {
                            if (iAttrs.context === 'objectContext') {
                                alert('실행중에는 오브젝트를 수정할 수 없습니다.');
                            } else if (iAttrs.context === 'pictureContext') {
                                alert('실행중에는 모양을 수정할 수 없습니다.');
                            } else if (iAttrs.context === 'soundContext') {
                                alert('실행중에는 소리를 수정할 수 없습니다.');
                            }
                            event.preventDefault();
                            return false;
                        }

                        var target = $(event.target).closest('li');
                        if (iAttrs.context === 'objectContext') {
                            scope.$apply(function() {
                                scope.setSelectedById(target.attr('id'));
                            });
                        } else if (iAttrs.context === 'pictureContext') {
                            scope.$apply(function() {
                                scope.setPictureSelected(target.attr('id'));
                            });
                        } else if (iAttrs.context === 'soundContext') {
                            scope.$apply(function() {
                                scope.setSoundSelected(target.attr('id'));
                            });
                        }

                        event.preventDefault();
                        ul.css({
                            position: "fixed",
                            display: "block",
                            left: event.clientX + 'px',
                            top:  (event.clientY-100) + 'px'
                        });
                        last = event.timeStamp;
                    });

                    $(document).click(function(event) {
                        var target = $(event.target);
                        if(!target.is(".popover") && !target.parents().is(".popover")) {
                            if(last === event.timeStamp)
                                return;
                            ul.css({
                                'display' : 'none'
                            });
                        }
                    });

                    $(document).bind('contextmenu', function(event) {
                        var target = $(event.target);
                        if(!target.is(".popover") && !target.parents().is(".popover")) {
                            if(last === event.timeStamp)
                                return;
                            ul.css({
                                'display' : 'none'
                            });
                        }
                    });
                }
            };
        }
    };
}]);


angular.module('common').constant('keyCodes', {
        esc: 27,
        space: 32,
        enter: 13,
        tab: 9,
        backspace: 8,
        shift: 16,
        ctrl: 17,
        alt: 18,
        capslock: 20,
        numlock: 144
    })
    .directive('keyBind', ['keyCodes', function (keyCodes) {
        function map(obj) {
            var mapped = {};
            for (var key in obj) {
                var action = obj[key];
                if (keyCodes.hasOwnProperty(key)) {
                    mapped[keyCodes[key]] = action;
                }
            }
            return mapped;
        }

        return function (scope, element, attrs) {
            var bindings = map(scope.$eval(attrs.keyBind));
            element.bind("keydown keypress", function (event) {
                if (bindings.hasOwnProperty(event.which)) {
                    scope.$apply(function() {
                        scope.$eval(bindings[event.which]);
                    });
                }
            });
        };
    }]);

angular.module('common').directive('treeModel', ['$compile', function($compile) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var treeId = attrs.treeId;
            var treeModel = attrs.treeModel;
            var nodeId = attrs.nodeId || 'id';
            var nodeLabel = attrs.nodeLabel || 'label';
            var nodeChildren = attrs.nodeChildren || 'children';

            var template =
                '<ul>' +
                    '<li data-ng-repeat="node in ' + treeModel + '">' +
                        '<i class="collapsed" data-ng-show="node.' + nodeChildren + '.length && node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                        '<i class="expanded" data-ng-show="node.' + nodeChildren + '.length && !node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                        '<i class="normal" data-ng-hide="node.' + nodeChildren + '.length"></i> ' +
                        '<span data-ng-class="node.selected" data-ng-click="' + treeId + '.selectNodeLabel(node)">{{node.' + nodeLabel + '}}</span>' +
                        '<div data-ng-hide="node.collapsed" data-tree-id="' + treeId + '" data-tree-model="node.' + nodeChildren + '" data-node-id=' + nodeId + ' data-node-label=' + nodeLabel + ' data-node-children=' + nodeChildren + '></div>' +
                    '</li>' +
                '</ul>';

            if (treeId && treeModel) {
                if (attrs.angularTreeview) {
                    scope[treeId] = scope[treeId] || {};
                    scope[treeId].selectNodeHead = scope[treeId].selectNodeHead || function(selectedNode) {
                        selectedNode.collapsed = !selectedNode.collapsed;
                    };

                    scope[treeId].selectNodeLabel = scope[treeId].selectNodeLabel || function(selectedNode) {
                        if (scope[treeId].currentNode && scope[treeId].currentNode.selected) {
                            scope[treeId].currentNode.selected = undefined;
                        }

                        selectedNode.selected = 'selected';
                        scope[treeId].currentNode = selectedNode;
                    };

                }

                element.html('').append($compile(template)(scope));
            }
        }
    };
}]);

angular.module('common').directive('projectBox', ['$http','$cookies', function ($http,$cookies) {       
    return {
        restrict: 'AE',
        scope : {
            project: '=project',
            user: '=user',
        },
        replace: true,
        templateUrl: '/views/arts/project_box.html',
        link: function (scope, elem, attrs) {
            scope.isLang = function(lang) {
                if ($cookies.get("lang") == lang)
                    return true;

                return false;
            };
            scope.projectDetail = function(project) {

                window.location.href = '/'+project.user.username+'/'+project._id;
            };
            scope.toggleProjectOpen = function() {
                scope.project.isopen = !scope.project.isopen;
                $http.put('/api/project/'+scope.project._id, {
                    isopen: scope.project.isopen,
                }).then(function(data) {
                    //nothing
                }, function(err) {
                    alert(Lang.Msgs.error_occured);
                });
            };

            var element = elem.children().eq(0);
            element.bind('mouseenter', function () {
                element.addClass('enter');
            });
            element.bind('mouseleave', function () {
                element.removeClass('enter');
                element.addClass('leave');
                element.bind('oanimationend animationend webkitAnimationEnd', function() {
                    element.removeClass('leave');
                });
            });
        }
    }
}]);

angular.module('common').directive('projectBoxIndex', ['$http', function ($http) {
    return {
        restrict: 'AE',
        scope : {
            project: '=project',
            tags: '@tags'
        },
        replace: true,
        templateUrl: '/views/index/project_box_index.html',
        link: function (scope, elem, attrs) {
            var tags = scope.tags;
            var badgeContainer = elem.find('.projectBadgeContainer');
            var baseUrl = '/img/assets/index/';
            if (tags) {
                if (tags.indexOf('best') > -1) {
                    var badge = $('<img src='+baseUrl+'main_staffpick.png>');
                    badgeContainer.append(badge);
                }

            }
            scope.projectDetail = function(project) {
                window.location.href = '/'+project.user.username+'/'+project._id;
            };
            scope.toggleProjectOpen = function() {
                scope.project.isopen = !scope.project.isopen;
                $http.put('/api/project/'+scope.project._id, {
                    isopen: scope.project.isopen,
                }).then(function(data) {
                    //nothing
                }, function(err) {
                    alert(Lang.Msgs.error_occured);
                });
            };
            var element = elem.children().eq(0);
            element.bind('mouseenter', function () {
                element.addClass('enter');
            });
            element.bind('mouseleave', function () {
                element.removeClass('enter');
                element.addClass('leave');
                element.bind('oanimationend animationend webkitAnimationEnd', function() {
                    element.removeClass('leave');
                });
            });
        }
    }
}]);

angular.module('common').directive('whenScrolled', function() {
    return function(scope, elm, attr) {
        var raw = elm[0];

        angular.element(raw).bind('scroll load', function(evt) {
            var rectObject = raw.getBoundingClientRect();
            scope.$apply(attr.whenScrolled);
        });
    }
});