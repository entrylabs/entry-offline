import { createAction, handleActions } from 'redux-actions';

// types
const CHANGE_LANGUAGE = 'persist/CHANGE_LANGUAGE';
const WS_MODE = 'persist/WORKSPACE_MODE';

// actions
export const PersistActionCreators = {
    changeLanguage: createAction(CHANGE_LANGUAGE, (lang: string) => {
        return { lang };
    }),
    changeWorkspaceMode: createAction(WS_MODE, (mode: string) => {
        return { mode };
    }),
};

// default state
export interface IPersistState {
    lang: string;
    mode?: string;
}

const defaultState: IPersistState = {
    lang: 'ko',
    mode: undefined,
};

// reducer
export default handleActions<IPersistState>({
    [WS_MODE]: (state, action) => ({ ...state, mode: action.payload.mode }),
    [CHANGE_LANGUAGE]: (state, action) => ({ ...state, lang: action.payload.lang }),
}, defaultState);
