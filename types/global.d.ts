declare module NodeJS  {
    interface Global {
        sharedObject: GlobalConfigurations;
        $: any;
    }
}

declare interface Window {
    createjs: any;
    Entry: any;
}
