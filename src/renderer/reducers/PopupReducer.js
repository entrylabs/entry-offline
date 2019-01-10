import { POPUP_SHOW, POPUP_HIDE, PAGE_MOVE } from '../actions/types';

const initState = {
    type: '',
    visible: false,
    page: 0,
};

export default (state = initState, action = {}) => {
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
