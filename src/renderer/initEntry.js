import root from 'window-or-global';
import _lodash from 'lodash';
import jquery from 'jquery';
import { BigNumber } from 'bignumber.js';
import StorageManager from './helper/storageManager';
import ImportToggleHelper from './helper/importToggleHelper';


// Lang, EntryStatic
const lastLang = StorageManager.getPersistLangType() || 'ko';
const lastWSMode = StorageManager.getPersistWorkspaceMode();

(async() => {
    await ImportToggleHelper.changeLang(lastLang);
    await ImportToggleHelper.changeEntryStatic(lastWSMode);
})();

// lodash
root._ = _lodash;

// jquery
// eslint-disable-next-line id-length
root.$ = jquery;
root.jQuery = jquery;

// bigNumber
root.BigNumber = BigNumber;

// entry-lms dummy
root.entrylms = {
    alert: (text) => {
        alert(text);
    },
    confirm: (text) => {
        const isConfirm = confirm(text);
        const defer = new root.$.Deferred();
        return defer.resolve(isConfirm);
    },
};

root.isOsx = process.platform === 'darwin';
