import Sprites from '../resources/db/sprites.json';
import Pictures from '../resources/db/pictures.json';
import Sounds from '../resources/db/sounds.json';
import Categories from '../resources/db/categories.json';
import TableInfos from '../resources/db/projectTableInfos.json';
import TableDatum from '../resources/db/projectTables.json';
import RendererUtils from './rendererUtils';

interface BaseObject {
    label: { ko: string; en: string; jp?: string; vn?: string };
    category: { main: string; sub: string };
    categoryId?: string;
    name: string;
    specials: [];
    created: string;
    _id: string;
}

export interface DBSoundObject extends BaseObject {
    path?: string;
    ext: string;
    duration: number;
    filename: string;
}

export interface DBPictureObject extends BaseObject {
    dimension: { height: number; width: number };
    filename: string;
}

export interface DBSpriteObject extends BaseObject {
    pictures: Pick<DBPictureObject, 'label' | 'dimension' | 'filename' | 'name'>[];
    sounds: Pick<DBSoundObject, 'label' | 'duration' | 'ext' | 'filename' | 'name'>[];
}

export interface DBTableObject {
    lang: string;
    fields: string[];
    name: string;
    url: string;
    provider: string;
    summary: string;
    description: string;
    rows: number;
    projectTable: string; // projectTable hashID
    hasOtherTypes?: Boolean;
    otherTypes?: Array<any>;
    fieldInfos?: Array<any>;
    selected?: DBTableObject;
}

type TableObjectsArray = DBPictureObject[] | DBSpriteObject[] | DBSoundObject[] | DBTableObject[];

/** categories.json 항목의 _id에서 oid 문자열을 추출한다 */
function getOid(ref: any): string {
    if (!ref) {
        return '';
    }
    if (typeof ref === 'string') {
        return ref;
    }
    return ref.$oid || '';
}

/** categories.json 항목의 depth 값을 숫자로 반환한다 */
function getDepth(cat: any): number {
    const d = cat.depth;
    if (typeof d === 'number') {
        return d;
    }
    if (d && typeof d === 'object' && d.$numberDouble) {
        return parseInt(d.$numberDouble, 10);
    }
    return 0;
}

/**
 * sprite, pictures, sounds 등의 데이터베이스 추출본을 가지고 CRUD 를 흉내내는 클래스.
 *
 */
export default class {
    /** categoryId → { main, sub } 매핑 캐시 */
    private static _categoryIdMap: Record<string, { main: string; sub: string }> | null = null;

    /**
     * categories.json에서 categoryId → { main, sub } 매핑을 구축한다.
     *
     * depth 1 카테고리: _id가 곧 main 카테고리의 categoryId.
     *   → 해당 _id를 categoryId로 가진 에셋은 main=value, sub=''
     * depth 2 카테고리: _id가 sub 카테고리의 categoryId.
     *   → parent의 value가 main, 자신의 value가 sub
     */
    private static _buildCategoryIdMap(): Record<string, { main: string; sub: string }> {
        if (this._categoryIdMap) {
            return this._categoryIdMap;
        }

        // categories.json에서 _id → category document 맵 구축 (removed 항목 제외)
        const activeCats = (Categories as any[]).filter((c) => !c.removed);
        const catById: Record<string, any> = {};
        for (const cat of activeCats) {
            const oid = getOid(cat._id);
            if (oid) {
                catById[oid] = cat;
            }
        }

        const map: Record<string, { main: string; sub: string }> = {};

        for (const cat of activeCats) {
            const oid = getOid(cat._id);
            if (!oid) {
                continue;
            }

            const depth = getDepth(cat);
            const value = cat.value || '';

            if (depth === 1) {
                // depth 1: main 카테고리 자체의 _id를 categoryId로 가진 에셋
                map[oid] = { main: value, sub: '' };
            } else if (depth === 2) {
                // depth 2: sub 카테고리. parent를 통해 main을 결정
                const parentOid = getOid(cat.parent);
                const parentCat = parentOid ? catById[parentOid] : null;
                const mainValue = parentCat ? (parentCat.value || '') : '';
                map[oid] = { main: mainValue, sub: value };
            }
        }

        this._categoryIdMap = map;
        return map;
    }

    /**
     * 오브젝트의 category 정보를 반환한다.
     * category.main이 유효하면 그대로 사용하고, 없으면 categoryId를 통해 categories.json에서 조회한다.
     */
    private static _getCategory(object: any): { main: string; sub: string } {
        const cat = object.category;
        if (cat) {
            const main = cat.main || '';
            if (main && main.trim() && !main.includes('?') && !main.includes('undefined')) {
                return { main, sub: cat.sub || '' };
            }
        }

        // category.main이 없거나 유효하지 않은 경우 categoryId로 폴백
        const cid = object.categoryId;
        if (cid) {
            const map = this._buildCategoryIdMap();
            const mapped = map[cid];
            if (mapped) {
                return mapped;
            }
        }

        return { main: '', sub: '' };
    }

    /**
     * 카테고리에 해당하는 모든 결과를 반환한다.
     * 대분류와 타입은 필수이다. 소분류는 없거나, all 인 경우 전체검색이다.
     * entry-tool 에서 전달받을때 아래의 세개를 전달받는다.
     * @param sidebar 대분류
     * @param subMenu 중분류
     * @param type 테이블명
     * @return {Array<string>} 결과 리스트
     */
    static findAll({ sidebar, subMenu, type }: { sidebar: string; subMenu: string; type: string }) {
        const table = this._selectTable(type);
        return new Promise((resolve) => {
            // 타입이 table 인 경우는 필터링을 거치지 않는다. 카테고리 정렬이 없기때문
            const findList =
                type === 'table'
                    ? table
                    : table
                          .filter((object) => {
                              const { main, sub } = this._getCategory(object);
                              if (!main) {
                                  return false;
                              }
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
    static search({ searchQuery }: { searchQuery: string }, type: string) {
        const table = this._selectTable(type);
        const lowerCaseSearchQuery = searchQuery.toString().toLowerCase();

        return new Promise((resolve) => {
            const findList =
                table.filter((object) => {
                    const { label = {}, name = '' } = object;
                    const objectName =
                        label[RendererUtils.getLangType()] ||
                        label[RendererUtils.getFallbackLangType()] ||
                        name;

                    return (
                        objectName
                            .toString()
                            .toLowerCase()
                            .indexOf(lowerCaseSearchQuery) > -1
                    );
                }) || [];

            resolve(findList);
        });
    }

    static selectDataTables(projectTableId: string[]): any[] {
        return projectTableId.map((id) => {
            return TableDatum.find((tableData: any) => tableData._id === id);
        });
    }

    static _selectTable(type?: string): TableObjectsArray | any[] {
        switch (type) {
            case 'picture':
                return Pictures as DBPictureObject[];
            case 'sprite':
                return (Sprites as unknown) as DBSpriteObject[];
            case 'sound':
                return (Sounds as unknown) as DBSoundObject[];
            case 'table':
                return TableInfos as DBTableObject[];
            default:
                return [];
        }
    }
}
