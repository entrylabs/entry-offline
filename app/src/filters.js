'use strict';

var common = angular.module('common');


common.filter('makeThumbnail', function() {
    return function(picture) {
        if (picture) {
            // return picture.filename.substring(0,2)+'/'+picture.filename.substring(2,4)+'/thumb/'+picture.filename+'.png';
            var extension = picture.extension || '.png';
            return ['uploads', picture.filename.substring(0,2), picture.filename.substring(2,4), 'thumb', picture.filename + extension].join('/');
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
            return ['temp', picture.filename.substring(0,2), picture.filename.substring(2,4), 'thumb', picture.filename + extension].join('/');
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
