commercelayer-cli-new
=====================

Commerce Layer CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/commercelayer-cli.svg)](https://npmjs.org/package/@commercelayer/commercelayer-cli)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/commercelayer-cli.svg)](https://npmjs.org/package/@commercelayer/commercelayer-cli)
[![License](https://img.shields.io/npm/l/@commercelayer/commercelayer-cli.svg)](https://github.com/commercelayer/commercelayer-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @commercelayer/commercelayer-cli
$ commercelayer COMMAND
running command...
$ commercelayer (-v|--version|version)
@commercelayer/commercelayer-cli/0.0.0 darwin-x64 node-v14.16.0
$ commercelayer --help [COMMAND]
USAGE
  $ commercelayer COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`commercelayer applications`](#commercelayer-applications)
* [`commercelayer applications:available [FILE]`](#commercelayer-applicationsavailable-file)
* [`commercelayer applications:current`](#commercelayer-applicationscurrent)
* [`commercelayer applications:login`](#commercelayer-applicationslogin)
* [`commercelayer applications:token`](#commercelayer-applicationstoken)
* [`commercelayer get RESOURCE [ID]`](#commercelayer-get-resource-id)
* [`commercelayer help [COMMAND]`](#commercelayer-help-command)
* [`commercelayer plugins`](#commercelayer-plugins)
* [`commercelayer plugins:available`](#commercelayer-pluginsavailable)
* [`commercelayer plugins:inspect PLUGIN...`](#commercelayer-pluginsinspect-plugin)
* [`commercelayer plugins:install PLUGIN...`](#commercelayer-pluginsinstall-plugin)
* [`commercelayer plugins:link PLUGIN`](#commercelayer-pluginslink-plugin)
* [`commercelayer plugins:uninstall PLUGIN...`](#commercelayer-pluginsuninstall-plugin)
* [`commercelayer plugins:update`](#commercelayer-pluginsupdate)

## `commercelayer applications`

show a list of all (logged in) available CLI applications

```
USAGE
  $ commercelayer applications

ALIASES
  $ commercelayer applications:available
```

_See code: [src/commands/applications.ts](https://github.com/commercelayer/commercelayer-cli/blob/v0.0.0/src/commands/applications.ts)_

## `commercelayer applications:available [FILE]`

describe the command here

```
USAGE
  $ commercelayer applications:available [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/applications/available.ts](https://github.com/commercelayer/commercelayer-cli/blob/v0.0.0/src/commands/applications/available.ts)_

## `commercelayer applications:current`

set or show the current CLI application

```
USAGE
  $ commercelayer applications:current

OPTIONS
  -o, --organization=organization  organization slug
  --live                           live execution mode

ALIASES
  $ commercelayer app:current
```

_See code: [src/commands/applications/current.ts](https://github.com/commercelayer/commercelayer-cli/blob/v0.0.0/src/commands/applications/current.ts)_

## `commercelayer applications:login`

perform CLI login to Commerce Layer

```
USAGE
  $ commercelayer applications:login

OPTIONS
  -i, --clientId=clientId          (required) organization client_id
  -o, --organization=organization  (required) organization slug
  -s, --clientSecret=clientSecret  (required) organization client_secret

ALIASES
  $ commercelayer app:login
```

_See code: [src/commands/applications/login.ts](https://github.com/commercelayer/commercelayer-cli/blob/v0.0.0/src/commands/applications/login.ts)_

## `commercelayer applications:token`

get new access_token from Commerce Layer

```
USAGE
  $ commercelayer applications:token

OPTIONS
  -o, --organization=organization  (required) [default: brioni] organization slug
  -s, --save                       save access_token
  --live                           live execution mode

ALIASES
  $ commercelayer app:token
```

_See code: [src/commands/applications/token.ts](https://github.com/commercelayer/commercelayer-cli/blob/v0.0.0/src/commands/applications/token.ts)_

## `commercelayer get RESOURCE [ID]`

Get resources from Commerce Layer

```
USAGE
  $ commercelayer get RESOURCE [ID]

OPTIONS
  -h, --help               show CLI help
  -i, --includes=includes  comma separated resources to include
```

_See code: [src/commands/get.ts](https://github.com/commercelayer/commercelayer-cli/blob/v0.0.0/src/commands/get.ts)_

## `commercelayer help [COMMAND]`

display help for commercelayer

```
USAGE
  $ commercelayer help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `commercelayer plugins`

list installed plugins

```
USAGE
  $ commercelayer plugins

OPTIONS
  --core  show core plugins

EXAMPLE
  $ commercelayer plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.10.0/src/commands/plugins/index.ts)_

## `commercelayer plugins:available`

describe the command here

```
USAGE
  $ commercelayer plugins:available
```

_See code: [src/commands/plugins/available.ts](https://github.com/commercelayer/commercelayer-cli/blob/v0.0.0/src/commands/plugins/available.ts)_

## `commercelayer plugins:inspect PLUGIN...`

displays installation properties of a plugin

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.10.0/src/commands/plugins/inspect.ts)_

## `commercelayer plugins:install PLUGIN...`

installs a plugin into the CLI

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.10.0/src/commands/plugins/install.ts)_

## `commercelayer plugins:link PLUGIN`

links a plugin into the CLI for development

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.10.0/src/commands/plugins/link.ts)_

## `commercelayer plugins:uninstall PLUGIN...`

removes a plugin from the CLI

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.10.0/src/commands/plugins/uninstall.ts)_

## `commercelayer plugins:update`

update installed plugins

```
USAGE
  $ commercelayer plugins:update

OPTIONS
  -h, --help     show CLI help
  -v, --verbose
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.10.0/src/commands/plugins/update.ts)_
<!-- commandsstop -->
