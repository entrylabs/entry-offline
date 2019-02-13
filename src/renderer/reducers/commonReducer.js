import { CHANGE_PROJECT_NAME } from '../actions/types';

const defaultState = {
    projectName: undefined,
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case CHANGE_PROJECT_NAME:
            return { ...state, projectName: action.payload };
        default:
            return state;
    }
};
