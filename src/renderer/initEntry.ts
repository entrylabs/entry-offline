import Entrylms from './resources/modal/app.js';
import StorageManager from './helper/storageManager';
import ImportToggleHelper from './helper/importToggleHelper';

// Lang, EntryStatic
const lastLang = StorageManager.getPersistLangType() || 'ko';

(async () => {
    await ImportToggleHelper.changeLang(lastLang);
    await ImportToggleHelper.changeEntryStatic('workspace');
})();

const entrylms = new Entrylms();
window.entrylms = {
    alert: entrylms.alert,
    confirm: entrylms.confirm,
};

import('@entrylabs/modal/dist/entry-modal.js').then((module) => {
    window.EntryModal = module;
});
