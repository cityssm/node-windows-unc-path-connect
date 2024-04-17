import { type UncPath, type UncPathOptions, type UncPathOptionsWithCredentials } from './types.js';
export declare function isWindows(): boolean;
export declare function uncPathOptionsHaveCredentials(uncPathOptions: UncPathOptions): uncPathOptions is UncPathOptionsWithCredentials;
export declare function uncPathIsSafe(uncPath: string): uncPath is UncPath;
export declare function uncPathOptionsAreSafe(uncPathOptions: UncPathOptions): boolean;
