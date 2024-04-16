// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable security/detect-non-literal-fs-filename */

import assert from 'node:assert'
import fs from 'node:fs/promises'
import { describe, it } from 'node:test'

import { connectToUncPath, disconnectUncPath } from '../index.js'

import { validUncPathOptions } from './config.test.js'

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
