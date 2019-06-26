import React, { Component } from 'react';
import './header.scss';
import root from 'window-or-global';
import _get from 'lodash/get';
import RendererUtils from '../helper/rendererUtils';
import EntryUtils from '../helper/entry/entryUtils';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CommonActionCreators } from '../store/modules/common';
import { PersistActionCreators } from '../store/modules/persist';
import { Dropdown } from '@entrylabs/tool/component';
import ImportToggleHelper from '../helper/importToggleHelper';
import LineHeaderLogoBox from './header_components/LineHeaderLogoBox';
import LineHeaderProjectTitle from './header_components/LineHeaderProjectTitle';
import HeaderLogoBox from './header_components/HeaderLogoBox';
import HeaderProjectTitle from './header_components/HeaderProjectTitle';
import HeaderButtonGroupBox from './header_components/HeaderButtonGroupBox';

/* global Entry */
class Header extends Component {
    constructor(props) {
        super(props);
        this.dropdownList = {};
        this.state = {
            dropdownType: undefined,
        };
    }

    get programLanguageList() {
        return [
            [RendererUtils.getLang('Menus.block_coding'), 'block'],
            [RendererUtils.getLang('Menus.python_coding'), 'python'],
        ];
    }
    get fileList() {
        return [
            [RendererUtils.getLang('Workspace.file_new'), 'new'],
            [RendererUtils.getLang('Workspace.file_upload'), 'open_offline'],
        ];
    }
    get saveList() {
        return [
            [RendererUtils.getLang('Workspace.file_save'), 'save'],
            [RendererUtils.getLang('Workspace.file_save_as'), 'save_as'],
        ];
    }
    get helpList() {
        const { persist } = this.props;
        const { mode } = persist;

        return [
            [RendererUtils.getLang('Workspace.block_helper'), 'help_block'],
            (mode === 'workspace' ?
                [RendererUtils.getLang('Workspace.hardware_guide'), 'help_hardware'] :
                [RendererUtils.getLang('Workspace.robot_guide'), 'help_robot']
            ),
            [RendererUtils.getLang('Workspace.python_guide'), 'help_python'],
        ];
    }
    get modeList() {
        return [
            [RendererUtils.getLang('Workspace.default_mode'), 'workspace'],
            [
                <div>
                    {RendererUtils.getLang('Workspace.practical_course_mode')}
                    <em className={'ico_workspace_practical'}>
                        {RendererUtils.getLang('Workspace.practical_course')}
                    </em>
                </div>,
                'practical_course',
            ],
        ];
    }
    get languageList() {
        return [
            [RendererUtils.getLang('ko'), 'ko'],
            [RendererUtils.getLang('en'), 'en'],
            [RendererUtils.getLang('jp'), 'jp'],
            [RendererUtils.getLang('vn'), 'vn'],
        ];
    }

    getModeText() {
        const { persist } = this.props;
        const { mode } = persist;
        const [modeText] = this.modeList.find((list) => {
            return list[1] === mode;
        });
        return modeText;
    }

    handleDropdownClick(type) {
        this.setState((state) => {
            const { dropdownType } = state;
            return {
                dropdownType: dropdownType === type ? undefined : type,
            };
        });
    }

    getLangValue() {
        const lang = _get(this.props, 'persist.lang');
        return _get(root.Lang, lang);
    }

    makeDropdown(type, items) {
        const { dropdownType } = this.state;
        if (type !== dropdownType) {
            return null;
        }
        const positionDom = this.dropdownList[type];
        return (
            <Dropdown
                autoWidth
                animation={false}
                items={items}
                positionDom={positionDom}
                onSelectDropdown={(item) => {
                    this.handleDropdownSelect(type, item);
                    this.setState(() => {
                        return {
                            dropdownType: undefined,
                        };
                    });
                }}
                outsideExcludeDom={[positionDom]}
                onOutsideClick={() => {
                    this.setState(() => {
                        return {
                            dropdownType: undefined,
                        };
                    });
                }}
            />
        );
    }

    handleDropdownSelect(type, item) {
        const key = item[1];
        switch (type) {
            case 'programLanguage':
                this.handleProgramLanguageClick(item);
                break;
            case 'file': {
                const { onFileAction } = this.props;
                onFileAction(key);
                break;
            }
            case 'save': {
                const { onSaveAction } = this.props;
                onSaveAction(key);
                break;
            }
            case 'help':
                this.handleHelpClick(item);
                break;
            case 'mode':
                this.handleChangeWsMode(item);
                break;
            case 'language':
                this.handleChangeLanguage(item);
                break;
        }
    }

    handleProgramLanguageClick(item) {
        const { onProgramLanguageChanged, programLanguageMode } = this.props;
        const key = item[1];
        if (key !== programLanguageMode) {
            onProgramLanguageChanged(key);
        }
    }

    handleHelpClick(item) {
        const key = item[1];
        if (key === 'help_block') {
            Entry.dispatchEvent('showBlockHelper');
        } else {
            switch (key) {
                case 'help_hardware':
                    RendererUtils.downloadHardwareGuide();
                    break;
                case 'help_robot':
                    RendererUtils.downloadRobotGuide();
                    break;
                case 'help_python':
                    RendererUtils.downloadPythonGuide();
                    break;
            }
        }
    }

    async handleChangeWsMode(item) {
        if (EntryUtils.confirmProjectWillDismiss()) {
            const { PersistActions, onLoadProject } = this.props;
            const key = item[1];
            await ImportToggleHelper.changeEntryStatic(key);
            PersistActions.changeWorkspaceMode(key);
            onLoadProject();
        }
    }

    async handleChangeLanguage(item) {
        const { PersistActions, onReloadProject } = this.props;
        const langType = item[1];
        await ImportToggleHelper.changeLang(langType);
        PersistActions.changeLanguage(langType);
        onReloadProject();
    }

    render() {
        const { CommonActions, persist = [], common, programLanguageMode, executionStatus = {} } = this.props;
        const { canRedo = false, canUndo = false } = executionStatus;
        const { projectName = RendererUtils.getDefaultProjectName() } = common;
        const { lang, mode } = persist;
        const { dropdownType } = this.state;

        return (
            /* eslint-disable jsx-a11y/heading-has-content, jsx-a11y/anchor-is-valid */
            <header className={'common_gnb'}>
                <HeaderLogoBox />
                <HeaderProjectTitle
                    onBlur={(projectTitle) => {
                        CommonActions.changeProjectName(projectTitle);
                    }}
                    value={projectName}
                />
                <HeaderButtonGroupBox>
                    <div className={'group_inner'}>
                        { mode === 'workspace' &&
                            // 블록코딩, 엔트리파이선 모드 변경
                            <div className={'work_space'}>
                                <a
                                    title={RendererUtils.getLang('Workspace.language')}
                                    className={`btn_work_space btn_workspace_lang ${
                                        dropdownType === 'programLanguage' ? 'on' : ''
                                    } ${programLanguageMode}`}
                                    ref={(dom) => (this.dropdownList.programLanguage = dom)}
                                    onClick={() => {
                                        this.handleDropdownClick('programLanguage');
                                    }}
                                >
                                    <span className={'blind'}>
                                        {RendererUtils.getLang('Workspace.language')}
                                    </span>
                                </a>
                                {this.makeDropdown('programLanguage', this.programLanguageList)}
                            </div>
                        }
                        {
                            // 새로만들기, 불러오기
                            <div className={'work_space'}>
                                <a
                                    title={RendererUtils.getLang('Workspace.file')}
                                    className={`${'btn_work_space'} ${'btn_workspace_file'} ${
                                        dropdownType === 'file' ? 'on' : ''
                                    }`}
                                    ref={(dom) => (this.dropdownList.file = dom)}
                                    onClick={() => {
                                        this.handleDropdownClick('file');
                                    }}
                                >
                                    <span className={'blind'}>
                                        {RendererUtils.getLang('Workspace.file')}
                                    </span>
                                </a>
                                {this.makeDropdown('file', this.fileList)}
                            </div>
                        }
                        {
                            // 저장하기, 복사본으로 저장하기
                            <div className={'work_space'}>
                                <a
                                    title={RendererUtils.getLang('Workspace.save')}
                                    className={`${'btn_work_space'} ${'btn_workspace_save'}  ${
                                        dropdownType === 'save' ? 'on' : ''
                                    }`}
                                    ref={(dom) => (this.dropdownList.save = dom)}
                                    onClick={() => {
                                        this.handleDropdownClick('save');
                                    }}
                                >
                                    <span className={'blind'}>
                                        {RendererUtils.getLang('Workspace.save')}
                                    </span>
                                </a>
                                {this.makeDropdown('save', this.saveList)}
                            </div>
                        }
                        {
                            // 도움말들
                            <div className={'work_space'}>
                                <a
                                    title={RendererUtils.getLang('Workspace.help')}
                                    className={`${'btn_work_space'} ${'btn_workspace_help'} ${
                                        dropdownType === 'help' ? 'on' : ''
                                    }`}
                                    ref={(dom) => (this.dropdownList.help = dom)}
                                    onClick={() => {
                                        this.handleDropdownClick('help');
                                    }}
                                >
                                    <span className={'blind'}>
                                        {RendererUtils.getLang('Workspace.help')}
                                    </span>
                                </a>
                                {this.makeDropdown('help', this.helpList)}
                            </div>
                        }
                    </div>

                    {/* undo, redo */}
                    <div className={'group_inner'}>
                        <div className={'work_space'}>
                            <a
                                title={RendererUtils.getLang('Workspace.undo')}
                                className={`btn_workspace_undo ${canUndo ? '' : 'disabled'}`}
                                onClick={() => {
                                    Entry.dispatchEvent('undo');
                                }}
                            >
                                <span className={'blind'}>{RendererUtils.getLang('Workspace.undo')}</span>
                            </a>
                            <a
                                title={RendererUtils.getLang('Workspace.redo')}
                                className={`btn_workspace_redo ${canRedo ? '' : 'disabled'}`}
                                onClick={() => {
                                    Entry.dispatchEvent('redo');
                                }}
                            >
                                <span className={'blind'}>{RendererUtils.getLang('Workspace.redo')}</span>
                            </a>
                        </div>
                    </div>

                    {/* 일반형, 교과형 모드변경 */}
                    {lang === 'ko' && (
                        <div className={'group_inner'}>
                            <div className={'work_space'}>
                                <a
                                    className={`link_workspace_text text_work_space  ${
                                        dropdownType === 'mode' ? 'on' : ''
                                    }`}
                                    ref={(dom) => (this.dropdownList.mode = dom)}
                                    onClick={() => {
                                        this.handleDropdownClick('mode');
                                    }}
                                >
                                    {this.getModeText()}
                                </a>
                                {this.makeDropdown('mode', this.modeList)}
                            </div>
                        </div>
                    )}

                    {
                        /* 언어 변경 */
                        mode === 'workspace' &&
                        (<div className={'lang_select_box'}>
                            <a
                                className={`${'select_link'} ${'ico_white_select_arr'} ${
                                    dropdownType === 'language' ? 'on' : ''
                                }`}
                                ref={(dom) => (this.dropdownList.language = dom)}
                                onClick={() => {
                                    this.handleDropdownClick('language');
                                }}
                            >
                                {this.getLangValue()}
                            </a>
                            <div className={'tooltip_box'}>
                                {this.makeDropdown('language', this.languageList)}
                            </div>
                        </div>)
                    }
                </HeaderButtonGroupBox>
            </header>
        );
    }
}

const mapStateToProps = (state) => ({
    ...state,
});

const mapDispatchToProps = (dispatch) => ({
    PersistActions: bindActionCreators(PersistActionCreators, dispatch),
    CommonActions: bindActionCreators(CommonActionCreators, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
