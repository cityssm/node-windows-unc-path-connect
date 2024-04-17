export declare const uncPathPrefix = "\\\\";
export type UncPath = `${typeof uncPathPrefix}${string}`;
interface UncPathOptionsWithoutCredentials {
    uncPath: UncPath;
}
type UncPathOptionsWithCredentials = UncPathOptionsWithoutCredentials & {
    userName: string;
    password: string;
};
export type UncPathOptions = UncPathOptionsWithoutCredentials | UncPathOptionsWithCredentials;
export interface ConnectOptions {
    deleteOnExit: boolean;
}
export {};
