import React, { Component } from 'react';
import './header.scss';
import root from 'window-or-global';
import _get from 'lodash/get';
import _includes from 'lodash/includes';
import Utils from '../helper/RendererUtils';
import { connect } from 'react-redux';
import { commonAction, showPopup } from '../actions';
import { LANGUAGE, WS_MODE } from '../actions/types';
import { Dropdown } from 'entry-tool/component';


/* global Entry, EntryStatic */
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
            [Utils.getLang('Menus.block_coding'), 'block'],
            [Utils.getLang('Menus.python_coding'), 'python'],
        ];
    }

    get fileList() {
        return [
            [Utils.getLang('Workspace.file_new'), 'new'],
            [Utils.getLang('Workspace.file_upload'), 'open_offline'],
        ];
    }
    get saveList() {
        return [
            [Utils.getLang('Workspace.file_save'), 'save_online'],
            [Utils.getLang('Workspace.file_save_as'), 'save_as_online'],
        ];
    }
    get helpList() {
        return [
            [Utils.getLang('Workspace.block_helper'), 'help_block'],
            [Utils.getLang('Workspace.hardware_guide'), 'help_hardware',{ isPracticalCourse: false }],
            [Utils.getLang('Workspace.robot_guide'), 'help_robot', { isPracticalCourse: true }],
            [Utils.getLang('Workspace.python_guide'), 'help_python'],
        ];
    }
    get modeList() {
        return [
            [Utils.getLang('Workspace.default_mode'), 'workspace'],
            [
                <div>
                    {Utils.getLang('Workspace.practical_course_mode')}
                    <em className={'ico_workspace_practical'}>
                        {Utils.getLang('Workspace.practical_course')}
                    </em>
                </div>,
                'practical_course',
            ],
        ];
    }
    getModeText() {
        const { common } = this.props;
        const { mode } = common;
        const [modeText] = this.modeList.find((list) => {
            return list[1] === mode;
        });
        return modeText;
    }

    get languageList() {
        return [
            [Utils.getLang('ko'), 'ko'],
            [Utils.getLang('en'), 'en'],
            [Utils.getLang('jp'), 'jp'],
            [Utils.getLang('vn'), 'vn'],
        ];
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
        const lang = _get(this.props, 'lang');
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
                    /*this.handleDropdownSelect(type, item);*/
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

    render() {
        const { lang, common, projectName = '' } = this.props;
        const { dropdownType } = this.state;
        const programLanguageMode = 'block';

        return (
            /* eslint-disable jsx-a11y/heading-has-content */
            <header className={'common_gnb'}>
                <h1 className={`${'logo'} ${'logo_gnb'}`}/>
                <div className={'srch_box'}>
                    <input
                        type="text"
                        id="common_srch"
                        name="common_srch"
                        defaultValue={projectName}
                        /*onChange={({ target }) => {
                            const { value } = target;
                            this.handleProjectNameChange(value);
                        }}*/
                    />
                </div>
                <div className={'group_box'}>
                    <div className={'group_inner'}>
                        {(
                            <div className={'work_space'}>
                                <a
                                    title={'Workspace.language'}
                                    className={`btn_work_space btn_workspace_lang ${
                                        dropdownType === 'programLanguage' ? 'on' : ''
                                        } ${programLanguageMode}`}
                                    ref={(dom) => (this.dropdownList.programLanguage = dom)}
                                    onClick={() => {
                                        this.handleDropdownClick('programLanguage');
                                    }}
                                >
                                    <span className={'blind'}>
                                        {'Workspace.language'}
                                    </span>
                                </a>
                                {this.makeDropdown('programLanguage', this.programLanguageList)}
                            </div>
                        )}
                        {(
                            <div className={'work_space'}>
                                <a
                                    title={'Workspace.file'}
                                    className={`${'btn_work_space'} ${'btn_workspace_file'} ${
                                        dropdownType === 'file' ? 'on' : ''
                                        }`}
                                    ref={(dom) => (this.dropdownList.file = dom)}
                                    onClick={() => {
                                        this.handleDropdownClick('file');
                                    }}
                                >
                                    <span className={'blind'}>
                                        {'Workspace.file'}
                                    </span>
                                </a>
                                {this.makeDropdown('file', this.fileList)}
                            </div>
                        )}
                        {(
                            <div className={'work_space'}>
                                <a
                                    title={'Workspace.save'}
                                    className={`${'btn_work_space'} ${'btn_workspace_save'}  ${
                                        dropdownType === 'save' ? 'on' : ''
                                        }`}
                                    ref={(dom) => (this.dropdownList.save = dom)}
                                    onClick={() => {
                                        this.handleDropdownClick('save');
                                    }}
                                >
                                    <span className={'blind'}>
                                        {'Workspace.save'}
                                    </span>
                                </a>
                                {this.makeDropdown('save', this.saveList)}
                            </div>
                        )}
                        {(
                            <div className={'work_space'}>
                                <a
                                    title={'Workspace.help'}
                                    className={`${'btn_work_space'} ${'btn_workspace_help'} ${
                                        dropdownType === 'help' ? 'on' : ''
                                        }`}
                                    ref={(dom) => (this.dropdownList.help = dom)}
                                    onClick={() => {
                                        this.handleDropdownClick('help');
                                    }}
                                >
                                    <span className={'blind'}>
                                        {'Workspace.help'}
                                    </span>
                                </a>
                                {this.makeDropdown('help', this.helpList)}
                            </div>
                        )}
                    </div>

                    <div className={'group_inner'}>
                        <div className={'work_space'}>
                            <a
                                title={'Workspace.undo'}
                                className={'btn_workspace_undo'}
                                onClick={() => {
                                    Entry.dispatchEvent('undo');
                                }}
                            >
                                <span className={'blind'}>{'Workspace.undo'}</span>
                            </a>
                            <a
                                title={'Workspace.redo'}
                                className={'btn_workspace_redo'}
                                onClick={() => {
                                    Entry.dispatchEvent('redo');
                                }}
                            >
                                <span className={'blind'}>{'Workspace.redo'}</span>
                            </a>
                        </div>
                    </div>

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

                    {(
                        <div className={'lang_select_box'}>
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
                        </div>
                    )}
                </div>
            </header>
        );
    }
}

const mapStateToProps = (state) => ({
    ...state,
});

const mapDispatchToProps = {
    showPopup,
    language: (data) => commonAction(LANGUAGE, data),
    mode: (data) => commonAction(WS_MODE, data),
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
