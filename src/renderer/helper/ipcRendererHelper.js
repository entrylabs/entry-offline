import { ipcRenderer } from 'electron';
import root from 'window-or-global';
import RendererUtils from './rendererUtils';

/**
 * electron main process 로 통신하기 위해 사용하는 클래스.
 * nodejs lib 사용 혹은 main 에 통신이 한번이상 필요한 경우 이쪽에 둔다.
 */
export default class {
    static loadProject(filePath) {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('loadProject', filePath);
            ipcRenderer.once('loadProject', (e, result) => {
                if (result instanceof Error) {
                    reject(result);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static saveProject(project, targetPath) {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('saveProject', project, targetPath);
            ipcRenderer.once('saveProject', (e, err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    static resetDirectory() {
        ipcRenderer.send('resetDirectory');
    }

    static downloadHardwareGuide() {
        const osType = root.isOsx ? {
            saveName: '(맥)',
            filePath: ['guide', 'hardware-osx.pdf'],
        } : {
            saveName: '(윈도우)',
            filePath: ['guide', 'hardware-win.pdf'],
        };

        RendererUtils.showSaveDialog({
            defaultPath: `[매뉴얼]엔트리 하드웨어 연결${osType.saveName}.pdf`,
            filters: [{ name: '*.pdf', extensions: ['pdf'] }],
        }, (filePath) => {
            if (filePath) {
                ipcRenderer.send('staticDownload', osType.filePath, filePath);
            }
        });
    }

    static downloadRobotGuide() {
        RendererUtils.showSaveDialog({
            defaultPath: '[매뉴얼]엔트리로봇연결.zip',
            filters: [{ name: '*.zip', extensions: ['zip'] }],
        }, (filePath) => {
            if (filePath) {
                ipcRenderer.send(
                    'staticDownload',
                    ['guide', '[매뉴얼]엔트리로봇연결.zip'],
                    filePath,
                );
            }
        });
    }

    static downloadPythonGuide() {
        RendererUtils.showSaveDialog({
            defaultPath: 'Python.Guide.zip',
            filters: [{ name: '*.zip', extensions: ['zip'] }],
        }, (filePath) => {
            if (filePath) {
                ipcRenderer.send(
                    'staticDownload',
                    ['guide', 'Python.Guide.zip'],
                    filePath,
                );
            }
        });
    }
}
