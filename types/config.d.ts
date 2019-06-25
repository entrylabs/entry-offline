// configuration for entire program setting

declare interface ExternalConfigurations {
    baseUrl: string,
}

declare type Configurations =  ExternalConfigurations;

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
