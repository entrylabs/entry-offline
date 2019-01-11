import React, { Component } from 'react';
import Header from './header';
import './workspace.scss';
import '../resources/styles/fonts.scss';
import { connect } from 'react-redux';
import { commonAction } from '../actions';
import { FETCH_POPUP_ITEMS, UPDATE_PROJECT } from '../actions/types';
import _includes from 'lodash/includes';
import _debounce from 'lodash/debounce';
import fontFaceOnload from 'fontfaceonload';
import Utils from '../helper/rendererUtils';

/* global Entry, EntryStatic */
class Workspace extends Component {
    get LOCAL_STORAGE_KEY() {
        return 'localStorageProject';
    }
    get LOCAL_STORAGE_KEY_RELOAD() {
        return 'localStorageProjectReload';
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

        this.initOption = {
            type: 'workspace',
            libDir: 'renderer/bower_components',
            fonts: EntryStatic.fonts,
            textCodingEnable: true,
        };
    }

    async componentDidMount() {
        this.hwCategoryList = EntryStatic.hwCategoryList;
        if (EntryStatic.initOptions) {
            this.initOption = Object.assign({}, this.initOption, EntryStatic.initOptions, {
                textCodingEnable: false,
            });
        }
        // return;
        this.isFontLoad();

        Entry.init(this.container.current, this.initOption);
        Entry.enableArduino();
        Entry.loadProject();
        this.addEntryEvents();
    }

    isFontLoad() {
        return new Promise((resolve) => {
            console.log('1');
            fontFaceOnload('NanumGothic', {
                success() {
                    console.log('font load');
                    resolve();
                },
                error() {
                    console.log('error');
                    resolve();
                },
                timeout: 5000,
            });
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
        //
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
                this.handleChangeWorkspaceMode
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
        const storage =
            typeof window.localStorage === 'undefined' ? undefined : window.localStorage;
        const supported = !(typeof storage === 'undefined' || typeof window.JSON === 'undefined');

        if (!supported) {
            return;
        }

        const { engine } = Entry;
        if (engine && engine.isState('run')) {
            return;
        }

        const project = Entry.exportProject();
        if (project) {
            project.name = this.projectName;
            const { project: originProject, common } = this.props;
            if (originProject) {
                project.parent = originProject.parent;
                project._id = originProject._id;
            }
            Object.assign(project, option);
            localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(project));
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
            //TODO 변경감지 후 경고문 추가 필요
            this.loadProject();
        } else if (type === 'open_offline') {
            console.log('load Offline');
        }
    };

    /**
     * 프로젝트를 로드한 후, 이벤트 연결을 시도한다.
     * @param{Object?} project undefined 인 경우 신규 프로젝트로 생성
     */
    loadProject(project) {
        Entry.disposeContainer();
        Entry.reloadBlock();
        Entry.init(this.container.current, this.initOption);
        Entry.loadProject(project);
        this.addEntryEvents();
    }

    reloadEntry = (project) => {
        let temp = project;
        if (!temp) {
            temp = Entry.exportProject();
        }
        this.loadProject(temp);
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
            workspace.setMode(option);
            const expectedBoardType = option.boardType;
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

    render() {
        const { programLanguageMode } = this.state;

        return (
            <div>
                <Header
                    onFileAction={this.handleFileAction}
                    onReloadEntry={this.reloadEntry}
                    onProgramLanguageChanged={this.handleProgramLanguageModeChanged}
                    onProjectNameChanged={(changedName) => (this.projectName = changedName)}
                    projectName={this.projectName}
                    programLanguageMode={programLanguageMode}
                />
                <input
                    className="uploadInput"
                    type="file"
                    ref={(dom) => {
                        this.uploadInput = dom;
                    }}
                    accept=".ent"
                />
                <div ref={this.container} className="workspace" />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return { ...state };
};

const mapDispatchToProps = {
    updateProject: (data) => {
        return commonAction(UPDATE_PROJECT, data);
    },
    fetchPopup: (data) => {
        return commonAction(FETCH_POPUP_ITEMS, data);
    },
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Workspace);
