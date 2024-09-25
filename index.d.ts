import type { ConnectOptions, UncPath, UncPathOptions } from './types.js';
export declare function connectToUncPath(uncPathOptions: UncPathOptions, connectOptions?: Partial<ConnectOptions>): boolean;
export declare function disconnectUncPath(uncPath: UncPath): boolean;
export type { UncPath, UncPathOptions, UncPathOptionsWithoutCredentials, UncPathOptionsWithCredentials, ConnectOptions } from './types.js';
export { isWindows, uncPathIsSafe, uncPathOptionsAreSafe } from './validators.js';
