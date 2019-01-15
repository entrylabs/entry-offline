import { MODAL_PROGRESS } from '../actions/types';

const initState = {
    isShow: false,
    data: {
        type: '',
        title: '',
        description: '',
    },
};

export default (state = initState, action) => {
    switch (action.type) {
        case MODAL_PROGRESS:
            return Object.assign({}, state, { ...action.payload });
        default:
            return state;
    }
};
