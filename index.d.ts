export type UncPath = `\\\\${string}`;
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
export declare function connectToUncPath(uncPathOptions: UncPathOptions, connectOptions?: Partial<ConnectOptions>): boolean;
export declare function disconnectUncPath(uncPath: UncPath): boolean;
export {};
