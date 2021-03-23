commercelayer-cli-new
=====================

Commerce Layer CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/commercelayer-cli-new.svg)](https://npmjs.org/package/commercelayer-cli-new)
[![Downloads/week](https://img.shields.io/npm/dw/commercelayer-cli-new.svg)](https://npmjs.org/package/commercelayer-cli-new)
[![License](https://img.shields.io/npm/l/commercelayer-cli-new.svg)](https://github.com/commercelayer/commercelayer-cli-new/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @commercelayer/commercelayer-cli-new
$ cl COMMAND
running command...
$ cl (-v|--version|version)
@commercelayer/commercelayer-cli-new/0.0.0 darwin-x64 node-v14.16.0
$ cl --help [COMMAND]
USAGE
  $ cl COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`cl applications:current`](#cl-applicationscurrent)
* [`cl applications:login`](#cl-applicationslogin)
* [`cl applications:token`](#cl-applicationstoken)
* [`cl get RESOURCE [ID]`](#cl-get-resource-id)
* [`cl help [COMMAND]`](#cl-help-command)
* [`cl plugins`](#cl-plugins)
* [`cl plugins:available`](#cl-pluginsavailable)
* [`cl plugins:inspect PLUGIN...`](#cl-pluginsinspect-plugin)
* [`cl plugins:install PLUGIN...`](#cl-pluginsinstall-plugin)
* [`cl plugins:link PLUGIN`](#cl-pluginslink-plugin)
* [`cl plugins:uninstall PLUGIN...`](#cl-pluginsuninstall-plugin)
* [`cl plugins:update`](#cl-pluginsupdate)

## `cl applications:current`

set or show the current organization

```
USAGE
  $ cl applications:current

OPTIONS
  -o, --organization=organization  organization slug
  --live                           live execution mode
```

_See code: [src/commands/applications/current.ts](https://github.com/commercelayer/commercelayer-cli/blob/v0.0.0/src/commands/applications/current.ts)_

## `cl applications:login`

perform CLI login to Commerce Layer

```
USAGE
  $ cl applications:login

OPTIONS
  -i, --clientId=clientId          (required) organization client_id
  -o, --organization=organization  (required) organization slug
  -s, --clientSecret=clientSecret  (required) organization client_secret
```

_See code: [src/commands/applications/login.ts](https://github.com/commercelayer/commercelayer-cli/blob/v0.0.0/src/commands/applications/login.ts)_

## `cl applications:token`

get new access_token from Commerce Layer

```
USAGE
  $ cl applications:token

OPTIONS
  -o, --organization=organization  (required) organization slug
  -s, --save                       save access_token
  --live                           live execution mode
```

_See code: [src/commands/applications/token.ts](https://github.com/commercelayer/commercelayer-cli/blob/v0.0.0/src/commands/applications/token.ts)_

## `cl get RESOURCE [ID]`

Get resources from Commerce Layer

```
USAGE
  $ cl get RESOURCE [ID]

OPTIONS
  -h, --help               show CLI help
  -i, --includes=includes  comma separated resources to include
```

_See code: [src/commands/get.ts](https://github.com/commercelayer/commercelayer-cli/blob/v0.0.0/src/commands/get.ts)_

## `cl help [COMMAND]`

display help for cl

```
USAGE
  $ cl help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `cl plugins`

list installed plugins

```
USAGE
  $ cl plugins

OPTIONS
  --core  show core plugins

EXAMPLE
  $ cl plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.10.0/src/commands/plugins/index.ts)_

## `cl plugins:available`

describe the command here

```
USAGE
  $ cl plugins:available
```

_See code: [src/commands/plugins/available.ts](https://github.com/commercelayer/commercelayer-cli/blob/v0.0.0/src/commands/plugins/available.ts)_

## `cl plugins:inspect PLUGIN...`

displays installation properties of a plugin

```
USAGE
  $ cl plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] plugin to inspect

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

EXAMPLE
  $ cl plugins:inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.10.0/src/commands/plugins/inspect.ts)_

## `cl plugins:install PLUGIN...`

installs a plugin into the CLI

```
USAGE
  $ cl plugins:install PLUGIN...

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
  $ cl plugins:add

EXAMPLES
  $ cl plugins:install myplugin 
  $ cl plugins:install https://github.com/someuser/someplugin
  $ cl plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.10.0/src/commands/plugins/install.ts)_

## `cl plugins:link PLUGIN`

links a plugin into the CLI for development

```
USAGE
  $ cl plugins:link PLUGIN

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
  $ cl plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.10.0/src/commands/plugins/link.ts)_

## `cl plugins:uninstall PLUGIN...`

removes a plugin from the CLI

```
USAGE
  $ cl plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

ALIASES
  $ cl plugins:unlink
  $ cl plugins:remove
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.10.0/src/commands/plugins/uninstall.ts)_

## `cl plugins:update`

update installed plugins

```
USAGE
  $ cl plugins:update

OPTIONS
  -h, --help     show CLI help
  -v, --verbose
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.10.0/src/commands/plugins/update.ts)_
<!-- commandsstop -->
