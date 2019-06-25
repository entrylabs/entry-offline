// configuration for entire program setting

declare interface ExternalConfigurations {
    baseUrl: string,
}

declare interface InternalConfigurations {
}

declare type Configurations =  ExternalConfigurations & InternalConfigurations;

// CommandLine Options

declare type CommandLineFlags = {
    debug?: boolean;
}

declare type CommandLinePairs = {
    version?: string;
    file?: any;
    baseUrl?: string;
    config?: string;
}

declare type CommandLineOptions = CommandLineFlags & CommandLinePairs;
