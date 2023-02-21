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

    window.ipcInvoke('isValidAsarFile').then((result: boolean) => {
        actions.changeProductIsValid(result);
    })
}

export default ipcRendererListen;
