import get from 'lodash/get';

export default class Utils {
    static getLang(key = '') {
        const lang = window.Lang || {};
        return get(lang, key) || key;
    }

    // YYMMDD
    static getFormattedDate() {
        const currentDate = new Date();
        const year = currentDate
            .getFullYear()
            .toString()
            .substr(-2);
        let month = (currentDate.getMonth() + 1).toString();
        let day = currentDate.getDate().toString();

        if (month.length === 1) {
            month = `0${month}`;
        }
        if (day.length === 1) {
            day = `0${month}`;
        }

        return year + month + day;
    }

    static getDefaultProjectName() {
        return `${this.getFormattedDate()}_${this.getLang('Workspace.project')}`;
    }

    static confirmProjectWillDismiss() {
        let confirmProjectDismiss = true;
        if (!Entry.stateManager.isSaved()) {
            confirmProjectDismiss = confirm(this.getLang('Menus.save_dismiss'));
        }

        return confirmProjectDismiss;
    }
}
