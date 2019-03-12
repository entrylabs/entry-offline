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

    Entry.playground.downloadPicture = function(pictureId) {
        const picture = Entry.playground.object.getPicture(pictureId);
        const saveFileName = EntryUtils.getObjectNameWithExtension(picture, 'png');

        RendererUtils.showSaveDialog({
            title: RendererUtils.getLang('Workspace.file_save'),
            defaultPath: saveFileName,
            filters: {
                'image/png': [
                    { name: 'PNG Image (*.png)', extensions: ['png'] },
                    { name: 'All Files (*.*)', extensions: ['*'] },
                ],
            },
        }, (filePath) => {
            IpcRendererHelper.tempResourceDownload(picture, 'image', filePath);
        });
    };

    Entry.playground.downloadSound = function(soundId) {
        const sound = Entry.playground.object.getSound(soundId);
        const saveFileName = EntryUtils.getObjectNameWithExtension(sound, 'mp3');

        RendererUtils.showSaveDialog({
            title: RendererUtils.getLang('Workspace.file_save'),
            defaultPath: saveFileName,
            filters: {
                'audio/mpeg3': [
                    { name: 'MP3 Audio (*.mp3)', extensions: ['mp3'] },
                    { name: 'All Files (*.*)', extensions: ['*'] },
                ],
            },
        }, (filePath) => {
            IpcRendererHelper.tempResourceDownload(sound, 'sound', filePath);
        });
    };

    Entry.playground.board._contextOptions[3].option.callback = function() {
        RendererUtils.showOpenDialog({
            properties: ['openDirectory'],
            filters: { name: 'Image', extensions: ['png'] },
        }, (dirPath) => {
            if (dirPath) {
                Entry.playground.board.code.getThreads()
                    .forEach(function(thread, index) {
                        const topBlock = thread.getFirstBlock();
                        if (!topBlock) {
                            return;
                        }

                        /* eslint-disable */
                        (function(i) {
                            topBlock.view.getDataUrl()
                                .then(function(data) {
                                    const savePath = `${dirPath[0]}${Constants.sep}${i}${'.png'}`;
                                    RendererUtils.saveBlockImage(data.src, savePath);
                                });
                        })(++index);
                        /* eslint-enable */
                    });
            }
        });
    };

    const openHardwarePage = function() {
        RendererUtils.getSharedObject().roomId = [
            localStorage.getItem('entryhwRoomId'),
        ];
        IpcRendererHelper.openHardwarePage(RendererUtils.getLangType());
        Entry.hw.initSocket();
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
}
