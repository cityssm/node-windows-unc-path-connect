import { execSync } from 'node:child_process';
import Debug from 'debug';
import exitHook from 'exit-hook';
import { DEBUG_NAMESPACE } from './debug.config.js';
import { driveLetterIsSafe, isWindows, uncPathIsSafe, uncPathOptionsAreSafe, uncPathOptionsHaveCredentials } from './validators.js';
const timeoutMilliseconds = 30_000;
const debug = Debug(`${DEBUG_NAMESPACE}:index`);
export function connectToUncPath(uncPathOptions, connectOptions) {
    if (!isWindows() || !uncPathOptionsAreSafe(uncPathOptions)) {
        return false;
    }
    debug(`Connecting to share: ${uncPathOptions.uncPath}`);
    const commandPieces = ['net use'];
    if (connectOptions?.driveLetter) {
        commandPieces.push(connectOptions.driveLetter);
    }
    commandPieces.push(`"${uncPathOptions.uncPath}"`);
    if (connectOptions?.persistent) {
        commandPieces.push('/persistent:yes');
    }
    if (uncPathOptionsHaveCredentials(uncPathOptions)) {
        commandPieces.push(`/user:"${uncPathOptions.userName}" "${uncPathOptions.password}"`);
    }
    try {
        const output = execSync(commandPieces.join(' '), {
            stdio: 'pipe',
            timeout: timeoutMilliseconds
        });
        debug(output.toString().trim());
        if (connectOptions?.deleteOnExit ?? false) {
            exitHook(() => {
                disconnectUncPath(connectOptions?.driveLetter ?? uncPathOptions.uncPath);
            });
        }
        return output.includes('command completed successfully');
    }
    catch (error) {
        return error
            .toString()
            .includes('Multiple connections to a server or shared resource');
    }
}
export function disconnectUncPath(uncPathOrDriveLetter) {
    if (!isWindows() ||
        (!uncPathIsSafe(uncPathOrDriveLetter) &&
            !driveLetterIsSafe(uncPathOrDriveLetter))) {
        return false;
    }
    debug(`Disconnecting share: ${uncPathOrDriveLetter}`);
    const command = `net use "${uncPathOrDriveLetter}" /delete`;
    try {
        const output = execSync(command, {
            stdio: 'pipe',
            timeout: timeoutMilliseconds
        });
        debug(output.toString().trim());
        return (output.includes('deleted successfully') ||
            output.includes('connection could not be found'));
    }
    catch (error) {
        const errorString = error.toString();
        if (errorString.includes('network connection could not be found')) {
            return true;
        }
        debug(errorString);
        return false;
    }
}
export { driveLetterIsSafe, isWindows, uncPathIsSafe, uncPathOptionsAreSafe } from './validators.js';
