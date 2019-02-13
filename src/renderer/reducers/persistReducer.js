import { CHANGE_LANGUAGE, PROJECT_DATA, WS_MODE } from '../actions/types';

const defaultState = {
    lang: 'ko',
    mode: undefined,
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case CHANGE_LANGUAGE:
        case PROJECT_DATA:
            return { ...state, ...action.payload };
        case WS_MODE:
            return { ...state, mode: action.payload };
        default:
            return state;
    }
};
