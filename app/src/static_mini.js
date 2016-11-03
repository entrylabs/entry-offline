'use strict'

var EntryStatic = {};

EntryStatic.objectTypes = [
    "sprite",
    "textBox"
]

EntryStatic.usageList = [
    'usage_event', 'usage_signal', 'usage_scene', 'usage_repeat', 'usage_condition_repeat',
    'usage_condition', 'usage_clone', 'usage_arrow_move', 'usage_rotation', 'usage_coordinate', 'usage_shape',
    'usage_speak', 'usage_picture_effect', 'usage_textBox', 'usage_draw', 'usage_sound',
    'usage_confirm', 'usage_comp_operation', 'usage_logical_operation', 'usage_math_operation',
    'usage_random', 'usage_timer', 'usage_variable', 'usage_list', 'usage_ask_answer',
    'usage_function', 'usage_arduino'
];

EntryStatic.conceptList = [
    'concept_resource_analytics', 'concept_individual', 'concept_abstractive', 'concept_procedual',
    'concept_automation', 'concept_simulation', 'concept_parallel'
];

EntryStatic.subjectList = [
    'subject_korean', 'subject_mathmatics', 'subject_social',
    'subject_science', 'subject_english', 'subject_courtesy', 'subject_music', 'subject_paint',
    'subject_athletic', 'subject_progmatic'
];

EntryStatic.lectureLevels = [1, 2, 3];

// EntryStatic.lectureLevels = ['level_high', 'level_mid','level_row'];

EntryStatic.lectureGrades = [
    'e_1', 'e_2', 'e_3', 'e_4', 'e_5', 'e_6',
    'm_1', 'm_2', 'm_3',
    'general'
];

EntryStatic.categoryList = [
    'category_game', 'category_animation', 'category_media_art',
    'category_physical', 'category_etc'
];

EntryStatic.requiredTimes = [1, 2, 3, 4, 5];

EntryStatic.searchProjectOption = [{
    'key': 'search_updated',
    'lang': 'search_updated',
    'value': 'updated'
}, {
    'key': 'search_recent',
    'lang': 'search_recent',
    'value': 'recent'
}, {
    'key': 'search_complexity',
    'lang': 'search_complexity',
    'value': 'complexity'
}, {
    'key': 'search_staffPicked',
    'lang': 'search_staffPicked',
    'value': 'staffPicked'
}, {
    'key': 'search_childCnt',
    'lang': 'search_childCnt',
    'value': 'childCnt'
}, {
    'key': 'search_likeCnt',
    'lang': 'search_likeCnt',
    'value': 'recentLikeCnt'
}]

EntryStatic.getAllBlocks = function() {
    return [
        {
            category: "start",
            blocks: [
                "when_run_button_click",
                "when_some_key_pressed",
                "mouse_clicked",
                "mouse_click_cancled",
                "when_object_click",
                "when_message_cast",
                "message_cast",
            ]
        },
        {
            category: "flow",
            blocks: [
                "wait_second",
                "repeat_basic",
                "repeat_inf",
                "repeat_while_true",
                "stop_repeat",
                "_if",
                "if_else",
                "wait_until_true",
            ]
        },
        {
            category: "moving",
            blocks: [
                "move_direction",
                "bounce_wall",
                "move_x",
                "move_y",
                "locate_y",
                "locate_xy",
                "locate_xy_time",
                "locate",
                "locate_object_time",
                "rotate_relative",
                "direction_relative",
                "rotate_absolute",
                "direction_absolute",
                "see_angle_object",
            ]
        },
        {
            category: "looks",
            blocks: [
                "show",
                "hide",
                "dialog_time",
                "change_to_some_shape",
                "change_to_next_shape",
                "add_effect_amount",
                "change_effect_amount",
                "erase_all_effects",
                "change_scale_size",
                "set_scale_size",
            ]
        },
        {
            category: "brush",
            blocks: [
                "brush_stamp",
                "start_drawing",
                "stop_drawing",
                "set_color",
                "change_thickness",
                "set_thickness",
                "brush_erase_all"
            ]
        },
        {
            category: "text",
            blocks: [
                "text_write",
                "text_append",
                "text_prepend",
                "text_flush"
            ]
        },
        {
            category: "sound",
            blocks: [
                "sound_something_with_block",
                "sound_something_wait_with_block",
                "sound_volume_change",
                "sound_volume_set",
            ]
        },
        {
            category: "judgement",
            blocks: [
                "is_clicked",
                "is_press_some_key",
                "reach_something",
                "boolean_basic_operator",
            ]
        },
        {
            category: "calc",
            blocks: [
                "calc_basic",
                "calc_rand",
                "coordinate_object",
                "quotient_and_mod",
                "get_project_timer_value",
                "choose_project_timer_action",
                "set_visible_project_timer",
                "length_of_string",
                "combine_something",
                "char_at",
                "substring",
                "replace_string",
            ]
        },
        {
            category: "variable",
            blocks: [
                "variableAddButton",
                "ask_and_wait",
                "get_canvas_input_value",
                "set_visible_answer",
                "get_variable",
                "change_variable",
                "set_variable",
                "show_variable",
                "hide_variable",
            ]
        }, {
        category: "arduino",
        blocks: [
            "arduino_download_connector",
            "download_guide",
            "arduino_download_source",
            "arduino_connected",
            "arduino_reconnect",
        ]
    }]
}

EntryStatic.getCategoryByBlock = function(blockName) {
    if (!blockName)
        return false;
    var allBlocks = EntryStatic.getAllBlocks();
    for (var i = 0, len = allBlocks.length; i < len; i++) {
        var blocks = allBlocks[i].blocks;
        if (blocks.indexOf(blockName) > -1) {
            return allBlocks[i].category;
        }
    }
    return false;
}

EntryStatic.objectMainCategories = ['entrybot_friends', 'people', 'animal', 'plant', 'vehicles',
    'architect', 'food', 'environment', 'stuff', 'fantasy', 'interface',
    'background'
];

EntryStatic.objectSubCategories = {
    'entrybot_friends': [],
    'people': [],
    'animal': ['animal_flying', 'animal_land', 'animal_water', 'animal_others'],
    'plant': ['plant_flower', 'plant_grass', 'plant_tree', 'plant_others'],
    'vehicles': ['vehicles_flying', 'vehicles_land', 'vehicles_water', 'vehicles_others'],
    'architect': ['architect_building', 'architect_monument', 'architect_others'],
    'food': ['food_vegetables', 'food_meat', 'food_drink', 'food_others'],
    'environment': ['environment_nature', 'environment_space', 'environment_others'],
    'stuff': ['stuff_living', 'stuff_hobby', 'stuff_others'],
    'fantasy': [],
    'interface': [],
    'background': ['background_outdoor', 'background_indoor', 'background_nature', 'background_others']
};

EntryStatic.fonts = [{
    name: '바탕체',
    family: 'KoPub Batang',
    url: '/css/kopubbatang.css'
}, {
    name: '명조체',
    family: 'Nanum Myeongjo',
    url: '/css/nanummyeongjo.css'
}, {
    name: '고딕체',
    family: 'Nanum Gothic',
    url: '/css/nanumgothic.css'
}, {
    name: '필기체',
    family: 'Nanum Pen Script',
    url: '/css/nanumpenscript.css'
}, {
    name: '한라산체',
    family: 'Jeju Hallasan',
    url: '/css/jejuhallasan.css'
}, {
    name: '코딩고딕체',
    family: 'Nanum Gothic Coding',
    url: '/css/nanumgothiccoding.css'
}];

EntryStatic.getName = function(str, type) {
    var dict = SpriteNames;
    if (type == 'picture')
        dict = PictureNames;
    else if (type == 'sound')
        dict = SoundNames;

    var lang = navigator.language ? navigator.language : 'ko';
    if (window.lang)
        lang = window.lang;

    if (window.user && window.user.language)
        lang = window.user.language;

    if (!dict || lang == 'ko' || lang == 'code') {
        return str;
    } else {
        return dict[str] ? dict[str] : str;
    }
};

EntryStatic.ARROW_COLOR_START = '#2f975a';
EntryStatic.ARROW_COLOR_FLOW = '#3a71bc';
EntryStatic.ARROW_COLOR_MOVING = '#8641b6';
EntryStatic.ARROW_COLOR_LOOKS = '#d8234e';
EntryStatic.ARROW_COLOR_SOUNDS = '#83a617';
EntryStatic.ARROW_COLOR_JUDGE = '#89a1f7';
EntryStatic.ARROW_COLOR_CALC = '#e8b349';
EntryStatic.ARROW_COLOR_VARIABLE = '#ce38ce';
EntryStatic.ARROW_COLOR_HW = '#097e84';


EntryStatic.COMMAND_TYPES = {
    addThread: 101,
    destroyThread: 102,
    destroyBlock: 103,
    recoverBlock: 104,
    insertBlock: 105,
    separateBlock: 106,
    moveBlock: 107,
    cloneBlock: 108,
    uncloneBlock: 109,
    scrollBoard: 110,
    setFieldValue: 111,

    selectObject: 201,

    'do': 301,
    'undo': 302,
    'redo': 303
};

// for server node js code
if (typeof exports == "object") {
    exports.blockInfo = EntryStatic.blockInfo;
    exports.getAllBlocks = EntryStatic.getAllBlocks;
    exports.getCategoryByBlock = EntryStatic.getCategoryByBlock;
    exports.EntryStatic = EntryStatic;
}
