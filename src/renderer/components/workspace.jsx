import React, { Component } from 'react';
import Header from './header';
import './workspace.scss';
import { connect } from 'react-redux';
import { commonAction } from '../actions';
import { FETCH_POPUP_ITEMS, UPDATE_PROJECT } from '../actions/types';

/* global Entry */
class Workspace extends Component {
    constructor(props) {
        super(props);
        this.modal = null;
        this.isSaving = false;
        this.container = React.createRef();

        const { project = {} } = props;
        const { name = '' } = project;

        this.state = {
            projectName: name || ''
        };

        this.initOption = {
            type: 'workspace',
            libDir: 'renderer/bower_components',
            textCodingEnable: true,
        };
    }

    async componentDidMount() {
        Entry.init(this.container.current, this.initOption);
        Entry.loadProject();
    }

    /**
     * onFileAction={this.handleFileAction}
     onSaveAction={this.handleSaveAction}
     onReloadEntry={this.reloadEntry}
     onProjectNameChange={this.handleProjectNameChange}
     */
    render() {
        return (
            <div>
                <Header
                    projectName={'projectName'}
                    programLanguageMode={'programLanguageMode'}
                    lang={'ko'}
                />
                <input
                    className="uploadInput"
                    type="file"
                    ref={(dom) => {
                        return (this.uploadInput = dom);
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
