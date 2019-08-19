import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Workspace from './workspace';
import ModeSelectModal from './modeSelectModal';
import './index.scss';
import { IStoreState } from '../store/modules';
import { IMapStateToProps } from '../store';

const Script = ({ children }: { children: any }) => (
    <script dangerouslySetInnerHTML={{ __html: `(${children.toString()})();` }}/>
);

interface IProps extends IReduxState {

}

class Index extends PureComponent<IProps> {
    render() {
        const { mode } = this.props;
        return (
            <div>
                {mode ? (
                    <div className={`ws ${mode === 'workspace' ? '' : 'practical_course_mode'}`}>
                        <Workspace/>
                    </div>
                ) : (
                    <ModeSelectModal/>
                )}
                <Script>
                    {/* eslint-disable id-length, no-undef, no-param-reassign */
                        () => {
                            const playFunc = createjs.Sound.play;
                            createjs.Sound.play = function(a: any, b: any) {
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

interface IReduxState {
    mode?: string;
}

const mapStateToProps: IMapStateToProps<IReduxState> = (state: IStoreState) => ({
    mode: state.persist.mode,
});

export default connect(mapStateToProps)(Index);
