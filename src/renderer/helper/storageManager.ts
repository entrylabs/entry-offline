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

    static saveProject(project: IEntry.Project | string) {
        if (!project) {
            this.clearSavedProject();
            return;
        }
        const projectJson = typeof project === 'string' ? project : JSON.stringify(project);
        localStorage.setItem(this.LOCAL_STORAGE_KEY, projectJson);
    }

    static loadProject() {
        const savedProjectString = localStorage.getItem(this.LOCAL_STORAGE_KEY);
        if (savedProjectString) {
            return JSON.parse(savedProjectString);
        }
    }

    static clearSavedProject() {
        return localStorage.removeItem(this.LOCAL_STORAGE_KEY);
    }

    static saveTempProject(project: IEntry.Project | string) {
        const projectJson = typeof project === 'string' ? project : JSON.stringify(project);
        localStorage.setItem(this.LOCAL_STORAGE_KEY_RELOAD, projectJson);
    }

    static loadTempProject(): IEntry.Project | undefined {
        const savedProjectString = localStorage.getItem(this.LOCAL_STORAGE_KEY_RELOAD);
        if (savedProjectString) {
            const tempProject = JSON.parse(savedProjectString);
            localStorage.removeItem(this.LOCAL_STORAGE_KEY_RELOAD);
            return tempProject;
        }
    }

    static getPersistLangType(): string | undefined {
        const rawPersist = localStorage.getItem(this.PERSIST);
        if (!rawPersist) {
            return;
        }

        const persist = JSON.parse(JSON.parse(rawPersist).persist);
        return persist[this.LOCAL_STORAGE_LANG];
    }

    static getPersistWorkspaceMode(): WorkspaceMode | undefined {
        const rawPersist = localStorage.getItem(this.PERSIST);
        if (!rawPersist) {
            return;
        }

        const persist = JSON.parse(JSON.parse(rawPersist).persist);
        return persist[this.LOCAL_STORAGE_WS_MODE];
    }

    static setWorkspaceInterface(interfaceState: IEntry.WorkspaceInterface) {
        (localStorage as Storage).setItem(this.WORKSPACE_INTERFACE, JSON.stringify(interfaceState));
    }

    static getLastDontShowVersion() {
        return localStorage.getItem(this.DONT_SHOW_VERSION);
    }

    static setLastDontShowVersion(latestVersion: string) {
        localStorage.setItem(this.DONT_SHOW_VERSION, latestVersion);
    }

    static getLastCheckedVersion() {
        return localStorage.getItem(this.LAST_CHECKED_VERSION);
    }

    static setLastCheckedVersion(lastCheckedVersion: string) {
        localStorage.setItem(this.LAST_CHECKED_VERSION, lastCheckedVersion);
    }
}
