import { combineReducers } from 'redux';
import commonReducer from './commonReducer';
import modalReducer from './modalReducer';

export default combineReducers({
    common: commonReducer,
    modal: modalReducer,
});
