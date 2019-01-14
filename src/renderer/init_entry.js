import root from 'window-or-global';
import _ from 'lodash';
import jquery from 'jquery';
import { BigNumber } from 'bignumber.js';
import StorageManager from './helper/storageManager';
import ImportToggleHelper from './helper/importToggleHelper';


// Lang, EntryStatic
const lastLang = StorageManager.getPersistLangType() || 'ko';
const lastWSMode = StorageManager.getPersistWorkspaceMode() || 'workspace';

(async() => {
    await ImportToggleHelper.changeLang(lastLang);
    await ImportToggleHelper.changeEntryStatic(lastWSMode);
})();

// lodash
// eslint-disable-next-line id-length
root._ = _;

// jquery
// eslint-disable-next-line no-multi-assign, id-length
root.$ = root.jQuery = jquery;

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
