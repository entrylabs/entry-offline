import root from 'window-or-global';
import RendererUtils from '../rendererUtils';
import IpcRendererHelper from '../ipcRendererHelper';
import CommonUtils from '../../../common/commonUtils';

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
        const saveFileName = CommonUtils.getObjectNameWithExtension(picture, 'png');

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
        const saveFileName = CommonUtils.getObjectNameWithExtension(sound, 'mp3');

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
    //
    // Entry.playground.board._contextOptions[3].option.callback = function() {
    //     Util.showOpenDialog(
    //         {
    //             properties: ['openDirectory'],
    //             filters: [
    //                 { name: 'Image', extensions: ['png'] },
    //             ],
    //         },
    //         function(paths) {
    //             Entry.playground.board.code
    //                 .getThreads()
    //                 .forEach(function(t, index) {
    //                     var topBlock = t.getFirstBlock();
    //                     if (!topBlock) return;
    //                     (function(i) {
    //                         topBlock.view
    //                             .getDataUrl()
    //                             .then(function(data) {
    //                                 var savePath = path.resolve(
    //                                     paths[0],
    //                                     i + '.png'
    //                                 );
    //                                 Entry.plugin.saveImage(
    //                                     data.src,
    //                                     savePath
    //                                 );
    //                             });
    //                     })(++index);
    //                 });
    //         }
    //     );
    // };
}
