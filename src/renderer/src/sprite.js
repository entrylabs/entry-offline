'use strict';

angular.module('common').controller('SpriteController', [
    '$scope',
    '$modalInstance',
    '$routeParams',
    '$http',
    'parent',
    function($scope, $modalInstance, $routeParams, $http, parent) {
        $scope.systemSprites = [];
        $scope.uploadPictures = [];

        $scope.uploadSprite = {};

        $scope.fonts = Entry.fonts;

        $scope.fontData = {
            font: $scope.fonts[0],
            bold: false,
            underLine: false,
            italic: false,
            strike: false,
            colour: '#000000',
            background: '#ffffff',
            lineBreak: false,
        };

        $scope.foreground = false;
        $scope.background = false;

        $scope.fgColor = { 'background-color': '#000000' };
        $scope.bgColor = { 'background-color': '#ffffff' };

        $scope.linebreak = false;

        $scope.main_menu = 'entrybot_friends';
        $scope.menu = '';

        $scope.searchWord = '';
        $scope.language = localStorage.getItem('lang') || 'ko';

        $scope.colours = Entry.getColourCodes();
        $scope.currentIndex = 0;
        // 현재 선택한 탭
        $scope.currentTab = 'sprite'; //for modal(sprite,upload,paint,character,text,etc)

        $scope.selectedSprites = [];
        $scope.selectedPictures = [];
        $scope.selectedColour = '#000000';

        $scope.spriteData = {};
        $scope.systemSprites = [];

        var calcInnerHeight = function() {
            var height = $('.tab-right').height();
            var rowCount = parseInt(height / 148);
            $scope.showCount = (rowCount + 1) * 6;
        };

        $scope.init = function() {
            $routeParams.type = 'default';
            $routeParams.main = 'entrybot_friends';
            $scope.collapse(1);

            calcInnerHeight();

            $scope.findSprites(
                $routeParams.type,
                $routeParams.main,
                $routeParams.sub
            );
        };

        var makePictureData = function(items) {
            $scope.spriteData = {};
            items.forEach(function(item, index) {
                var category = '';
                if ('category' in item) {
                    category = item.category.main;
                } else {
                    category = 'default';
                }

                if (!Array.isArray($scope.spriteData[category])) {
                    $scope.spriteData[category] = [];
                }
                $scope.spriteData[category].push(item);
            });
            sessionStorage.setItem(
                'spriteData',
                JSON.stringify($scope.spriteData)
            );
        };

        var getPictureData = function(main, sub) {
            var datas = $scope.spriteData[main];
            var data = [];
            if (sub) {
                datas.forEach(function(item, index) {
                    if (item.category.sub === sub) {
                        data.push(item);
                    }
                });
            } else {
                data = datas;
            }

            return data;
        };

        var setSystemSprites = function(type, main, sub) {
            var data = getPictureData(main, sub);
            $scope.systemSprites = [];
            for (var i in data) {
                var picture = data[i];
                picture.selected = 'boxOuter';
                for (var j in $scope.selectedSprites) {
                    if ($scope.selectedSprites[j]._id === picture._id) {
                        picture.selected = 'boxOuter selected';
                        break;
                    }
                }

                $scope.systemSprites.push(picture);
            }
        };

        var sortPictureData = function(response) {
            response = response.sort(function(a, b) {
                if (!b.name || a.name > b.name) {
                    return 1;
                } else if (!a.name || a.name < b.name) {
                    return -1;
                } else {
                    return 0;
                }
            });
        };

        $scope.findSprites = function(type, main, sub) {
            calcInnerHeight();

            if (main) {
                $scope.main_menu = main;
                if (sub) {
                    $scope.menu = sub;
                } else {
                    $scope.menu = '';
                }
            }

            $('.wrap_sprite').scrollTop(0);

            if ($.isEmptyObject($scope.spriteData)) {
                var spriteData = sessionStorage.getItem('spriteData');
                spriteData = spriteData ? JSON.parse(spriteData) : {};
                if ($.isEmptyObject(spriteData)) {
                    const response = require('./resource_map/sprites.json');
                    sortPictureData(response);
                    makePictureData(response);
                    setSystemSprites(type, main, sub);
                } else {
                    $scope.spriteData = spriteData;
                    setSystemSprites(type, main, sub);
                }
            } else {
                setSystemSprites(type, main, sub);
            }
        };

        var filterSpriteData = function(keyword, cb) {
            var filtered_data = [];
            if ($scope.language === 'ko') {
                var categories = Object.keys($scope.spriteData);
                for (var i = 0, len = categories.length; i < len; i++) {
                    var current = categories[i];
                    var result = $scope.spriteData[current].filter(function(
                        item
                    ) {
                        return (
                            item.name && item.name.indexOf(keyword.name) > -1
                        );
                    });

                    if (result && result.length > 0) {
                        result.forEach(function(d) {
                            filtered_data.push(d);
                        });
                    }
                }
            } else {
                var keys = Object.keys(SpriteNames);
                var resultKeys = keys.filter(function(key) {
                    return (
                        SpriteNames[key]
                            .toLowerCase()
                            .indexOf(keyword.name.toLowerCase()) > -1
                    );
                });

                var categories = Object.keys($scope.spriteData);
                for (var i = 0, len = categories.length; i < len; i++) {
                    var current = categories[i];
                    var result = $scope.spriteData[current].filter(function(
                        item
                    ) {
                        for (var j = 0, l = resultKeys.length; j < l; j++) {
                            if (item.name == resultKeys[j]) return true;
                        }
                    });

                    if (result && result.length > 0) {
                        result.forEach(function(d) {
                            filtered_data.push(d);
                        });
                    }
                }
            }

            if ($.isFunction(cb)) {
                cb(filtered_data);
            }
        };

        $scope.search = function() {
            calcInnerHeight();

            $scope.searchWord = $('#searchWord').val();
            if (!$scope.searchWord || $scope.searchWord == '') {
                alert(Lang.Menus.searchword_required);
                return false;
            }

            filterSpriteData({ name: $scope.searchWord }, function(
                filtered_data
            ) {
                $scope.systemSprites = [];
                for (var i in filtered_data) {
                    var sprite = filtered_data[i];
                    sprite.selected = 'boxOuter';
                    for (var j in $scope.selectedSprites) {
                        if ($scope.selectedSprites[j]._id === sprite._id) {
                            sprite.selected = 'boxOuter selected';
                            break;
                        }
                    }
                    $scope.systemSprites.push(sprite);
                }
                $scope.collapse(0);
                $scope.main_menu = '';
            });
        };

        $scope.upload = function() {
            var uploadFile = document.getElementById('uploadFile').files;

            if (!uploadFile) {
                alert(Lang.Menus.file_required);
                return false;
            }

            if (uploadFile.length > 10) {
                alert(Lang.Menus.file_upload_max_count);
                return false;
            }

            const objectFile = [];
            const pictureFile = [];

            for (var i = 0, len = uploadFile.length; i < len; i++) {
                var file = uploadFile[i];

                var isImage = /^image\//.test(file.type);
                var isGif = /^image\/gif/.test(file.type);
                var isObject = /\.eo$/.test(file.name);
                if (!isObject && (!isImage || isGif)) {
                    entrylms.alert(
                        Lang.Workspace.upload_not_supported_file_msg
                    );
                    document.getElementById('uploadFile').value = '';
                    return false;
                }

                if (file.size > 1024 * 1024 * 10) {
                    alert(Lang.Menus.file_upload_max_size);
                    document.getElementById('uploadFile').value = '';
                    return false;
                }

                if (isObject) {
                    objectFile.push(file);
                } else {
                    pictureFile.push(file);
                }
            }

            $scope.$apply(function() {
                $scope.isUploading = true;
            });

            let pictureData = [];
            let objectData = null;
            for (let i = 0, len = pictureFile.length; i < len; i++) {
                const file = pictureFile[i] || {};
                const { path } = file;
                pictureData.push(path);
            }

            for (let i = 0, len = objectFile.length; i < len; i++) {
                const file = objectFile[i];
                if (!objectData) {
                    objectData = new FormData();
                }
                objectData.append('objects', file);
            }

            $scope.uploadPictureFile(pictureData, objectData);
        };

        $scope.uploadPictureFile = (pictureData, objectData) => {
            new Promise((resolve, reject)=> {

                const picturePromise = new Promise((resolve, reject) => {
                    try {
                        if (!pictureData.length) {
                            return resolve([]);
                        }
                        Entry.plugin.uploadTempImageFile(
                            pictureData,
                            (data) => {
                                resolve(data);
                            }
                        );
                    } catch (e) {
                        reject(e);
                    }
                });

                const objectPromise = new Promise(async (resolve, reject) => {
                    try {
                        if (!objectData) {
                            return resolve([]);
                        }
                        const objectArray = [];
                        objectData.forEach(function(file, index) {
                            objectArray.push(_.clone(file));
                        });
                        const result = await Entry.plugin.executeEvent(
                            'importObject',
                            objectArray
                        );
                        resolve(result);
                    } catch (e) {
                        reject(e);
                    }
                });

                Promise.all([picturePromise, objectPromise])
                    .then((result) => {
                        const [pictureData = [], objectData = []] = result;
                        $scope.$apply(() => {
                            try{
                                $scope.isUploading = false;
                                if (!$scope.uploadPictures) {
                                    $scope.uploadPictures = [];
                                }
    
                                pictureData.forEach((item) => {
                                    $scope.uploadPictures.push(item);
                                });

                                objectData.forEach(function(item) {
                                    const objects = item.objects;
                                    objects.forEach(function (object) {
                                        const { objectType } = object;
                                        if(objectType === 'textBox') {
                                            const { text, entity, name } = object;
                                            const { font } = entity;
                                            const fontIndex = _.findIndex($scope.fonts, ({ family }) => {
                                                return font.indexOf(family) > -1;
                                            });
                                            const bold = font.indexOf('bold') > -1;
                                            const italic = font.indexOf('italic') > -1;
                                            object.selectedPicture = {
                                                name,
                                                text,
                                                objectType,
                                                options: entity,
                                                _id: Entry.generateHash(),
                                                sprite: item,
                                                fileurl: './bower_components/entryjs/images/text_icon.png',
                                            }
                                        } else {
                                            object.selectedPicture.sprite = item;
                                        }
                                        $scope.uploadPictures.push(object.selectedPicture);
                                    });
                                });
    
                                document.getElementById('uploadFile').value = '';
                            } catch(e) {
                                reject(e);
                            }
                        });
                    })
                    .catch((e) => {
                        reject(e);
                    });
            }).catch((e)=> {
                $scope.$apply(function() {
                    $scope.isUploading = false;
                    document.getElementById('uploadFile').value = '';
                    alert(Lang.Msgs.error_occured);
                });
            });
        };

        $scope.collapse = function(dest) {
            for (var i = 1; i <= 12; i++) $scope['isCollapsed' + i] = true;

            if (dest > 0) {
                $scope['isCollapsed' + dest] = false;
                $('#searchWord').val('');
            }
        };

        $scope.changeLanguage = function(sprite) {
            if ($scope.language !== 'ko') {
                sprite.name = SpriteNames[sprite.name] || sprite.name;

                sprite.pictures.forEach(function(item) {
                    item.name = PictureNames[item.name] || item.name;
                });
                sprite.sounds.forEach(function(item) {
                    item.name = SoundNames[item.name] || item.name;
                });
            }
        };

        $scope.applySprite = function(sprite) {
            var cloneSprite = $.extend({}, sprite, true);
            $scope.selectedSprites = [];
            $scope.changeLanguage(cloneSprite);
            $scope.selectedSprites.push(cloneSprite);

            $modalInstance.close({
                target: $scope.currentTab,
                data: $scope.currentSelected(),
            });
        };

        // 선택
        $scope.selectSprite = function(sprite) {
            var selected = false;
            for (var i in $scope.selectedSprites) {
                var item = $scope.selectedSprites[i];
                if (item._id === sprite._id) {
                    $scope.selectedSprites.splice(i, 1);
                    selected = true;
                }
            }

            let _id;
            if ($.isPlainObject(sprite._id)) {
                _id = JSON.stringify(sprite._id);
            } else {
                _id = sprite._id;
            }

            if (selected) {
                var elements = jQuery('.boxOuter').each(function() {
                    var element = jQuery(this);
                    if (element.attr('id') === sprite._id) {
                        element.attr('class', 'boxOuter');
                    }
                });
                $scope.moveContainer('right');
            } else {
                var cloneSprite = $.extend({}, sprite, true);
                $scope.changeLanguage(cloneSprite);
                $scope.selectedSprites.push(cloneSprite);
                // $scope.selectedSprites.push(sprite);
                // 스프라이트 다중 선택.
                var elements = jQuery('.boxOuter').each(function() {
                    var element = jQuery(this);

                    if (element.attr('id') === _id) {
                        element.attr('class', 'boxOuter selected');
                    }
                });
                $scope.moveContainer('left');
            }
        };

        $scope.moveContainer = function(direction) {
            var sprites;

            if ($scope.currentTab === 'upload') {
                sprites = $scope.selectedPictures;
            } else {
                sprites = $scope.selectedSprites;
            }

            if (sprites.length <= 5 && direction === 'left') return;

            var mover = jQuery('.modal_selected_container_moving').eq(0);
            if (direction == 'left') {
                if ($scope.currentIndex + 2 > sprites.length) return;
                $scope.currentIndex++;
                mover.animate(
                    {
                        marginLeft: '-=106px',
                        duration: '0.2',
                    },
                    function() {}
                );
            } else {
                if ($scope.currentIndex - 1 < 0) return;
                $scope.currentIndex--;
                mover.animate(
                    {
                        marginLeft: '+=106px',
                        duration: '0.2',
                    },
                    function() {}
                );
            }
        };

        $scope.applyPicture = function(picture) {
            $scope.selectedPictures = [];
            $scope.selectedPictures.push(picture);

            $modalInstance.close({
                target: $scope.currentTab,
                data: $scope.currentSelected(),
            });
        };

        $scope.selectPicture = function(picture) {
            var selected = false;
            for (var i in $scope.selectedPictures) {
                var item = $scope.selectedPictures[i];
                if (item._id === picture._id) {
                    $scope.selectedPictures.splice(i, 1);
                    selected = true;
                }
            }

            if (selected) {
                var elements = jQuery('.boxOuter').each(function() {
                    var element = jQuery(this);
                    if (element.attr('id') === picture._id) {
                        element.attr('class', 'boxOuter');
                    }
                });
                $scope.moveContainer('right');
            } else {
                $scope.selectedPictures.push(picture);
                // 스프라이트 다중 선택.
                var elements = jQuery('.boxOuter').each(function() {
                    var element = jQuery(this);
                    if (element.attr('id') === picture._id) {
                        element.attr('class', 'boxOuter selected');
                    }
                });
                $scope.moveContainer('left');
            }
        };

        // 탭 이동
        $scope.changeTab = function(tab) {
            $scope.currentIndex = 0;
            var mover = jQuery('.modal_selected_container_moving').eq(0);
            mover.css('margin-left', 0);
            $scope.currentTab = tab;
        };

        $scope.tabs = [
            {
                title: 'Workspace.select_library',
                category: 'sprite',
                partial: './views/modal/sprite_library.html',
                active: true,
            },
            {
                title: 'Workspace.upload',
                category: 'upload',
                partial: './views/modal/sprite_upload.html',
            },
            {
                title: 'Workspace.draw_new',
                category: 'newSprite',
                partial: './views/modal/sprite_draw_new.html',
            },
            {
                title: 'Workspace.textbox',
                category: 'textBox',
                partial: './views/modal/sprite_text.html',
            },
        ];

        $scope.currentSelected = function() {
            if ($scope.currentTab === 'sprite') {
                return $scope.selectedSprites;
            } else if ($scope.currentTab === 'upload') {
                return $scope.selectedPictures;
            } else if ($scope.currentTab === 'textBox') {
                return '1';
            } else {
                return null;
            }
        };

        $scope.showChoosen = function() {
            var currentTab = $scope.currentTab;
            var banList = ['textBox', 'newSprite'];
            if (banList.indexOf(currentTab) > -1) return false;
            else return true;
        };

        $scope.changeTextColour = function(colour) {
            $scope.fontData.colour = colour;
            $scope.fgColor = { 'background-color': colour };
            $scope.foreground = false;
        };

        $scope.changeBackgroundColour = function(colour) {
            $scope.fontData.background = colour;
            $scope.bgColor = { 'background-color': colour };
            $scope.background = false;
        };

        $scope.changeTextFont = function(font) {
            $scope.fontData.font = font;
        };

        $scope.toggleFontOption = function(name) {
            $scope.fontData[name] = !$scope.fontData[name];
        };

        $scope.setFontOption = function(name, value) {
            $scope.fontData[name] = value;
        };

        $scope.getFontOption = function(name) {
            return (
                './images/text_button_' +
                name +
                '_' +
                $scope.fontData[name] +
                '.png'
            );
        };

        $scope.getBackgroundColor = function(name) {
            return (
                './images/text_button_background_' + $scope.background + '.png'
            );
        };

        $scope.toggleColorChooser = function(name) {
            if (name === 'foreground') {
                $scope.foreground = !$scope.foreground;
                if ($scope.foreground) $scope.background = false;
            } else if (name === 'background') {
                $scope.background = !$scope.background;
                if ($scope.background) $scope.foreground = false;
            }
        };

        $scope.setLinebreak = function(linebreak) {
            if ($scope.linebreak == linebreak) return;

            $scope.linebreak = linebreak;
            $scope.fontData.lineBreak = linebreak;

            if (linebreak) {
                var text = $('.modal_textBox')
                    .eq(0)
                    .val();
                $('.modal_textBox')
                    .eq(1)
                    .val(text);
            } else {
                text = $('.modal_textBox')
                    .eq(1)
                    .val();
                $('.modal_textBox')
                    .eq(0)
                    .val(text);
            }
        };

        // 적용
        $scope.ok = () => {
            if (!$scope.currentSelected()) {
                alert(Lang.Workspace.select_sprite);
            } else {
                if ($scope.currentSelected() === '1') {
                    removeUploadPictures();
                    var value = jQuery('.modal_textBox')
                        .eq(0)
                        .val();
                    if ($scope.linebreak)
                        value = jQuery('.modal_textBox')
                            .eq(1)
                            .val();
                    $modalInstance.close({
                        target: $scope.currentTab,
                        data: value,
                        options: $scope.fontData,
                    });
                } else {
                    removeUploadPictures($scope.currentSelected());
                    $modalInstance.close({
                        target: $scope.currentTab,
                        data: $scope.currentSelected(),
                    });
                }
            }
        };

        // 취소
        $scope.cancel = () => {
            removeUploadPictures();
            $modalInstance.dismiss('cancel');
        };

        function removeUploadPictures(passItems = []) {
            const passKeys = passItems.map((item) => {
                return item.filename || '';
            });

            const removePictures = $scope.uploadPictures.filter((item) => {
                return passKeys.indexOf(item.filename) === -1;
            });

            removePictures.forEach(function(item) {
                Util.removeFileByUrl(item.fileurl);
            });

            Util.clearTempDir();
        }

        // 새로 그리기
        $scope.addNewSprite = function() {
            $modalInstance.close({
                target: 'newSprite',
            });
        };

        $scope.loadMore = function() {
            if ($scope.showCount < $scope.systemSprites.length) {
                $scope.showCount += 6; // append next one line
            }
        };
    },
]);
