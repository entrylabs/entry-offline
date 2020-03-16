import React, { Component } from 'react';
import Header from './header';
import './workspace.scss';
import '../resources/styles/fonts.scss';
import { connect } from 'react-redux';
import fontFaceOnload from 'fontfaceonload';
import { IPersistState, PersistActionCreators } from '../store/modules/persist';
import { CommonActionCreators, ICommonState } from '../store/modules/common';
import _includes from 'lodash/includes';
import _debounce from 'lodash/debounce';
import entryPatch from '../helper/entry/entryPatcher';
import { ModalProgress } from '@entrylabs/tool/component';
import ModalHelper from '../helper/entry/entryModalHelper';
import RendererUtils from '../helper/rendererUtils';
import IpcRendererHelper from '../helper/ipcRendererHelper';
import LocalStorageManager from '../helper/storageManager';
import ImportToggleHelper from '../helper/importToggleHelper';
import EntryUtils from '../helper/entry/entryUtils';
import { bindActionCreators } from 'redux';
import { IModalState, ModalActionCreators } from '../store/modules/modal';
import { IMapDispatchToProps, IMapStateToProps } from '../store';
import DragAndDropContainer from './DragAndDropContainer';

interface IProps extends IReduxDispatch, IReduxState {

}

class Workspace extends Component<IProps> {
    private lastHwName?: string;
    private projectSavedPath?: string;
    private container = React.createRef<HTMLDivElement>();
    private isFirstRender = true;
    private isSavingCanvasData = false;
    private isSaveProject = false;
    private defaultInitOption = {
        type: 'workspace',
        backpackDisable: true,
        libDir: '../node_modules',
        defaultDir: 'renderer/resources',
        baseUrl: 'https://playentry.org',
        fonts: EntryStatic.fonts,
        textCodingEnable: true,
        dataTableEnable: true,
        paintMode: 'entry-paint',
    };
    state = {
        programLanguageMode: 'block',
        executionStatus: {
            canRedo: false,
            canUndo: false,
        },
    };

    get initOption() {
        return Object.assign({},
            this.defaultInitOption,
            EntryStatic.initOptions,
        );
    }

    constructor(props: Readonly<IProps>) {
        super(props);
        this.addMainProcessEvents();
    }

    _waitFontLoad() {
        return new Promise((resolve) => {
            fontFaceOnload('NanumGothic', {
                success() {
                    console.log('NanumGothic load successed');
                    resolve();
                },
                error() {
                    console.log('font load failed');
                    resolve();
                },
                timeout: 5000,
            });
        });
    }

    componentDidMount() {
        IpcRendererHelper.checkUpdate();
        setTimeout(async () => {
            await this._waitFontLoad();
            try {
                const project = await EntryUtils.getSavedProject();
                await this.loadProject(project);
            } catch (e) {
                console.error(e);
                this.showModalProgress(
                    'error',
                    RendererUtils.getLang('Workspace.loading_fail_msg'),
                    RendererUtils.getLang('Workspace.fail_contact_msg'),
                );
                await RendererUtils.clearTempProject();

                this.isFirstRender = true; // didMount 에서 에러가 발생한 경우, 렌더하지 않은 것으로 판단하기 위함
                await this.loadProject();
            }
        }, 0);
    }

    componentDidUpdate(prevProps: Readonly<IProps>): void {
        if (prevProps.common.projectName && prevProps.common.projectName !== this.props.common.projectName) {
            this.handleStorageProjectSave();
        }
    }

    addMainProcessEvents() {
        window.onLoadProjectFromMain(async (readProjectFunction) => {
            try {
                this.showModalProgress(
                    'progress',
                    RendererUtils.getLang('Workspace.uploading_msg'),
                    RendererUtils.getLang('Workspace.fail_contact_msg'),
                );
                const project = await readProjectFunction;
                await this.loadProject(project);
            } catch (e) {
                console.log('error occurred, ', e);
            } finally {
                this.hideModalProgress();
            }
        });
    }

    addEntryEvents() {
        const addEventListener = Entry.addEventListener.bind(Entry);

        addEventListener('openBackPack', () => {
            entrylms.alert(RendererUtils.getLang('[다국어미적용]\n온라인에서 사용가능'));
        });
        // 교과형에서 하드웨어가 바뀔때 마다 카테고리 변화
        addEventListener('hwChanged', this.handleHardwareChange);
        // 하드웨어 다운로드 탭에서 다운로드 처리
        addEventListener('newWorkspace', async () => {
            await this.handleFileAction('new');
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
        addEventListener('saveCanvasImage', (data: any) => {
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
        addEventListener('openAIUtilizeBlockManager', () => {
            ModalHelper.showAIUtilizePopup();
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

    async handleCanvasImageSave(data: any) {
        if (this.isSavingCanvasData) {
            entrylms.alert(RendererUtils.getLang('Msgs.save_canvas_alert'));
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

    handleStorageProjectSave = _debounce((option = {}) => {
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

    handleBeforeSaveProject = (e: BeforeUnloadEvent) => {
        if (this.isSaveProject) {
            e.returnValue = false;
            e.preventDefault();
        }
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
            (hw.programConnected && hw.hwModule && this.lastHwName === hw.hwModule.name) ||
            !EntryStatic.isPracticalCourse
        ) {
            return;
        }
        const blockMenu = Entry.playground.blockMenu;
        if (hw.programConnected && hw.hwModule) {
            const hwName = hw.hwModule.name;
            if (_includes(EntryStatic.hwMiniSupportList, hwName)) {
                hwCategoryList.forEach(function(categoryName: string) {
                    blockMenu.unbanCategory(categoryName);
                });
                blockMenu.banCategory('arduino');
                blockMenu.banCategory('hw_robot');
            } else {
                hwCategoryList.forEach(function(categoryName: string) {
                    blockMenu.banCategory(categoryName);
                });
                blockMenu.banCategory('hw_robot');
                blockMenu.unbanCategory('arduino');
            }
            this.lastHwName = hwName;
        } else {
            hwCategoryList.forEach(function(categoryName: string) {
                blockMenu.banCategory(categoryName);
            });
            blockMenu.banCategory('arduino');
            blockMenu.unbanCategory('hw_robot');
            this.lastHwName = undefined;
        }
    };

    handleSaveAction = async (key: string) => {
        const { persist } = this.props;
        const { mode } = persist;
        const projectName = this._getProjectName();

        const saveFunction = async (filePath: string | undefined) => {
            if (!filePath) {
                return;
            }

            this.showModalProgress(
                'progress',
                RendererUtils.getLang('Workspace.saving_msg'),
                RendererUtils.getLang('Workspace.fail_contact_msg'),
            );

            try {
                window.addEventListener('beforeunload', this.handleBeforeSaveProject);
                this.isSaveProject = true;

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
                    `${projectName} ${RendererUtils.getLang('Workspace.saved_msg')}`,
                );
            } catch (err) {
                console.error(err);
                this.showModalProgress(
                    'error',
                    RendererUtils.getLang('Workspace.saving_fail_msg'),
                    RendererUtils.getLang('Workspace.fail_contact_msg'),
                );
            } finally {
                this.isSaveProject = false;
                window.removeEventListener('beforeunload', this.handleBeforeSaveProject);
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
        LocalStorageManager.clearSavedProject();
    };

    handleFileAction = async (type: string) => {
        if (type === 'new') {
            if (EntryUtils.confirmProjectWillDismiss()) {
                await RendererUtils.clearTempProject();
                await this.loadProject();
            }
        } else if (type === 'open_offline') {
            this._loadProjectFromFile(() => new Promise<string>((resolve, reject) => {
                RendererUtils.showOpenDialog({
                    /*defaultPath: storage.getItem('defaultPath') || '',*/
                    properties: ['openFile'],
                    filters: [{ name: 'Entry File', extensions: ['ent'] }],
                }).then(({ filePaths }) => {
                    resolve(filePaths[0]);
                });
            }));
        }
    };

    async _loadProjectFromFile(filePathGetter: string | (() => Promise<string>)) {
        if (!filePathGetter) {
            return;
        }

        this.showModalProgress(
            'progress',
            RendererUtils.getLang('Workspace.uploading_msg'),
            RendererUtils.getLang('Workspace.fail_contact_msg'),
        );

        try {
            const filePath = typeof filePathGetter === 'function' ? (await filePathGetter()) : filePathGetter;
            if (!filePath) {
                this.hideModalProgress();
                return;
            }
            const project = await IpcRendererHelper.loadProject(filePath);
            await this.loadProject(project);
            this.hideModalProgress();
        } catch (e) {
            this.showModalProgress(
                'error',
                RendererUtils.getLang('Workspace.loading_fail_msg'),
                RendererUtils.getLang('Workspace.fail_contact_msg'),
            );
        }
    }

    /**
     * 프로젝트를 로드한 후, 이벤트 연결을 시도한다.
     * @param{Object?} project undefined 인 경우 신규 프로젝트로 생성
     */
    loadProject = async (project?: any) => {
        const { CommonActions, PersistActions, persist } = this.props;
        const { mode: currentWorkspaceMode } = persist;
        let projectWorkspaceMode = currentWorkspaceMode;

        if (project) {
            this.projectSavedPath = project.savedPath || '';
            projectWorkspaceMode = project.isPracticalCourse ? 'practical_course' : 'workspace';
            CommonActions.changeProjectName(project.name || RendererUtils.getDefaultProjectName());
        } else {
            delete this.projectSavedPath;
            CommonActions.changeProjectName(RendererUtils.getDefaultProjectName());
        }

        // 현재 WS mode 와 이후 변경될 모드가 다른 경우
        if (currentWorkspaceMode !== projectWorkspaceMode) {
            await ImportToggleHelper.changeEntryStatic(projectWorkspaceMode);
            PersistActions.changeWorkspaceMode(projectWorkspaceMode);
        }

        if (!this.isFirstRender) {
            Entry.clearProject();
            Entry.disposeContainer();
            // zoom 스케일이 변경된 상태에서 new project 한 경우 블록메뉴에 스케일정보가 남아서 초기화
            Entry.getMainWS().setScale(1);
        }
        Entry.reloadBlock();
        this.isFirstRender = false;
        Entry.init(this.container.current as HTMLDivElement, this.initOption);
        entryPatch();
        this.addEntryEvents();
        Entry.loadProject(project);

        /*
        Single Page 동작을 하기 때문에 발생하는 이슈
        함수 창을 열어두면 해당 함수 편집 스테이지로 바인딩 되고,
        new 프로젝트를 한다 하더라도 Entry 는 이 데이터를 계속 들고있는다.
        그래서 강제로 신규 로드시 이전 프로젝트가 함수편집 모드였는지 체크하고,
        함수용 블록을 추가, 메뉴 업데이트를 하는 동작이다.

        @TODO Entry 의 loadProject 혹은 destroy 개선을 위해 로직을 코어로 이전한다.
        @since 20190905
        @author extracold1209
         */
        if (Entry.Func.isEdit) {
            Entry.Func.endEdit();
            Entry.Func.setupMenuCode();
            Entry.Func.updateMenu();
        }
    };

    reloadProject = async () => {
        const project = Entry.exportProject();
        project.name = this._getProjectName();
        await this.loadProject(project);
    };

    handleProgramLanguageModeChanged = (mode: string) => {
        const option: any = {};

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

    showModalProgress(type: string, title: string, description = '') {
        const { ModalActions } = this.props;
        ModalActions.showModalProgress({
            isShow: true,
            data: {
                type,
                title,
                description,
            },
        });
    }

    hideModalProgress = () => {
        const { ModalActions } = this.props;
        ModalActions.showModalProgress({
            isShow: false,
        });
    };

    render() {
        const { programLanguageMode, executionStatus } = this.state;
        const { modal } = this.props;
        const { isShow, data } = modal;
        const { title, type, description } = data;

        return (
            <>
                <DragAndDropContainer
                    text={RendererUtils.getLang('Workspace.ent_drag_and_drop')}
                    onDropFile={async (filePath) => {
                        if (filePath.endsWith('.ent')) {
                            await this._loadProjectFromFile(filePath);
                        } else {
                            entrylms.alert(RendererUtils.getLang('Workspace.upload_not_supported_file_msg'));
                        }
                    }}
                />
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
            </>
        );
    }
}

interface IReduxState {
    modal: IModalState,
    persist: IPersistState,
    common: ICommonState,
}

const mapStateToProps: IMapStateToProps<IReduxState> = (state) => ({
    modal: state.modal,
    persist: state.persist,
    common: state.common,
});

interface IReduxDispatch {
    PersistActions: any;
    CommonActions: any;
    ModalActions: any;
}

const mapDispatchToProps: IMapDispatchToProps<IReduxDispatch> = (dispatch) => ({
    PersistActions: bindActionCreators(PersistActionCreators, dispatch),
    CommonActions: bindActionCreators(CommonActionCreators, dispatch),
    ModalActions: bindActionCreators(ModalActionCreators, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Workspace);
