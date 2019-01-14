import root from 'window-or-global';

export default class {
    /**
     * 교과형 / 일반형 변경
     * 교과형으로 변경시에는 lang 이 강제로 ko 로 고정된다.
     * TODO ko 로 진입하는 것이 불법접근인데 필요한 방어코드인지 고려
     * @param mode
     */
    static async changeEntryStatic(mode) {
        let defaultEntryStatic;
        if (mode === 'practical_course') {
            if (root.Lang && root.Lang.type !== 'ko') {
                (async() => await this.changeLang('ko'))();
            }
            defaultEntryStatic = await import('../bower_components/entry-js/extern/util/static_mini');
            defaultEntryStatic = defaultEntryStatic.EntryStatic;
        } else {
            defaultEntryStatic = await import('../resources/static.js');
            defaultEntryStatic = defaultEntryStatic.default;
        }

        root.EntryStatic = defaultEntryStatic || root.EntryStatic;
    }

    static async changeLang(lang) {
        console.log('nextLang', lang);
        root.Lang = await import(`../resources/lang/${lang}.json`);
    }
}
