import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PersistActionCreators } from '../store/modules/persist';
import RendererUtils from '../helper/rendererUtils';
import ImportToggleHelper from '../helper/importToggleHelper';
import './modeSelectModal.scss';

class ModeSelectModal extends PureComponent {
    constructor(props) {
        super(props);
        this.mode = 'workspace';
        this.state = {
            mode: 'workspace',
        };
    }

    handleSelectAreaClick(type) {
        this.setState({
            mode: type,
        });
    }

    async handleCloseButtonClick() {
        const { mode } = this.state;
        const { PersistActions } = this.props;

        try {
            await ImportToggleHelper.changeEntryStatic(mode);
            Entry.reloadBlock();
            PersistActions.changeWorkspaceMode(mode);
        } catch (e) {
            console.error(e);
        }
    }

    render() {
        const { mode } = this.state;

        return (
            <div className={'workspaceModeSelect'}>
                <div className={'contentArea'}>
                    <div className={'workspaceModeSelectTitle'}>
                        {RendererUtils.getLang('Workspace.select_mode_popup_title')}
                    </div>
                    <div className={'workspaceModeSelectArea'}>
                        <div
                            className={`workspaceModeSelectDefault ${mode === 'workspace' ? 'active' : ''} workspaceModeSelectBox`}
                            onClick={() => this.handleSelectAreaClick('workspace')}
                        >
                            <div className={'modeTitle'}>
                                {RendererUtils.getLang('Workspace.select_mode_popup_lable1')}
                            </div>
                            <div
                                className={'modeDesc'}
                                dangerouslySetInnerHTML={{ __html: RendererUtils.getLang('Workspace.select_mode_popup_desc1')}}
                            />
                            <div className={'modeButton'} />
                        </div>
                        <div
                            className={`workspaceModeSelectPracticalArts ${mode === 'practical_course' ? 'active' : ''} workspaceModeSelectBox`}
                            onClick={() => this.handleSelectAreaClick('practical_course')}
                        >
                            <div className={'modeTitle'}>
                                {RendererUtils.getLang('Workspace.select_mode_popup_lable2')}
                            </div>
                            <div
                                className={'modeDesc'}
                                dangerouslySetInnerHTML={{ __html: RendererUtils.getLang('Workspace.select_mode_popup_desc2')}}
                            />
                            <div className={'modeButton'} />
                        </div>
                    </div>
                    <div
                        className={'workspaceModeSelectCloseBtn'}
                        onClick={async() => {
                            await this.handleCloseButtonClick();
                        }}
                    >
                        {RendererUtils.getLang('Menus.corporateConfirm')}
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    PersistActions: bindActionCreators(PersistActionCreators, dispatch),
});

export default connect(
    undefined,
    mapDispatchToProps,
)(ModeSelectModal);
