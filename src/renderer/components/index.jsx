import React, { PureComponent } from 'react';
import Workspace from './workspace';
import './workspace.scss';

const Script = ({ children }) => (
    <script dangerouslySetInnerHTML={{ __html: `(${children.toString()})();` }} />
);

export default class Index extends PureComponent {
    render() {
        const { project } = this.props;
        return (
            <div>
                <div className={`ws`}>
                    <Workspace project={project} />
                </div>

                <div className="entryUploaderWindow">
                    <div className="entryUploaderWindowContent">
                        <h1>{'Workspace.ent_drag_and_drop'}</h1>
                    </div>
                </div>
                <div className="entrySpinnerWindow">
                    <div className="entrySpinner">
                        <div className="rect1"/>
                        <div className="rect2"/>
                        <div className="rect3"/>
                        <div className="rect4"/>
                        <div className="rect5"/>
                    </div>
                </div>

                <Script>
                    {() => {
                        const playFunc = createjs.Sound.play;
                        createjs.Sound.play = function(a, b) {
                            if (b) {
                                b.pan = 0.01;
                            } else {
                                b = { pan: 0.01 };
                            }
                            return playFunc(a, b);
                        };
                    }}
                </Script>
            </div>
        );
    }
}
