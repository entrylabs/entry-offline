import root from 'window-or-global';
import Constants from '../constants';
import RendererUtils from '../rendererUtils';
import IpcRendererHelper from '../ipcRendererHelper';
import EntryUtils from './entryUtils';

/**
 * 엔트리 내 오프라인용으로 몽키패치가 필요한 경우 이 함수에서 처리한다.
 * 개별 파일 다운로드 및 엔트리 하드웨어 코드가 있다.
 */
export default function() {
    if (!root.Entry) {
        return;
    }

    Entry.playground.downloadPicture = function(pictureId: string) {
        const picture = Entry.playground.object.getPicture(pictureId);
        const saveFileName = EntryUtils.getObjectNameWithExtension(picture, 'png');

        const timeQueryIndex = picture.fileurl.indexOf('?');
        if (timeQueryIndex > -1) {
            picture.fileurl = picture.fileurl.slice(0, timeQueryIndex);
        }
        RendererUtils.showSaveDialog({
            title: RendererUtils.getLang('Workspace.file_save'),
            defaultPath: saveFileName,
            filters: [
                { name: 'PNG Image (*.png)', extensions: ['png'] },
                { name: 'All Files (*.*)', extensions: ['*'] },
            ],
        }, (filePath) => {
            if (filePath) {
                IpcRendererHelper.tempResourceDownload(picture, 'image', filePath);
            }
        });
    };

    Entry.playground.downloadSound = function(soundId: string) {
        const sound = Entry.playground.object.getSound(soundId);
        const saveFileName = EntryUtils.getObjectNameWithExtension(sound, 'mp3');

        RendererUtils.showSaveDialog({
            title: RendererUtils.getLang('Workspace.file_save'),
            defaultPath: saveFileName,
            filters: [
                { name: 'MP3 Audio (*.mp3)', extensions: ['mp3'] },
                { name: 'All Files (*.*)', extensions: ['*'] },
            ],
        }, (filePath) => {
            if (filePath) {
                IpcRendererHelper.tempResourceDownload(sound, 'sound', filePath);
            }
        });
    };

    Entry.playground.board._contextOptions[3].option.callback = function() {
        RendererUtils.showOpenDialog({
            properties: ['openDirectory'],
            filters: [{ name: 'Image', extensions: ['png'] }],
        }, (dirPath) => {
            if (dirPath) {
                Entry.playground.board.code.getThreads()
                    .forEach(function(thread: any, index: number) {
                        const topBlock = thread.getFirstBlock();
                        if (!topBlock) {
                            return;
                        }

                        /* eslint-disable */
                        (function(i) {
                            topBlock.view.getDataUrl()
                                .then(function(data: any) {
                                    const savePath = `${dirPath[0]}${Constants.sep}${i}${'.png'}`;
                                    RendererUtils.saveBlockImage(data.src, savePath);
                                });
                        })(++index);
                        /* eslint-enable */
                    });
            }
        });
    };

    Entry.playground.painter.getImageSrc = function({ fileurl, filename, imageType = 'png' }: { fileurl: string; filename: string; imageType: string; }) {
        if (!fileurl) {
            return Constants.resourceImagePath(filename) + `${filename}.${imageType}`;
        }
        return fileurl.replace(/\..{3,4}$/, `.${imageType}`);
    };

    const openHardwarePage = function() {
        RendererUtils.getSharedObject().roomIds = [localStorage.getItem('entryhwRoomId')];
        IpcRendererHelper.openHardwarePage();
        Entry.hw._initSocket();
    };

    Entry.HW.prototype.downloadConnector = openHardwarePage;
    Entry.HW.prototype.openHardwareProgram = openHardwarePage;

    Entry.HW.prototype.downloadGuide = function() {
        if (root.EntryStatic.isPracticalCourse) {
            RendererUtils.downloadRobotGuide();
        } else {
            RendererUtils.downloadHardwareGuide();
        }
    };

    Entry.HW.prototype.downloadSource = function() {
        RendererUtils.showSaveDialog({
            defaultPath: 'board.ino',
            filters: [
                { name: 'Arduino(*.ino)', extensions: ['ino'] },
            ],
        }, (filePath) => {
            if (filePath) {
                IpcRendererHelper.staticDownload(['source', 'board.ino'], filePath);
            }
        });
    };

    Entry.EXPANSION_BLOCK.tts.api = EntryStatic.baseUrl + Entry.EXPANSION_BLOCK.tts.api;
}
