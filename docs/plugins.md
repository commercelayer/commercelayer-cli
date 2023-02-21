# `commercelayer plugins`

Manage CLI plugins.

* [`commercelayer plugins`](#commercelayer-plugins)
* [`commercelayer plugins:install PLUGIN...`](#commercelayer-pluginsinstall-plugin)
* [`commercelayer plugins:available`](#commercelayer-pluginsavailable)
* [`commercelayer plugins:inspect PLUGIN...`](#commercelayer-pluginsinspect-plugin)
* [`commercelayer plugins:install PLUGIN...`](#commercelayer-pluginsinstall-plugin-1)
* [`commercelayer plugins:link PLUGIN`](#commercelayer-pluginslink-plugin)
* [`commercelayer plugins:uninstall PLUGIN...`](#commercelayer-pluginsuninstall-plugin)
* [`commercelayer plugins:uninstall PLUGIN...`](#commercelayer-pluginsuninstall-plugin-1)
* [`commercelayer plugins:uninstall PLUGIN...`](#commercelayer-pluginsuninstall-plugin-2)
* [`commercelayer plugins:update`](#commercelayer-pluginsupdate)

### `commercelayer plugins`

List installed plugins.

```sh-session
USAGE
  $ commercelayer plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ commercelayer plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.3.2/src/commands/plugins/index.ts)_

### `commercelayer plugins:install PLUGIN...`

Installs a plugin into the CLI.

```sh-session
USAGE
  $ commercelayer plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ commercelayer plugins:add

EXAMPLES
  $ commercelayer plugins:install myplugin 

  $ commercelayer plugins:install https://github.com/someuser/someplugin

  $ commercelayer plugins:install someuser/someplugin
```

### `commercelayer plugins:available`

Show all available Commerce Layer CLI plugins.

```sh-session
USAGE
  $ commercelayer plugins:available

DESCRIPTION
  show all available Commerce Layer CLI plugins

EXAMPLES
  $ commercelayer plugins:available
```

_See code: [src/commands/plugins/available.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/src/commands/plugins/available.ts)_

### `commercelayer plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```sh-session
USAGE
  $ commercelayer plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ commercelayer plugins:inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.3.2/src/commands/plugins/inspect.ts)_

### `commercelayer plugins:install PLUGIN...`

Installs a plugin into the CLI.

```sh-session
USAGE
  $ commercelayer plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ commercelayer plugins:add

EXAMPLES
  $ commercelayer plugins:install myplugin 

  $ commercelayer plugins:install https://github.com/someuser/someplugin

  $ commercelayer plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.3.2/src/commands/plugins/install.ts)_

### `commercelayer plugins:link PLUGIN`

Links a plugin into the CLI for development.

```sh-session
USAGE
  $ commercelayer plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ commercelayer plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.3.2/src/commands/plugins/link.ts)_

### `commercelayer plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```sh-session
USAGE
  $ commercelayer plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ commercelayer plugins:unlink
  $ commercelayer plugins:remove
```

### `commercelayer plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```sh-session
USAGE
  $ commercelayer plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ commercelayer plugins:unlink
  $ commercelayer plugins:remove
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.3.2/src/commands/plugins/uninstall.ts)_

### `commercelayer plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```sh-session
USAGE
  $ commercelayer plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ commercelayer plugins:unlink
  $ commercelayer plugins:remove
```

### `commercelayer plugins:update`

Update installed plugins.

```sh-session
USAGE
  $ commercelayer plugins:update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.3.2/src/commands/plugins/update.ts)_
