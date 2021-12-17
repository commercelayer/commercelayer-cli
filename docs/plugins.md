`commercelayer plugins`
=======================

Manage CLI plugins.

* [`commercelayer plugins`](#commercelayer-plugins)
* [`commercelayer plugins:available`](#commercelayer-pluginsavailable)
* [`commercelayer plugins:inspect PLUGIN...`](#commercelayer-pluginsinspect-plugin)
* [`commercelayer plugins:install PLUGIN...`](#commercelayer-pluginsinstall-plugin)
* [`commercelayer plugins:link PLUGIN`](#commercelayer-pluginslink-plugin)
* [`commercelayer plugins:uninstall PLUGIN...`](#commercelayer-pluginsuninstall-plugin)
* [`commercelayer plugins:update`](#commercelayer-pluginsupdate)

### `commercelayer plugins`

List installed plugins.

```
USAGE
  $ commercelayer plugins

OPTIONS
  --core  show core plugins

EXAMPLE
  $ commercelayer plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.10.11/src/commands/plugins/index.ts)_

### `commercelayer plugins:available`

Show all available Commerce Layer CLI plugins.

```
USAGE
  $ commercelayer plugins:available

EXAMPLE
  $ commercelayer plugins:available
```

_See code: [src/commands/plugins/available.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/src/commands/plugins/available.ts)_

### `commercelayer plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ commercelayer plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] plugin to inspect

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

EXAMPLE
  $ commercelayer plugins:inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.10.11/src/commands/plugins/inspect.ts)_

### `commercelayer plugins:install PLUGIN...`

Installs a plugin into the CLI

```
USAGE
  $ commercelayer plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  plugin to install

OPTIONS
  -f, --force    yarn install with force flag
  -h, --help     show CLI help
  -v, --verbose

DESCRIPTION
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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.10.11/src/commands/plugins/install.ts)_

### `commercelayer plugins:link PLUGIN`

Links a plugin into the CLI for development

```
USAGE
  $ commercelayer plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

DESCRIPTION
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
   command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLE
  $ commercelayer plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.10.11/src/commands/plugins/link.ts)_

### `commercelayer plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ commercelayer plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

ALIASES
  $ commercelayer plugins:unlink
  $ commercelayer plugins:remove
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.10.11/src/commands/plugins/uninstall.ts)_

### `commercelayer plugins:update`

Update installed plugins.

```
USAGE
  $ commercelayer plugins:update

OPTIONS
  -h, --help     show CLI help
  -v, --verbose
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.10.11/src/commands/plugins/update.ts)_
