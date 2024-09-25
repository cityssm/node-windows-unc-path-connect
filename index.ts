// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/os-command */

import { execSync } from 'node:child_process'

import Debug from 'debug'
import exitHook from 'exit-hook'

import type { ConnectOptions, UncPath, UncPathOptions } from './types.js'
import {
  isWindows,
  uncPathIsSafe,
  uncPathOptionsAreSafe,
  uncPathOptionsHaveCredentials
} from './validators.js'

const debug = Debug('windows-unc-path-connect')

/**
 * Connects to a given UNC path.
 * @param uncPathOptions - UNC path and optional connection credentials.
 * @param connectOptions - Optional options for the connection.
 * @returns True when the connection is made successfully.
 */
export function connectToUncPath(
  uncPathOptions: UncPathOptions,
  connectOptions?: Partial<ConnectOptions>
): boolean {
  if (!isWindows() || !uncPathOptionsAreSafe(uncPathOptions)) {
    return false
  }

  debug(`Connecting to share: ${uncPathOptions.uncPath}`)

  let command = `net use "${uncPathOptions.uncPath}"`

  if (uncPathOptionsHaveCredentials(uncPathOptions)) {
    command += ` /user:"${uncPathOptions.userName}" "${
      uncPathOptions.password
    }"`
  }

  try {
    const output = execSync(command, { stdio: 'pipe' })

    debug(output.toString().trim())

    if (connectOptions?.deleteOnExit ?? false) {
      exitHook(() => {
        disconnectUncPath(uncPathOptions.uncPath)
      })
    }

    return output.includes('command completed successfully')
  } catch (error) {
    return (error as Error)
      .toString()
      .includes('Multiple connections to a server or shared resource')
  }
}

/**
 * Disconnects a given UNC path.
 * @param uncPath - UNC path to disconnect
 * @returns True if the path was disconnected.
 */
export function disconnectUncPath(uncPath: UncPath): boolean {
  if (!isWindows() || !uncPathIsSafe(uncPath)) {
    return false
  }

  debug(`Disconnecting share: ${uncPath}`)

  const command = `net use "${uncPath}" /delete`

  try {
    const output = execSync(command, { stdio: 'pipe' })

    debug(output.toString().trim())

    return (
      output.includes('deleted successfully') ||
      output.includes('connection could not be found')
    )
  } catch {
    return false
  }
}

export type {
  UncPath,
  UncPathOptions,
  UncPathOptionsWithoutCredentials,
  UncPathOptionsWithCredentials,
  ConnectOptions
} from './types.js'
