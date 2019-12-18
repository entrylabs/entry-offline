/// <reference path="./config.d.ts"/>

declare namespace NodeJS  {
    // noinspection JSUnusedGlobalSymbols
    interface Global {
        sharedObject: GlobalConfigurations;
        $: any;
    }
}

declare interface Window {
    createjs: any;
    EntryStatic: any;
}

declare var createjs: any;
declare var EntryStatic: any;
