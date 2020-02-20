import _lodash from 'lodash';
import jquery from 'jquery';
import { BigNumber } from 'bignumber.js';
import Entrylms from './resources/modal/app.js';
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
window._ = _lodash;

// jquery
// @ts-ignore
window.$ = jquery;

// @ts-ignore
window.jQuery = jquery;

// bigNumber
// @ts-ignore
window.BigNumber = BigNumber;

// entry-lms
const entrylms = new Entrylms();
window.entrylms = {
    alert: entrylms.alert,
    confirm: entrylms.confirm,
};

window.isOsx = process.platform === 'darwin';
