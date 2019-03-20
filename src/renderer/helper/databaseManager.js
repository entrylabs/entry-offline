import Sprites from '../resources/db/sprites.json';
import Pictures from '../resources/db/pictures.json';
import Sounds from '../resources/db/sounds.json';
import RendererUtils from './rendererUtils';

/**
 * sprite, pictures, sounds 등의 데이터베이스 추출본을 가지고 CRUD 를 흉내내는 클래스.
 *
 */
export default class {
    /**
     * 카테고리에 해당하는 모든 결과를 반환한다.
     * 대분류와 타입은 필수이다. 소분류는 없거나, all 인 경우 전체검색이다.
     * entry-tool 에서 전달받을때 아래의 세개를 전달받는다.
     * @param sidebar 대분류
     * @param subMenu 중분류
     * @param type 테이블명
     * @return {Array<string>} 결과 리스트
     */
    static findAll({ sidebar, subMenu, type }) {
        const table = this._selectTable(type);
        return new Promise((resolve) => {
            const findList =
                table.filter((object) => {
                    if (!object.category) {
                        return false;
                    }

                    const { main = '', sub = '' } = object.category;
                    return main === sidebar && (subMenu === 'all' || subMenu === sub);
                })
                    .sort((prev, next) => {
                        if (!next.name || prev.name > next.name) {
                            return 1;
                        } else if (!prev.name || prev.name < next.name) {
                            return -1;
                        } else {
                            return 0;
                        }
                    }) || [];

            resolve(findList);
        });
    }

    /**
     * searchQuery 에 해당하는 키워드를 like 검색한다.
     * 검색은 오브젝트의 name 프로퍼티와만 한다. (운영과 동일)
     * entry-tool 에서 전달받을 때는 아래의 인자를 받게 된다.
     * {category, period, searchQuery, sort, type}
     */
    static search({ type, searchQuery }) {
        const table = this._selectTable(type);
        const lowerCaseSearchQuery = searchQuery.toString().toLowerCase();

        return new Promise((resolve) => {
            const findList = table.filter((object) => {
                const { label = {}, name = '' }  = object;
                const objectName =
                    label[RendererUtils.getLangType()] ||
                    label[RendererUtils.getFallbackLangType()] ||
                    name;

                return objectName.toString().toLowerCase()
                    .indexOf(lowerCaseSearchQuery) > -1;
            }) || [];

            resolve(findList);
        });
    }

    static _selectTable(type) {
        switch (type) {
            case 'picture':
                return Pictures;
            case 'sprite':
                return Sprites;
            case 'sound':
                return Sounds;
            default:
                return [];
        }
    }
}

/*
참고사항

sprite 구조 :
{
    '_id': '56cb52e5fc051ddf4ba6110d',
    '__v': 0,
    'name': '아무거나 버튼',
    'user': '56b2f0052d7146c949202baa',
    'specials': [],
    'created': '2016-02-22T18:26:45.271Z',
    'sounds': [],
    'pictures': [{
        '_id': '56ca2a4cfc051ddf4ba60f5f',
        'filename': '817ef76cf059abf7c9c39a478e57612f',
        'name': '아무거나 버튼_1',
        'dimension': { 'height': 99, 'width': 236 },
        'label': { 'en': 'Random Button_1', 'ko': '아무거나 버튼_1', 'vn': '아무거나버' },
    }],
    'type': '_system_',
    'category': { 'main': 'interface' },
    'label': { 'ko': '아무거나 버튼', 'en': 'Random Button' },
};

*/
