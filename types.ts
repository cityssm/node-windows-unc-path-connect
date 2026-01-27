export const uncPathPrefix = '\\\\'

export type UncPath = `${typeof uncPathPrefix}${string}`

export interface UncPathOptionsWithoutCredentials {
  uncPath: UncPath
}

export type UncPathOptionsWithCredentials = UncPathOptionsWithoutCredentials & {
  password: Exclude<string, ''>
  userName: Exclude<string, ''>
}

export type UncPathOptions =
  | UncPathOptionsWithCredentials
  | UncPathOptionsWithoutCredentials

export interface ConnectOptions {
  /**
   * Attempt to disconnect from the UNC path when the application exits.
   */
  deleteOnExit: boolean

  /**
   * Drive letter to map the UNC path to (e.g., 'Z:').
   */
  driveLetter: `${Uppercase<string>}:`

  /**
   * Whether the connection should be persistent (reconnect on login).
   */
  persistent: boolean
}
