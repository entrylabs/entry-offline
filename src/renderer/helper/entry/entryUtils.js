import IpcRendererHelper from '../ipcRendererHelper';
import StorageManager from '../storageManager';
import RendererUtils from '../rendererUtils';
import Constants from '../constants';
import root from 'window-or-global';

/**
 * 엔트리 코드로직과 관련된 유틸.
 * rendererUtils 와 다른 점은 Entry 관련 코드가 포함되면 이쪽.
 */
export default class {
    static confirmProjectWillDismiss() {
        let confirmProjectDismiss = true;
        if (!Entry.stateManager.isSaved()) {
            confirmProjectDismiss = confirm(RendererUtils.getLang('Menus.save_dismiss'));
        }

        if (confirmProjectDismiss) {
            StorageManager.saveCurrentWorkspaceInterface();
        }

        return confirmProjectDismiss;
    }

    /**
     * 즉시 리로드되어야 하는 프로젝트가 있는 경우 해당 프로젝트 리로드
     * 기존에 작업하던 자동저장 프로젝트가 있는 경우 confirm 후 리로드
     * 전부 아닌 경우 신규 프로젝트 리로드
     *
     * 프로젝트를 반환하는 경우에는 electron temp 프로젝트 폴더를 그대로 둔다.
     * 프로젝트를 반환하지 않는 경우에는 temp 프로젝트 폴더를 삭제한다.
     *
     * @return {Promise<Object>} undefined || Entry Project
     */
    static getSavedProject() {
        return new Promise(((resolve) => {
            const reloadProject = StorageManager.loadTempProject();
            const project = StorageManager.loadProject();

            if (reloadProject) {
                resolve(reloadProject);
            } else if (project) {
                root.entrylms.confirm(
                    RendererUtils.getLang('Workspace.confirm_load_temporary')
                )
                    .then((confirm) => {
                        if (confirm) {
                            StorageManager.removeProject();
                            resolve(project);
                        } else {
                            IpcRendererHelper.resetDirectory();
                            StorageManager.removeProject();
                            resolve(undefined);
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                        resolve(undefined);
                    });
            } else {
                IpcRendererHelper.resetDirectory();
                StorageManager.removeProject();
                resolve(undefined);
            }
        }));
    }

    /**
     * 사운드 오브젝트 (from resources/db) 를 Entry.soundQueue 에 로드한다.
     * @param {Array<Object>} sounds
     */
    static loadSound(sounds = []) {
        sounds.forEach((sound) => {
            const path = `${Constants.resourceSoundPath(sound.filename)}${sound.filename}${sound.ext}`;
            Entry.soundQueue.loadFile({
                id: sound._id,
                src: path,
                type: root.createjs.LoadQueue.SOUND,
            });
        });
    }

    static exportObject(object) {
        const { name, script } = object;

        const blockList = script.getBlockList();
        const objectVariable = Entry.variableContainer.getObjectVariables(blockList);
        objectVariable.objects = [object.toJSON()];

        RendererUtils.showSaveDialog({
            defaultPath: name,
            filters: [{ name: 'Entry object file(.eo)', extensions: ['eo'] }],
        }, (filePath) => {
            IpcRendererHelper.exportObject(filePath, objectVariable);
        });
    }
}
