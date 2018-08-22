
angular.module('common').controller('ExpansionBlockController', ['$scope', '$uibModalInstance', '$routeParams', '$http', 'parent',
                        function ($scope, $uibModalInstance, $routeParams, $http, parent) {
    $scope.parent = parent;

    $scope.systemBlocks = [];
    $scope.selectedSystem = [];
    $scope.selectedBlock = { description : "" };

    $scope.main_menu = "test";
    $scope.menu = "";
    $scope.cursor = 0;

    $scope.initList = function() {
        var expansionBlocks = _.uniq(_.values(Entry.EXPANSION_BLOCK_LIST));
        expansionBlocks = _.sortBy(expansionBlocks, function (item) {
            var result = '';
            if(item.title) {
                item.nameByLang = item.title[Lang.type];
                result = item.title.ko.toLowerCase();
            }
            return result;
        });

        $scope.systemBlocks = expansionBlocks;
    }

    $scope.init = function() {
        $routeParams.type = 'default';
        $routeParams.main = 'test';
        $scope.collapse(1);
        $scope.initList();

    };

    // 현재 선택한 탭
    $scope.currentTab = 'system'; //for modal(sprite,upload,paint,character,text,etc)

    $scope.selectedUpload = [];
    $scope.currentIndex = 0;

    $scope.applySystem = function(block) {
        $scope.selectedSystem = [];
        $scope.selectedSystem.push(block);
        $scope.selectedBlock = block;

        $uibModalInstance.close({
            target: $scope.currentTab,
            data: $scope.currentSelected()
        });
    };

    function _selectedMapFunc(datum) {
        var ret = _.findWhere($scope.selectedSystem || [], {
            _id: datum.name,
        });
        if (ret) {
            datum.selected = 'boxOuter selected';
        } else {
            datum.selected = 'boxOuter';
        }
        return datum;
    }

    // 선택
    $scope.selectSystem = function(block) {
        var blockId = block.name;
        var idx = _.findIndex($scope.selectedSystem, function(item) {
            return blockId === item.name;
        });

        var selector = '#'+ blockId + '.boxOuter';

        if (~idx) {
            $scope.selectedSystem.splice(idx, 1);
            jQuery(selector).attr('class', 'boxOuter');
            $scope.moveContainer('right');
        } else {
            $scope.selectedSystem.push(block);
            $scope.selectedBlock = block;
            // 스프라이트 다중 선택.
            jQuery(selector).attr('class', 'boxOuter selected');
            $scope.moveContainer('left');
        }
    };

    $scope.moveContainer = function (direction) {
        var mover = jQuery('.modal_selected_container_moving').eq(0);
        var blocks = $scope.selectedSystem;

        if (direction == 'left' && (blocks.length-1 < 5 || $scope.cursor == blocks.length-1)) return;
        if (direction == 'right' && ($scope.cursor == 0 || blocks.length < 5 && $scope.cursor > blocks.length)) return;

        var marginL = parseInt(mover.css("margin-left"));
        if (direction == 'left') {
            mover.css("margin-left", (marginL - 106) + 'px');
            $scope.cursor = $scope.cursor + 1;
        } else {
            mover.css("margin-left", (marginL + 106) + 'px');
            $scope.cursor = $scope.cursor - 1;
        }
    }

    $scope.currentSelected = function() {
        if ($scope.currentTab === 'system') {
            return $scope.selectedSystem;
        } else if ($scope.currentTab === 'upload') {
            return $scope.selectedUpload;
        } else if ($scope.currentTab === 'textBox') {
            return 'textBox';
        } else {
            return null;
        }
    };

    $scope.addExpansionBlock = function() {
        $uibModalInstance.close({
            target: 'new'
        });
    };

    $scope.collapse = function(dest) {
        for (var i=1; i<10; i++)
            $scope['isCollapsed' + i] = true;

        if (dest > 0) {
            $scope['isCollapsed' + dest] = false;
            $('#searchWord').val('');
        }
    };

    // 적용
    $scope.ok = function () {
        if (!$scope.currentSelected()) {
            entrylms.alert(Lang.Workspace.select_sprite);
        } else {
            $uibModalInstance.close({
                target: $scope.currentTab,
                data: $scope.currentSelected()
            });
        }
    };

    // 취소
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.dict = {
        'WORKSPACE_LOAD_EXPANSION_BLOCK': Lang.Workspace.load_exapnsion_block,
        'WORKSPACE_SELECT_EXPANSION_BLOCK': Lang.Workspace.select_expansion_block,
        'BUTTONS_APPLY': Lang.Buttons.apply,
        'BUTTONS_CANCEL': Lang.Buttons.cancel,
        'WEATHER_DESC': Lang.Msgs.expansion_weather_description
    }
}]);