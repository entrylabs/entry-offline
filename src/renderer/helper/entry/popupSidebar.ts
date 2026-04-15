/**
 * 팝업 사이드바 카테고리 정의
 *
 * entry-tool의 DEFAULT_OPTIONS.POPUP_TYPE에 정의된 기본 sidebar를 오버라이드하기 위해
 * entry-offline에서 직접 관리하는 카테고리 구조.
 *
 * sidebar 객체의 key는 DB JSON(sprites.json, pictures.json, sounds.json)의
 * category.main 값과 일치해야 하며, sub 객체의 key는 category.sub 값과 일치해야 한다.
 *
 * name 값은 window.Lang에서 조회되는 i18n 키이다. (예: 'Category.people' → Lang.Category.people)
 */

/** sprite / picture / paint 팝업에서 공유하는 사이드바 */
export const SPRITE_SIDEBAR: Record<
    string,
    { name: string; sub: Record<string, { name: string }> }
> = {
    entrybot_friends: {
        name: 'Category.entrybot_friends',
        sub: {
            all: { name: 'Menus.all' },
            sub_PoQFQceEVP: { name: 'Category.sub_PoQFQceEVP' },
            sub_clSVysPeQN: { name: 'Category.sub_clSVysPeQN' },
            sub_fzGUMTBmzL: { name: 'Category.sub_fzGUMTBmzL' },
        },
    },
    main_IYYpuwnMXN: {
        name: 'Category.main_IYYpuwnMXN',
        sub: {
            all: { name: 'Menus.all' },
            sub_etZywbAiLM: { name: 'Category.sub_etZywbAiLM' },
            sub_rcOFSAdOTw: { name: 'Category.sub_rcOFSAdOTw' },
            sub_GyyQIXIyPq: { name: 'Category.sub_GyyQIXIyPq' },
            sub_iovaINIAZi: { name: 'Category.sub_iovaINIAZi' },
        },
    },
    people: {
        name: 'Category.people',
        sub: {
            all: { name: 'Menus.all' },
            // background_outdoor: { name: 'Category.background_outdoor' },
        },
    },
    animal: {
        name: 'Category.animal',
        sub: {
            all: { name: 'Menus.all' },
            animal_land: { name: 'Category.animal_land' },
            animal_flying: { name: 'Category.animal_flying' },
            sub_xTBlDOMvCE: { name: 'Category.sub_xTBlDOMvCE' },
            animal_water: { name: 'Category.animal_water' },
            sub_vNptLxmKxM: { name: 'Category.sub_vNptLxmKxM' },
            animal_others: { name: 'Category.animal_others' },
        },
    },
    plant: {
        name: 'Category.plant',
        sub: {
            all: { name: 'Menus.all' },
            plant_flower: { name: 'Category.plant_flower' },
            plant_grass: { name: 'Category.plant_grass' },
            plant_tree: { name: 'Category.plant_tree' },
            plant_others: { name: 'Category.plant_others' },
        },
    },
    vehicles: {
        name: 'Category.vehicles',
        sub: {
            all: { name: 'Menus.all' },
            vehicles_flying: { name: 'Category.vehicles_flying' },
            vehicles_land: { name: 'Category.vehicles_land' },
            vehicles_water: { name: 'Category.vehicles_water' },
        },
    },
    architect: {
        name: 'Category.architect',
        sub: {
            all: { name: 'Menus.all' },
            architect_building: { name: 'Category.architect_building' },
            architect_monument: { name: 'Category.architect_monument' },
            architect_others: { name: 'Category.architect_others' },
        },
    },
    food: {
        name: 'Category.food',
        sub: {
            all: { name: 'Menus.all' },
            food_vegetables: { name: 'Category.food_vegetables' },
            food_meat: { name: 'Category.food_meat' },
            food_drink: { name: 'Category.food_drink' },
            food_others: { name: 'Category.food_others' },
        },
    },
    environment: {
        name: 'Category.environment',
        sub: {
            all: { name: 'Menus.all' },
            environment_nature: { name: 'Category.environment_nature' },
            environment_space: { name: 'Category.environment_space' },
            environment_others: { name: 'Category.environment_others' },
        },
    },
    stuff: {
        name: 'Category.stuff',
        sub: {
            all: { name: 'Menus.all' },
            stuff_living: { name: 'Category.stuff_living' },
            stuff_hobby: { name: 'Category.stuff_hobby' },
            stuff_others: { name: 'Category.stuff_others' },
        },
    },
    fantasy: {
        name: 'Category.fantasy',
        sub: {
            all: { name: 'Menus.all' },
            sub_eKpEudNuUV: { name: 'Category.sub_eKpEudNuUV' },
            sub_FGBSNslZaJ: { name: 'Category.sub_FGBSNslZaJ' },
        },
    },
    interface: {
        name: 'Category.interface',
        sub: {
            all: { name: 'Menus.all' },
            interface_website: { name: 'Category.interface_website' },
            interface_game: { name: 'Category.interface_game' },
            interface_others: { name: 'Category.interface_others' },
        },
    },
    background: {
        name: 'Category.background',
        sub: {
            all: { name: 'Menus.all' },
            background_outdoor: { name: 'Category.background_outdoor' },
            background_indoor: { name: 'Category.background_indoor' },
            background_nature: { name: 'Category.background_nature' },
            background_others: { name: 'Category.background_others' },
        },
    },
    // EBS15회: {
    //     name: 'Category.EBS15회',
    //     sub: {
    //         all: { name: 'Menus.all' },
    //     },
    // },
    // EBS20회: {
    //     name: 'Category.EBS20회',
    //     sub: {
    //         all: { name: 'Menus.all' },
    //     },
    // },
    // EBS21회: {
    //     name: 'Category.EBS21회',
    //     sub: {
    //         all: { name: 'Menus.all' },
    //     },
    // },
    // EBS24회: {
    //     name: 'Category.EBS24회',
    //     sub: {
    //         all: { name: 'Menus.all' },
    //     },
    // },
    // EBS25회: {
    //     name: 'Category.EBS25회',
    //     sub: {
    //         all: { name: 'Menus.all' },
    //     },
    // },
};

/** sound 팝업 전용 사이드바 */
export const SOUND_SIDEBAR: Record<
    string,
    { name: string; sub: Record<string, { name: string }> }
> = {
    사람: {
        name: 'Menus.people',
        sub: {
            all: { name: 'Menus.all' },
            일상생활: { name: 'Menus.daily_life' },
        },
    },
    자연: {
        name: 'Menus.nature',
        sub: {
            all: { name: 'Menus.all' },
            동물: { name: 'Menus.animal_insect' },
            자연환경: { name: 'Menus.environment' },
        },
    },
    사물: {
        name: 'Menus.things',
        sub: {
            all: { name: 'Menus.all' },
            이동수단: { name: 'Menus.vehicles' },
            기타: { name: 'Menus.others' },
        },
    },
    판타지: {
        name: 'Menus.fantasy',
        sub: {
            all: { name: 'Menus.all' },
        },
    },
    악기: {
        name: 'Menus.instrument',
        sub: {
            all: { name: 'Menus.all' },
            피아노: { name: 'Menus.piano' },
            마림바: { name: 'Menus.marimba' },
            드럼: { name: 'Menus.drum' },
            장구: { name: 'Menus.janggu' },
            효과음: { name: 'Menus.sound_effect' },
            기타타악기: { name: 'Menus.others_instrument' },
        },
    },
    // EBS15회: {
    //     name: 'Category.EBS15회',
    //     sub: {
    //         all: { name: 'Menus.all' },
    //     },
    // },
    // EBS18회: {
    //     name: 'Category.EBS18회',
    //     sub: {
    //         all: { name: 'Menus.all' },
    //     },
    // },
};

/**
 * 팝업 type에 따라 적절한 sidebar를 반환한다.
 */
export function getSidebarByType(type: string) {
    switch (type) {
        case 'sprite':
        case 'picture':
        case 'paint':
            return SPRITE_SIDEBAR;
        case 'sound':
            return SOUND_SIDEBAR;
        default:
            return undefined;
    }
}
