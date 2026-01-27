# Windows UNC Path Connect for Node

[![npm (scoped)](https://img.shields.io/npm/v/%40cityssm/windows-unc-path-connect)](https://www.npmjs.com/package/@cityssm/windows-unc-path-connect)
[![DeepSource](https://app.deepsource.com/gh/cityssm/node-windows-unc-path-connect.svg/?label=active+issues&show_trend=true&token=kMenIfdyEcHVDtebaPlgkjFy)](https://app.deepsource.com/gh/cityssm/node-windows-unc-path-connect/)
[![codecov](https://codecov.io/gh/cityssm/node-windows-unc-path-connect/graph/badge.svg?token=37N29WMP5B)](https://codecov.io/gh/cityssm/node-windows-unc-path-connect)
[![Coverage Testing](https://github.com/cityssm/node-windows-unc-path-connect/actions/workflows/coverage.yml/badge.svg)](https://github.com/cityssm/node-windows-unc-path-connect/actions/workflows/coverage.yml)

Ensures a UNC path that requires a user name and password
is ready to use in Windows before use.

## Installation

```sh
npm install @cityssm/windows-unc-path-connect
```

## Usage

```javascript
import { connectToUncPath } from '@cityssm/windows-unc-path-connect'

const uncPath = '\\\\server\\fileShare'

/*
 * Connect to share
 */

const success = connectToUncPath(
  {
    uncPath,
    userName: 'user',
    password: 'p@ss'
  },
  {
    // Optionally attempt to clean up connection on application shutdown.
    deleteOnExit: true,

    // Optionally assign a drive letter.
    driveLetter: 'M:',

    // Optionally persist the connection after restart.
    persistent: true
  }
)

/*
 * Reading files should now work.
 */

try {
  const files = await fs.readdir(uncPath)
} catch (error) {}
```
