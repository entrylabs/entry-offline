import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Workspace from './workspace';
import './index.scss';

const Script = ({ children }) => (
    <script dangerouslySetInnerHTML={{ __html: `(${children.toString()})();` }} />
);

class Index extends PureComponent {
    render() {
        const { common = [] } = this.props;
        const { mode } = common;

        console.log(this.props);
        return (
            <div>
                <div className={`ws ${mode === 'workspace' ? '' : 'practical_course_mode'}`}>
                    <Workspace />
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

const mapStateToProps = (state) => {
    return {
        ...state,
    };
};

export default connect(mapStateToProps)(Index);
