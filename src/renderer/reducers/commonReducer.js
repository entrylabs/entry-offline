import {
    LANGUAGE,
    PROJECT_DATA,
    WS_MODE,
} from '../actions/types';

const defaultState = {
    lang: 'en',
    mode: 'workspace',
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case LANGUAGE:
        case PROJECT_DATA:
            return { ...state, ...action.payload };
        case WS_MODE:
            return { ...state, mode: action.payload };
        default:
            return state;
    }
};
