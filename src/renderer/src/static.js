import _ from 'lodash';

var { EntryStatic } = require(path.join(
    _real_path,
    'bower_components',
    'entryjs',
    'extern',
    'util',
    localStorage.getItem('isPracticalCourse') === 'true' ? 'static_mini.js' : 'static.js',
));

const originGetAllBlocks = EntryStatic.getAllBlocks;
EntryStatic.getAllBlocks = (() =>
    _.memoize(() => {
        const allBlocks = originGetAllBlocks();
        const arduino = _.find(allBlocks, ['category', 'arduino']);
        const { blocks } = arduino;
        const index = blocks.indexOf('arduino_open');
        blocks.splice(index, 1);
        return allBlocks;
    }))();

EntryStatic.getName = function(str, type) {
    var dict = SpriteNames;
    if (type == 'picture') dict = PictureNames;
    else if (type == 'sound') dict = SoundNames;

    var lang = navigator.language ? navigator.language : 'ko';
    if (window.lang) lang = window.lang;

    if (window.user && window.user.language) lang = window.user.language;

    if (!dict || (lang && lang.indexOf('ko') != -1)) {
        return str;
    } else {
        return dict[str] ? dict[str] : str;
    }
};

// for server node js code
if (typeof exports == 'object') {
    exports.blockInfo = EntryStatic.blockInfo;
    exports.getAllBlocks = EntryStatic.getAllBlocks;
    exports.getCategoryByBlock = EntryStatic.getCategoryByBlock;
    exports.EntryStatic = EntryStatic;
}
