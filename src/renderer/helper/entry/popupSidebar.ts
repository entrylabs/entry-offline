/**
 * 팝업 사이드바 카테고리 정의
 *
 * categories.json을 기반으로 사이드바 구조를 자동 생성한다.
 * entry-tool의 DEFAULT_OPTIONS.POPUP_TYPE에 정의된 기본 sidebar를 오버라이드한다.
 *
 * categories.json 구조:
 *   - depth 1: 대분류 (main). value가 에셋의 category.main과 일치
 *   - depth 2: 소분류 (sub). value가 에셋의 category.sub과 일치. parent로 대분류 참조
 *   - categoryType: 'sprite' | 'picture' | 'sound'
 */

import Categories from '../../resources/db/categories.json';

type SidebarItem = { name: string; sub: Record<string, { name: string }> };
type Sidebar = Record<string, SidebarItem>;

interface CategoryDoc {
    _id: any;
    name: string;
    value: string;
    label?: { ko?: string; en?: string; ja?: string };
    categoryType: string;
    depth: any;
    categoryOrder?: number;
    children?: any[];
    parent?: any;
    removed?: any;
}

/** _id 필드에서 oid 문자열을 추출한다 */
function getOid(ref: any): string {
    if (!ref) {
        return '';
    }
    if (typeof ref === 'string') {
        return ref;
    }
    return ref.$oid || '';
}

/** depth 필드를 숫자로 반환한다 */
function getDepth(cat: CategoryDoc): number {
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
 * categories.json에서 특정 categoryType에 해당하는 sidebar 구조를 생성한다.
 *
 * @param categoryType 'sprite' | 'picture' | 'sound'
 * @returns sidebar 객체 (entry-tool Popup의 sidebar prop 형식)
 */
function buildSidebar(categoryType: string): Sidebar {
    // removed 항목은 제외
    const cats = (Categories as unknown as CategoryDoc[]).filter((c) => !c.removed);

    // _id → category document 매핑
    const catById: Record<string, CategoryDoc> = {};
    for (const cat of cats) {
        const oid = getOid(cat._id);
        if (oid) {
            catById[oid] = cat;
        }
    }

    // 해당 categoryType의 depth 1 (main) 카테고리를 순서대로 수집
    const mainCats = cats
        .filter((c) => c.categoryType === categoryType && getDepth(c) === 1)
        .sort((a, b) => (a.categoryOrder || 0) - (b.categoryOrder || 0));

    // 해당 categoryType의 depth 2 (sub) 카테고리를 parent별로 그룹화
    const subsByParent: Record<string, CategoryDoc[]> = {};
    for (const cat of cats) {
        if (cat.categoryType === categoryType && getDepth(cat) === 2) {
            const parentOid = getOid(cat.parent);
            if (parentOid) {
                if (!subsByParent[parentOid]) {
                    subsByParent[parentOid] = [];
                }
                subsByParent[parentOid].push(cat);
            }
        }
    }

    const sidebar: Sidebar = {};

    for (const main of mainCats) {
        const mainOid = getOid(main._id);
        const mainValue = main.value || '';

        const sidebarItem: SidebarItem = {
            name: `Category.${mainValue}`,
            sub: {
                all: { name: 'Menus.all' },
            },
        };

        // children 배열의 순서를 사용하되, 없으면 categoryOrder로 정렬
        const childOids = (main.children || []).map(getOid).filter(Boolean);
        let subCats: CategoryDoc[];

        if (childOids.length > 0) {
            subCats = childOids
                .map((oid) => catById[oid])
                .filter(Boolean) as CategoryDoc[];
        } else {
            subCats = (subsByParent[mainOid] || []).sort(
                (a, b) => (a.categoryOrder || 0) - (b.categoryOrder || 0)
            );
        }

        for (const sub of subCats) {
            const subValue = sub.value || '';
            sidebarItem.sub[subValue] = { name: `Category.${subValue}` };
        }

        sidebar[mainValue] = sidebarItem;
    }

    return sidebar;
}

/** sprite 팝업 사이드바 */
export const SPRITE_SIDEBAR = buildSidebar('sprite');

/** picture / paint 팝업 사이드바 */
export const PICTURE_SIDEBAR = buildSidebar('picture');

/** sound 팝업 전용 사이드바 */
export const SOUND_SIDEBAR = buildSidebar('sound');

/**
 * 팝업 type에 따라 적절한 sidebar를 반환한다.
 */
export function getSidebarByType(type: string) {
    switch (type) {
        case 'sprite':
            return SPRITE_SIDEBAR;
        case 'picture':
        case 'paint':
            return PICTURE_SIDEBAR;
        case 'sound':
            return SOUND_SIDEBAR;
        default:
            return undefined;
    }
}
