import get from 'lodash/get';
import root from 'window-or-global';
import { remote } from 'electron';
const { dialog } = remote;

export default class Utils {
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

    static openDialog(option, callback) {
        if (root.isOsx) {
            dialog.showOpenDialog(option, callback);
        } else {
            //TODO 윈도우용은 다른가요?
            dialog.showOpenDialog(option, callback);
        }
    }

    /**
     * 프로젝트의 이름, 교과형여부, 파일 url 등을 정리한다.
     * @param {Object} project 엔트리 프로젝트
     * @return {Object.<{boolean}isPracticalCourse, {string}projectName, {Object}project>}
     */
    static reviseProject(project) {
        const baseUrl = project.path;

        project.objects.forEach((object) => {
            const { pictures, sounds } = object.sprite;
            pictures.forEach((picture) => {
                const fileUrl = picture.fileurl;
                if (!fileUrl) {
                    return;
                }
                picture.fileurl = this.getElectronTempPathUrl(baseUrl, fileUrl);
            });
            sounds.forEach((sound) => {
                const fileUrl = sound.fileurl;
                if (!fileUrl) {
                    return;
                }
                sound.fileurl = this.getElectronTempPathUrl(baseUrl, fileUrl);
            });
        });

        //TODO blockly(XML project) 변환

        return {
            isPracticalCourse: project.isPracticalCourse,
            projectName: project.name,
            project,
        };
    }

    /**
     * project 내 object 들에 들어간 fileUrl 을 electron temp path 에 맞춰 수정한다.
     * 또한 entryjs 내장 기본 오브젝트 들의 주소를 정리한다.
     * @param {string} baseUrl 일렉트론 app path (절대경로)
     * @param {string} fileUrl 변경될 파일 경로
     * @return {string} 변환된 파일 경로
     */
    static getElectronTempPathUrl(baseUrl, fileUrl) {
        let result = fileUrl;
        if (result.startsWith('.')) {
            /*
            기본 오브젝트인 경우 (./bower_components/..)
            renderer/bower_components/.. 로 변경
            */
            result = result.replace(/\./, 'renderer');
        } else if (result.startsWith('temp')) {
            /*
            추가된 오브젝트인 경우 (temp/fo/ba/..);
            [ElectronAppData 경로]/temp/fo/ba/.. 로 변경
             */
            result = `${baseUrl}/${result}`.replace(/\\/gi, '/');
        }
        return result;
    }

    static confirmProjectWillDismiss() {
        let confirmProjectDismiss = true;
        if (!Entry.stateManager.isSaved()) {
            confirmProjectDismiss = confirm(this.getLang('Menus.save_dismiss'));
        }

        return confirmProjectDismiss;
    }
}
