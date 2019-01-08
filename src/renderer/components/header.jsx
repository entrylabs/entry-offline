import React, { Component } from 'react';
import './header.scss';
import root from 'window-or-global';
import _get from 'lodash/get';
import _includes from 'lodash/includes';


export default class Header extends Component {
    render() {
        const { common, projectName = '' } = this.props;
        const { lang } = common;
        const { dropdownType, programLanguageMode } = this.state;
        return (
            <header className={'common_gnb'}>
                <h1 className={`${'logo'} ${'logo_gnb'}`}>
                    <a href="/">Entry</a>
                </h1>
                <div className={'srch_box'}>
                    <input
                        type="text"
                        id="common_srch"
                        name="common_srch"
                        value={projectName}
                        /*onChange={({ target }) => {
                            const { value } = target;
                            this.handleProjectNameChange(value);
                        }}*/
                    />
                </div>
                <div className={'group_box'}>
                    <div className={'group_inner'}>
                        {this.isEnableNavigation('lang') && (
                            <div className={'work_space'}>
                                <a
                                    title={'Workspace.language'}
                                    className={`btn_work_space btn_workspace_lang ${
                                        dropdownType === 'programLanguage' ? 'on' : ''
                                        } ${programLanguageMode}`}
                                    /*ref={(dom) => (this.dropdownList.programLanguage = dom)}*/
                                    /*onClick={() => {
                                        this.handleDropdownClick('programLanguage');
                                    }}*/
                                >
                                    <span className={'blind'}>
                                        {'Workspace.language'}
                                    </span>
                                </a>
                                {/*{this.makeDropdown('programLanguage', this.programLanguageList)}*/}
                            </div>
                        )}
                        {(
                            <div className={'work_space'}>
                                <a
                                    title={'Workspace.file'}
                                    className={`${'btn_work_space'} ${'btn_workspace_file'} ${
                                        dropdownType === 'file' ? 'on' : ''
                                        }`}
                                    /*ref={(dom) => (this.dropdownList.file = dom)}
                                    onClick={() => {
                                        this.handleDropdownClick('file');
                                    }}*/
                                >
                                    <span className={'blind'}>
                                        {'Workspace.file'}
                                    </span>
                                </a>
                                {/*{this.makeDropdown('file', this.fileList)}*/}
                            </div>
                        )}
                        {(
                            <div className={'work_space'}>
                                <a
                                    title={'Workspace.save'}
                                    className={`${'btn_work_space'} ${'btn_workspace_save'}  ${
                                        dropdownType === 'save' ? 'on' : ''
                                        }`}
                                    /*ref={(dom) => (this.dropdownList.save = dom)}
                                    onClick={() => {
                                        this.handleDropdownClick('save');
                                    }}*/
                                >
                                    <span className={'blind'}>
                                        {'Workspace.save'}
                                    </span>
                                </a>
                                {/*{this.makeDropdown('save', this.saveList)}*/}
                            </div>
                        )}
                        {(
                            <div className={'work_space'}>
                                <a
                                    title={'Workspace.help'}
                                    className={`${'btn_work_space'} ${'btn_workspace_help'} ${
                                        dropdownType === 'help' ? 'on' : ''
                                        }`}
                                    /*ref={(dom) => (this.dropdownList.help = dom)}
                                    onClick={() => {
                                        this.handleDropdownClick('help');
                                    }}*/
                                >
                                    <span className={'blind'}>
                                        {'Workspace.help'}
                                    </span>
                                </a>
                                {/*{this.makeDropdown('help', this.helpList)}*/}
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

                    {lang === 'ko' && this.isEnableNavigation('mode') && (
                        <div className={'group_inner'}>
                            <div className={'work_space'}>
                                <a
                                    className={`link_workspace_text text_work_space  ${
                                        dropdownType === 'mode' ? 'on' : ''
                                        }`}
                                    /*ref={(dom) => (this.dropdownList.mode = dom)}
                                    onClick={() => {
                                        this.handleDropdownClick('mode');
                                    }}*/
                                >
                                    {/*{this.getModeText()}*/}
                                </a>
                                {/*{this.makeDropdown('mode', this.modeList)}*/}
                            </div>
                        </div>
                    )}

                    {(
                        <div className={'lang_select_box'}>
                            <a
                                className={`${'select_link'} ${'ico_white_select_arr'} ${
                                    dropdownType === 'language' ? 'on' : ''
                                    }`}
                                /*ref={(dom) => (this.dropdownList.language = dom)}
                                onClick={() => {
                                    this.handleDropdownClick('language');
                                }}*/
                            >
                                {/*{this.getLangValue()}*/}
                            </a>
                            <div className={'tooltip_box'}>
                                {/*{this.makeDropdown('language', this.languageList)}*/}
                            </div>
                        </div>
                    )}
                </div>
            </header>
        );
    }
}
