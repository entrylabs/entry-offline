import { combineReducers } from 'redux';
import commonReducer from './commonReducer';
import modalReducer from './modalReducer';
import popupReducer from './popupReducer';

export default combineReducers({
    common: commonReducer,
    modal: modalReducer,
    popup: popupReducer,
});
