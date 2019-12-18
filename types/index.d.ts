// TODO ObjectLike 로 표기된 구문은 나중에 인터페이스로 따로 만들어주어야 한다.
declare interface ObjectLike extends Object {
    [key: string]: any
}

declare type WorkspaceMode = 'practical_course' | 'workspace';

declare type Point = {
    x: number;
    y: number;
};
