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
     * @return {sharedObject}
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
        let resultPromise = Promise.resolve();
        if (!options.saveTemp) {
            resultPromise = IpcRendererHelper.resetDirectory();
        }
        return resultPromise.then(() => {
            StorageManager.removeProject();
        });
    }

    /**
     * root.Lang 에서 해당 프로퍼티를 가져온다.
     * @param key{string} property chain
     * @return {string} 해당하는 값 || key
     */
    static getLang(key = '') {
        const lang = root.Lang || {};
        return get(lang, key) || key;
    }

    /**
     * 현재 window 에 존재한 Lang 오브젝트의 타입을 반환한다.
     * 타입이 없는경우 fallbackType 이 반환되는데, 반환 순서는 아래와 같다.
     * 1. Lang 오브젝트의 fallbackType
     * 2. 한글 (기본)
     * @return {string}
     */
    static getLangType() {
        return root.Lang.type || root.Lang.fallbackType;
    }

    /**
     * 현재 window 에 존재하는 Lang 오브젝트의 fallback 타입을 먼저 반환한다.
     * fallbackType 이 없는 경우 type 을 반환한다.
     * @return {string}
     */
    static getFallbackLangType() {
        return root.Lang.fallbackType || root.Lang.type;
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
    static saveBlockImage(data, filePath) {
        const buffer = Buffer.from(
            data.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64'
        );

        IpcRendererHelper.writeFile(buffer, filePath);
    }

    /**
     * 캔버스에서 사용되지 않은 부분을 잘라낸다.
     * @param imageData
     * @return {*|jQuery|{}} jQuery deferred.
     */
    static cropImageFromCanvas(imageData) {
        return new Promise(((resolve) => {
            const image = new Image();

            image.src = imageData;
            image.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(this, 0, 0, canvas.width, canvas.height);

                let width = canvas.width;
                let height = canvas.height;
                const pix = { x: [], y: [] };
                const imageData = ctx.getImageData(0,0, width, height);

                let x;
                let y;
                let index;

                for (y = 0; y < height; y++) {
                    for (x = 0; x < width; x++) {
                        index = (y * width + x) * 4;
                        if (imageData.data[index + 3] > 0) {
                            pix.x.push(x);
                            pix.y.push(y);
                        }
                    }
                }
                pix.x.sort(function(a, b) {
                    return a - b;
                });
                pix.y.sort(function(a, b) {
                    return a - b;
                });
                const n = pix.x.length - 1;

                let minx = 0;
                let miny = 0;
                let maxx = 0;
                let maxy = 0;

                if (pix.x.length > 0) {
                    minx = pix.x[0];
                    maxx = pix.x[n];
                    width = maxx - minx;
                    if (width % 2 !== 0) {
                        width += 1;
                    }
                } else {
                    width = 1;
                    minx = 0;
                }

                if (pix.y.length > 0) {
                    miny = pix.y[0];
                    maxy = pix.y[n];
                    height = maxy - miny;
                    if (height % 2 !== 0) {
                        height += 1;
                    }
                } else {
                    height = 1;
                    miny = 0;
                }

                const cut = ctx.getImageData(minx, miny, width, height);

                canvas.width = width;
                canvas.height = height;
                ctx.putImageData(cut, 0, 0);

                resolve(canvas.toDataURL('image/png'));
            };
        }));
    }

    /**
     * 확장자 앞에 . 을 붙여준다. 확장자가 없는 경우 defaultExtension 을 반환한다.
     *
     * @param {string}extension 확장자
     * @param {string=}defaultExtension extension 이 falsy 인 경우 반환
     * @return {string} . 이 붙은 확장자
     */
    static sanitizeExtension(extension, defaultExtension) {
        let sanitizedExt = extension || defaultExtension;
        if (!sanitizedExt.startsWith('.')) {
            sanitizedExt = `.${sanitizedExt}`;
        }
        return sanitizedExt;
    }
}
