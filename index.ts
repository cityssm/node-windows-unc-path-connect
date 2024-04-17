import { execSync } from 'node:child_process'

import Debug from 'debug'
import exitHook from 'exit-hook'

import {
  type ConnectOptions,
  type UncPath,
  type UncPathOptions,
  type UncPathOptionsWithCredentials,
  uncPathPrefix
} from './types.js'

const debug = Debug('windows-unc-path-connect')

function uncPathOptionsHasCredentials(
  uncPathOptions: UncPathOptions
): uncPathOptions is UncPathOptionsWithCredentials {
  return (
    ((uncPathOptions as UncPathOptionsWithCredentials).userName ?? '') !== '' &&
    ((uncPathOptions as UncPathOptionsWithCredentials).password ?? '') !== ''
  )
}

/**
 * Connects to a given UNC path.
 * @param {UncPathOptions} uncPathOptions - UNC path and optional connection credentials.
 * @param {Partial<ConnectOptions>} connectOptions - Optional options for the connection.
 * @returns {boolean} - True when the connection is made successfully.
 */
export function connectToUncPath(
  uncPathOptions: UncPathOptions,
  connectOptions?: Partial<ConnectOptions>
): boolean {
  if (!uncPathOptions.uncPath.startsWith(uncPathPrefix)) {
    return false
  }

  debug(`Connecting to share: ${uncPathOptions.uncPath}`)

  let command = `net use "${uncPathOptions.uncPath}"`

  if (uncPathOptionsHasCredentials(uncPathOptions)) {
    command += ` /user:${uncPathOptions.userName} ${
      uncPathOptions.password ?? ''
    }`
  }

  const output = execSync(command)

  debug(output.toString().trim())

  if (connectOptions?.deleteOnExit ?? false) {
    exitHook(() => {
      disconnectUncPath(uncPathOptions.uncPath)
    })
  }

  return output.includes('command completed successfully')
}

/**
 * Disconnects a given UNC path.
 * @param {UncPath} uncPath - UNC path to disconnect
 * @returns {boolean} - True if the path was disconnected.
 */
export function disconnectUncPath(uncPath: UncPath): boolean {
  if (!uncPath.startsWith(uncPathPrefix)) {
    return false
  }

  debug(`Disconnecting share: ${uncPath}`)

  const command = `net use "${uncPath}" /delete`

  try {
    const output = execSync(command)

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
