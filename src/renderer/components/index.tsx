import React from 'react';
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

const IndexComponent: React.FC<IProps> = (props) => {
    const { mode } = props;

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
                        // @ts-ignore
                        const playFunc = createjs.Sound.play;

                        // @ts-ignore
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
};


interface IReduxState {
    mode?: string;
}

const mapStateToProps: IMapStateToProps<IReduxState> = (state: IStoreState) => ({
    mode: state.persist.mode,
});

export default connect(mapStateToProps)(IndexComponent);
