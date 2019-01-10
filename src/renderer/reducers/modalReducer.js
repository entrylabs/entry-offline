import { MODAL_PROGRESS } from '../actions/types';

const initState = {
    progress: {
        isShow: false,
        data: {
            type: '',
            title: '',
            description: '',
        },
    },
};

export default (state = initState, action) => {
    switch (action.type) {
        case MODAL_PROGRESS:
            return Object.assign({}, state, { progress: action.payload });
        default:
            return state;
    }
};
