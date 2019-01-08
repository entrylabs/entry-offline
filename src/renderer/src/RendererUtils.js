import get from 'lodash/get';

export default class Utils {
    static getLang(key = '') {
        const lang = window.Lang || {};
        return get(lang, key) || key;
    }
}
