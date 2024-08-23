# `commercelayer plugins`

Manage CLI plugins.

* [`commercelayer plugins`](#commercelayer-plugins)
* [`commercelayer plugins:available`](#commercelayer-pluginsavailable)
* [`commercelayer plugins:inspect PLUGIN...`](#commercelayer-pluginsinspect-plugin)
* [`commercelayer plugins:install PLUGIN`](#commercelayer-pluginsinstall-plugin)
* [`commercelayer plugins:latest [PLUGIN]`](#commercelayer-pluginslatest-plugin)
* [`commercelayer plugins:link PATH`](#commercelayer-pluginslink-path)
* [`commercelayer plugins:reset`](#commercelayer-pluginsreset)
* [`commercelayer plugins:uninstall [PLUGIN]`](#commercelayer-pluginsuninstall-plugin)
* [`commercelayer plugins:update`](#commercelayer-pluginsupdate)

### `commercelayer plugins`

List installed plugins.

```sh-session
USAGE
  $ commercelayer plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ commercelayer plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.4/src/commands/plugins/index.ts)_

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
  PLUGIN...  [default: .] Plugin to inspect.

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.4/src/commands/plugins/inspect.ts)_

### `commercelayer plugins:install PLUGIN`

Installs a plugin into commercelayer.

```sh-session
USAGE
  $ commercelayer plugins:install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into commercelayer.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the COMMERCELAYER_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the COMMERCELAYER_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ commercelayer plugins:add

EXAMPLES
  Install a plugin from npm registry.

    $ commercelayer plugins:install myplugin

  Install a plugin from a github url.

    $ commercelayer plugins:install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ commercelayer plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.4/src/commands/plugins/install.ts)_

### `commercelayer plugins:latest [PLUGIN]`

Show latest version of available plugins.

```sh-session
USAGE
  $ commercelayer plugins:latest [PLUGIN] [-b]

ARGUMENTS
  PLUGIN  the name of the plugin

FLAGS
  -b, --beta  retrieve latest version from beta channel

DESCRIPTION
  show latest version of available plugins

EXAMPLES
  $ commercelayer plugins:latest

  $ cl plugins:latest resources
```

_See code: [src/commands/plugins/latest.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/src/commands/plugins/latest.ts)_

### `commercelayer plugins:link PATH`

Links a plugin into the CLI for development.

```sh-session
USAGE
  $ commercelayer plugins:link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ commercelayer plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.4/src/commands/plugins/link.ts)_

### `commercelayer plugins:reset`

Remove all user-installed and linked plugins.

```sh-session
USAGE
  $ commercelayer plugins:reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.4/src/commands/plugins/reset.ts)_

### `commercelayer plugins:uninstall [PLUGIN]`

Removes a plugin from the CLI.

```sh-session
USAGE
  $ commercelayer plugins:uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ commercelayer plugins:unlink
  $ commercelayer plugins:remove

EXAMPLES
  $ commercelayer plugins:uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.4/src/commands/plugins/uninstall.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.4/src/commands/plugins/update.ts)_
