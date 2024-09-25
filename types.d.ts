export declare const uncPathPrefix = "\\\\";
export type UncPath = `${typeof uncPathPrefix}${string}`;
export interface UncPathOptionsWithoutCredentials {
    uncPath: UncPath;
}
export type UncPathOptionsWithCredentials = UncPathOptionsWithoutCredentials & {
    userName: Exclude<string, ''>;
    password: Exclude<string, ''>;
};
export type UncPathOptions = UncPathOptionsWithoutCredentials | UncPathOptionsWithCredentials;
export interface ConnectOptions {
    deleteOnExit: boolean;
}
