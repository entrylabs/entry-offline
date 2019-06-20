import { combineReducers } from 'redux';
import persistReducer from './persistReducer';
import modalReducer from './modalReducer';
import popupReducer from './popupReducer';
import commonReducer from './commonReducer';

// TODO ducks reducers
import ducksPersistReducer from '../store/modules/persist';
import ducksCommonReducer from '../store/modules/common';

export default combineReducers({
    persist: ducksPersistReducer,
    common: ducksCommonReducer,
    modal: modalReducer,
    popup: popupReducer,
});
