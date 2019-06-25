declare module NodeJS  {
    interface Global {
        sharedObject: GlobalConfigurations;
        $: any;
    }
}
