import { uncPathPrefix } from './types.js';
function stringHasForbiddenCharacters(stringToCheck) {
    return (stringToCheck ?? '').includes('"');
}
export function isWindows() {
    return process.platform === 'win32';
}
export function uncPathOptionsHaveCredentials(uncPathOptions) {
    return ((uncPathOptions.userName ??
        '') !== '' &&
        (uncPathOptions.password ??
            '') !== '');
}
export function uncPathIsSafe(uncPath) {
    return (uncPath.startsWith(uncPathPrefix) && !stringHasForbiddenCharacters(uncPath));
}
export function uncPathOptionsAreSafe(uncPathOptions) {
    if (!uncPathIsSafe(uncPathOptions.uncPath)) {
        return false;
    }
    if (uncPathOptionsHaveCredentials(uncPathOptions) &&
        (stringHasForbiddenCharacters(uncPathOptions.userName) ||
            stringHasForbiddenCharacters(uncPathOptions.password))) {
        return false;
    }
    return true;
}
