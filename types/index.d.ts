// TODO ObjectLike 로 표기된 구문은 나중에 인터페이스로 따로 만들어주어야 한다.
declare interface ObjectLike extends Object {
    [key: string]: any
}

declare type WorkspaceMode = 'practical_course' | 'workspace';

declare type Point = {
    x: number;
    y: number;
};

declare namespace NodeJS {
    // noinspection JSUnusedGlobalSymbols
    interface Global {
        sharedObject: GlobalConfigurations;
        $: any;
    }
}

// configuration from config file
declare type FileConfigurations = {
    updateCheckUrl: string; // for offline version check
    remoteModuleResourceUrl: string; // for offline's synchronize module list
    moduleResourceUrl: string; // for hardware's remote module request
}

// CommandLine Options
declare type CommandLineFlags = {
    debug?: boolean;
}

declare type CommandLinePairs = Partial<FileConfigurations> & {
    version?: string;
    file?: string;
    config?: string;
}

declare type CommandLineOptions = CommandLineFlags & CommandLinePairs;

// runtimeProperties
declare type RuntimeGlobalProperties = {
    roomIds: string[]; // cloud pc 용. 사용처 불분명. entry-hw 와 사용처 비교 필요
    file?: string; // 프로젝트의 savePath 담당
    appName: 'entry'; // 아직 렌더러 프로세스에서 실행하는 하드웨어 업데이트 로직 실행방지용
}

declare type GlobalConfigurations = CommandLineOptions & FileConfigurations & RuntimeGlobalProperties;

interface HardwareMessageData extends HardwareModuleId {
    [key: string]: any;
}

interface HardwareModuleId {
    company: string;
    model: string;
}

type WebSocketMessage = {
    data: string;
    mode: number;
    type: 'utf8';
};

declare module IEntry {
    type PlaygroundViewMode = 'default' | 'variable' | 'picture' | 'sound' | 'text' | 'code' | 'table' | string;

    export var HWMonitor: HardwareMonitor;
    export var moduleManager: any; //TODO
    export var popupHelper: any; //TODO

    /**
     * 외부에 노출될 수 있는 하드웨어 클래스 내 변수 및 함수 정의
     */
    export interface Hardware {
        prototype: any;

        programConnected: boolean;
        hwModule: any;

        portData: any;
        sendQueue: any;
        update: () => void;
        closeConnection: () => void;
        downloadConnector: () => void;
        downloadGuide: () => void;
        downloadSource: () => void;
        setZero: () => void;
        checkDevice: (data: HardwareMessageData) => void;
        openHardwareDownloadPopup: () => void;

        _initSocket: () => void;
    }

    /**
     * 엔트리 워크스페이스에 존재하는 하드웨어 모듈
     * 블록 및 하드웨어모니터 UI 정보, 통신 로직을 가지고있음
     */
    export interface HardwareModule {
        id: HardwareModuleId;
        name: string;
        monitorTemplate?: any;
        sendMessage?: (hw: Hardware) => void;
        setZero: () => void;

        // 웹소켓에서 온 데이터를 직접 핸들링 하고 싶을 때 사용하는 함수. 매 메세지 수신시 발생
        // 둘다 로직상으로 보면 사실상 같은 일을 한다. 왜 두개가 있는지도 의문
        afterReceive?: (portData: HardwareMessageData) => void;
        afterSend?: (sendQueue: HardwareMessageData) => void;
        dataHandler?: (data: HardwareMessageData) => void;
    }

    /**
     * 하드웨어 모니터 프로퍼티 패널 오브젝트
     * 하드웨어가 연결되면 필요여부에 따라 프로퍼티패널에 하드웨어 모니터가 노출됨
     */
    export interface HardwareMonitor {
        new(hwModule: HardwareModule): HardwareMonitor;

        initView: () => void;
        generateView: () => void;
        generateListView: () => void;
        toggleMode: (mode: string) => void; // 'list' || 'both'?
        setHwModule: (hwModule: HardwareModule) => void;
        update: (portData: any, sendQueue: any) => void;
    }

    enum WorkspaceMode {
        MODE_BOARD, MODE_VIMBOARD, MODE_OVERLAYBOARD
    }

    export type Project = {
        name: string;
        script: any & {
            getBlockList: () => any;
        }
        toJSON: () => JSON;
    };
    export type Object = {
        id: string;
        name?: string;
        script?: any;
        scene?: string;
        objectType: string;
        rotateMethod?: string;
        entity?: EntityObject;
        fileurl?: string;
        selectedPicture?: any;
        selectedPictureId?: string;
        lock?: boolean;
        sprite?: any[];
        toJSON: () => JSON;
        getPicture: (pictureId: string) => IEntry.Picture | null;
        getSound: (soundId: string) => IEntry.Sound;
    };

    export type EntityObject = any;

    export type Picture = any & {
        id: string;
        name: string;
        filename: string;
        fileurl?: string;
        imageType?: 'png' | 'svg';
        dimension?: { width: number, height: number, scaleX: number; scaleY: number; }
    };
    export type Sound = any;
    export type WorkspaceInterface = {
        canvasWidth: number;
        menuWidth: number;
        object: string;
    }

    export type Variable = any & {
        id: string;
        object: string;
    }

    export interface Container {
        getAllObjects(): any[];

        addObject: (objectModel: any, ...rest: number[]) => any;
        getObject: (objectId: string) => IEntry.Object;
        cachePicture: (pictureId: string, image: any) => void;
    }

    export interface Workspace {
        MODE_BOARD: 0;
        MODE_VIMBOARD: 1;
        MODE_OVERLAYBOARD: 2;

        board: any;
        changeEvent: any;
        mode: WorkspaceMode;
        setMode: (mode: WorkspaceMode) => void;
        getMode: () => WorkspaceMode;
        setScale: (scale: number) => void;
    }

    export interface Playground {
        object?: Object;
        addSound: (sound: Sound, NotForView?: boolean, isNew?: boolean) => void;
        addPicture: (picture: Picture, isNew?: boolean, isSelect?: boolean) => void;
        setPicture: (picture: Picture) => void;
        selectPicture: (pictureId: string, objectId?: string) => string;
        downloadPicture: (pictureId: string) => void;
        downloadSound: (soundId: string) => void;
        changeViewMode: (viewType: PlaygroundViewMode) => void;
        addExpansionBlocks: (expansionInfoList: any[]) => void;
        addAIUtilizeBlocks: (aiBlockInfoList: any[]) => void;
        removeExpansionBlocks: (expansionInfoList: any[]) => void;
        removeAIUtilizeBlocks: (aiBlockInfoList: any[]) => void;
        painter: Painter;
        dataTable: any;
        setMenu?: (...args: any[]) => any;
        board: any;
        blockMenu: BlockMenu;
    }

    export interface BlockMenu {
        banCategory: (category: string) => void;
        unbanCategory: (category: string) => void;
    }

    export interface Painter {
        file: any;
        getImageSrc: (image: Picture) => string;
    }

    /**
     * 오브젝트, 도움말, 하드웨어등의 정보를 가지고있는 좌측하단 패널
     */
    export interface PropertyPanel {
        removeMode: (mode: string) => void;
        addMode: (modeKey: string, element: any) => void;
        selected: string;
    }

    export interface Stage {
        canvas: /*PIXI.Container | */any;
        _app: /*PIXI.Application | */any;
        handle: any;
        update: () => void;
    }

    /**
     * 과거 엔트리 토스트
     */
    type ToastLegacyFunction = (title: string, message: string, isNotAutoDispose?: boolean) => void;

    export interface ToastLegacy {
        alert: ToastLegacyFunction;
        warning: ToastLegacyFunction;
        success: ToastLegacyFunction;
    }

    /**
     * 최초 엔트리 Init 시 받는 옵션들. 여기저기서 사용된다
     */
    export interface EntryOptions {
        disableHardware?: boolean;
    }

    export interface StateManager {
        isSaved: () => boolean;
        canRedo: () => boolean;
        canUndo: () => boolean;
        addStamp: () => void;
    }
}

declare type EntryAddOptions = {
    name?: any;
    id?: any;
    objectType: string;
    text: string;
    options: any;

    sprite: any;
    objects: IEntry.Object[];
    functions: any[];
    messages: any[];
    variables: IEntry.Variable[];
}

/// <reference path="./entry.d.ts" />
/// <reference path="./hardware.d.ts" />
/// <reference path="../index.d.ts" />

declare class Entry {
    // 엔트리 네임스페이스에 할당되어있는 클래스들
    static Project: IEntry.Project;
    static Picture: IEntry.Picture;
    static Workspace: IEntry.Workspace;
    static HW: IEntry.Hardware;
    static Vim: any;
    static Utils: any;
    static Event: any;

    static EXPANSION_BLOCK: any;
    static EXPANSION_BLOCK_LIST: any;
    static AI_UTILIZE_BLOCK_LIST: any;
    static mediaFilePath: string;


    // 엔트리에 할당되어있는 특정 객체들
    static container: IEntry.Container;
    static playground: IEntry.Playground;
    static hw: IEntry.Hardware;
    static engine: any;
    static stage: IEntry.Stage;
    static toast: IEntry.ToastLegacy;
    static Func: any;
    static expansionBlocks: any[];
    static aiUtilizeBlocks: any[];
    static aiLearning: any;
    static TextCodingUtil: any;

    // 엔트리 네임스페이스에 할당되어있는 특정 함수들
    static generateHash: () => string;
    static reloadBlock: () => void;
    static do: (command: string, ...args: any[]) => void;
    static captureInterfaceState: () => IEntry.WorkspaceInterface;
    static addEventListener: (event: string, listener: (...args: any[]) => void) => void;
    static dispatchEvent: (event: string, ...args: any[]) => void;
    static getMainWS: () => IEntry.Workspace;
    static exportProject: () => any;
    static clearProject: () => void;
    static loadProject: (project: IEntry.Project) => void;
    static disposeContainer: () => void;
    static init: (container: HTMLDivElement, option: IEntry.EntryOptions) => void;
    static loadExternalModules: (moduleNames: string[]) => void;

    // 엔트리 네임스페이스에 할당되어있는 특정 변수들
    static type: WorkspaceMode;
    static interfaceState: IEntry.WorkspaceInterface;
    static creationChangedEvent?: any;

    static variableContainer: any;
    static expansion: any;
    static aiUtilize: any;
    static soundQueue: any;
    static stateManager: IEntry.StateManager;
}
