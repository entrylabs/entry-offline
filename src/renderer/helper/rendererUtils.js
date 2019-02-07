import get from 'lodash/get';
import root from 'window-or-global';
import { remote } from 'electron';
import IpcRendererHelper from './ipcRendererHelper';
import StorageManager from './storageManager';

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
     * localStorage, Electron temp 폴더를 삭제한다.
     * @param {Object=} options
     * @property saveTemp temp 폴더를 그대로 두는 경우. 이전 리소스가 남아있을지 모르는 상태일때 사용
     */
    static clearTempProject(options = {}) {
        if (!options.saveTemp) {
            IpcRendererHelper.resetDirectory();
        }
        StorageManager.removeProject();
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
            day = `0${day}`;
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

    static downloadHardwareGuide() {
        const osType = root.isOsx ? {
            saveName: '(맥)',
            filePath: ['guide', 'hardware-osx.pdf'],
        } : {
            saveName: '(윈도우)',
            filePath: ['guide', 'hardware-win.pdf'],
        };

        this.showSaveDialog({
            defaultPath: `[매뉴얼]엔트리 하드웨어 연결${osType.saveName}.pdf`,
            filters: [{ name: '*.pdf', extensions: ['pdf'] }],
        }, (filePath) => {
            if (filePath) {
                IpcRendererHelper.staticDownload(osType.filePath, filePath);
            }
        });
    }

    static downloadRobotGuide() {
        this.showSaveDialog({
            defaultPath: '[매뉴얼]엔트리로봇연결.zip',
            filters: [{ name: '*.zip', extensions: ['zip'] }],
        }, (filePath) => {
            if (filePath) {
                IpcRendererHelper.staticDownload(
                    ['guide', '[매뉴얼]엔트리로봇연결.zip'],
                    filePath,
                );
            }
        });
    }

    static downloadPythonGuide() {
        this.showSaveDialog({
            defaultPath: 'Python.Guide.zip',
            filters: [{ name: '*.zip', extensions: ['zip'] }],
        }, (filePath) => {
            if (filePath) {
                IpcRendererHelper.staticDownload(
                    ['guide', 'Python.Guide.zip'],
                    filePath,
                );
            }
        });
    }

    /**
     * 이미지를 저장한다. 블록 스레드 이미지를 저장하는데 사용된다.
     * @param data buffer 화 되지 않은 엘리먼트의 src
     * @param filePath 저장할 위치
     */
    static writeImage(data, filePath) {
        const buffer = Buffer.from(
            data.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64'
        );

        IpcRendererHelper.writeFile(buffer, filePath);
    }
}
