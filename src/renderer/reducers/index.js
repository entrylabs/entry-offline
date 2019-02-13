import { combineReducers } from 'redux';
import persistReducer from './persistReducer';
import modalReducer from './modalReducer';
import popupReducer from './popupReducer';
import commonReducer from './commonReducer';

export default combineReducers({
    persist: persistReducer,
    common: commonReducer,
    modal: modalReducer,
    popup: popupReducer,
});
