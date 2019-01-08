import React, { PureComponent } from 'react';
import '../styles/index.less';

export default class Index extends PureComponent {
    render() {
        return (
            <div>
                
                <div className={`ws`}>
                    여기다 표시할거임
                </div>
                
                <div className="entryUploaderWindow">
                    <div className="entryUploaderWindowContent">
                        <h1>{'Workspace.ent_drag_and_drop'}</h1>
                    </div>
                </div>
                <div className="entrySpinnerWindow">
                    <div className="entrySpinner">
                        <div className="rect1"></div>
                        <div className="rect2"></div>
                        <div className="rect3"></div>
                        <div className="rect4"></div>
                        <div className="rect5"></div>
                    </div>
                </div>
            </div>
        );
    }
}