import IpcRendererHelper from '../ipcRendererHelper';
import StorageManager from '../storageManager';
import RendererUtils from '../rendererUtils';
import Constants from '../constants';
import EntryModalHelper from './entryModalHelper';

/**
 * 엔트리 코드로직과 관련된 유틸.
 * rendererUtils 와 다른 점은 Entry 관련 코드가 포함되면 이쪽.
 */
export default class {
    /**
     * 현재 엔트리 프로젝트가 변경점이 있는 경우,
     * 정말로 종료할 것인지 묻는다. 종료를 선택한 경우 현재 WS 의 레이아웃 크기를 저장한다.
     * 저장을 해주지는 않는다.
     *
     * @return {boolean} 저장확인여부
     */
    static async confirmProjectWillDismiss() {
        let confirmProjectDismiss = true;
        if (!Entry.stateManager.isSaved()) {
            confirmProjectDismiss = await EntryModalHelper.getConfirmModal(
                RendererUtils.getLang('Menus.save_dismiss')
            );
        }

        if (confirmProjectDismiss) {
            this.saveCurrentWorkspaceInterface();
        }

        return confirmProjectDismiss;
    }

    /**
     * 즉시 리로드되어야 하는 프로젝트가 있는 경우 해당 프로젝트 리로드
     * 기존에 작업하던 자동저장 프로젝트가 있는 경우 confirm 후 리로드
     * 전부 아닌 경우 신규 프로젝트 리로드
     *
     * 프로젝트를 반환하는 경우에는 electron temp 프로젝트 폴더를 그대로 둔다.
     * 프로젝트를 반환하지 않는 경우에는 temp 프로젝트 폴더를 삭제한다.
     *
     * @return {Promise<Object>} undefined || Entry Project
     */
    static async getSavedProject() {
        const sharedObject = RendererUtils.getSharedObject();
        const { file } = sharedObject;
        const reloadProject = StorageManager.loadTempProject();
        const project = StorageManager.loadProject();

        console.log('Workspace load from file : ', file);
        if (file) {
            try {
                return await IpcRendererHelper.loadProject(file);
            } catch (e) {
                return undefined;
            } finally {
                sharedObject.file = undefined;
            }
        } else if (reloadProject) {
            return reloadProject;
        } else if (project) {
            let confirm = false;
            try {
                confirm = await EntryModalHelper.getConfirmModal(
                    RendererUtils.getLang('Workspace.confirm_load_temporary'),
                    RendererUtils.getLang('Workspace.confirm_load_header')
                );

                if (confirm) {
                    return project;
                } else {
                    return undefined;
                }
            } catch (e) {
                console.error(e);
                return undefined;
            } finally {
                await RendererUtils.clearTempProject({ saveTemp: confirm });
            }
        } else {
            await RendererUtils.clearTempProject();
            return undefined;
        }
    }

    /**
     * 사운드 오브젝트 (from resources/db) 를 Entry.soundQueue 에 로드한다.
     * @param {Array<Object>} sounds
     */
    static loadSound(sounds: any[] = []) {
        sounds.forEach((sound) => {
            const path =
                sound.path ||
                `${Constants.resourceSoundPath(sound.filename)}${sound.filename}${sound.ext}`;
            Entry.soundQueue.loadFile({
                id: sound._id,
                src: path,
                type: createjs.LoadQueue.SOUND,
            });
        });
    }

    /**
     * 오브젝트를 eo 파일로 만들어서 외부로 저장한다.
     * @param object 저장할 엔트리 오브젝트
     */
    static exportObject(object: IEntry.Object) {
        const { name, script } = object;
        const getObjectData = (script: any, index?: number) => {
            const blockList = script.getBlockList(undefined, undefined, index);
            const objectVariable = Entry.variableContainer.getObjectVariables(blockList);
            return {
                ...objectVariable,
                expansionBlocks: Entry.expansion.getExpansions(blockList),
            };
        };

        const objectVariable = getObjectData(script);
        objectVariable.objects = [object.toJSON()];

        RendererUtils.showSaveDialog(
            {
                defaultPath: name,
                filters: [{ name: 'Entry object file(.eo)', extensions: ['eo'] }],
            },
            (filePath) => {
                if (filePath) {
                    IpcRendererHelper.exportObject(filePath, objectVariable).then(() => {
                        console.log('object exported successfully');
                    });
                }
            }
        );
    }

    /**
     * 오브젝트를 엔트리에 추가한다.
     *
     * @param {Object}item 엔트리 외부 import 용 오브젝트
     * @property {Object}objects 오브젝트 목록
     * @property {Object}functions 오브젝트에서 사용된 함수목록
     * @property {Object}messages 오브젝트에서 사용된 메세지목록
     * @property {Object}variables 오브젝트에서 사용된 변수목록
     */
    static addObjectToEntry(item: EntryAddOptions) {
        if (!item.sprite) {
            console.error('object structure is not valid');
            return;
        }

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
                return window.EntryModal.alert(Lang.Menus.object_import_syntax_error);
            }

            const objectIdMap = {} as any;
            variables.forEach((variable: any) => {
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

            objects.forEach((object: any) => {
                const idMap = objectIdMap[object.id];
                if (idMap) {
                    let script = object.script;
                    idMap.variableOriginId.forEach((id: string, idx: number) => {
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
                // TODO: 첫번째 이미지에 sprite가 추가되는 원인 코드 찾아서 제거
                if (object.sprite.pictures.length > 0) {
                    object.sprite.pictures.forEach((picture: any) => {
                        delete picture.sprite;
                    });
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
    }

    static addPictureObjectToEntry(picture: IEntry.Picture) {
        if (!picture.id) {
            picture.id = Entry.generateHash();
        }

        const object = {
            id: Entry.generateHash(),
            objectType: 'sprite',
            sprite: {
                name: picture.name,
                pictures: [picture],
                sounds: [],
                category: {},
            },
        };

        Entry.container.addObject(object, 0);
    }

    /**
     * 그림판 영역에서 편집 혹은 신규생성된 이미지를 저장한다.
     * 편집인 경우 해당 오브젝트 > 이미지의 이전 이미지가 존재하는지 확인하고
     * 기본 이미지가 아닌 경우 삭제한다.
     * @param data
     * @property file 오브젝트 및 현재 행동 메타데이터.
     * @property image image src. base64 이미지이다.
     */
    static async saveCanvasImage(data: any) {
        const { file, image } = data;
        const { id, name, objectId, mode } = file;

        try {
            const croppedImageData = await RendererUtils.cropImageFromCanvas(image);
            const imageBuffer = Uint8Array.from(
                atob(croppedImageData.replace(/^data:image\/(png|gif|jpeg);base64,/, '')),
                (chr) => chr.charCodeAt(0)
            );

            // 만약 이전 파일명이 존재하는 경우 삭제처리를 위함
            file.prevFilename = Entry.container.getObject(objectId).getPicture(id).filename;

            const newPicture = await IpcRendererHelper.importPictureFromCanvas({
                file,
                image: imageBuffer,
            });
            // 엔트리에 이미지 추가

            if (mode === 'new') {
                newPicture.name = RendererUtils.getLang('Workspace.new_picture');
                Entry.playground.addPicture(newPicture, true);
            } else {
                newPicture.id = id;
                newPicture.name = name;
                Entry.playground.setPicture(newPicture);
            }

            // 엔트리 워크스페이스 내 이미지 캐싱
            const imageElement = new Image();
            imageElement.src = newPicture.fileurl;
            imageElement.onload = () => {
                const entityId = Entry.playground.object!.entity.id;
                const painterFileId = Entry.playground.painter.file.id;
                const cacheId = `${newPicture.id}${entityId}`;

                Entry.container.cachePicture(cacheId, imageElement);
                if (painterFileId === newPicture.id) {
                    Entry.playground.selectPicture(newPicture);
                }
            };
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * 엔트리 오브젝트에서 오브젝트명, 확장자를 호출한다.
     * @param entryObject 엔트리 사운드, 이미지 오브젝트
     * @property name 이름이 없는 경우 강제로 nonamed 출력
     * @property ext|extension 확장자. 없는 경우 defaultExtension 으로 대체
     * @param defaultExtension 확장자가 없는 경우 대체할 기본확장자
     */
    static getObjectNameWithExtension(entryObject: any, defaultExtension: string) {
        const filename = entryObject.name || 'nonamed';
        const extension = RendererUtils.sanitizeExtension(
            entryObject.ext || entryObject.extension,
            defaultExtension
        );

        return `${filename}${extension}`;
    }

    /**
     * 엔트리 현재 오브젝트, 블록메뉴의 width 를 저장한다.
     * 이는 entryjs 가 알아서 불러서 활용한다.
     */
    static saveCurrentWorkspaceInterface() {
        if (Entry.type === 'workspace') {
            if (localStorage && Entry.interfaceState) {
                StorageManager.setWorkspaceInterface(Entry.captureInterfaceState());
            }
        }
    }
}
