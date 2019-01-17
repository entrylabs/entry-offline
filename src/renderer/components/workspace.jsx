import React, { Component } from 'react';
import Header from './header';
import './workspace.scss';
import '../resources/styles/fonts.scss';
import { connect } from 'react-redux';
import { commonAction, modalProgressAction } from '../actions';
import { FETCH_POPUP_ITEMS, UPDATE_PROJECT, WS_MODE } from '../actions/types';
import _includes from 'lodash/includes';
import _debounce from 'lodash/debounce';
import { ModalProgress } from 'entry-tool/component';
import EntryTool from 'entry-tool';
import root from 'window-or-global';
import EntryUtils from '../helper/entryUtils';
import Utils from '../helper/rendererUtils';
import IpcRendererHelper from '../helper/ipcRendererHelper';
import LocalStorageManager from '../helper/storageManager';
import ImportToggleHelper from '../helper/importToggleHelper';
import DatabaseManager from '../helper/databaseManager';

/* global Entry, EntryStatic */
class Workspace extends Component {
    get LOCAL_STORAGE_KEY() {
        return 'localStorageProject';
    }

    get LOCAL_STORAGE_KEY_RELOAD() {
        return 'localStorageProjectReload';
    }

    get initOption() {
        return Object.assign({},
            this.defaultInitOption,
            EntryStatic.initOptions,
        );
    }

    constructor(props) {
        super(props);
        this.modal = null;
        this.isSaving = false;
        this.container = React.createRef();

        const { project = {} } = props;
        const { name } = project;

        this.projectName = name || Utils.getDefaultProjectName();
        this.state = {
            programLanguageMode: 'block',
        };

        this.defaultInitOption = {
            type: 'workspace',
            libDir: 'renderer/bower_components',
            fonts: EntryStatic.fonts,
            textCodingEnable: true,
        };
    }

    async componentDidMount() {
        this.hwCategoryList = EntryStatic.hwCategoryList;
        Entry.init(this.container.current, this.initOption);
        Entry.enableArduino();

        //TODO tempProject 에 저장된 데이터가 있는 경우, entrylms 로 불러오기 확인
        //TODO 그렇다면 신규 프로젝트를 오픈하거나 로드하는 경우 temp 삭제해야함
        Entry.loadProject();

        this.modal = document.createElement('div');
        this.modal.className = 'modal';


        this.loadImagePopup();
        this.addEntryEvents();
    }

    loadImagePopup() {
        this.loadSpritePopup('shapePopup', { type: 'shape', baseUrl: './renderer/resources/node_modules' }, "picture");
        this.loadSpritePopup('spritePopup', { type: 'sprite', baseUrl: './renderer/resources/node_modules' }, "sprite");
    }

    loadSpritePopup(name, props, type) {
        Entry[name] = new EntryTool({
            container: this.modal.cloneNode(true),
            target: document.body,
            isShow: false,
            data: {
                data: {
                    data: [],
                },
            },
            type: 'popup',
            props,
        })
            .on('fetch', async(data) => {
                DatabaseManager.findAll(data)
                    .then((result) => {
                        Entry[name].setData({ data: { data: result } });
                    });
            })
            .on('search', (data) => {
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
            })
            .on('submit', function(data) {
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
            })
            .on('select', function(data) {
                console.log('popupSelectData')
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
            })
            .on('draw', () => {
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
            })
            .on('write', function(data) {
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
            })
            .on('uploads', function(data) {
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
            })
            .on('uploadFail', function(data) {
                root.entrylms.alert(Utils.getLang(`${data.messageParent}.${data.message}`));
            })
            .on('fail', function(data) {
                root.entrylms.alert(Utils.getLang('Msgs.error_occured'));
            })
            .on('error', function(data) {
                root.entrylms.alert(Utils.getLang('Msgs.error_occured'));
            });
    }

    addEntryEvents() {
        const addEventListener = Entry.addEventListener.bind(Entry);

        // 교과형에서 하드웨어가 바뀔때 마다 카테고리 변화
        addEventListener('hwChanged', this.handleHardwareChange);
        // 하드웨어 다운로드 탭에서 다운로드 처리
        addEventListener('hwDownload', this.handleHardwareDownload.bind(this));
        // 저장처리
        addEventListener('saveWorkspace', () => {
            console.log('saveWorkspace');
        });
        // exportObject
        addEventListener('exportObject', () => {
            console.log('exportObject');
        });
        // 리스트 Import
        addEventListener('openImportListModal', EntryUtils.openImportListModal);
        // 리스트 Export
        addEventListener('openExportListModal', EntryUtils.openExportListModal);

        addEventListener('openPictureManager', () => {
            Entry.shapePopup.show();
        });
        addEventListener('openSpriteManager', () => {
            Entry.spritePopup.show();
        });
        addEventListener('openSoundManager', () => {
            Entry.soundPopup.show();
        });
        addEventListener('openExpansionBlockManager', () => {
            Entry.expansionPopup.show();
        });
        addEventListener('openPictureImport', () => {
            Entry.paintPopup.show();
        });

        if (!Entry.creationChangedEvent) {
            Entry.creationChangedEvent = new Entry.Event(window);
        }
        Entry.creationChangedEvent.attach(this, this.handleStorageProjectSave);

        const workspace = Entry.getMainWS();
        if (workspace) {
            workspace.changeEvent.attach(
                this,
                this.handleChangeWorkspaceMode,
            );
        }
    }

    handleChangeWorkspaceMode() {
        const workspace = Entry.getMainWS();
        const { mode } = workspace;
        let key = 'block';
        switch (mode) {
            case Entry.Workspace.MODE_BOARD:
            case Entry.Workspace.MODE_OVERLAYBOARD:
                key = 'block';
                break;
            case Entry.Workspace.MODE_VIMBOARD:
                key = 'python';
                break;
        }

        const { programLanguageMode } = this.state;
        if (programLanguageMode !== key) {
            this.setState(() => {
                return {
                    programLanguageMode: key,
                };
            });
        }
    }

    handleStorageProjectSave = _debounce((isImmediate, option = {}) => {
        const { engine } = Entry;
        if (engine && engine.isState('run')) {
            return;
        }

        const project = Entry.exportProject();
        if (project) {
            project.name = this.projectName;
            Object.assign(project, option);
            LocalStorageManager.saveProject(project);
        }
    }, 300);

    handleHardwareChange = () => {
        const hw = Entry.hw;
        const hwCategoryList = this.hwCategoryList;

        if (
            (hw.connected && hw.hwModule && this.lastHwName === hw.hwModule.name) ||
            !EntryStatic.isPracticalCourse
        ) {
            return;
        }
        const blockMenu = Entry.playground.blockMenu;
        if (hw.connected && hw.hwModule) {
            const hwName = hw.hwModule.name;
            if (_includes(EntryStatic.hwMiniSupportList, hwName)) {
                hwCategoryList.forEach(function(categoryName) {
                    blockMenu.unbanCategory(categoryName);
                });
                blockMenu.banCategory('arduino');
                blockMenu.banCategory('hw_robot');
            } else {
                hwCategoryList.forEach(function(categoryName) {
                    blockMenu.banCategory(categoryName);
                });
                blockMenu.banCategory('hw_robot');
                blockMenu.unbanCategory('arduino');
            }
            this.lastHwName = hwName;
        } else {
            hwCategoryList.forEach(function(categoryName) {
                blockMenu.banCategory(categoryName);
            });
            blockMenu.banCategory('arduino');
            blockMenu.unbanCategory('hw_robot');
            this.lastHwName = undefined;
        }
    };

    handleHardwareDownload(type) {
        console.log(type);
    }

    handleSaveAction = async(key) => {
        const saveFunction = async(filePath) => {
            if (!filePath) {
                return;
            }

            this.showModalProgress(
                'progress',
                Utils.getLang('Workspace.saving_msg'),
                Utils.getLang('Workspace.fail_contact_msg'),
            );

            try {
                // 프로젝트를 가져온다. 프로젝트 명과 워크스페이스 모드를 주입한다.
                const { common } = this.props;
                const { mode } = common;

                Entry.stage.handle.setVisible(false);
                Entry.stage.update();
                const project = Entry.exportProject();
                project.isPracticalCourse = mode === 'practical_course';
                project.name = this.projectName;
                // project.parent = parent;

                await IpcRendererHelper.saveProject(project, filePath);
                this.projectSavedPath = filePath;

                // 모달 해제 후 엔트리 토스트로 저장처리
                this.hideModalProgress();
                Entry.stateManager.addStamp();
                Entry.toast.success(
                    Utils.getLang('Workspace.saved'),
                    `${this.projectName} ${Utils.getLang('Workspace.saved_msg')}`
                );
            } catch (err) {
                console.error(err);
                this.showModalProgress(
                    'error',
                    Utils.getLang('Workspace.saving_fail_msg'),
                    Utils.getLang('Workspace.fail_contact_msg')
                );
            }
        };

        if (key === 'save' && this.projectSavedPath) {
            await saveFunction(this.projectSavedPath);
        } else {
            const targetPath = this.projectSavedPath || '*';
            Utils.showSaveDialog({
                defaultPath: `${targetPath}/${this.projectName}`,
                filters: [{ name: 'Entry File', extensions: ['ent'] }],
            }, saveFunction);
        }
    };

    handleFileAction = (type) => {
        if (type === 'new') {
            if (Utils.confirmProjectWillDismiss()) {
                IpcRendererHelper.resetDirectory();
                delete this.projectSavedPath;
                this.loadProject();
            }
        } else if (type === 'open_offline') {
            const { changeWorkspaceMode, common } = this.props;
            const { mode: currentWorkspaceMode } = common;
            this.showModalProgress(
                'progress',
                Utils.getLang('Workspace.uploading_msg'),
                Utils.getLang('Workspace.fail_contact_msg'),
            );

            Utils.showOpenDialog({
                /*defaultPath: storage.getItem('defaultPath') || '',*/
                properties: ['openFile'],
                filters: [{ name: 'Entry File', extensions: ['ent'] }],
            }, async(filePaths) => {
                if (Array.isArray(filePaths)) {
                    const filePath = filePaths[0];
                    const project = await IpcRendererHelper.loadProject(filePath);

                    this.projectName = project.name;
                    this.projectSavedPath = project.savedPath;
                    const isToPracticalCourse = project.isPracticalCourse;

                    // 현재 WS mode 와 이후 변경될 모드가 다른 경우
                    if ((currentWorkspaceMode === 'workspace') === isToPracticalCourse) {
                        if (isToPracticalCourse) {
                            await ImportToggleHelper.changeEntryStatic('practical_course');
                            changeWorkspaceMode('practical_course');
                        } else {
                            await ImportToggleHelper.changeEntryStatic('workspace');
                            changeWorkspaceMode('workspace');
                        }
                    }

                    this.loadProject(project);
                }

                this.hideModalProgress();
            });
        }
    };

    /**
     * 프로젝트를 로드한 후, 이벤트 연결을 시도한다.
     * @param{Object?} project undefined 인 경우 신규 프로젝트로 생성
     */
    loadProject = (project) => {
        Entry.disposeContainer();
        Entry.reloadBlock();
        Entry.init(this.container.current, this.initOption);
        Entry.loadProject(project);
        this.addEntryEvents();
    };

    reloadProject = () => {
        this.loadProject(Entry.exportProject());
    };

    handleProgramLanguageModeChanged = (mode) => {
        const option = {};

        if (mode === 'block') {
            option.boardType = Entry.Workspace.MODE_BOARD;
            option.textType = -1;
        } else {
            option.boardType = Entry.Workspace.MODE_VIMBOARD;
            option.textType = Entry.Vim.TEXT_TYPE_PY;
            option.runType = Entry.Vim.WORKSPACE_MODE;
        }

        const workspace = Entry.getMainWS();

        if (workspace) {
            const expectedBoardType = option.boardType;

            workspace.setMode(option);
            const actualBoardType = workspace.getMode();

            if (expectedBoardType === actualBoardType) {
                this.setState({
                    programLanguageMode: mode,
                });
            } else {
                console.error('entry workspace mode change failed');
            }
        } else {
            console.error('entry workspace not found!');
        }
    };

    showModalProgress(type, title, description) {
        const { modalProgressAction } = this.props;
        modalProgressAction({
            isShow: true,
            data: {
                type,
                title,
                description,
            },
        });
    }

    hideModalProgress = () => {
        const { modalProgressAction } = this.props;
        modalProgressAction({
            isShow: false,
        });
    };

    render() {
        const { programLanguageMode } = this.state;
        const { modal } = this.props;
        const { isShow, data } = modal;
        const { title, type, description } = data;

        return (
            <div>
                <Header
                    onSaveAction={this.handleSaveAction}
                    onFileAction={this.handleFileAction}
                    onReloadProject={this.reloadProject}
                    onLoadProject={this.loadProject}
                    onProgramLanguageChanged={this.handleProgramLanguageModeChanged}
                    onProjectNameChanged={(changedName) => (this.projectName = changedName)}
                    projectName={this.projectName}
                    programLanguageMode={programLanguageMode}
                />
                <div ref={this.container} className="workspace"/>
                ;
                {isShow && (
                    <ModalProgress
                        title={title}
                        type={type}
                        description={description}
                        onClose={this.hideModalProgress}
                    />
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return { ...state };
};

const mapDispatchToProps = {
    modalProgressAction,
    changeWorkspaceMode: (data) => commonAction(WS_MODE, data),
    updateProject: (data) => {
        return commonAction(UPDATE_PROJECT, data);
    },
    fetchPopup: (data) => {
        return commonAction(FETCH_POPUP_ITEMS, data);
    },
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Workspace);
