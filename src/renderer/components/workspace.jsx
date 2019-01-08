import { Component } from 'react';
import Router from 'next/router';
import Header from '@components/ws/header';
import { showPopup, commonAction, modalProgressAction } from '@actions';
import { UPDATE_PROJECT, FETCH_POPUP_ITEMS } from '@actions/types';
import Utils from '@utils';
import Popup from '../popup/popup';
import _has from 'lodash/has';
import _isEmpty from 'lodash/isEmpty';
import _includes from 'lodash/includes';
import _debounce from 'lodash/debounce';
import _cloneDeep from 'lodash/cloneDeep';
import { connect } from 'react-redux';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';
import produce from 'immer';
import cookie from 'react-cookies';
import TooltipGuide from '../common/TooltipGuide';

const ModalProgress = dynamic(
    import('entry-tool/component').then((component) => {
        return component.ModalProgress;
    }),
    {
        loading: () => {
            return <div />;
        },
        ssr: false,
    }
);

let EntryTool = null;
const apiPath = '/api/project';
class Workspace extends Component {

    render() {
        const { modal, common } = this.props;
        const { progress } = modal;
        const { isShow: isShowProgress, data = {} } = progress;
        const { title, type, description } = data;
        const { projectName, programLanguageMode, tooltipInfo, isShowTooltip } = this.state;
        const { lang } = common;
        return (
            <div>
                {isShowTooltip && (
                    <TooltipGuide data={tooltipInfo} onClick={this.handleTooltipClick} />
                )}
                <Header
                    onFileAction={this.handleFileAction}
                    onSaveAction={this.handleSaveAction}
                    onReloadEntry={this.reloadEntry}
                    onProjectNameChange={this.handleProjectNameChange}
                    onProjectPrint={this.handleProjectPrint}
                    projectName={projectName}
                    programLanguageMode={programLanguageMode}
                    lang={lang}
                />
                <input
                    className="uploadInput"
                    type="file"
                    ref={(dom) => {
                        return (this.uploadInput = dom);
                    }}
                    accept=".ent"
                    onChange={this.handleUploadChange}
                />
                <div ref={this.container} className="workspace" />
                {this.props.popup.visible && <Popup type={this.props.popup.type} />}
                {isShowProgress && (
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