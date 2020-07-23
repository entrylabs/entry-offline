import { bindActionCreators, Store } from 'redux';
import { CommonActionCreators } from './modules/common';


const listen = window.ipcListen;

function ipcRendererListen(store: Store) {
    if (!listen) {
        console.warn('ipcRenderer Listener not defined');
        return;
    }

    const { dispatch } = store;
    const actions = bindActionCreators(CommonActionCreators, dispatch);

    listen('invalidAsarFile', () => {
        actions.changeProductIsValid(false);
        console.log('this file is foo bar baz');
    });
}

export default ipcRendererListen;
