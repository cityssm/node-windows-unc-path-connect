/* eslint-disable sonarjs/no-hardcoded-passwords -- Test passwords */
/* eslint-disable security/detect-non-literal-fs-filename, unicorn/prefer-string-raw */

import assert from 'node:assert'
import fs from 'node:fs/promises'
import { describe, it } from 'node:test'

import Debug from 'debug'

import { DEBUG_ENABLE_NAMESPACES } from '../debug.config.js'
import {
  type UncPath,
  type UncPathOptions,
  connectToUncPath,
  disconnectUncPath
} from '../index.js'
import {
  uncPathIsSafe,
  uncPathOptionsAreSafe,
  uncPathOptionsHaveCredentials
} from '../validators.js'

import { driveLetter, validUncPathOptions } from './config/config.js'

Debug.enable(DEBUG_ENABLE_NAMESPACES)

await describe('windows-unc-path-connect', async () => {
  for (const path of validUncPathOptions) {
    // eslint-disable-next-line no-await-in-loop
    await it(`Successfully connects to a UNC path: ${path.uncPath}`, async () => {
      // Ensure the share doesn't exist
      disconnectUncPath(driveLetter)

      // Connect to share
      const success = connectToUncPath(path, {
        deleteOnExit: true,
        driveLetter,
        persistent: false
      })

      assert.ok(success)

      // Reading files should work
      try {
        await fs.readdir(driveLetter)
      } catch {
        assert.fail('Cannot list files')
      }
    })
  }
})

await describe('windows-unc-path-connect/validators', async () => {
  const goodUncPaths: UncPath[] = ['\\\\192.168.1.1\\folder']

  const badUncPaths = [
    // eslint-disable-next-line sonarjs/no-hardcoded-ip
    '192.168.1.1', // missing slashes
    '\\192.168.1.1', // missing double slash beginning
    '\\\\192.168.1.1\\folder" /delete' // includes double quote
  ]

  await describe('uncPathIsSafe()', async () => {
    await it('Returns "true" for good UNC paths', () => {
      for (const goodUncPath of goodUncPaths) {
        assert.strictEqual(uncPathIsSafe(goodUncPath), true)
      }
    })

    await it('Returns "false" for bad UNC paths', () => {
      for (const badUncPath of badUncPaths) {
        assert.strictEqual(uncPathIsSafe(badUncPath), false)

        assert.strictEqual(
          uncPathOptionsAreSafe({
            uncPath: badUncPath
          }),
          false
        )
      }
    })
  })

  await describe('uncPathOptionsHaveCredentials()', async () => {
    await it('Returns "true" for options with credentials', () => {
      assert.strictEqual(
        uncPathOptionsHaveCredentials({
          uncPath: goodUncPaths[0],
          userName: 'user',

          password: 'pass'
        }),
        true
      )
    })

    await it('Returns "false" for options without credentials', () => {
      const optionsWithoutCredentials: UncPathOptions[] = [
        {
          uncPath: goodUncPaths[0]
        },
        {
          uncPath: goodUncPaths[0],
          userName: ''
        },
        {
          uncPath: goodUncPaths[0],
          userName: 'noPass'
        },
        {
          uncPath: goodUncPaths[0],

          password: ''
        },
        {
          uncPath: goodUncPaths[0],

          password: 'noUser'
        },
        {
          uncPath: goodUncPaths[0],

          password: '',
          userName: ''
        }
      ]

      for (const options of optionsWithoutCredentials) {
        assert.strictEqual(uncPathOptionsHaveCredentials(options), false)
      }
    })
  })
})
