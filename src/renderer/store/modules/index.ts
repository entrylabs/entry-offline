import { combineReducers } from 'redux';
import persist, { IPersistState } from './persist';

export default combineReducers({
    persist
});

// 스토어의 상태 타입 정의
export interface StoreState {
    persist: IPersistState;
}
