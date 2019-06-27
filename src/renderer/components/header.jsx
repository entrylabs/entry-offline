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
import ImportToggleHelper from '../helper/importToggleHelper';
import HeaderLogoBox from './header_components/HeaderLogoBox';
import HeaderProjectTitle from './header_components/HeaderProjectTitle';
import HeaderButtonGroupBox from './header_components/HeaderButtonGroupBox';
import HeaderWrapper from './header_components/HeaderWrapper';
import HeaderDropdownButton from './header_components/HeaderDropdownButton';
import HeaderButton from './header_components/HeaderButton';
import HeaderDropdownText from './header_components/HeaderDropdownText';
import HeaderDropdownBox from './header_components/HeaderDropdownBox';

/* global Entry */
class Header extends Component {
    constructor(props) {
        super(props);
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

    getLangValue() {
        const lang = _get(this.props, 'persist.lang');
        return _get(root.Lang, lang);
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

        return (
            /* eslint-disable jsx-a11y/heading-has-content, jsx-a11y/anchor-is-valid */
            <HeaderWrapper>
                <HeaderLogoBox/>
                <HeaderProjectTitle
                    onBlur={(projectTitle) => {
                        CommonActions.changeProjectName(projectTitle);
                    }}
                    value={projectName}
                />
                <HeaderButtonGroupBox>
                    {
                        // 파이선모드 변경
                        mode === 'workspace' &&
                        <HeaderDropdownButton
                            title={RendererUtils.getLang('Workspace.language')}
                            icon={`${programLanguageMode}.svg`}
                            onSelect={(item) => this.handleDropdownSelect('programLanguage', item)}
                            items={this.programLanguageList}
                        />
                    }
                    <HeaderDropdownButton
                        title={RendererUtils.getLang('Workspace.file')}
                        icon={'file.png'}
                        onSelect={(item) => this.handleDropdownSelect('file', item)}
                        items={this.fileList}
                        style={mode === 'practical_course' ? {
                            border: '1px solid #b2a9ff',
                            backgroundColor: '#9f95ff',
                        } : {}}
                    />
                    <HeaderDropdownButton
                        title={RendererUtils.getLang('Workspace.save')}
                        icon={'save.png'}
                        onSelect={(item) => this.handleDropdownSelect('save', item)}
                        items={this.saveList}
                        style={mode === 'practical_course' ? {
                            border: '1px solid #b2a9ff',
                            backgroundColor: '#9f95ff',
                        } : {}}
                    />
                    <HeaderDropdownButton
                        title={RendererUtils.getLang('Workspace.help')}
                        icon={'help.png'}
                        onSelect={(item) => this.handleDropdownSelect('help', item)}
                        items={this.helpList}
                        style={mode === 'practical_course' ? {
                            border: '1px solid #b2a9ff',
                            backgroundColor: '#9f95ff',
                        } : {}}
                    />

                    <hr/>

                    <HeaderButton
                        disabled={!canUndo}
                        enabledIcon={mode === 'workspace' ? 'undo.png' : 'undo_textbook_mode.png'}
                        disabledIcon={'undo_disabled.png'}
                        onClick={() => {Entry.dispatchEvent('undo')}}
                    />
                    <HeaderButton
                        disabled={!canRedo}
                        enabledIcon={mode === 'workspace' ? 'redo.png' : 'redo_textbook_mode.png'}
                        disabledIcon={'redo_disabled.png'}
                        onClick={() => {Entry.dispatchEvent('redo')}}
                    />

                    <hr/>

                    {
                        // 일반형, 교과형 모드 변경
                        lang === 'ko' &&
                        <HeaderDropdownText
                            onSelect={(item) => this.handleDropdownSelect('mode', item)}
                            items={this.modeList}
                        >
                            {this.getModeText()}
                        </HeaderDropdownText>
                    }
                    {
                        // 언어 변경
                        mode === 'workspace' &&
                        <HeaderDropdownBox
                            items={this.languageList}
                            onSelect={(item) => this.handleDropdownSelect('language', item)}
                        >
                            {this.getLangValue()}
                        </HeaderDropdownBox>
                    }
                </HeaderButtonGroupBox>
            </HeaderWrapper>
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
    mapDispatchToProps,
)(Header);
