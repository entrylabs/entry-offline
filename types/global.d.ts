declare module NodeJS  {
    interface Global {
        sharedObject: GlobalConfigurations;
        $: any;
    }
}
declare const createjs: any;
declare const Entry: any;
