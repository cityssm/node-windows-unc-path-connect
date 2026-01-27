export declare const uncPathPrefix = "\\\\";
export type UncPath = `${typeof uncPathPrefix}${string}`;
export interface UncPathOptionsWithoutCredentials {
    uncPath: UncPath;
}
export type UncPathOptionsWithCredentials = UncPathOptionsWithoutCredentials & {
    password: Exclude<string, ''>;
    userName: Exclude<string, ''>;
};
export type UncPathOptions = UncPathOptionsWithCredentials | UncPathOptionsWithoutCredentials;
export interface ConnectOptions {
    deleteOnExit: boolean;
    driveLetter: `${Uppercase<string>}:`;
    persistent: boolean;
}
