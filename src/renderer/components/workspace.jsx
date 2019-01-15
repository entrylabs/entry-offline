import React, { Component } from 'react';
import Header from './header';
import './workspace.scss';
import '../resources/styles/fonts.scss';
import { connect } from 'react-redux';
import { commonAction, modalProgressAction } from '../actions';
import { FETCH_POPUP_ITEMS, UPDATE_PROJECT } from '../actions/types';
import _includes from 'lodash/includes';
import _debounce from 'lodash/debounce';
import { ModalProgress } from 'entry-tool/component';
import Utils from '../helper/rendererUtil';
import IpcRendererHelper from '../helper/ipcRendererHelper';
import LocalStorageManager from '../helper/storageManager';

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
        Entry.loadProject();
        this.addEntryEvents();
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
        addEventListener('openImportListModal', () => {
            console.log('openImportListModal');
        });
        // 리스트 Export
        addEventListener('openExportListModal', () => {
            console.log('openExportListModal');
        });

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
            this.workspaceChangeEvent = workspace.changeEvent.attach(
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
        console.log('saved');
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

    handleFileAction = (type) => {
        if (type === 'new') {
            if (Utils.confirmProjectWillDismiss()) {
                this.loadProject();
            }
        } else if (type === 'open_offline') {
            this.showModalProgress(
                'progress',
                Utils.getLang('Workspace.uploading_msg'),
                Utils.getLang('Workspace.fail_contact_msg'),
            );

            Utils.openDialog({
                /*defaultPath: storage.getItem('defaultPath') || '',*/
                properties: ['openFile'],
                filters: [{ name: 'Entry File', extensions: ['ent'] }],
            }, async(filePaths) => {
                if (Array.isArray(filePaths)) {
                    const filePath = filePaths[0];
                    const project = await IpcRendererHelper.loadProject(filePath);
                    const analyzedProject = Utils.reviseProject(project);

                    this.projectName = analyzedProject.projectName;
                    if (analyzedProject.isPracticalCourse) {
                        //TODO 모드변경 액션 보내고, static 모드 변경하고 로드프로젝트 하고
                    }
                    this.loadProject(analyzedProject.project);
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
        )
            ;
    }
}

const mapStateToProps = (state) => {
    return { ...state };
};

const mapDispatchToProps = {
    modalProgressAction,
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
