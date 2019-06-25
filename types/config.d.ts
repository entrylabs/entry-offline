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
    roomIds: string[]; // cloud pc 용. 사용처 불분명. entry-hw 와 사용처 비교 필요
    mainWindowId: number; // 메인 브라우저의 progressbar 컨트롤용
    workingPath: string; // 프로젝트의 savePath 담당
    appName: 'entry'; // 아직 렌더러 프로세스에서 실행하는 하드웨어 업데이트 로직 실행방지용
}

declare type GlobalConfigurations = CommandLineOptions & FileConfigurations & RuntimeGlobalProperties;
