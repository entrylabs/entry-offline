import { CHANGE_LANGUAGE, PROJECT_DATA, WS_MODE } from '../actions/types';
import { CommonAction } from './index';

interface IPersistState {
    lang: string,
    mode?: string,
}

const defaultState = {
    lang: 'ko',
    mode: undefined,
};

export default (state: IPersistState = defaultState, action: CommonAction): IPersistState => {
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
