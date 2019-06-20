import { combineReducers } from 'redux';
import persistReducer from './persistReducer';
import modalReducer from './modalReducer';
import popupReducer from './popupReducer';
import commonReducer from './commonReducer';

// TODO ducks reducers
import ducksPersistReducer from '../store/modules/persist';

export default combineReducers({
    persist: ducksPersistReducer,
    common: commonReducer,
    modal: modalReducer,
    popup: popupReducer,
});
