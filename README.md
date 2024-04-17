# Windows UNC Path Connect for Node

[![npm (scoped)](https://img.shields.io/npm/v/%40cityssm/windows-unc-path-connect)](https://www.npmjs.com/package/@cityssm/windows-unc-path-connect)
[![DeepSource](https://app.deepsource.com/gh/cityssm/node-windows-unc-path-connect.svg/?label=active+issues&show_trend=true&token=kMenIfdyEcHVDtebaPlgkjFy)](https://app.deepsource.com/gh/cityssm/node-windows-unc-path-connect/)
[![Maintainability](https://api.codeclimate.com/v1/badges/0c0f2c336c22c3c889fa/maintainability)](https://codeclimate.com/github/cityssm/node-windows-unc-path-connect/maintainability)
[![DeepSource](https://app.deepsource.com/gh/cityssm/node-windows-unc-path-connect.svg/?label=code+coverage&show_trend=false&token=kMenIfdyEcHVDtebaPlgkjFy)](https://app.deepsource.com/gh/cityssm/node-windows-unc-path-connect/)
[![Coverage Testing](https://github.com/cityssm/node-windows-unc-path-connect/actions/workflows/coverage.yml/badge.svg)](https://github.com/cityssm/node-windows-unc-path-connect/actions/workflows/coverage.yml)

Ensures a UNC path is ready to use in Windows before use.

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
    // Attempt to clean up connection on application shutdown
    deleteOnExit: true
  }
)

/*
 * Reading files should now work.
 */

try {
  const files = await fs.readdir(uncPath)
} catch (error) {}
```
