import React, { Component } from 'react';
import Header from './header';
import './workspace.scss';
import '../resources/styles/fonts.scss';
import { connect } from 'react-redux';
import { commonAction, modalProgressAction } from '../actions';
import { FETCH_POPUP_ITEMS, UPDATE_PROJECT, WS_MODE, CHANGE_PROJECT_NAME } from '../actions/types';
import _includes from 'lodash/includes';
import _debounce from 'lodash/debounce';
import entryPatch from '../helper/entry/entryPatcher';
import root from 'window-or-global';
import { ModalProgress } from 'entry-tool/component';
import ModalHelper from '../helper/entry/entryModalHelper';
import RendererUtils from '../helper/rendererUtils';
import IpcRendererHelper from '../helper/ipcRendererHelper';
import LocalStorageManager from '../helper/storageManager';
import ImportToggleHelper from '../helper/importToggleHelper';
import EntryUtils from '../helper/entry/entryUtils';

/* global Entry, EntryStatic */
class Workspace extends Component {
    get initOption() {
        return Object.assign({},
            this.defaultInitOption,
            EntryStatic.initOptions,
        );
    }

    constructor(props) {
        super(props);

        this.container = React.createRef();

        this.isFirstRender = true;
        this.state = {
            programLanguageMode: 'block',
        };

        this.defaultInitOption = {
            type: 'workspace',
            libDir: 'renderer/bower_components',
            defaultDir: 'renderer/resources',
            fonts: EntryStatic.fonts,
            textCodingEnable: true,
        };

        this.addMainProcessEvents();
    }

    componentDidMount() {
        IpcRendererHelper.checkUpdate();
        setTimeout(async() => {
            const project = await EntryUtils.getSavedProject();
            await this.loadProject(project);
            this.isFirstRender = false;
        }, 0);
    }

    addMainProcessEvents() {
        IpcRendererHelper.loadProjectFromMain(async(readProjectFunction) => {
            try {
                this.showModalProgress(
                    'progress',
                    RendererUtils.getLang('Workspace.uploading_msg'),
                    RendererUtils.getLang('Workspace.fail_contact_msg'),
                );
                const project = await readProjectFunction;
                await this.loadProject(project);
            } finally {
                this.hideModalProgress();
            }
        });
    }

    addEntryEvents() {
        const addEventListener = Entry.addEventListener.bind(Entry);

        // 교과형에서 하드웨어가 바뀔때 마다 카테고리 변화
        addEventListener('hwChanged', this.handleHardwareChange);
        // 하드웨어 다운로드 탭에서 다운로드 처리
        addEventListener('newWorkspace', () => {
            this.handleFileAction('new');
        });
        addEventListener('loadWorkspace', () => {
            this.handleFileAction('open_offline');
        });
        // 저장처리
        addEventListener('saveWorkspace', () => {
            this.handleSaveAction('save');
        });
        addEventListener('saveAsWorkspace', () => {
            this.handleSaveAction('saveAs');
        });
        addEventListener('saveCanvasImage', (data) => {
            this.handleCanvasImageSave(data);
        });
        // exportObject
        addEventListener('exportObject', EntryUtils.exportObject);
        // 리스트 Import
        addEventListener('openImportListModal', ModalHelper.openImportListModal);
        // 리스트 Export
        addEventListener('openExportListModal', ModalHelper.openExportListModal);

        addEventListener('openPictureManager', () => {
            ModalHelper.showPicturePopup();
        });
        addEventListener('openSpriteManager', () => {
            ModalHelper.showSpritePopup();
        });
        addEventListener('openSoundManager', () => {
            ModalHelper.showSoundPopup();
        });
        addEventListener('openExpansionBlockManager', () => {
            ModalHelper.showExpansionPopup();
        });
        addEventListener('openPictureImport', () => {
            ModalHelper.showPaintPopup();
        });

        if (!Entry.creationChangedEvent) {
            Entry.creationChangedEvent = new Entry.Event(window);
        }
        Entry.creationChangedEvent.attach(this, this.handleStorageProjectSave);
        Entry.creationChangedEvent.attach(this, this.setExecutionStatus);

        const workspace = Entry.getMainWS();
        if (workspace) {
            workspace.changeEvent.attach(
                this,
                this.handleChangeWorkspaceMode,
            );
        }
    }

    async handleCanvasImageSave(data) {
        if (this.isSavingCanvasData) {
            root.entrylms.alert(RendererUtils.getLang('Msgs.save_canvas_alert'));
        } else {
            this.showModalProgress('progress', RendererUtils.getLang('Msgs.save_canvas_alert'));
            this.isSavingCanvasData = true;
            try {
                await EntryUtils.saveCanvasImage(data);
            } catch (e) {
                console.error(e);
            } finally {
                this.hideModalProgress();
                this.isSavingCanvasData = false;
            }
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

        console.log('handleStorageProjectSave called');
        const project = Entry.exportProject();
        if (project) {
            project.name = this._getProjectName();
            Object.assign(project, option);
            LocalStorageManager.saveProject(project);
        }
    }, 300);

    setExecutionStatus = () => {
        this.setState({
            executionStatus: {
                canRedo: Entry.stateManager.canRedo(),
                canUndo: Entry.stateManager.canUndo(),
            },
        });
    };

    _getProjectName = () => {
        const { common } = this.props;
        const { projectName } = common;

        return projectName || RendererUtils.getDefaultProjectName();
    };

    handleHardwareChange = () => {
        const hw = Entry.hw;
        const hwCategoryList = EntryStatic.hwCategoryList;

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

    handleSaveAction = async(key) => {
        const { persist } = this.props;
        const { mode } = persist;
        const projectName = this._getProjectName();

        const saveFunction = async(filePath) => {
            if (!filePath) {
                return;
            }

            this.showModalProgress(
                'progress',
                RendererUtils.getLang('Workspace.saving_msg'),
                RendererUtils.getLang('Workspace.fail_contact_msg'),
            );

            try {
                // 프로젝트를 가져온다. 프로젝트 명과 워크스페이스 모드를 주입한다.
                Entry.stage.handle.setVisible(false);
                Entry.stage.update();
                const project = Entry.exportProject();
                project.isPracticalCourse = mode === 'practical_course';
                project.name = projectName;
                // project.parent = parent;

                await IpcRendererHelper.saveProject(project, filePath);
                this.projectSavedPath = filePath;

                // 모달 해제 후 엔트리 토스트로 저장처리
                this.hideModalProgress();
                Entry.stateManager.addStamp();
                Entry.toast.success(
                    RendererUtils.getLang('Workspace.saved'),
                    `${projectName} ${RendererUtils.getLang('Workspace.saved_msg')}`
                );
            } catch (err) {
                console.error(err);
                this.showModalProgress(
                    'error',
                    RendererUtils.getLang('Workspace.saving_fail_msg'),
                    RendererUtils.getLang('Workspace.fail_contact_msg')
                );
            }
        };

        if (key === 'save' && this.projectSavedPath) {
            await saveFunction(this.projectSavedPath);
        } else {
            const targetPath = this.projectSavedPath || '*';
            RendererUtils.showSaveDialog({
                defaultPath: `${targetPath}/${projectName}`,
                filters: [{ name: 'Entry File', extensions: ['ent'] }],
            }, saveFunction);
        }
    };

    handleFileAction = async(type) => {
        if (type === 'new') {
            if (EntryUtils.confirmProjectWillDismiss()) {
                RendererUtils.clearTempProject();
                await this.loadProject();
            }
        } else if (type === 'open_offline') {
            this.showModalProgress(
                'progress',
                RendererUtils.getLang('Workspace.uploading_msg'),
                RendererUtils.getLang('Workspace.fail_contact_msg'),
            );

            RendererUtils.showOpenDialog({
                /*defaultPath: storage.getItem('defaultPath') || '',*/
                properties: ['openFile'],
                filters: [{ name: 'Entry File', extensions: ['ent'] }],
            }, async(filePaths) => {
                try {
                    if (Array.isArray(filePaths)) {
                        await RendererUtils.clearTempProject();
                        const filePath = filePaths[0];
                        const project = await IpcRendererHelper.loadProject(filePath);
                        await this.loadProject(project);
                    }
                    this.hideModalProgress();
                } catch (e) {
                    this.showModalProgress(
                        'error',
                        RendererUtils.getLang('Workspace.loading_fail_msg'),
                        RendererUtils.getLang('Workspace.fail_contact_msg'),
                    );
                }
            });
        }
    };

    /**
     * 프로젝트를 로드한 후, 이벤트 연결을 시도한다.
     * @param{Object?} project undefined 인 경우 신규 프로젝트로 생성
     */
    loadProject = async(project) => {
        const { changeWorkspaceMode, persist, changeProjectName } = this.props;
        const { mode: currentWorkspaceMode } = persist;
        let projectWorkspaceMode = currentWorkspaceMode;

        if (project) {
            this.projectSavedPath = project.savedPath || '';
            projectWorkspaceMode = project.isPracticalCourse ? 'practical_course' : 'workspace';
            changeProjectName(project.name || RendererUtils.getDefaultProjectName());
        } else {
            delete this.projectSavedPath;
            changeProjectName(RendererUtils.getDefaultProjectName());
        }

        // 현재 WS mode 와 이후 변경될 모드가 다른 경우
        if (currentWorkspaceMode !== projectWorkspaceMode) {
            if (projectWorkspaceMode === 'practical_course') {
                await ImportToggleHelper.changeEntryStatic('practical_course');
                changeWorkspaceMode('practical_course');
            } else {
                await ImportToggleHelper.changeEntryStatic('workspace');
                changeWorkspaceMode('workspace');
            }
        }

        if (!this.isFirstRender) {
            Entry.disposeContainer();
            Entry.reloadBlock();
        }
        Entry.init(this.container.current, this.initOption);
        entryPatch();
        Entry.enableArduino();
        this.addEntryEvents();
        Entry.loadProject(project);
    };

    reloadProject = async() => {
        const project = Entry.exportProject();
        project.name = this._getProjectName();
        await this.loadProject(project);
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
        const { programLanguageMode, executionStatus } = this.state;
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
                    programLanguageMode={programLanguageMode}
                    executionStatus={executionStatus}
                />
                <div ref={this.container} className="workspace"/>
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
    changeProjectName: (data) => commonAction(CHANGE_PROJECT_NAME, data),
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
