`commercelayer cli`
===================

Update Commerce Layer CLI.

* [`commercelayer cli:update`](#commercelayer-cliupdate)
* [`commercelayer cli:version`](#commercelayer-cliversion)

### `commercelayer cli:update`

Update Commerce Layer CLI.

```
USAGE
  $ commercelayer cli:update [-v <value>]

FLAGS
  -v, --version=<value>  Update CLI to a specific version or tag

DESCRIPTION
  Update Commerce Layer CLI

ALIASES
  $ commercelayer upgrade
  $ commercelayer latest

EXAMPLES
  $ commercelayer cli:update --version=<version-or-tag>
```

_See code: [src/commands/cli/update.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/src/commands/cli/update.ts)_

### `commercelayer cli:version`

Show installed version of Commerce Layer CLI.

```
USAGE
  $ commercelayer cli:version

DESCRIPTION
  Show installed version of Commerce Layer CLI

ALIASES
  $ commercelayer version

EXAMPLES
  $ commercelayer cli:version
```

_See code: [src/commands/cli/version.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/src/commands/cli/version.ts)_
