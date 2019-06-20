import { combineReducers } from 'redux';
import popupReducer from './popupReducer';

// TODO ducks reducers
import ducksPersistReducer from '../store/modules/persist';
import ducksCommonReducer from '../store/modules/common';
import ducksModalReducer from '../store/modules/modal';

export default combineReducers({
    persist: ducksPersistReducer,
    common: ducksCommonReducer,
    modal: ducksModalReducer,
    popup: popupReducer,
});
