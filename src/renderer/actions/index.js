import { MODAL_PROGRESS } from './types';
export const commonAction = (type, data, options) => {
    return {
        type,
        options,
        payload: data,
    };
};

export const modalProgressAction = (data) => {
    return {
        type: MODAL_PROGRESS,
        payload: data,
    };
};

export { showPopup, hidePopup, goTo } from './PopupAction';
