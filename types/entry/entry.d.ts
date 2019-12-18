declare module IEntry {
    type PlaygroundViewMode = 'default' | 'variable' | 'picture' | 'sound' | 'text' | 'code' | string;
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
        objectType: string;
        entity?: EntityObject;
        // sprite: {
        //     name: string;
        //     pictures: Picture[];
        //     sounds: Sound[];
        //     category: any;
        // }
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
        addExpansionBlock: (blockName: string) => void;
        painter: Painter;
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
    objectType: string;
    text: string;
    options: any;

    sprite: any;
    objects: IEntry.Object[];
    functions: any[];
    messages: any[];
    variables: IEntry.Variable[];
}
