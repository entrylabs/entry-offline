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

    static downloadExcel(filename, array) {
        return new Promise((resolve, reject) => {
            RendererUtils.showSaveDialog({
                title: RendererUtils.getLang('Workspace.file_save'),
                defaultPath: `${filename}.xlsx`,
                filters: {
                    'application/vnd.ms-excel': [
                        { name: 'Excel Files (*.xlsx)', extensions: ['xlsx'] },
                        { name: 'All Files (*.*)', extensions: ['*'] },
                    ],
                },
            }, (filePath) => {
                console.log('테스트용', filePath);
                resolve();
                // ipcRenderer.send('saveExcel', filePath, array);
                // ipcRenderer.once('saveExcel', (e, err) => {
                //     if (err) {
                //         reject(err);
                //     } else {
                //         resolve();
                //     }
                // });
            });
        });
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

    /**
     * 오브젝트를 eo 파일로 만들어서 외부로 저장한다.
     * 이 이벤트는 일반적으로 entryUtils 를 거쳐서 발생된다.
     * 인식가능한 형태로 만들기 전에 선처리 로직이 있기 때문이다.
     *
     * @see entryUtils.exportObject
     * @param filePath 저장할 파일 전체경로
     * @param objectVariable
     */
    static exportObject(filePath, objectVariable) {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('exportObject', filePath, objectVariable);
            ipcRenderer.once('exportObject', (result) => {
                //NOTE Entry.Toast 라도 주면 좋겠는데 real 에도 아무반응 없네요.
                resolve();
            });
        }) ;
    }

    static importObjects(filePaths) {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('importObjects', filePaths);
            ipcRenderer.once('importObjects', (e, object) => {
                resolve(object);
            });
        });
    }

    /**
     * 업로드 파일 경로를 temp 로 가져온다.
     * @param {Array!}filePaths 이미지 파일 경로
     * @return {Promise<Object>} 신규생성된 오브젝트 메타데이터
     */
    static importPictures(filePaths) {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('importPictures', filePaths);
            ipcRenderer.once('importPictures', (e, object) => {
                resolve(object);
            });
        });
    }

    /**
     * 리소스 디렉토리에서 파일을 temp 로 가져온다.
     * @param {Array}pictures DB 에서 가져온 이미지 정보 오브젝트
     * @return {Promise<Object>} 파일명이 변경된 이미지 정보 오브젝트
     */
    static importPicturesFromResource(pictures) {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('importPicturesFromResource', pictures);
            ipcRenderer.once('importPicturesFromResource', (e, object) => {
                resolve(object);
            });
        });
    }

    static importSounds(filePath) {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('importSounds', filePath);
            ipcRenderer.once('importSounds', (e, object) => {
                resolve(object);
            });
        });
    }

    static importSoundsFromResource(sounds) {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('importSoundsFromResource', sounds);
            ipcRenderer.once('importSoundsFromResource', (e, object) => {
                resolve(object);
            });
        });
    }
}
