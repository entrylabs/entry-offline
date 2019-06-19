import { POPUP_SHOW, POPUP_HIDE, PAGE_MOVE } from '../actions/types';
import { Action } from 'redux';

export type PopupAction = Action & {
    popupType: string;
    visible: boolean;
    page: number;
}

export interface IPopupState {
    type: string;
    visible: boolean;
    page: number;
}

const initState = {
    type: '',
    visible: false,
    page: 0,
};

export default (state: IPopupState = initState, action: PopupAction): IPopupState => {
    switch (action.type) {
        case POPUP_SHOW:
        case POPUP_HIDE:
            return {
                ...state,
                type: action.popupType,
                visible: action.visible,
            };
        case PAGE_MOVE:
            return {
                ...state,
                page: action.page,
            };
        default:
            return state;
    }
};
