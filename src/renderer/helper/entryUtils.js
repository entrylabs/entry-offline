import Modal from '../resources/modal/app.js';
import root from 'window-or-global';
import Utils from './rendererUtils';
import IpcRendererHelper from './ipcRendererHelper';

/**
 * Entry 프로젝트 관련 로직이 많은 경우 이 클래스로 옮긴다.
 */
export default class {
    static openImportListModal() {
        new Modal()
            .createModal([{ type: 'LIST_IMPORT', theme: 'BLUE' }])
            .on('click', (e, data) => {
                switch (e) {
                    case 'save':
                        //아무것도 입력하지 않은 경우, 빈칸 하나만 있는 것으로 처리된다.
                        if (data.length === 1 && data[0] === '') {
                            root.entrylms.alert(Utils.getLang('Menus.nothing_to_import'));
                        } else {
                            const list = Entry.variableContainer.selected;
                            list.array_ = data.map((element) => {
                                return { data: element };
                            });
                            Entry.do('listChangeLength', list.id_, list.array_.length);
                        }
                        break;
                    default:
                        break;
                }
            })
            .show();
    }

    static openExportListModal(array, name) {
        new Modal()
            .createModal([{ type: 'LIST_EXPORT', theme: 'BLUE', content: array }])
            .on('click', function(e, data) {
                switch (e) {
                    case 'copied':
                        root.entrylms.alert(Utils.getLang('Menus.content_copied'));
                        break;
                    case 'excel':
                        //TODO 추출중입니다 이런 ModalProgress 문구가 있으면 더 좋을것 같음.
                        IpcRendererHelper.downloadExcel(name, data)
                            .then(() => {
                                root.entrylms.alert('엑셀 추출에 성공했습니다.');
                            })
                            .catch((err) => {
                                console.error(err);
                                root.entrylms.alert('엑셀 추출에 실패했습니다.');
                            });
                        break;
                    default:
                        break;
                }
            })
            .show();
    }
}
