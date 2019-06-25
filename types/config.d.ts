// configuration from config file
declare type CommonConfigurations = {
    baseUrl: string;
}

declare type FileConfigurations = CommonConfigurations & {
    baseUrl: string,
}

// CommandLine Options
declare type CommandLineFlags = {
    debug?: boolean;
}

declare type CommandLinePairs = Partial<CommonConfigurations> & {
    version?: string;
    file?: string;
    config?: string;
}

declare type CommandLineOptions = CommandLineFlags & CommandLinePairs;

// runtimeProperties
declare type RuntimeGlobalProperties = {
    roomIds: string[];
    mainWindowId: number;
    workingPath: string;
    isInitEntry: boolean;
    appName: string
}

declare type GlobalConfigurations = CommandLineOptions & FileConfigurations & RuntimeGlobalProperties;
