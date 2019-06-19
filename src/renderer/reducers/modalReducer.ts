import { MODAL_PROGRESS } from '../actions/types';
import { CommonAction } from './index';

export interface IModalState {
    isShow: boolean,
    data: {
        type: string,
        title: string,
        description: string,
    },
}

const initState: IModalState = {
    isShow: false,
    data: {
        type: '',
        title: '',
        description: '',
    },
};

export default (state: IModalState = initState, action: CommonAction): IModalState => {
    switch (action.type) {
        case MODAL_PROGRESS:
            return Object.assign({}, state, { ...action.payload });
        default:
            return state;
    }
};
