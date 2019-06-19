declare module Entry {
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
        sprite: {
            name: string;
            pictures: Picture[];
            sounds: Sound[];
            category: any;
        }
        toJSON: () => JSON;
    };
    export type Picture = any & {
        id: string;
        name: string;

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
}

declare type EntryAddOptions = {
    objectType: string;
    text: string;
    options: any;

    sprite: any;
    objects: Entry.Object[];
    functions: any[];
    messages: any[];
    variables: Entry.Variable[];
}
