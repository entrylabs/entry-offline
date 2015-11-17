'use strict';

var common = angular.module('common');


common.filter('makeThumbnail', function() {
    return function(picture) {
        if (picture) {
            // return picture.filename.substring(0,2)+'/'+picture.filename.substring(2,4)+'/thumb/'+picture.filename+'.png';
            return '/uploads/' + picture.filename.substring(0,2)+'/'+picture.filename.substring(2,4)+'/thumb/'+picture.filename+'.png';;
        }
        else
            return '/images/text_icon.png';
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