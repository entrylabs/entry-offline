'use strict';

var common = angular.module('common');


common.filter('makeThumbnail', () => {
    return (picture) => {
        if (picture) {
            if(picture.fileurl) {
                picture.fileurl = picture.fileurl.replace(/\\/gi, '/');
                picture.fileurl = picture.fileurl.replace(/%5C/gi, '/');
                let returnValue = decodeURI(picture.fileurl);
                var lastIdx = returnValue.lastIndexOf('/image/');
                if(lastIdx > -1) {
                    let temp = returnValue.substr(lastIdx).replace('/image/', '/thumb/');
                    returnValue = returnValue.substr(0, lastIdx) + temp;
                }
                return returnValue;
            } else {
                const {extension = '.png', filename} = picture;
                return path.join('node_modules', 'uploads', filename.substring(0,2), filename.substring(2,4), 'thumb', filename + extension);
            }
        }
        else {
            return './images/text_icon.png';
        }
    };
});

common.filter('makeUploadThumbnail', () => {
    return (picture) => {
        if (picture) {
            const { extension = '.png', filename, fileurl } = picture;
            if (fileurl) {
                return fileurl;
            }
            let temp;
            temp = _real_temp_path.replace(/\\/gi, '/');
            temp = temp.replace(/%5C/gi, '/');

            return path.join(
                temp,
                'temp',
                filename.substring(0, 2),
                filename.substring(2, 4),
                'thumb',
                filename + extension
            );
        } else {
            return './images/text_icon.png';
        }
    };
});

common.filter('text', function() {
    return function(input) {
        var array = input.split('.');
        if (array.length > 1) {
            var middle = array[0];
            var key = array[1];
            if (middle == 'Blocks')
                return Lang.Blocks[key];
            else if (middle == 'Menus')
                return Lang.Menus[key];
            else if (middle == 'Users')
                return Lang.Users[key];
            else if (middle == 'Msgs')
                return Lang.Msgs[key];
            else if (middle == 'Buttons')
                return Lang.Buttons[key];
            else if (middle == 'Workspace')
                return Lang.Workspace[key];
            else if (middle == 'Category')
                return Lang.Category[key];
            else
                return "unknown";
        } else {
            return Lang[input];
        }
    }
});

common.filter('nameTranslate', function() {
    return function(str, type) {
        var dict = SpriteNames;
        if (type == 'picture')
            dict = PictureNames;
        else if (type == 'sound')
            dict = SoundNames;

        var lang = localStorage.getItem('lang') || 'ko';
        if (window.lang)
            lang = window.lang;

        if (window.user && window.user.language)
            lang = window.user.language;

        if (!dict || lang == 'ko' || lang == 'code') {
            return str;
        } else {
            return dict[str] ? dict[str] : str;
        }
    }
});

common.filter('unsafe', ['$sce', function($sce) {
    return function(str) {
        if (!str)
            return '';
        return $sce.trustAsHtml(str.replace(new RegExp('\r?\n','g'), '<br/>'));
    }
}]);
