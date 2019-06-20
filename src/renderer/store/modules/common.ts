import { createAction, handleActions } from 'redux-actions';

// types
const CHANGE_PROJECT_NAME = 'common/CHANGE_PROJECT_NAME';

// actions
export const CommonActionCreators = {
    changeProjectName: createAction(CHANGE_PROJECT_NAME, (projectName: string) => ({ projectName })),
};

// default state
export interface ICommonState {
    projectName?: string;
}

const defaultState: ICommonState = {
    projectName: undefined,
};

// reducer
export default handleActions<ICommonState>({
    [CHANGE_PROJECT_NAME]: (state, action) => ({ ...state, projectName: action.payload.projectName }),
}, defaultState);
