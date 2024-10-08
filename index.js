import { execSync } from 'node:child_process';
import Debug from 'debug';
import exitHook from 'exit-hook';
import { isWindows, uncPathIsSafe, uncPathOptionsAreSafe, uncPathOptionsHaveCredentials } from './validators.js';
const debug = Debug('windows-unc-path-connect');
export function connectToUncPath(uncPathOptions, connectOptions) {
    if (!isWindows() || !uncPathOptionsAreSafe(uncPathOptions)) {
        return false;
    }
    debug(`Connecting to share: ${uncPathOptions.uncPath}`);
    let command = `net use "${uncPathOptions.uncPath}"`;
    if (uncPathOptionsHaveCredentials(uncPathOptions)) {
        command += ` /user:"${uncPathOptions.userName}" "${uncPathOptions.password}"`;
    }
    try {
        const output = execSync(command, { stdio: 'pipe' });
        debug(output.toString().trim());
        if (connectOptions?.deleteOnExit ?? false) {
            exitHook(() => {
                disconnectUncPath(uncPathOptions.uncPath);
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
export function disconnectUncPath(uncPath) {
    if (!isWindows() || !uncPathIsSafe(uncPath)) {
        return false;
    }
    debug(`Disconnecting share: ${uncPath}`);
    const command = `net use "${uncPath}" /delete`;
    try {
        const output = execSync(command, { stdio: 'pipe' });
        debug(output.toString().trim());
        return (output.includes('deleted successfully') ||
            output.includes('connection could not be found'));
    }
    catch {
        return false;
    }
}
export { isWindows, uncPathIsSafe, uncPathOptionsAreSafe } from './validators.js';
