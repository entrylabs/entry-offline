// configuration for entire program setting

declare interface ExternalConfigurations {
    baseUrl: string,
    baseResource: string,
    versionCheckApi: string,
    moduleCheckApi: string,
}

declare interface InternalConfigurations {
}

declare type Configurations =  ExternalConfigurations & InternalConfigurations;

// CommandLine Options

declare type CommandLineFlags = {
    debug?: boolean;
    version?: boolean;
}

declare type CommandLinePairs = {
    file?: any;
    host?: string;
    protocol?: string;
    config?: string;
}

declare type CommandLineOptions = CommandLineFlags & CommandLinePairs;
