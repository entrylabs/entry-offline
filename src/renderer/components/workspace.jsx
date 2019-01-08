import React, { Component } from 'react';
import Header from './header';

/* global Entry */
export default class Workspace extends Component {
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

    render() {
        return (
            <div>
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
