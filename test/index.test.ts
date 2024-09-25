// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable security/detect-non-literal-fs-filename */

import assert from 'node:assert'
import fs from 'node:fs/promises'
import { describe, it } from 'node:test'

import {
  type UncPathOptions,
  connectToUncPath,
  disconnectUncPath
} from '../index.js'
import { uncPathIsSafe, uncPathOptionsHaveCredentials } from '../validators.js'

import { validUncPathOptions } from './config/config.js'

await describe('windows-unc-path-connect', async () => {
  for (const path of validUncPathOptions) {
    await it(`Successfully connects to a UNC path: ${path.uncPath}`, async () => {
      // Ensure the share doesn't exist
      disconnectUncPath(path.uncPath)

      // Reading files should fail
      try {
        await fs.readdir(path.uncPath)
        assert.fail('Reading directory successful after deleting path.')
      } catch {
        assert.ok(true)
      }

      // Connect to share
      const success = connectToUncPath(path, {
        deleteOnExit: true
      })
      assert.ok(success)

      // Reading files should work
      try {
        await fs.readdir(path.uncPath)
      } catch {
        assert.fail('Cannot list files')
      }
    })
  }
})

await describe('windows-unc-path-connect/validators', async () => {
  await describe('uncPathIsSafe()', async () => {
    await it('Returns "true" for good UNC paths', async () => {
      const goodUncPaths = ['\\\\192.168.1.1\\folder']

      for (const goodUncPath of goodUncPaths) {
        assert.strictEqual(uncPathIsSafe(goodUncPath), true)
      }
    })

    await it('Returns "false" for bad UNC paths', async () => {
      const badUncPaths = [
        '192.168.1.1', // missing slashes
        '\\192.168.1.1', // missing double slash beginning
        '\\\\192.168.1.1\\folder" /delete' // includes double quote
      ]

      for (const badUncPath of badUncPaths) {
        assert.strictEqual(uncPathIsSafe(badUncPath), false)
      }
    })
  })

  await describe('uncPathOptionsHaveCredentials()', async () => {
    await it('Returns "true" for options with credentials', async () => {
      assert.strictEqual(
        uncPathOptionsHaveCredentials({
          uncPath: '\\\\192.168.1.1\\folder',
          userName: 'user',
          password: 'pass'
        }),
        true
      )
    })

    await it('Returns "false" for options without credentials', async () => {
      const optionsWithoutCredentials: UncPathOptions[] = [
        {
          uncPath: '\\\\192.168.1.1\\folder'
        },
        {
          uncPath: '\\\\192.168.1.1\\folder',
          userName: ''
        },
        {
          uncPath: '\\\\192.168.1.1\\folder',
          userName: 'noPass'
        },
        {
          uncPath: '\\\\192.168.1.1\\folder',
          password: ''
        },
        {
          uncPath: '\\\\192.168.1.1\\folder',
          password: 'noUser'
        },
        {
          uncPath: '\\\\192.168.1.1\\folder',
          userName: '',
          password: ''
        }
      ]

      for (const options of optionsWithoutCredentials) {
        assert.strictEqual(uncPathOptionsHaveCredentials(options), false)
      }
    })
  })
})
