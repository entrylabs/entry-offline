import { createAction, handleActions } from 'redux-actions';

// types
const CHANGE_PROJECT_NAME = 'common/CHANGE_PROJECT_NAME';
const SET_VALID_PRODUCT = 'common/SET_VALID_PRODUCT';

// actions
export const CommonActionCreators = {
    changeProjectName: createAction(CHANGE_PROJECT_NAME, (projectName: string) => ({ projectName })),
    changeProductIsValid: createAction(SET_VALID_PRODUCT, (isValid: boolean) => ({ isValidProduct: isValid })),
};

// default state
export interface ICommonState {
    projectName?: string;
    isValidProduct: boolean;
}

const defaultState: ICommonState = {
    projectName: undefined,
    isValidProduct: true,
};

// reducer
export default handleActions<ICommonState>({
    [CHANGE_PROJECT_NAME]: (state, action) => ({ ...state, projectName: action.payload.projectName }),
    [SET_VALID_PRODUCT]: (state, action) => ({ ...state, isValidProduct: action.payload.isValidProduct }),
}, defaultState);
