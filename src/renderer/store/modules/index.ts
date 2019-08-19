import { combineReducers } from 'redux';
import persist, { IPersistState } from './persist';
import common, { ICommonState } from './common';
import modal, { IModalState } from './modal';

export default combineReducers({
    persist, common, modal,
});

// 스토어의 상태 타입 정의
export interface IStoreState {
    persist: IPersistState;
    common: ICommonState;
    modal: IModalState;
}
