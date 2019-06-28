import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Workspace from './workspace';
import ModeSelectModal from './modeSelectModal';
import './index.scss';

const Script = ({ children }) => (
    <script dangerouslySetInnerHTML={{ __html: `(${children.toString()})();` }} />
);

class Index extends PureComponent {
    render() {
        const { mode } = this.props;
        return (
            <div>
                {mode ? (
                    <div className={`ws ${mode === 'workspace' ? '' : 'practical_course_mode'}`}>
                        <Workspace />
                    </div>
                ) : (
                    <ModeSelectModal />
                )}
                <Script>
                    {/* eslint-disable id-length, no-undef, no-param-reassign */
                        () => {
                            const playFunc = createjs.Sound.play;
                            createjs.Sound.play = function(a, b) {
                                if (b) {
                                    b.pan = 0.01;
                                } else {
                                    b = { pan: 0.01 };
                                }
                                return playFunc(a, b);
                            };
                        }
                    }
                </Script>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        mode: state.persist.mode,
    };
};

export default connect(mapStateToProps)(Index);
