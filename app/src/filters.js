'use strict';

var common = angular.module('common');


common.filter('makeThumbnail', function() {
    return function(picture) {
        if (picture) {
            // return picture.filename.substring(0,2)+'/'+picture.filename.substring(2,4)+'/thumb/'+picture.filename+'.png';
            //
            if(picture.fileurl) {
                var returnValue;
                picture.fileurl = picture.fileurl.replace(/\\/gi, '/');
                picture.fileurl = picture.fileurl.replace(/%5C/gi, '/');

                // console.log(decodeURI(picture.fileurl).replace('/image/', '/thumb/'));
                // return decodeURI(picture.fileurl).replace('/image/', '/thumb/');

                var lastIdx = picture.fileurl.lastIndexOf('/image/');
                if(lastIdx > -1) {
                    var temp = decodeURI(picture.fileurl);
                    temp = temp.substr(lastIdx).replace('/image/', '/thumb/');
                    returnValue = picture.fileurl.substr(0, lastIdx) + temp;
                }

                // console.log(picture.fileurl);
                return returnValue;

            } else {
                var extension = picture.extension || '.png';
                return ['uploads', picture.filename.substring(0,2), picture.filename.substring(2,4), 'thumb', picture.filename + extension].join('/');
            }
        }
        else
            return './images/text_icon.png';
    };
});

common.filter('makeUploadThumbnail', function() {
    return function(picture) {
        if (picture) {
            // return picture.filename.substring(0,2)+'/'+picture.filename.substring(2,4)+'/thumb/'+picture.filename+'.png';
            var extension = picture.extension || '.png';
            var temp;

            temp = _real_path.replace(/\\/gi, '/');
            temp = temp.replace(/%5C/gi, '/');

            return [temp, 'temp', picture.filename.substring(0,2), picture.filename.substring(2,4), 'thumb', picture.filename + extension].join('/');
        }
        else
            return './images/text_icon.png';
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
