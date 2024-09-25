import {
  type UncPath,
  type UncPathOptions,
  type UncPathOptionsWithCredentials,
  uncPathPrefix
} from './types.js'

function stringHasForbiddenCharacters(stringToCheck?: string): boolean {
  return (stringToCheck ?? '').includes('"')
}

/**
 * Checks if the operating system is Windows.
 * @returns True if the operating system is Windows.
 */
export function isWindows(): boolean {
  return process.platform === 'win32'
}

/**
 * Checks if the options include credentials.
 * @param uncPathOptions - UNC path options.
 * @returns True when the UNC path options include credentials.
 */
export function uncPathOptionsHaveCredentials(
  uncPathOptions: UncPathOptions
): uncPathOptions is UncPathOptionsWithCredentials {
  return (
    ((uncPathOptions as Partial<UncPathOptionsWithCredentials>).userName ??
      '') !== '' &&
    ((uncPathOptions as Partial<UncPathOptionsWithCredentials>).password ??
      '') !== ''
  )
}

/**
 * Ensures a UNC path is safe.
 * @param uncPath - UNC path.
 * @returns True if the UNC path is safe for use.
 */
export function uncPathIsSafe(uncPath: string): uncPath is UncPath {
  return (
    uncPath.startsWith(uncPathPrefix) && !stringHasForbiddenCharacters(uncPath)
  )
}

/**
 * Ensures the options are safe to use.
 * @param uncPathOptions - UNC path options.
 * @returns True if the options are safe to use.
 */
export function uncPathOptionsAreSafe(uncPathOptions: UncPathOptions): boolean {
  if (!uncPathIsSafe(uncPathOptions.uncPath)) {
    return false
  }

  // eslint-disable-next-line sonarjs/prefer-single-boolean-return
  if (
    uncPathOptionsHaveCredentials(uncPathOptions) &&
    (stringHasForbiddenCharacters(uncPathOptions.userName) ||
      stringHasForbiddenCharacters(uncPathOptions.password))
  ) {
    return false
  }

  return true
}
