import { POPUP_SHOW, POPUP_HIDE, PAGE_MOVE } from './types';

export const showPopup = (type, data) => {
    return {
        type: POPUP_SHOW,
        popupType: type,
        visible: true,
        payload: data,
    };
};

export const hidePopup = () => {
    return {
        type: POPUP_HIDE,
        visible: false,
    };
};

export const goTo = (page) => {
    return {
        type: PAGE_MOVE,
        page: page,
    };
};
