import { CHANGE_PROJECT_NAME } from '../actions/types';
import { CommonAction } from './index';

interface ICommonState {
    projectName?: string;
}

const defaultState: ICommonState = {
    projectName: undefined,
};

export default (state: ICommonState = defaultState, action: CommonAction): ICommonState => {
    switch (action.type) {
        case CHANGE_PROJECT_NAME:
            return { ...state, projectName: action.payload };
        default:
            return state;
    }
};
