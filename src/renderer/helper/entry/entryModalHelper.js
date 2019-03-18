import Modal from '../../resources/modal/app.js';
import root from 'window-or-global';
import RendererUtils from '../rendererUtils';
import IpcRendererHelper from '../ipcRendererHelper';
import EntryTool from 'entry-tool';
import DatabaseManager from '../../helper/databaseManager';
import StorageManager from '../storageManager';
import _ from 'lodash';
import EntryUtils from './entryUtils';

/**
 * 이 클래스는 Entry 프로젝트에서 entry-lms, entry-tool 을 사용하여 팝업 및 모달을 출력해야 하는 경우 사용한다.
 * entry-tool 의 팝업은 기본적으로 타겟이될 div HTMLElement 가 필요하므로 인스턴스를 만들어서 사용해야 한다.
 *
 * @export
 * @class
 */
//TODO object fetch result sort 필요?
class EntryModalHelper {
    /**
     * 오브젝트 추가 팝업을 노출한다
     */
    static showSpritePopup() {
        console.log('object popup show');
        const popup = this._switchPopup('sprite', {
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
            submit: async(data) => {
                console.log('popupSubmitSpritePopup', data);
                const newObjects = await IpcRendererHelper.importObjectsFromResource(data.selected);
                newObjects.forEach((item) => {
                    const labeledItem = EntryModalHelper._getLabeledObject(item);
                    const object = {
                        id: Entry.generateHash(),
                        objectType: 'sprite',
                        sprite: labeledItem, // 스프라이트 정보
                    };
                    Entry.container.addObject(object, 0);
                });
            },
            select: (data) => {
                const object = {
                    id: Entry.generateHash(),
                    objectType: 'sprite',
                    sprite: data.item, // 스프라이트 정보
                };
                Entry.container.addObject(object, 0);
            },
            draw: () => {
                const object = {
                    id: Entry.generateHash(),
                    objectType: 'sprite',
                    sprite: {
                        name: `${RendererUtils.getLang('Workspace.new_object')
                        }${Entry.container.getAllObjects().length + 1}`,
                        pictures: [
                            {
                                dimension: {
                                    width: 960,
                                    height: 540,
                                },
                                fileurl: `${Entry.mediaFilePath}_1x1.png`,
                                name: RendererUtils.getLang('Workspace.new_picture'),
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
            },
            write: (data) => {
                console.log('popupWrite', data);
                let linebreak = true;
                if (data.writeType === 'one') {
                    linebreak = false;
                }
                const text = data.text || RendererUtils.getLang('Blocks.TEXT');
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
            dummyUploads: async({ formData, objectData }) => {
                const pictures = formData.values();
                const objects = objectData.values();

                const uploadPicturesPaths = [];
                const uploadObjectPaths = [];
                // picture files
                for (const value of pictures) {
                    if (value.path) {
                        uploadPicturesPaths.push(value.path);
                    }
                }

                // eo files
                for (const value of objects) {
                    if (value.path) {
                        uploadObjectPaths.push(value.path);
                    }
                }

                const results = await IpcRendererHelper.importPictures(uploadPicturesPaths);
                const objectResults = await IpcRendererHelper.importObjects(uploadObjectPaths);

                popup.setData({
                    data: {
                        data: [],
                        uploads: results.concat(
                            objectResults.map((objectModel) => {
                                // thumbnail 용으로 쓸 selectedPicture 표기. 본 데이터는 sprite
                                const [firstObject] = objectModel.objects;

                                let selected = firstObject.selectedPicture;
                                if (firstObject.objectType === 'textBox') {
                                    // selected = firstObject;
                                    selected = {
                                        name: firstObject.name,
                                        text: firstObject.text,
                                        objectType: firstObject.objectType,
                                        options: firstObject.entity || {},
                                        _id: Entry.generateHash(),
                                        fileurl: 'renderer/resources/images/popup/text_icon.png',
                                    };
                                }

                                selected.sprite = objectModel;
                                return selected;
                            })
                        ),
                    },
                });
            },
            uploads: (data) => {
                data.uploads.forEach(function(objectModel) {
                    const { sprite, objectType = '' } = objectModel;
                    if (sprite || objectType === 'textBox') {
                        EntryUtils.addObjectToEntry(objectModel);
                    } else {
                        EntryUtils.addPictureObjectToEntry(objectModel);
                    }
                });
            },
            uploadFail: (data) => {
                root.entrylms.alert(RendererUtils.getLang(`${data.messageParent}.${data.message}`));
            },
            fail: (data) => {
                root.entrylms.alert(RendererUtils.getLang('Msgs.error_occured'));
            },
            error: (data) => {
                root.entrylms.alert(RendererUtils.getLang('Msgs.error_occured'));
            },
        });
    }

    /**
     * 모양 추가 팝업을 노출한다.
     * fetch 시 Object 와 동일하나, Object 내의 Pictures 를 전부 까서 보여주는 차이가 있다.
     */
    static showPicturePopup() {
        const popup = this._switchPopup('picture', {
            fetch: (data) => {
                DatabaseManager.findAll({
                    ...data,
                    type: 'picture',
                })
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
                DatabaseManager.search({
                    ...data,
                    type: 'picture',
                })
                    .then((result) => {
                        popup.setData({
                            data: { data: result },
                        });
                    });
            },
            submit: async(data) => {
                const pictures = await IpcRendererHelper.importPicturesFromResource(data.selected);
                pictures.forEach((object) => {
                    const labeledObject = EntryModalHelper._getLabeledObject(object);
                    labeledObject.id = Entry.generateHash();
                    Entry.playground.addPicture(labeledObject, true);
                });
            },
            select: (data) => {
                const picture = data.item;
                picture.id = Entry.generateHash();
                Entry.playground.addPicture(picture, true);
            },
            draw: () => {
                const item = {
                    id: Entry.generateHash(),
                    dimension: {
                        height: 1,
                        width: 1,
                    },
                    fileurl: `${Entry.mediaFilePath}_1x1.png`,
                    name: RendererUtils.getLang('Workspace.new_picture'),
                };
                Entry.playground.addPicture(item, true);
            },
            write: (data) => {
                console.log('popupWrite', data);
                let linebreak = true;
                if (data.writeType === 'one') {
                    linebreak = false;
                }
                const text = data.text || RendererUtils.getLang('Blocks.TEXT');
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
            dummyUploads: async({ formData }) => {
                const files = formData.values(); // keyName : ...uploadFile${idx}

                try {
                    const uploadFilePaths = [];
                    for (const value of files) {
                        if (value instanceof File) {
                            uploadFilePaths.push(value.path);
                        }
                    }

                    const results = await IpcRendererHelper.importPictures(uploadFilePaths);
                    popup.setData({
                        data: {
                            data: [], // 없으면 에러남. entry-tool 의 수정필요
                            uploads: results,
                        },
                    });
                } catch (e) {
                    console.error(e);
                }
            },
            uploads: (data) => {
                // upload 된 데이터의 submit 과 동일
                data.uploads.forEach((picture) => {
                    // css 에 들어갈 background-url fileUrl 의 경우, windows 에서도 / 여야 한다.
                    picture.fileurl = picture.fileurl.replace(/\\/gi, '/');
                    Entry.playground.addPicture(picture, true);
                });
            },
            uploadFail: (data) => {
                root.entrylms.alert(RendererUtils.getLang(`${data.messageParent}.${data.message}`));
            },
            fail: (data) => {
                root.entrylms.alert(RendererUtils.getLang('Msgs.error_occured'));
            },
            error: (data) => {
                root.entrylms.alert(RendererUtils.getLang('Msgs.error_occured'));
            },
        });
    }

    /**
     * 소리 추가 팝업을 노출한다.
     * 소리는 추가됨과 동시에 loadSound 함수를 통해 실제 mp3 파일을 Entry 에 추가한다.
     */
    static showSoundPopup() {
        const popup = this._switchPopup('sound', {
            fetch: (data) => {
                DatabaseManager.findAll(data)
                    .then((result) => {
                        popup.setData({
                            data: { data: result },
                        });
                        EntryUtils.loadSound(result);
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
                        EntryUtils.loadSound(result);
                    });
            },
            submit: async(data) => {
                const sounds = await IpcRendererHelper.importSoundsFromResource(data.selected);
                sounds.forEach((item) => {
                    const labeledItem = EntryModalHelper._getLabeledObject(item);
                    labeledItem.id = Entry.generateHash();
                    Entry.playground.addSound(labeledItem, true);
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
            loaded: EntryUtils.loadSound,
            load: EntryUtils.loadSound,
            itemoff: () => {
                return root.createjs.Sound.stop();
            },
            itemon: (data) => {
                root.createjs.Sound.play(data.id);
            },
            dummyUploads: async({ formData }) => {
                const files = formData.values(); // keyName : ...uploadFile${idx}

                try {
                    const uploadFilePaths = [];
                    for (const value of files) {
                        if (value instanceof File) {
                            uploadFilePaths.push(value.path);
                        }
                    }

                    const results = await IpcRendererHelper.importSounds(uploadFilePaths);
                    createjs.Sound.stop();

                    EntryUtils.loadSound(results);
                    popup.setData({
                        data: {
                            data: [], // 없으면 에러남. entry-tool 의 수정필요
                            uploads: results,
                        },
                    });
                } catch (e) {
                    console.error(e);
                }
            },
            uploads:(data) => {
                console.log(data);
                data.uploads.forEach(function(item) {
                    item.id = Entry.generateHash();
                    Entry.playground.addSound(item, true);
                });
                createjs.Sound.stop();
            },
            uploadFail: (data) => {
                root.entrylms.alert(RendererUtils.getLang(`${data.messageParent}.${data.message}`));
            },
            fail: (data) => {
                root.entrylms.alert(RendererUtils.getLang('Msgs.error_occured'));
            },
            error: (data) => {
                root.entrylms.alert(RendererUtils.getLang('Msgs.error_occured'));
            },
        });
    }

    /**
     * 확장블록 리스트를 가져와, 확장블록 추가 팝업을 노출한다.
     */
    static showExpansionPopup() {
        let expansionBlocks = _.uniq(_.values(Entry.EXPANSION_BLOCK_LIST));
        expansionBlocks = _.sortBy(expansionBlocks, function(item) {
            let result = '';
            if (item.title) {
                item.nameByLang = item.title[RendererUtils.getLangType() || 'ko'];
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
     * 그림판의 편집 > 가져오기 시 팝업을 노출한다. showPicturePopup 과 동일한 DB table 이다.
     * 검색기능이 없다.
     */
    static showPaintPopup() {
        const popup = this._switchPopup('paint', {
            fetch: (data) => {
                DatabaseManager.findAll({
                    ...data,
                    type: 'picture',
                })
                    .then((result) => {
                        popup.setData({
                            data: { data: result },
                        });
                    });
            },
            submit: (data) => {
                const item = data.selected[0];
                if (item) {
                    item.id = Entry.generateHash();
                    Entry.dispatchEvent('pictureImport', item);
                }
            },
            select: (data) => {
                const item = data.item;
                if (item) {
                    item.id = Entry.generateHash();
                    Entry.dispatchEvent('pictureImport', item);
                }
            },
            dummyUploads: async({ formData }) => {
                const files = formData.values(); // keyName : ...uploadFile${idx}

                try {
                    const uploadFilePaths = [];
                    for (const value of files) {
                        if (value instanceof File) {
                            uploadFilePaths.push(value.path);
                        }
                    }

                    const results = await IpcRendererHelper.importPictures(uploadFilePaths);
                    popup.setData({
                        data: {
                            data: [], // 없으면 에러남. entry-tool 의 수정필요
                            uploads: results,
                        },
                    });
                } catch (e) {
                    console.error(e);
                }
            },
            uploads: (data) => {
                data.uploads.forEach(function(item) {
                    if (item.sprite) {
                        const obj = item.sprite.objects[0];
                        obj.id = Entry.generateHash();
                        Entry.container.addObject(obj, 0);
                        return;
                    }
                    if (!item.id) {
                        item.id = Entry.generateHash();
                    }
                    Entry.dispatchEvent('pictureImport', item);
                });
            },
            uploadFail: (data) => {
                root.entrylms.alert(RendererUtils.getLang(`${data.messageParent}.${data.message}`));
            },
            fail: (data) => {
                root.entrylms.alert(RendererUtils.getLang('Msgs.error_occured'));
            },
            error: (data) => {
                root.entrylms.alert(RendererUtils.getLang('Msgs.error_occured'));
            },
        });
    }

    /**
     * 기존 팝업을 hide, event off 후, 신규 타입의 팝업을 노출한다.
     *
     * @param {string}type 팝업 타입
     * @param {Object}events 바인딩할 이벤트 목록들. key = eventName, value = function
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

        popup.show({ type, baseUrl: './renderer/resources' });
        return popup;
    }

    /**
     * 팝업을 로드한다. 두번째부터는 기존 팝업을 그대로 사용한다.
     *
     * @param {!string} type
     * @param {?Object} data
     * @return {Object} popup
     */
    static loadPopup = (type, data) => {
        const popup = EntryModalHelper.popup;
        if (popup === undefined) {
            EntryModalHelper.popup = new EntryTool({
                container: (function() {
                    const targetDiv = document.createElement('div');
                    targetDiv.classList = 'modal';

                    return targetDiv;
                })(),
                target: document.body,
                isShow: false,
                data: {
                    data: {
                        data,
                    },
                    isOffline: true,
                    imageBaseUrl: './renderer/bower_components/entry-js/images/hardware/',
                },
                type: 'popup',
                props: { type, baseUrl: './renderer/resources' },
            });

            return EntryModalHelper.popup;
        } else {
            return popup;
        }
    };

    static openImportListModal() {
        new Modal()
            .createModal([{ type: 'LIST_IMPORT', theme: 'BLUE' }])
            .on('click', (e, data) => {
                switch (e) {
                    case 'save':
                        //아무것도 입력하지 않은 경우, 빈칸 하나만 있는 것으로 처리된다.
                        if (data.length === 1 && data[0] === '') {
                            root.entrylms.alert(RendererUtils.getLang('Menus.nothing_to_import'));
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
                        root.entrylms.alert(RendererUtils.getLang('Menus.content_copied'));
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

    static showUpdateCheckModal(latestVersion) {
        new Modal()
            .alert(
                `${RendererUtils.getLang('Msgs.version_update_msg1')
                    .replace(/%1/gi, latestVersion)
                }\n\n${RendererUtils.getLang('Msgs.version_update_msg3')}`,
                RendererUtils.getLang('General.update_title'),
                {
                    positiveButtonText: RendererUtils.getLang('General.recent_download'),
                    positiveButtonStyle: {
                        marginTop: '16px',
                        marginBottom: '16px',
                        width: '180px',
                    },
                    parentClassName: 'versionAlert',
                    withDontShowAgain: true,
                }
            )
            .one('click', (event, { dontShowChecked }) => {
                if (event === 'ok') {
                    IpcRendererHelper.openExternalUrl('https://playentry.org/#!/offlineEditor');
                }
                if (dontShowChecked) {
                    /*
                    ok 던 close 던 안열기 누른상태면 더이상 안염
                    localStorage 에는 latestVersion 을 저장
                    */
                    StorageManager.setLastDontShowVersion(latestVersion);
                }
            });
    }

    /**
     * 현재 워크스페이스의 언어에 따라 추가될 오브젝트의 이름을 변경한다.
     * 선택은 label 에서, 현재언어 > fallback 언어 > ko 순을 따른다.
     *
     * @param object{Object} 변환할 타겟 오브젝트
     * @return{Object} label 에 맞춰 이름이 치환된 오브젝트
     * @private
     */
    static _getLabeledObject(object) {
        object.pictures && object.pictures.map(this._getLabeledObject);
        object.sounds && object.sounds.map(this._getLabeledObject);

        const result = object;
        if (result.label) {
            result.name =
                result.label[RendererUtils.getLangType()] ||
                result.label[RendererUtils.getFallbackLangType()] ||
                result.name;
        }
        return result;
    }
}

export default EntryModalHelper;
