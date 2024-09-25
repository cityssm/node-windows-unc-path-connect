import assert from 'node:assert';
import fs from 'node:fs/promises';
import { describe, it } from 'node:test';
import { connectToUncPath, disconnectUncPath } from '../index.js';
import { uncPathIsSafe, uncPathOptionsAreSafe, uncPathOptionsHaveCredentials } from '../validators.js';
import { validUncPathOptions } from './config/config.js';
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
await describe('windows-unc-path-connect/validators', async () => {
    const goodUncPaths = ['\\\\192.168.1.1\\folder'];
    const badUncPaths = [
        '192.168.1.1',
        '\\192.168.1.1',
        '\\\\192.168.1.1\\folder" /delete'
    ];
    await describe('uncPathIsSafe()', async () => {
        await it('Returns "true" for good UNC paths', () => {
            for (const goodUncPath of goodUncPaths) {
                assert.strictEqual(uncPathIsSafe(goodUncPath), true);
            }
        });
        await it('Returns "false" for bad UNC paths', () => {
            for (const badUncPath of badUncPaths) {
                assert.strictEqual(uncPathIsSafe(badUncPath), false);
                assert.strictEqual(uncPathOptionsAreSafe({
                    uncPath: badUncPath
                }), false);
            }
        });
    });
    await describe('uncPathOptionsHaveCredentials()', async () => {
        await it('Returns "true" for options with credentials', () => {
            assert.strictEqual(uncPathOptionsHaveCredentials({
                uncPath: goodUncPaths[0],
                userName: 'user',
                password: 'pass'
            }), true);
        });
        await it('Returns "false" for options without credentials', () => {
            const optionsWithoutCredentials = [
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
                    userName: '',
                    password: ''
                }
            ];
            for (const options of optionsWithoutCredentials) {
                assert.strictEqual(uncPathOptionsHaveCredentials(options), false);
            }
        });
    });
});
