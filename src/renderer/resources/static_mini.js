import { EntryStatic } from 'entry-js/extern/util/static_mini';
import _ from 'lodash';

/**
 * entryjs 내 포함되어있는 EntryStatic 에 추가적인 코드를 덮어쓰기 하는 로직
 */

EntryStatic.isPracticalCourse = true;

EntryStatic.categoryProjectOption = [
    {
        key: 'search_genre_all',
        lang: 'search_전체',
        value: '전체',
    },
    {
        key: 'search_genre_game',
        lang: 'search_게임',
        value: '게임',
    },
    {
        key: 'search_genre_animation',
        lang: 'search_애니메이션',
        value: '애니메이션',
    },
    {
        key: 'search_genre_media',
        lang: 'search_미디어아트',
        value: '미디어아트',
    },
    {
        key: 'search_genre_physical',
        lang: 'search_피지컬',
        value: '피지컬',
    },
    {
        key: 'search_genre_etc',
        lang: 'search_기타',
        value: '기타',
    },
];

EntryStatic.getCategoryByBlock = function(blockName) {
    if (!blockName) {
        return false;
    }
    const allBlocks = EntryStatic.getAllBlocks();
    for (let i = 0, len = allBlocks.length; i < len; i++) {
        const blocks = allBlocks[i].blocks;
        if (blocks.indexOf(blockName) > -1) {
            return allBlocks[i].category;
        }
    }
    return false;
};

EntryStatic.objectMainCategories = [
    'entrybot_friends',
    'people',
    'animal',
    'plant',
    'vehicles',
    'architect',
    'food',
    'environment',
    'stuff',
    'fantasy',
    'interface',
    'background',
];

EntryStatic.objectSubCategories = {
    entrybot_friends: [],
    people: [],
    animal: ['animal_flying', 'animal_land', 'animal_water', 'animal_others'],
    plant: ['plant_flower', 'plant_grass', 'plant_tree', 'plant_others'],
    vehicles: ['vehicles_flying', 'vehicles_land', 'vehicles_water', 'vehicles_others'],
    architect: ['architect_building', 'architect_monument', 'architect_others'],
    food: ['food_vegetables', 'food_meat', 'food_drink', 'food_others'],
    environment: ['environment_nature', 'environment_space', 'environment_others'],
    stuff: ['stuff_living', 'stuff_hobby', 'stuff_others'],
    fantasy: [],
    interface: [],
    background: [
        'background_outdoor',
        'background_indoor',
        'background_nature',
        'background_others',
    ],
};

EntryStatic.fonts = [
    {
        name: Lang.Fonts.batang,
        family: 'KoPub Batang',
        url: '/style/kopubbatang.css',
    },
    {
        name: Lang.Fonts.myeongjo,
        family: 'Nanum Myeongjo',
        url: '/style/nanummyeongjo.css',
    },
    {
        name: Lang.Fonts.gothic,
        family: 'Nanum Gothic',
        url: '/style/nanumgothic.css',
    },
    {
        name: Lang.Fonts.pen_script,
        family: 'Nanum Pen Script',
        url: '/style/nanumpenscript.css',
    },
    {
        name: Lang.Fonts.jeju_hallasan,
        family: 'Jeju Hallasan',
        url: '/style/jejuhallasan.css',
    },
    {
        name: Lang.Fonts.gothic_coding,
        family: 'Nanum Gothic Coding',
        url: '/style/nanumgothiccoding.css',
    },
];

EntryStatic.initOptions = {
    listEnable: false,
    functionEnable: false,
    sceneEditable: false,
    textCodingEnable: false,
};

EntryStatic.getQuestionCategoryData = function() {
    return {
        category: 'dummy',
        blocks: ['hidden_event', 'hidden', 'hidden_string', 'hidden_boolean'],
    };
};

const originGetAllBlocks = EntryStatic.getAllBlocks;
EntryStatic.getAllBlocks = () => {
    const allBlocks = originGetAllBlocks();
    const arduino = _.find(allBlocks, ['category', 'arduino']);
    arduino.blocks.forEach((block, index) => {
        if (['arduino_download_connector'].indexOf(block) !== -1) {
            arduino.blocks.splice(index, 1);
        }
    });

    const aiModelTrainCategory = _.find(allBlocks, ['category', 'ai_utilize']);
    aiModelTrainCategory.blocks.forEach((block, index) => {
        if (['aiUtilizeModelTrainButton'].indexOf(block) !== -1) {
            aiModelTrainCategory.blocks.splice(index, 1);
        }
    });
    return allBlocks;
};

export default EntryStatic;
