import type { ConnectOptions, UncPathOptions } from './types.js';
export declare function connectToUncPath(uncPathOptions: UncPathOptions, connectOptions?: Partial<ConnectOptions>): boolean;
export declare function disconnectUncPath(uncPathOrDriveLetter: string): boolean;
export type { ConnectOptions, UncPath, UncPathOptions, UncPathOptionsWithCredentials, UncPathOptionsWithoutCredentials } from './types.js';
export { driveLetterIsSafe, isWindows, uncPathIsSafe, uncPathOptionsAreSafe } from './validators.js';
