import Constants from '../constants';
import RendererUtils from '../rendererUtils';
import IpcRendererHelper from '../ipcRendererHelper';
import EntryUtils from './entryUtils';

/**
 * 엔트리 내 오프라인용으로 몽키패치가 필요한 경우 이 함수에서 처리한다.
 * 개별 파일 다운로드 및 엔트리 하드웨어 코드가 있다.
 */
export default function() {
    if (!Entry) {
        return;
    }

    Entry.playground.downloadPicture = function(pictureId: string) {
        const picture = Entry.playground.object!.getPicture(pictureId);
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
        const sound = Entry.playground.object!.getSound(soundId);
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

    /*
    오프라인은 fileurl 을 사용한다.
    entryjs 는 filename, fileurl 이 다 있으면 fileurl 을 우선으로, 없으면 filename 으로 일정규칙의 주소를 만든다.
    이 규칙은 EntryInitOptions 의 defaultDir 을 따르나 이미지가 워크스페이스 내장이 아닐 수 있으므로 이 규직을 따를 수 없다.
    그러므로 직접 오프라인에 맞는 파일시스템 기준 경로생성 로직을 따로 구현하였다.
     */
    Entry.playground.painter.getImageSrc = function({ fileurl, filename, imageType = 'png' }: { fileurl: string; filename: string; imageType: string; }) {
        if (fileurl) {
            // 외부에서 들어온 파일인 경우 fileurl 이 필수적으로 포함되어있다. 타입과 상관없이 png 이다
            if (imageType === 'svg') {
                return fileurl.replace(/\..{3,4}$/, `.${imageType}`);
            }
            return fileurl;
        }
        return `${Constants.resourceImagePath(filename)  }${filename}.${imageType}`;
    };

    const openHardwarePage = function() {
        const roomId = localStorage.getItem('entryhwRoomId');
        if (roomId) {
            RendererUtils.getSharedObject().roomIds = [roomId];
        }

        IpcRendererHelper.openHardwarePage();
        Entry.hw._initSocket();
    };

    Entry.HW.prototype.downloadConnector = openHardwarePage;
    Entry.HW.prototype.openHardwareProgram = openHardwarePage;

    Entry.HW.prototype.downloadGuide = function() {
        if (EntryStatic.isPracticalCourse) {
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
