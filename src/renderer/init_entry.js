import root from 'window-or-global';
import EntryStatic from './resources/static.js';
import _ from 'lodash';
import jquery from 'jquery';
import { BigNumber } from 'bignumber.js';
import StorageManager from './helper/storageManager';


// Lang
(async() => {
    const lastLang = StorageManager.getPersistLangType();
    root.Lang = await import(`./resources/lang/${lastLang}.json`);
})();

// EntryStatic
root.EntryStatic = EntryStatic;

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
