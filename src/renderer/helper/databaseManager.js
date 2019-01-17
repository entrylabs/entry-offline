import Sprites from '../resources/db/sprites.json';
import Pictures from '../resources/db/pictures.json';
import Sounds from '../resources/db/sounds.json';

/**
 * sprite, pictures, sounds 등의 데이터베이스 추출본을 가지고 CRUD 를 흉내내는 클래스.
 *
 */
export default class {
    /**
     *
     * @param sidebar
     * @param subMenu
     * @param type
     * @return {Array<string>} 결과 리스트
     */
    static findAll({ sidebar, subMenu, type }) {
        const table = this.selectTable(type);
        return new Promise((resolve) => {
            const findList =
                table.filter((sprite) => {
                    const { main, sub } = sprite.category;
                    return main === sidebar && (subMenu === 'all' || subMenu === sub);
                }) || [];

            console.log(findList);
            resolve(findList);
        });
    }

    static selectTable(type) {
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
