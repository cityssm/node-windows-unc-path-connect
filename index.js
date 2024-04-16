import { execSync } from 'node:child_process';
import Debug from 'debug';
import exitHook from 'exit-hook';
const debug = Debug('windows-unc-path-connect');
const uncShareAddress = /^\\\\/;
function uncPathOptionsHasCredentials(uncPathOptions) {
    return ((uncPathOptions.userName ?? '') !== '' &&
        (uncPathOptions.password ?? '') !== '');
}
export function connectToUncPath(uncPathOptions, connectOptions) {
    if (!uncShareAddress.test(uncPathOptions.uncPath)) {
        return false;
    }
    debug(`Connecting to share: ${uncPathOptions.uncPath}`);
    let command = `net use ${uncPathOptions.uncPath}`;
    if (uncPathOptionsHasCredentials(uncPathOptions)) {
        command += ` /user:${uncPathOptions.userName} ${uncPathOptions.password ?? ''}`;
    }
    const output = execSync(command);
    debug(output.toString().trim());
    if (connectOptions?.deleteOnExit ?? false) {
        exitHook(() => {
            disconnectUncPath(uncPathOptions.uncPath);
        });
    }
    return output.includes('command completed successfully');
}
export function disconnectUncPath(uncPath) {
    if (!uncShareAddress.test(uncPath)) {
        return false;
    }
    debug(`Disconnecting share: ${uncPath}`);
    const command = `net use ${uncPath} /delete`;
    try {
        const output = execSync(command);
        debug(output.toString().trim());
        return (output.includes('deleted successfully') ||
            output.includes('connection could not be found'));
    }
    catch {
        return false;
    }
}
