import styled, { keyframes, css } from 'styled-components';
import { Theme } from '../../../types/theme';

const main = {
    default_green: '#40b235',
    dark_green: '#006446',
    light_green: '#88c082',
    green2: '#2f8f37',
    green3: '#92d930',
    green4: '#00b50a',
    green5: '#007e2c',
    gray1: '#333',
    gray2: '#666',
    gray3: '#888',
    gray4: '#d4d4d4',
    gray5: '#eee',
    gray6: '#707070',
    gray7: '#e4e4d2',
    gray8: '#eeeee0',
    gray9: '#f4f4f4',
    gray10: '#ebebeb',
    gray11: '#cdcdcd',
    gray12: '#acacac',
    gray13: '#fcfcfc',
    gray14: '#eee',
    gray15: '#d8d8d8',
    gray16: '#555',
    placeholder: '#d4d4d4',
    ListBG1: '#f8f8e6',
    font_UserThmb: '#50b4fa',
    font_Error: '#fa5536',
    red1: '#fd5538',
    yellow1: '#f8f821',
    yellow2: '#f8f8e6',
    yellow3: '#e4af0a',
    yellow4: '#e0e0c3',
    yellow5: '#f1f1d4',
    yellow6: '#c7c79f',
    blue1: '#2578d6',
    blue2: '#009ce1',
    blue3: '#5a96ff',
    white: '#fff',
    workspace_main: '#1c8850',
    workspace_point: '#006446',
    black: '#333',
};

const assetPath = '../src/renderer/resources/theme/line/';
const workspacePath = `${assetPath}workspace/`;
const ColorSet = {
    green: '#1c8850',
    grey: '#d4d4d4',
    brightYello: '#fffdea',
    yello: '#f6f3d2',
};

const Loading = keyframes`
to {
    background-position: 350% 0, 20px 18px, 20px 238px, 
    20px 286px, 20px 334px, 56px 238px, 56px 308px, 
    56px 378px, 56px 448px, 56px 518px, 56px 588px, 
    290px 18px, 290px 80px, 290px 142px, 290px 204px, 
    290px 266px, 290px 328px, 290px 390px, 290px 452px, 
    290px 514px, 290px 576px, 360px 28px, 430px 28px, 
    500px 28px, right 52px top 18px, right 0 top 18px, 
    362px 80px, 582px 80px, 20px 0px; 
}`;

const Wrapper = styled.div`
    ${({ minimize }: { minimize: boolean }) => {
    if (minimize) {
        return css`
                height: 100%;
            `;
    } else {
        return css`
                height: 100%;
                min-height: 590px;
                /* workspace loading */
                .workspace:empty {
                    overflow: hidden;
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 44px;
                    bottom: 0;
                }
                .workspace:empty::before {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 37px;
                    background-image: linear-gradient(#e2e2e2 370px, transparent 0),
                        linear-gradient(white 370px, transparent 0),
                        linear-gradient(#d8d8d8 37px, transparent 0);
                    background-size: 57px 15px, 102px 370px, 100% 37px;
                    background-position: 30px 11px, 20px 0px, 0px 0px;
                    background-repeat: no-repeat;
                }
                .workspace:empty::after {
                    z-index: 1000;
                    content: '';
                    display: block;
                    width: calc(100% - 20px);
                    height: 100%;
                    background-image: linear-gradient(
                            90deg,
                            rgba(255, 255, 255, 0) 0,
                            rgba(255, 255, 255, 0.8) 50%,
                            rgba(255, 255, 255, 0) 100%
                        ),
                        linear-gradient(#f2f2f2 198px, transparent 0),
                        linear-gradient(#f2f2f2 38px, transparent 0),
                        linear-gradient(#f2f2f2 38px, transparent 0),
                        linear-gradient(#f2f2f2 38px, transparent 0),
                        linear-gradient(#f2f2f2 60px, transparent 0),
                        linear-gradient(#f2f2f2 60px, transparent 0),
                        linear-gradient(#f2f2f2 60px, transparent 0),
                        linear-gradient(#f2f2f2 60px, transparent 0),
                        linear-gradient(#f2f2f2 60px, transparent 0),
                        linear-gradient(#f2f2f2 60px, transparent 0),
                        linear-gradient(#f2f2f2 52px, transparent 0),
                        linear-gradient(#f2f2f2 52px, transparent 0),
                        linear-gradient(#f2f2f2 52px, transparent 0),
                        linear-gradient(#f2f2f2 52px, transparent 0),
                        linear-gradient(#f2f2f2 52px, transparent 0),
                        linear-gradient(#f2f2f2 52px, transparent 0),
                        linear-gradient(#f2f2f2 52px, transparent 0),
                        linear-gradient(#f2f2f2 52px, transparent 0),
                        linear-gradient(#f2f2f2 52px, transparent 0),
                        linear-gradient(#f2f2f2 52px, transparent 0),
                        linear-gradient(#f2f2f2 42px, transparent 0),
                        linear-gradient(#f2f2f2 42px, transparent 0),
                        linear-gradient(#f2f2f2 42px, transparent 0),
                        linear-gradient(#f2f2f2 42px, transparent 0),
                        linear-gradient(#f2f2f2 42px, transparent 0),
                        linear-gradient(#f2f2f2 588px, transparent 0),
                        linear-gradient(#f2f2f2 588px, transparent 0);
                    background-size: 200px 100%, 250px 198px, 26px 38px, 26px 38px, 26px 38px,
                        214px 60px, 214px 60px, 214px 60px, 214px 60px, 214px 60px, 214px 60px,
                        62px 52px, 62px 52px, 62px 52px, 62px 52px, 62px 52px, 62px 52px, 62px 52px,
                        62px 52px, 62px 52px, 62px 52px, 62px 42px, 62px 42px, 62px 42px, 42px 42px,
                        42px 42px, 200px 588px, 100% 588px;
                    background-position: -150% 0, 20px 18px, 20px 238px, 20px 286px, 20px 334px,
                        56px 238px, 56px 308px, 56px 378px, 56px 448px, 56px 518px, 56px 588px,
                        290px 18px, 290px 80px, 290px 142px, 290px 204px, 290px 266px, 290px 328px,
                        290px 390px, 290px 452px, 290px 514px, 290px 576px, 360px 28px, 430px 28px,
                        500px 28px, right 52px top 18px, right 0 top 18px, 362px 80px, 582px 80px;
                    background-repeat: no-repeat;
                    -webkit-animation: ${Loading} 4s infinite;
                    animation: ${Loading} 4s infinite;
                }
            `;
    }
}}

    /* workspace header */
    /* scene */
    .entrySceneWorkspace {
        background-color: ${main.workspace_main};
        z-index: 1;
    }
    .workspace_button_group .workspace_divider {
        background-color: #fff;
    }
    .entrySceneInputCover {
        background-color: #88c082;
    }
    .selectedScene .entrySceneInputCover {
        background-color: #fff;
    }
    .entrySceneAddButtonWorkspace {
        background-image: url(${workspacePath}top_icon_add_b_nor.png);
        background-size: 44px auto;
    }

    /* canvas */
    .entryEngineWorkspace_w {
        border: 1px solid ${ColorSet.green};
    }
    .entryCanvasWorkspace {
        border-top: 1px solid ${ColorSet.green};
    }
    /* canvas header button */
    .entryMouseViewWorkspace_w,
    .entryMouseViewWorkspace_w > input {
        color: #32d27d;
    }
    .entryEngineButtonWrapper {
        .entryAddButtonWorkspace_w,
        .entryRestartButtonWorkspace_w {
            background-image: url(${workspacePath}layers_icon_button_plus_nor.png);
        }
        .entryAddButtonWorkspace_w,
        .entryPauseButtonWorkspace_w,
        .entryRestartButtonWorkspace_w {
            border-color: ${ColorSet.green};
        }
        .entryStopButtonWorkspace_w {
            border-color: ${ColorSet.green};
            background-image: url(${workspacePath}layers_icon_button_stop_nor.png);
        }
        .entryPauseButtonWorkspace_w {
            background-image: url(${workspacePath}layers_icon_button_pause_nor.png);
        }
        .entryRunButtonWorkspace_w {
            border-color: ${ColorSet.green};
            background-image: url(${workspacePath}layers_icon_button_play_nor_1.png);
        }
        .entryAddButtonWorkspace_w.entryRemove ~ .entryRunButtonWorkspace_w,
        .entryPauseButtonWorkspace_w.entryRemove ~ .entryStopButtonWorkspace_w {
            border: 1px solid ${ColorSet.green};
            border-radius: 0 0 5px 5px;
        }
    }
    .entryCoordinateButtonWorkspace_w.toggleOn {
        background-image: url(${workspacePath}layers_icon_grid_nor_1.png);
    }
    .entrySpeedButtonWorkspace.on {
        background-image: url(${workspacePath}speed_edit_on.png);
    }

    /* object */
    .entryContainerListElementWorkspace.selectedObject {
        background-color: ${ColorSet.brightYello};
    }
    .entryContainerListElementWorkspace {
        background-color: #fff;
        border: 1px solid ${ColorSet.grey};
        border-width: 1px 0;
    }
    .entryObjectRotationWrapperWorkspace {
        background-color: ${ColorSet.yello};
        border: 0px;
        border-top: 1px solid ${ColorSet.grey};
    }
    .entryContainerListElementWorkspace.selectedObject + .entryContainerListElementWorkspace,
    .entryContainerListElementWorkspace:first-child {
        border-top: 0;
    }
    .propertyContent {
        border: 1px solid ${ColorSet.grey};
    }
    .propertyTabobject {
        background-image: url(${workspacePath}tab_container.png);
        &.selected {
            background-image: url(${workspacePath}tab_container_on.png);
        }
    }
    .propertyTabhint {
        background-image: url(${workspacePath}hint_off.png);
        &.selected {
            background-image: url(${workspacePath}hint_on.png);
        }
    }
    .propertyTabvideo {
        background-image: url(${workspacePath}video_off.png);
        &.selected {
            background-image: url(${workspacePath}video_on.png);
        }
    }
    .propertyTabpdf {
        background-image: url(${workspacePath}pdf_off.png);
        &.selected {
            background-image: url(${workspacePath}pdf_on.png);
        }
    }
    .propertyTabhelper {
        background-image: url(${workspacePath}tab_helper.png);
        &.selected {
            background-image: url(${workspacePath}tab_helper_on.png);
        }
    }
    .selectedObject .entryObjectInformationWorkspace {
        background-image: url(${workspacePath}layers_arrow_up_nor.png);
    }
    .entryObjectInformationWorkspace,
    .selectedObject.fold .entryObjectInformationWorkspace {
        background-image: url(${workspacePath}layers_arrow_down_nor.png);
    }
    .objectInfo_visible:not(.objectInfo_unvisible) {
        background-image: url(${workspacePath}layers_icon_visible.png);
    }
    .objectInfo_unlock:not(.objectInfo_lock) {
        background-image: url(${workspacePath}layers_icon_unlock.png);
    }
    .entryObjectRotateModeAWorkspace.selected {
        background-image: url(${workspacePath}layers_icon_rotate01_nor.png);
    }
    .entryObjectRotateModeBWorkspace.selected {
        background-image: url(${workspacePath}layers_icon_rotate02_nor.png);
    }
    .entryObjectRotateModeCWorkspace.selected {
        background-image: url(${workspacePath}layers_icon_rotate03_nor.png);
    }

    /* blockMenu */
    .entryWorkspaceBlockMenu {
        .entryCategoryListWorkspace:not(:first-child) {
            display: none;
        }
    }
    .blockMenuContainer {
        background-color: ${ColorSet.brightYello};
        border: 1px solid ${ColorSet.grey};
    }
    .entryCategoryElementWorkspace {
        border: 1px solid ${ColorSet.grey};
    }
    .entryCategoryListWorkspace:before {
        border: 1px solid ${ColorSet.grey};
    }
    .entryCategoryListWorkspace li {
        background-color: ${ColorSet.brightYello};
    }
    .entryTabListItemWorkspace {
        background-color: #cee1cc;
    }
    .entryTabSelected {
        background-color: ${ColorSet.green};
    }
    .entryCategoryListWorkspace {
        background-color: ${ColorSet.brightYello};
    }

    .blockMenu {
        min-width: 100px;
        width: 100%;
    }

    .entryPlaygroundPictureList,
    .entryPlaygroundPictureListPhone,
    .entryPlaygroundSoundList,
    .entryPlaygroundSoundListPhone,
    .entryVariablePanelWorkspace,
    .entryPlaygroundAddPicture,
    .entryPlaygroundAddSound {
        background-color: #fff;
        border: 1px solid ${ColorSet.grey};
    }

    .entryPlaygroundSoundElement {
        background-color: inherit;
        border-bottom: 1px solid ${ColorSet.grey};
        &.entrySoundSelected {
            background-color: ${ColorSet.brightYello};
        }
    }

    .entryPlaygroundPictureElement {
        background-color: inherit;
        border-bottom: 1px solid ${ColorSet.grey};
        &.entryPictureSelected {
            background-color: ${ColorSet.brightYello};
        }
    }

    .entryPlaygroundAddPictureInner {
        background-color: #fff;
        border: 1px solid ${ColorSet.green};
        color: ${ColorSet.green};
    }

    .entryPlaygroundAddSoundInner {
        background-color: #fff;
        border: 1px solid ${ColorSet.green};
        color: ${ColorSet.green};
    }

    .entryPlaygroundPictureOrder,
    .entryPlaygroundSoundOrder {
        background-color: ${ColorSet.green};
    }

    /* list signal function tab */
    .entryVariableSelectButtonWorkspace {
        &.selected {
            div {
                color: ${ColorSet.green};
                &:after {
                    border-color: ${ColorSet.green};
                }
            }
            &.message {
                div {
                    &:before {
                        background-image: url(${workspacePath}ic_attr_message_on.png);
                    }
                }
            }
            &.list {
                div {
                    &:before {
                        margin-right: 6px;
                        background-image: url(${workspacePath}ic_attr_list_on.png);
                    }
                }
            }
            &.func {
                div {
                    &:before {
                        background-image: url(${workspacePath}ic_attr_func_on.png);
                    }
                }
            }
        }
        &.variable {
            &.selected {
                div:before {
                    background-image: url(${workspacePath}ic_attr_variable_on.png);
                }
            }
        }
    }

    .entryVariableAdd_box {
        .entryVariableAddWorkspace {
            border: 1px solid ${ColorSet.grey};
            background-color: #fff;
            color: ${ColorSet.green};
        }
        .entryVariableAddSpaceWorkspace {
            background-color: ${ColorSet.yello};
        }
        .message_inpt {
            padding: 16px 26px 16px 8px;
            border-top: 1px solid ${ColorSet.grey};
            background-color: ${ColorSet.yello};
        }
    }
    .entryVariableAddSpaceGlobalWrapperWorkspace {
        .entryVariableAddSpaceCheckWorkspace {
            background-size: 20px auto;
            background-image: url(${workspacePath}btn_radio.png);
        }
        &.on {
            .entryVariableAddSpaceCheckWorkspace {
                background-image: url(${workspacePath}btn_radio_on.png);
            }
        }
        .entryVariableAddSpaceCloudWrapperWorkspace {
            border: 1px solid ${ColorSet.grey};
            border-width: 1px 0;
            .entryVariableAddSpaceCheckWorkspace {
                background-size: 16px auto;
                background-image: url(${workspacePath}btn_checkbox.png);
            }
            &.on {
                .entryVariableAddSpaceCheckWorkspace {
                    background-image: url(${workspacePath}btn_checkbox_on.png);
                }
            }
        }
    }
    .entryVariableAddSpaceButtonWrapperWorkspace {
        border-top: 1px solid ${ColorSet.grey};
    }
    .entryVariableSplitterWorkspace + .entryVariableSplitterWorkspace {
        border-top: 0;
    }

    .entryVariableSplitterWorkspace {
        border: 1px solid ${ColorSet.grey};
        border-width: 1px 0;
        &.all {
            border-top: none;
            .list.unfold .inpt_box {
                background-color: ${ColorSet.brightYello};
            }
        }
        .list {
            .inpt_box {
                background-color: ${ColorSet.brightYello};
            }
            &.fold .inpt_box {
                background-color: inherit;
            }
            .attr_inner_box {
                border-top: 1px solid ${ColorSet.grey};
                background-color: ${ColorSet.yello};
                .val_attr {
                    .slide_inpt {
                        .entryVariableAddSpaceCheckWorkspace {
                            background-image: url(${workspacePath}btn_checkbox.png);
                            &.on {
                                background-image: url(${workspacePath}btn_checkbox_on.png);
                            }
                        }
                    }
                }
                .list_attr {
                    .btn_box .btn_list {
                        border: 1px solid ${ColorSet.green};
                        background-color: #fff;
                        color: ${ColorSet.green};
                    }

                    .list_cnt .cnt_inpt .btn_cnt {
                        line-height: 30px;
                    }
                }
                .box_sjt:before {
                    background-color: ${ColorSet.green};
                }
            }

            .watch {
                background-image: url(${workspacePath}layers_icon_unvisible24.png);
                background-size: 24px auto;
                &.on {
                    background-image: url(${workspacePath}layers_icon_visible24.png);
                }
            }

            .caution_dsc {
                background-color: ${ColorSet.yello};
            }
            &.default_list.list,
            &.default_val.list,
            &.global_list + .list,
            &.global_val + .list,
            &.local_list + .list,
            &.local_val + .list {
                border-top: 1px solid ${ColorSet.grey};
            }
            &.default_message {
                .inpt_box {
                    background-color: inherit;
                    &:before {
                        left: 10px;
                        background-image: url(${workspacePath}ic_attr_message_on.png);
                    }
                }
                &.unfold {
                    left: 10px;
                    background-image: url(${workspacePath}ic_attr_message_on.png);
                    .inpt_box {
                        background-color: ${ColorSet.brightYello};
                    }
                }
            }
            &.default_func {
                .inpt_box {
                    background-color: inherit;
                    &:before {
                        left: 10px;
                        background-image: url(${workspacePath}ic_attr_func_on.png);
                    }
                }
                &.unfold {
                    left: 10px;
                    background-image: url(${workspacePath}ic_attr_message_on.png);
                    .inpt_box {
                        background-color: ${ColorSet.brightYello};
                    }
                }
            }
        }
        .list.global_list .inpt_box:before {
            background-image: url(${workspacePath}ic_attr_list_global_on.png);
        }
        .list.global_val .inpt_box:before {
            background-image: url(${workspacePath}ic_attr_variable_global_on.png);
        }
        .list.default_list .inpt_box:before {
            background-image: url(${workspacePath}ic_attr_list_on.png);
        }
        .list.local_list .inpt_box:before {
            background-image: url(${workspacePath}ic_attr_list_local_on.png);
        }
        .list.default_val .inpt_box:before {
            background-image: url(${workspacePath}ic_attr_variable_on.png);
        }
        .list.local_val .inpt_box:before {
            background-image: url(${workspacePath}ic_attr_variable_local_on.png);
        }
        /* arrow */
        &.fold .attr_link:before,
        .list.default_func .inpt_box:after,
        .list.default_message .inpt_box:after,
        .list.fold .inpt:after {
            background-image: url(${workspacePath}layers_arrow_down_nor.png);
            background-color: inherit;
        }
        &.unfold .attr_link:before,
        .list.default_func.unfold .inpt_box:after,
        .list.default_message.unfold .inpt_box:after,
        .list.unfold .inpt:after {
            background-image: url(${workspacePath}layers_arrow_up_nor.png);
            background-color: inherit;
        }
        .attr_link:before {
            background-color: ${ColorSet.green};
        }
    }
    .entryVariableAddSpaceInputLabelWorkspace:before {
        background-color: ${ColorSet.green};
    }
    .entryVariableAddSpaceButtonWorkspace {
        border: 1px solid ${ColorSet.green};
        background-color: #fff;
        color: ${ColorSet.green};
    }
    .entryVariableAddSpaceConfirmWorkspace {
        color: #fff;
        background-color: ${ColorSet.green};
    }
    .entryVariableListWorkspace {
        border-top: 1px solid ${ColorSet.grey};
    }

    .entryFunctionButtonText {
        fill: ${ColorSet.green};
    }

    .entryFunctionButtonBorder {
        fill: #fff;
        stroke: ${ColorSet.green};
    }

    .block.basicButtonView > g > path {
        stroke: ${ColorSet.green};
    }
    .entryPlaygroundSoundEdit .entryPlaygroundSoundEditImage {
        background-image: url(${workspacePath}sound_edit.png);
    }
    .entryPlaygroundButtonTabWorkspace .entryPlaygroundCommentButtonWorkspace.showComment {
        background-image: url(${workspacePath}btn-toggle-comment-select.png);
    }
    .entryPlaygroundButtonTabWorkspace .entryPlaygroundCommentButtonWorkspace {
        background-image: url(${workspacePath}btn-toggle-comment-off.png);
    }
    .entryPlaygroundTextWorkspace {
        background-color: #fffdea;
        .write_box {
            .write_set .font_style_box .style_link.on {
                border: 1px solid ${ColorSet.green};
            }
            .input_box .write_type_box .on {
                color: ${ColorSet.green};
                border-color: ${ColorSet.green};
            }
        }
        .entryPlaygroundFontSizeKnob {
            background-image: url(${workspacePath}text_size_knob.png);
            background-size: 9px 20px;
        }
        .entryPlaygroundFontSizeIndicator {
            background-color: transparent;
        }
    }

    .literally .lc-picker .toolbar-button {
        &.selected:not(.disabled) {
            border-color: ${ColorSet.green};
        }
        &.pan-icon.selected:not(.disabled) {
            /* background-image: url(../img/pan-select.svg); */
        }
        &.select-cut-icon.selected:not(.disabled) {
            background-image: url(${workspacePath}select-cut-select.png);
        }
        &.pencil-icon.selected:not(.disabled) {
            background-image: url(${workspacePath}pencil-select.png);
        }
        &.line-icon.selected:not(.disabled) {
            background-image: url(${workspacePath}line-select.png);
        }
        &.rectangle-icon.selected:not(.disabled) {
            background-image: url(${workspacePath}rectangle-select.png);
        }
        &.ellipse-icon.selected:not(.disabled) {
            background-image: url(${workspacePath}ellipse-select.png);
        }
        &.text-icon.selected:not(.disabled) {
            background-image: url(${workspacePath}text-select.png);
        }
        &.fill-icon.selected:not(.disabled) {
            background-image: url(${workspacePath}fill-select.png);
        }
        &.eraser-icon.selected:not(.disabled) {
            background-image: url(${workspacePath}eraser-select.png);
        }
        &.magnifier-icon.selected:not(.disabled) {
            background-image: url(${workspacePath}magnifier-select.png);
        }
    }

    /* playground */
    .entryWorkspaceBoard {
        background-image: url(${workspacePath}entry_bg.png);
    }
    .entryPlaygroundResizeWorkspace {
        background-image: url(${workspacePath}entry_scroll_02.png);
        background-size: 16px auto;
    }
    .entryMobileToastWrapper .entryMobileToast:before {
        margin-left: 0px;
        background-image: url(${workspacePath}toast_left.png);
        background-size: 17px 38px;
    }
    .entryMobileToastWrapper .entryMobileToast:after {
        margin-left: -2.5px;
        background-image: url(${workspacePath}toast_right.png);
        background-size: 20px 38px;
    }

    .entryMobileToastWrapper .entryMobileToast .content {
        padding-top: 6px;
        background-image: url(${workspacePath}toast_bg.png);
        background-size: auto 38px;
        color: ${ColorSet.green};
        margin-left: 1.5px;
    }

    .entryPlaygroundButtonTabWorkspace .entryPlaygroundBackPackButtonWorkspace {
        background-image: url(${workspacePath}back_pack_button.png);
    }

    /* border-color */
    .entryVariableSplitterWorkspace
        .list
        .attr_inner_box
        .list_attr
        .cnt_list
        input[type='text']:active,
    .entryVariableSplitterWorkspace
        .list
        .attr_inner_box
        .list_attr
        .cnt_list
        input[type='text']:focus,
    .entryPlaygroundPictureName:active,
    .entryPlaygroundPictureName:focus,
    .entryPlaygroundSoundName:active,
    .entryPlaygroundSoundName:focus,
    .entryVariableSplitterWorkspace .list .inpt input[type='text']:active,
    .entryVariableSplitterWorkspace .list .inpt input[type='text']:focus,
    .entryVariableSplitterWorkspace
        .list
        .attr_inner_box
        .val_attr
        .attr_inpt
        input[type='text']:active,
    .entryVariableSplitterWorkspace
        .list
        .attr_inner_box
        .val_attr
        .attr_inpt
        input[type='text']:focus,
    .entryVariableAdd_box .message_inpt input[type='text']:active,
    .entryVariableAdd_box .message_inpt input[type='text']:focus,
    .entryVariableAddSpaceNameWrapperWorkspace .entryVariableAddSpaceInputWorkspace:active,
    .entryVariableAddSpaceNameWrapperWorkspace .entryVariableAddSpaceInputWorkspace:focus,
    .entryObjectDirectionInputWorkspace:active,
    .entryObjectDirectionInputWorkspace:focus,
    .entryObjectRotateInputWorkspace:active,
    .entryObjectRotateInputWorkspace:focus,
    .entryObjectNameWorkspace:active,
    .entryObjectNameWorkspace:focus,
    .entryObjectCoordinateInputWorkspace:active,
    .entryObjectCoordinateInputWorkspace:focus {
        border-color: ${ColorSet.green};
    }

    /* iframe */
    .minimize {
        min-width: inherit;
        #entry {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            overflow: hidden;
        }
        .entryCanvasWorkspace {
            border-top: 0px;
        }
        .entryEngineMinimize {
            position: absolute;
            bottom: 0;
            .entryMouseViewMinimize {
                color: ${ColorSet.green};
                input {
                    color: ${ColorSet.green};
                }
            }
            .entryStopButtonMinimize {
                background-image: url(${workspacePath}layers_icon_button_stop_nor.png);
                background-size: 13px;
                color: ${ColorSet.green};
            }
            .entryPauseButtonMinimize {
                background-image: url(${workspacePath}layers_icon_button_pause_nor.png);
                background-size: 13px;
                color: ${ColorSet.green};
            }
            .entryCoordinateButtonMinimize {
                background-size: 15px;
            }
        }

        .entryRunButtonMinimize {
            display: inline-block;
        }

        #entryCanvasWrapper {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 35px;
        }

        .entryCanvasWorkspace {
            position: absolute;
            top: 0;
            width: 100%;
            height: 100%;
        }

        .dropdown-menu {
            display: none;
        }

        .entryToastContainer {
            display: none;
        }

        .entryMaximizeButtonMinimize {
            display: none;
        }
    }

    #container {
        height: 100%;

        & > div {
            height: 100%;
            & > div {
                height: 100%;
            }
        }

        .icon_area {
            background: url(${workspacePath}img_mission_icon.png);
            background-size: 52px;
            img {
                display: none;
            }
        }
        .entryEngine_w,
        .entryPlaygroundWorkspace {
            top: 0px !important;
        }

        .propertyPanel {
            margin-top: 12px;
        }

        .intro_text_area {
            background-color: ${ColorSet.brightYello};
            border: 1px solid ${ColorSet.grey};
        }

        .intro_button {
            background-color: ${ColorSet.green};
        }
    }
`;

const Theme: Theme = {
    header: {
        wrapper: styled.div`
            position: relative;
            width: 100%;
            padding: 10px;
            background-color: ${main.workspace_main};
            color: #fff;
            font-size: 14px;
            min-width: 1024px;
            z-index: 2;
        `,
        logo: styled.h1`
            float: left;
            position: relative;
            display: inline-block;
            width: 113px;
            height: 20px;
            background: url(${assetPath}ic_line_entry_gnb.png) no-repeat 0 0;
            background-size: 113px auto;
            vertical-align: top;
            z-index: 10;
        `,
        projectTitle: styled.input`
            width: 164px;
            border-radius: 4px;
            border: 0;
            box-sizing: content-box;
            background-color: #fff;
            padding: 6px 6px 4px;
            font-size: 12px;
            font-weight: bold;
            color: #2c313d;
            letter-spacing: -0.4px;
            line-height: 14px;
            vertical-align: top;
            margin-left: 10px;
        `,
        buttonGroup: styled.div`
            position: absolute;
            right: 10px;
            top: 0;
            z-index: 10;
            padding: 5px;
            & > div {
                vertical-align: top;
                margin-left: 10px;
            }
            span {
                margin-top: 5px;
            }
            & > hr:first-child {
                display: none;
            }
            hr {
                margin-left: 13px;
                margin-right: 3px;
                display: inline-block;
                width: 1px;
                border: none;
                border-left: 1px solid #fff;
                height: 16px;
            }
        `,
        dropdownButton: {
            wrapper: styled.div`
                display: inline-block;
                position: relative;
                font-size: 0;
            `,
            anchor: styled.a<{on: boolean, icon: string}>`
                margin-top: 0;
                display: block;
                position: relative;
                overflow: hidden;
                width: 48px;
                height: 32px;
                border-radius: 16px;
                border-style: solid;
                border-width: 1px;
                border-color: #9ab6ff;
                background-color: #6e97ff;
                cursor: pointer;
                &:before {
                    position: absolute;
                    left: 8px;
                    top: 50%;
                    width: 18px;
                    height: 18px;
                    margin-top: -9px;
                    content: '';
                    background: ${(props) => `url(${assetPath}btn_workspace_${props.icon}.png) no-repeat;`};
                    background-size: 18px auto;
                }
                &:after {
                    position: absolute;
                    right: 8px;
                    top: 50%;
                    width: 6px;
                    height: 4px;
                    margin-top: -2px;
                    content: '';
                    background: ${(props) => {
                const url = props.on
                    ? `${assetPath}btn_workspace_arr_on.png`
                    : `${assetPath}btn_workspace_arr.png`;
                return `url(${url}) no-repeat;`;
            }};
                    background-size: 6px auto;
                }
            `
        }
    },
    workspace: Wrapper,
};

export default Theme;
