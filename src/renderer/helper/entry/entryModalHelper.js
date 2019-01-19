import Modal from '../../resources/modal/app.js';
import root from 'window-or-global';
import Utils from '../rendererUtils';
import IpcRendererHelper from '../ipcRendererHelper';
import EntryTool from 'entry-tool';
import DatabaseManager from '../../helper/databaseManager';

/**
 * 이 클래스는 Entry 프로젝트에서 entry-lms, entry-tool 을 사용하여 팝업 및 모달을 출력해야 하는 경우 사용한다.
 * entry-tool 의 팝업은 기본적으로 타겟이될 div HTMLElement 가 필요하므로 인스턴스를 만들어서 사용해야 한다.
 *
 * @export
 * @class
 */
class EntryModalHelper {
    /**
     * 오브젝트 추가 팝업을 노출한다
     */
    static showSpritePopup() {
        this._showImagePopup('sprite');
    }

    static showShapePopup() {
        this._showImagePopup('shape');
    }

    static _showImagePopup(type) {
        const popup = this.popup;
        this._switchPopup(type, {
            fetch: (data) => {
                DatabaseManager.findAll(data)
                    .then((result) => {
                        popup.setData({
                            data: { data: result },
                        });
                    });
            },
            search: (data) => {
                console.log('popupSearch', data);
                // if (data.searchQuery === '') {
                //     return;
                // }
                // this.props.fetchPopup({
                //     url: `/api/${type}/search/${data.searchQuery}`,
                //     callback: (data) => {
                //         Entry[name].setData({ data: { data } });
                //     },
                // });
            },
            submit: (data) => {
                switch (name) {
                    case 'spritePopup':
                        console.log('popupSubmitSpritePopup', data);
                        /*data.selected.forEach(function(item) {
                            const object = {
                                id: Entry.generateHash(),
                                objectType: 'sprite',
                                sprite: item, // 스프라이트 정보
                            };
                            Entry.container.addObject(object, 0);
                        });*/
                        break;
                    case 'shapePopup':
                        console.log('popupSubmitShapePopup', data);
                        /*data.selected.forEach(function(object) {
                            object.id = Entry.generateHash();
                            Entry.playground.addPicture(object, true);
                        });*/
                        break;
                }
            },
            select: (data) => {
                console.log('popupSelectData');
                /*switch (name) {
                    case 'spritePopup': {
                        const object = {
                            id: Entry.generateHash(),
                            objectType: 'sprite',
                            sprite: data.item, // 스프라이트 정보
                        };
                        Entry.container.addObject(object, 0);
                    }
                    case 'shapePopup': {
                        const picture = data.item;

                        picture.id = Entry.generateHash();
                        Entry.playground.addPicture(picture, true);
                        break;
                    }
                }*/
            },
            draw: () => {
                console.log('draw');
                /*switch (name) {
                    case 'spritePopup': {
                        const object = {
                            id: Entry.generateHash(),
                            objectType: 'sprite',
                            sprite: {
                                name:
                                    Lang.Workspace.new_object +
                                    (Entry.container.getAllObjects().length + 1),
                                pictures: [
                                    {
                                        dimension: {
                                            width: 960,
                                            height: 540,
                                        },
                                        fileurl: `${Entry.mediaFilePath}_1x1.png`,
                                        name: Lang.Workspace.new_picture,
                                        type: '_system_',
                                    },
                                ],
                                sounds: [],
                                category: {
                                    main: 'new',
                                },
                            },
                        };
                        Entry.container.addObject(object, 0);
                        Entry.playground.changeViewMode('picture');
                        break;
                    }
                    case 'shapePopup': {
                        const item = {
                            id: Entry.generateHash(),
                            dimension: {
                                height: 1,
                                width: 1,
                            },
                            fileurl: `${Entry.mediaFilePath}_1x1.png`,
                            name: Lang.Workspace.new_picture,
                        };
                        Entry.playground.addPicture(item, true);
                        break;
                    }
                }*/
            },
            on: (data) => {
                /*let linebreak = true;
                if (data.writeType === 'one') {
                    linebreak = false;
                }
                const text = data.text || Lang.Blocks.TEXT;
                const object = {
                    id: Entry.generateHash(),
                    name: text, //Lang.Workspace.textbox,
                    text,
                    options: {
                        font: data.font,
                        bold: false,
                        underLine: false,
                        italic: false,
                        strike: data.effects.through || false,
                        colour: data.effects.color || '#000000',
                        background: data.effects.backgroundColor || '#ffffff',
                        lineBreak: linebreak,
                        ...data.effects,
                    },
                    objectType: 'textBox',
                    sprite: { sounds: [], pictures: [] },
                };
                Entry.container.addObject(object, 0);*/
                console.log('popupWrite', data);
            },
            uploads: (data) => {
                console.log('popupUploads', data);
                /*switch (name) {
                    case 'spritePopup':
                        data.uploads.forEach(function(item) {
                            const { sprite } = item;
                            if (sprite) {
                                const objects = sprite.objects;
                                const functions = sprite.functions;
                                const messages = sprite.messages;
                                const variables = sprite.variables;

                                if (
                                    Entry.getMainWS().mode === Entry.Workspace.MODE_VIMBOARD &&
                                    (!Entry.TextCodingUtil.canUsePythonVariables(variables) ||
                                        !Entry.TextCodingUtil.canUsePythonFunctions(functions))
                                ) {
                                    return entrylms.alert(Lang.Menus.object_import_syntax_error);
                                }
                                const objectIdMap = {};
                                variables.forEach((variable) => {
                                    const { object } = variable;
                                    if (object) {
                                        const id = variable.id;
                                        const idMap = objectIdMap[object];
                                        variable.id = Entry.generateHash();
                                        if (!idMap) {
                                            variable.object = Entry.generateHash();
                                            objectIdMap[object] = {
                                                objectId: variable.object,
                                                variableOriginId: [id],
                                                variableId: [variable.id],
                                            };
                                        } else {
                                            variable.object = idMap.objectId;
                                            idMap.variableOriginId.push(id);
                                            idMap.variableId.push(variable.id);
                                        }
                                    }
                                });
                                Entry.variableContainer.appendMessages(messages);
                                Entry.variableContainer.appendVariables(variables);
                                Entry.variableContainer.appendFunctions(functions);

                                objects.forEach(function(object) {
                                    const idMap = objectIdMap[object.id];
                                    if (idMap) {
                                        let script = object.script;
                                        idMap.variableOriginId.forEach((id, idx) => {
                                            const regex = new RegExp(id, 'gi');
                                            script = script.replace(regex, idMap.variableId[idx]);
                                        });
                                        object.script = script;
                                        object.id = idMap.objectId;
                                    } else if (Entry.container.getObject(object.id)) {
                                        object.id = Entry.generateHash();
                                    }
                                    if (item.objectType === 'textBox') {
                                        const text = item.text ? item.text : Lang.Blocks.TEXT;
                                        const options = item.options;
                                        object.objectType = 'textBox';
                                        Object.assign(object, {
                                            text,
                                            options,
                                            name: Lang.Workspace.textbox,
                                        });
                                    } else {
                                        object.objectType = 'sprite';
                                    }
                                    Entry.container.addObject(object, 0);
                                });
                            } else {
                                if (!item.id) {
                                    item.id = Entry.generateHash();
                                }

                                const object = {
                                    id: Entry.generateHash(),
                                    objectType: 'sprite',
                                    sprite: {
                                        name: item.name,
                                        pictures: [item],
                                        sounds: [],
                                        category: {},
                                    },
                                };
                                Entry.container.addObject(object, 0);
                            }
                        });
                        break;
                    case 'shapePopup':
                        data.uploads.forEach(function(item) {
                            item.id = Entry.generateHash();
                            Entry.playground.addPicture(item, true);
                        });
                        break;
                }*/
            },
            uploadFail: (data) => {
                root.entrylms.alert(Utils.getLang(`${data.messageParent}.${data.message}`));
            },
            fail: (data) => {
                root.entrylms.alert(Utils.getLang('Msgs.error_occured'));
            },
            error: (data) => {
                root.entrylms.alert(Utils.getLang('Msgs.error_occured'));
            },
        });
    }

    /**
     * 기존 팝업을 hide, event off 후, 신규 타입의 팝업을 노출한다.
     * 
     * @param {string}type 팝업 타입
     * @param {object}events 바인딩할 이벤트 목록들. key = eventName, value = function
     */
    static _switchPopup(type, events = {}) {
        const popup = this.popup;
        if (popup.isShow) {
            popup.hide();
        }

        popup.removeAllListeners();

        Object.entries(events).forEach(([eventName, func]) => {
            popup.on(eventName, func);
        });

        //TODO show(props) 하고싶은데 props = undefined 에서 부르면 Navigation component 를 부르는듯.
        popup.props = { type, baseUrl: './renderer/resources/node_modules' };
        popup.show();
    }

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

    static call() {
        console.log(this.targetDiv);
    }
}
const popupTargetElement = document.createElement('div');
popupTargetElement.classList = 'modal';

//TODO 팝업타입을 주고 props 가 없는경우는 init 이 불가능하다
EntryModalHelper.popup = new EntryTool({
    container: popupTargetElement,
    target: document.body,
    isShow: false,
    data: {
        data: {
            data: [],
        },
    },
    type: 'popup',
    props: { type: 'sprite', baseUrl: './renderer/resources/node_modules' },
});

export default EntryModalHelper;
