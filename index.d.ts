import { type ConnectOptions, type UncPath, type UncPathOptions } from './types.js';
export declare function connectToUncPath(uncPathOptions: UncPathOptions, connectOptions?: Partial<ConnectOptions>): boolean;
export declare function disconnectUncPath(uncPath: UncPath): boolean;
export type { UncPath, UncPathOptions, UncPathOptionsWithoutCredentials, UncPathOptionsWithCredentials, ConnectOptions } from './types.js';
