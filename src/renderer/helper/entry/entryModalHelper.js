import Modal from '../../resources/modal/app.js';
import root from 'window-or-global';
import Utils from '../rendererUtils';
import IpcRendererHelper from '../ipcRendererHelper';
import EntryTool from 'entry-tool';
import DatabaseManager from '../../helper/databaseManager';
import _ from 'lodash';

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
        const popup = this._switchPopup(type, {
            fetch: (data) => {
                DatabaseManager.findAll(data)
                    .then((result) => {
                        popup.setData({
                            data: { data: result },
                        });
                    });
            },
            search: (data) => {
                if (data.searchQuery === '') {
                    return;
                }
                DatabaseManager.search(data)
                    .then((result) => {
                        popup.setData({
                            data: { data: result },
                        });
                    });
            },
            submit: (data) => {
                switch (type) {
                    case 'sprite':
                        console.log('popupSubmitSpritePopup', data);
                        data.selected.forEach(function(item) {
                            const object = {
                                id: Entry.generateHash(),
                                objectType: 'sprite',
                                sprite: item, // 스프라이트 정보
                            };
                            Entry.container.addObject(object, 0);
                        });
                        break;
                    case 'shape':
                        console.log('popupSubmitShapePopup', data);
                        data.selected.forEach(function(object) {
                            object.id = Entry.generateHash();
                            Entry.playground.addPicture(object, true);
                        });
                        break;
                }
            },
            select: (data) => {
                console.log('popupSelectData');
                switch (type) {
                    case 'sprite': {
                        const object = {
                            id: Entry.generateHash(),
                            objectType: 'sprite',
                            sprite: data.item, // 스프라이트 정보
                        };
                        Entry.container.addObject(object, 0);
                        break;
                    }
                    case 'shape': {
                        const picture = data.item;
                        picture.id = Entry.generateHash();
                        Entry.playground.addPicture(picture, true);
                        break;
                    }
                }
            },
            draw: () => {
                console.log('draw', type);
                switch (type) {
                    case 'sprite': {
                        const object = {
                            id: Entry.generateHash(),
                            objectType: 'sprite',
                            sprite: {
                                name: `${Utils.getLang('Workspace.new_object')}${Entry.container.getAllObjects().length + 1}`,
                                pictures: [
                                    {
                                        dimension: {
                                            width: 960,
                                            height: 540,
                                        },
                                        fileurl: `${Entry.mediaFilePath}_1x1.png`,
                                        name: Utils.getLang('Workspace.new_picture'),
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
                    case 'shape': {
                        const item = {
                            id: Entry.generateHash(),
                            dimension: {
                                height: 1,
                                width: 1,
                            },
                            fileurl: `${Entry.mediaFilePath}_1x1.png`,
                            name: Utils.getLang('Workspace.new_picture'),
                        };
                        Entry.playground.addPicture(item, true);
                        break;
                    }
                }
            },
            write: (data) => {
                console.log('popupWrite', data);
                let linebreak = true;
                if (data.writeType === 'one') {
                    linebreak = false;
                }
                const text = data.text || Utils.getLang('Blocks.TEXT');
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
                Entry.container.addObject(object, 0);
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

    static showSoundPopup() {
        const popup = this._switchPopup('sound', {
            fetch: (data) => {
                DatabaseManager.findAll(data)
                    .then((result) => {
                        popup.setData({
                            data: { data: result },
                        });
                        Utils.loadSound(result);
                    });
                console.log(data);
                // let url = `/api/sound/browse/default/${data.sidebar}`;
                // if (data.subMenu && data.subMenu !== 'all') {
                //     url = `/api/sound/browse/default/${data.sidebar}/${data.subMenu}`;
                // }
                // this.props.fetchPopup({
                //     url,
                //     popup: name,
                //     callback: (data) => {
                //         Entry.soundPopup.setData({ data: { data } });
                //         this.loadSound(data);
                //     },
                // });
            },
            search: (data) => {
                console.log(data);
                if (data.searchQuery === '') {
                    return;
                }
                DatabaseManager.search(data)
                    .then((result) => {
                        popup.setData({
                            data: { data: result },
                        });
                        Utils.loadSound(result);
                    });
                // this.props.fetchPopup({
                //     url: `/api/sound/search/${data.searchQuery}`,
                //     callback: (data) => {
                //         Entry.soundPopup.setData({ data: { data } });
                //         this.loadSound(data);
                //     },
                // });
            },
            submit: (data) => {
                console.log(data);
                data.selected.forEach(function(item) {
                    item.id = Entry.generateHash();
                    Entry.playground.addSound(item, true);
                });
                root.createjs.Sound.stop();
            },
            select: (data) => {
                console.log(data);
                const item = {
                    id: Entry.generateHash(),
                    ...data.item,
                };
                Entry.playground.addSound(item, true);
            },
            loaded: Utils.loadSound,
            load: Utils.loadSound,
            itemoff: () => {
                console.log('itemOff');
                return root.createjs.Sound.stop();
            },
            itemon: (data) => {
                console.log('itemon', data);
                root.createjs.Sound.play(data.id);
            },
            uploads:(data) => {
                console.log(data);
                // data.uploads.forEach(function(item) {
                //     item.id = Entry.generateHash();
                //     Entry.playground.addSound(item, true);
                // });
                // createjs.Sound.stop();
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

    static showExpansionPopup() {
        let expansionBlocks = _.uniq(_.values(Entry.EXPANSION_BLOCK_LIST));
        expansionBlocks = _.sortBy(expansionBlocks, function(item) {
            let result = '';
            if (item.title) {
                item.nameByLang = item.title[root.Lang.type];
                result = item.title.ko.toLowerCase();
            }
            return result;
        });

        this._switchPopup('expansion', {
            submit: (data) => {
                data.selected.forEach(function(item) {
                    item.id = Entry.generateHash();
                    Entry.playground.addExpansionBlock(item, true, true);
                });
            },
            select: (data) => {
                data.item.id = Entry.generateHash();
                Entry.playground.addExpansionBlock(data.item, true, true);
            },
        }, expansionBlocks);
    }

    /**
     * 기존 팝업을 hide, event off 후, 신규 타입의 팝업을 노출한다.
     * 
     * @param {string}type 팝업 타입
     * @param {object}events 바인딩할 이벤트 목록들. key = eventName, value = function
     * @param {*}data entry-tool popup 최초 init 시에 들어갈 data object
     * @return popup 자신을 반환한다. 내부 콜백에서 자신을 사용해야 하는 경우 활용가능하다.
     */
    static _switchPopup(type, events = {}, data = []) {
        const popup = this.loadPopup(type, data);
        if (popup.isShow) {
            popup.hide();
        }

        //TODO 돌려쓰기용 함수인데, 만약 돌려쓰기가 안된다면 이 함수를 사용하는 함수에 popup 을 직접 넣고 고정적으로 사용하도록 한다.
        popup.removeAllListeners();

        Object.entries(events).forEach(([eventName, func]) => {
            popup.on(eventName, func);
        });

        popup.show({ type, baseUrl: './renderer/resources/node_modules' });
        return popup;
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
}
const popupTargetElement = () => {
    const targetDiv = document.createElement('div');
    targetDiv.classList = 'modal';

    return targetDiv;
};

//TODO 렌더가 바로 되지 않는 현상이 해결되면 popup 하나로 돌려쓰기 한다.
EntryModalHelper.loadPopup = (type, data) => {
    const popup = EntryModalHelper[`${type}Popup`];
    if (popup === undefined) {
        EntryModalHelper[`${type}Popup`] = new EntryTool({
            container: popupTargetElement(),
            target: document.body,
            isShow: false,
            data: {
                data: {
                    data,
                },
            },
            type: 'popup',
            props: { type, baseUrl: './renderer/resources/node_modules' },
        });

        return EntryModalHelper[`${type}Popup`];
    } else {
        return popup;
    }
};

export default EntryModalHelper;
