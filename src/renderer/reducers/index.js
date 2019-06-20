import { combineReducers } from 'redux';
import modalReducer from './modalReducer';
import popupReducer from './popupReducer';

// TODO ducks reducers
import ducksPersistReducer from '../store/modules/persist';
import ducksCommonReducer from '../store/modules/common';

export default combineReducers({
    persist: ducksPersistReducer,
    common: ducksCommonReducer,
    modal: modalReducer,
    popup: popupReducer,
});
