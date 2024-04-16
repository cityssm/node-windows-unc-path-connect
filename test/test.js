import assert from 'node:assert';
import fs from 'node:fs/promises';
import { describe, it } from 'node:test';
import { connectToUncPath, disconnectUncPath } from '../index.js';
import { validUncPathOptions } from './config.js';
await describe('windows-unc-path-connect', async () => {
    for (const path of validUncPathOptions) {
        await it(`Successfully connects to a UNC path: ${path.uncPath}`, async () => {
            disconnectUncPath(path.uncPath);
            try {
                await fs.readdir(path.uncPath);
                assert.fail('Reading directory successful after deleting path.');
            }
            catch {
                assert.ok(true);
            }
            const success = connectToUncPath(path, {
                deleteOnExit: true
            });
            assert.ok(success);
            try {
                await fs.readdir(path.uncPath);
            }
            catch {
                assert.fail('Cannot list files');
            }
        });
    }
});
