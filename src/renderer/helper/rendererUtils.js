import get from 'lodash/get';
import root from 'window-or-global';
import { remote } from 'electron';
const { dialog } = remote;

/**
 * Renderer Process 전역에서 사용할 수 있는 클래스.
 * ipc 통신이 한번이상 필요한 경우 이곳에 두지 않는다.
 */
export default class {
    /**
     * electron main process 와 연결된 오브젝트를 가져온다.
     * @return {any}
     */
    static getSharedObject() {
        return remote.getGlobal('sharedObject');
    }

    /**
     * root.Lang 에서 해당 프로퍼티를 가져온다.
     * @param key{string} property chain
     * @return {string} 해당하는 값 || key
     */
    static getLang(key = '') {
        const lang = window.Lang || {};
        return get(lang, key) || key;
    }

    /**
     * 현재 일자를 YYMMDD 형식으로 반환한다
     * @return {string}
     */
    static getFormattedDate() {
        const currentDate = new Date();
        const year = currentDate
            .getFullYear()
            .toString()
            .substr(-2);
        let month = (currentDate.getMonth() + 1).toString();
        let day = currentDate.getDate()
            .toString();

        if (month.length === 1) {
            month = `0${month}`;
        }
        if (day.length === 1) {
            day = `0${month}`;
        }

        return year + month + day;
    }

    /**
     * YYMMDD_프로젝트 형태의 문자열 반환
     * @return {string}
     */
    static getDefaultProjectName() {
        return `${this.getFormattedDate()}_${this.getLang('Workspace.project')}`;
    }

    static showOpenDialog(option, callback) {
        if (root.isOsx) {
            dialog.showOpenDialog(option, callback);
        } else {
            //TODO 윈도우용은 다른가요?
            dialog.showOpenDialog(option, callback);
        }
    }

    static showSaveDialog(option, callback) {
        dialog.showSaveDialog(option, callback);
    }

    static confirmProjectWillDismiss() {
        let confirmProjectDismiss = true;
        if (!Entry.stateManager.isSaved()) {
            confirmProjectDismiss = confirm(this.getLang('Menus.save_dismiss'));
        }

        return confirmProjectDismiss;
    }
}
