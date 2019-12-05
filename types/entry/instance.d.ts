declare interface Window {
    Entry: Entry;
}

declare class Entry {
    // 엔트리 네임스페이스에 할당되어있는 클래스들
    static Project: IEntry.Project;
    static Picture: IEntry.Picture;
    static Workspace: IEntry.Workspace;
    static HW: IEntry.Hardware;
    static Vim: UnknownAny;
    static Utils: UnknownAny;
    static Event: UnknownAny;

    static EXPANSION_BLOCK: UnknownAny;
    static EXPANSION_BLOCK_LIST: UnknownAny;
    static mediaFilePath: string;


    // 엔트리에 할당되어있는 특정 객체들
    static container: IEntry.Container;
    static playground: IEntry.Playground;
    static hw: IEntry.Hardware;
    static engine: UnknownAny;
    static stage: IEntry.Stage;
    static toast: IEntry.ToastLegacy;
    static Func: UnknownAny;

    // 엔트리 네임스페이스에 할당되어있는 특정 함수들
    static generateHash: () => string;
    static reloadBlock: () => void;
    static do: (command: string, ...args: any[]) => void;
    static captureInterfaceState: () => IEntry.WorkspaceInterface;
    static addEventListener: (event: string, listener: (...args: any[]) => void) => void;
    static dispatchEvent: (event: string, ...args: any[]) => void;
    static getMainWS: () => IEntry.Workspace;
    static exportProject: () => UnknownAny;
    static clearProject: () => void;
    static loadProject: (project: IEntry.Project) => void;
    static disposeContainer: () => void;
    static init: (container: HTMLDivElement, option: IEntry.EntryOptions) => void;

    // 엔트리 네임스페이스에 할당되어있는 특정 변수들
    static type: WorkspaceMode;
    static interfaceState: IEntry.WorkspaceInterface;
    static creationChangedEvent?: any;

    static variableContainer: any;
    static expansion: any;
    static soundQueue: any;
    static stateManager: IEntry.StateManager;
}
