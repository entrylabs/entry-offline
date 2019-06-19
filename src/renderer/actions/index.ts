import { MODAL_PROGRESS } from './types';
export const commonAction = (type: string, data: any, options?: any) => {
    return {
        type,
        options,
        payload: data,
    };
};

export const modalProgressAction = (data: any) => {
    return {
        type: MODAL_PROGRESS,
        payload: data,
    };
};

export { showPopup, hidePopup, goTo } from './popupAction';
