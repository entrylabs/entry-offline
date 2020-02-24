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

const entrylms = new Entrylms();
window.entrylms = {
    alert: entrylms.alert,
    confirm: entrylms.confirm,
};
