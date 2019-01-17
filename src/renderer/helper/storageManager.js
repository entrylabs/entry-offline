import root from 'window-or-global';

export default class {
    static get LOCAL_STORAGE_KEY() {
        return 'localStorageProject';
    }
    static get LOCAL_STORAGE_KEY_RELOAD() {
        return 'localStorageProjectReload';
    }
    static get LOCAL_STORAGE_LANG() {
        return 'lang';
    }
    static get LOCAL_STORAGE_WS_MODE() {
        return 'mode';
    }

    static saveProject(project) {
        const projectJson = typeof project === 'string' ? project : JSON.stringify(project);
        root.localStorage.setItem(this.LOCAL_STORAGE_KEY, projectJson);
    }

    static loadProject() {
        return root.localStorage.getItem(this.LOCAL_STORAGE_KEY);
    }

    static saveTempProject(project) {
        const projectJson = typeof project === 'string' ? project : JSON.stringify(project);
        root.localStorage.setItem(this.LOCAL_STORAGE_KEY_RELOAD, projectJson);
    }

    static loadTempProject() {
        const tempProject = root.localStorage.getItem(this.LOCAL_STORAGE_KEY_RELOAD);
        root.localStorage.removeItem(this.LOCAL_STORAGE_KEY_RELOAD);
        return tempProject;
    }

    static getPersistLangType() {
        const persist = root.localStorage.getItem('persist:storage');
        if (!persist) {
            return;
        }

        const common = JSON.parse(JSON.parse(persist).common);
        return common[this.LOCAL_STORAGE_LANG];
    }

    static getPersistWorkspaceMode() {
        const persist = root.localStorage.getItem('persist:storage');
        if (!persist) {
            return;
        }

        const common = JSON.parse(JSON.parse(persist).common);
        return common[this.LOCAL_STORAGE_WS_MODE];
    }

    /**
     * Entry 전용
     * 엔트리 현재 오브젝트, 블록메뉴의 width 를 저장한다.
     * 이는 entryjs 가 알아서 불러서 활용한다.
     */
    static saveCurrentWorkspaceInterface() {
        if (Entry.type === 'workspace') {
            if (localStorage && Entry.interfaceState) {
                localStorage.setItem(
                    'workspace-interface',
                    JSON.stringify(Entry.captureInterfaceState())
                );
            }
        }
    }
}
