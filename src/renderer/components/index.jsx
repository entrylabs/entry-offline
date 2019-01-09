import React, { PureComponent } from 'react';
import Workspace from './workspace';
import './index.scss';

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
