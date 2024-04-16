# Windows UNC Path Connect for Node

Ensures a UNC path is ready to use in Windows before use.

## Installation

```sh
npm install @cityssm/windows-unc-path-connect
```

## Usage

```javascript
import { connectToUncPath } from '@cityssm/windows-unc-path-connect'

// Connect to share
const success = connectToUncPath(
  {
    uncPath: '\\\\server\\fileShare',
    userName: 'user',
    password: 'p@ss'
  },
  {
    deleteOnExit: true
  }
)

// Reading files should now work
try {
  const files = await fs.readdir('\\\\server\\fileShare')
} catch (error) {}
```
