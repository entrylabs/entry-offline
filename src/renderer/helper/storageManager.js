import root from 'window-or-global';

export default class {
    static get PERSIST() {
        return 'persist:storage';
    }
    static get DONT_SHOW_VERSION() {
        return 'dontShowVersion';
    }
    static get LAST_CHECKED_VERSION() {
        return 'lastCheckVersion';
    }
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
    static get WORKSPACE_INTERFACE() {
        return 'workspace-interface';
    }

    static saveProject(project) {
        if (!project) {
            this.removeProject();
            return;
        }
        const projectJson = typeof project === 'string' ? project : JSON.stringify(project);
        root.localStorage.setItem(this.LOCAL_STORAGE_KEY, projectJson);
    }

    static loadProject() {
        return JSON.parse(root.localStorage.getItem(this.LOCAL_STORAGE_KEY));
    }

    static removeProject() {
        return root.localStorage.removeItem(this.LOCAL_STORAGE_KEY);
    }

    static saveTempProject(project) {
        const projectJson = typeof project === 'string' ? project : JSON.stringify(project);
        root.localStorage.setItem(this.LOCAL_STORAGE_KEY_RELOAD, projectJson);
    }

    static loadTempProject() {
        const tempProject = JSON.parse(root.localStorage.getItem(this.LOCAL_STORAGE_KEY_RELOAD));
        root.localStorage.removeItem(this.LOCAL_STORAGE_KEY_RELOAD);
        return tempProject;
    }

    static getPersistLangType() {
        const rawPersist = root.localStorage.getItem(this.PERSIST);
        if (!rawPersist) {
            return;
        }

        const persist = JSON.parse(JSON.parse(rawPersist).persist);
        return persist[this.LOCAL_STORAGE_LANG];
    }

    static getPersistWorkspaceMode() {
        const rawPersist = root.localStorage.getItem(this.PERSIST);
        if (!rawPersist) {
            return;
        }

        const persist = JSON.parse(JSON.parse(rawPersist).persist);
        return persist[this.LOCAL_STORAGE_WS_MODE];
    }

    static setWorkspaceInterface(interfaceState) {
        root.localStorage.setItem(this.WORKSPACE_INTERFACE, interfaceState);
    }

    static getLastDontShowVersion() {
        return root.localStorage.getItem(this.DONT_SHOW_VERSION);
    }

    static setLastDontShowVersion(latestVersion) {
        root.localStorage.setItem(this.DONT_SHOW_VERSION, latestVersion);
    }

    static getLastCheckedVersion() {
        return root.localStorage.getItem(this.LAST_CHECKED_VERSION);
    }

    static setLastCheckedVersion(lastCheckedVersion) {
        root.localStorage.setItem(this.LAST_CHECKED_VERSION, lastCheckedVersion);
    }
}
