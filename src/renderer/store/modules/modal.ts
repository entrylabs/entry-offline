import { createAction, handleActions } from 'redux-actions';

// types
const MODAL_PROGRESS = 'popup/MODAL_PROGRESS';

// actions
export const ModalActionCreators = {
    showModalProgress: createAction(MODAL_PROGRESS, (data: Partial<IModalState>) => data),
};

// default state
export interface IModalState {
    isShow: boolean;
    data: {
        type: string;
        title: string;
        description: string;
    },
}

const defaultState = {
    isShow: false,
    data: {
        type: '',
        title: '',
        description: '',
    },
};

// reducer
export default handleActions<IModalState>({
    // payload 는 IModalState 의 Partial 이므로 전체 state 고정을 위해 이와같이 작성
    // TODO 그렇지 않으면 immutable.js 사용 필요
    [MODAL_PROGRESS]: (state, action) => ({ ...state, ...action.payload }),
}, defaultState);
