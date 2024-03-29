# `commercelayer cli`

Core CLI commands.

* [`commercelayer cli:update`](#commercelayer-cliupdate)
* [`commercelayer cli:version`](#commercelayer-cliversion)

### `commercelayer cli:update`

Update Commerce Layer CLI.

```sh-session
USAGE
  $ commercelayer cli:update [-v <value>]

FLAGS
  -v, --version=<value>  update CLI to a specific version or tag

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

```sh-session
USAGE
  $ commercelayer cli:version [-p]

FLAGS
  -p, --plugins  show version of installed plugins

DESCRIPTION
  Show installed version of Commerce Layer CLI

ALIASES
  $ commercelayer version

EXAMPLES
  $ commercelayer cli:version
```

_See code: [src/commands/cli/version.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/src/commands/cli/version.ts)_
