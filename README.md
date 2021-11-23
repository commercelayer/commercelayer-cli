# Commerce Layer CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli.svg)](https://npmjs.org/package/@commercelayer/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli.svg)](https://npmjs.org/package/@commercelayer/cli)
[![License](https://img.shields.io/npm/l/@commercelayer/commercelayer-cli.svg)](https://github.com/commercelayer/commercelayer-cli/blob/master/package.json)

The official Commerce Layer CLI which helps you to manage your Commerce Layer applications right from the terminal.

![Commerce Layer CLI demo](assets/home.gif)

## What is Commerce Layer?

[Commerce Layer](https://commercelayer.io) is a multi-market commerce API and order management system that lets you add global shopping capabilities to any website, mobile app, chatbot, wearable, voice, or IoT device, with ease. Compose your stack with the best-of-breed tools you already mastered and love. Make any experience shoppable, anywhere, through a blazing-fast, enterprise-grade, and secure API.

## Table of contents

<!-- toc -->

* [ Installation](#-installation)
* [ Usage](#-usage)
* [ Commands](#-commands)
* [ Plugins](#-plugins)
* [ Contributors Guide](#-contributors-guide)
* [ Need help?](#-need-help)
* [ License](#-license)
<!-- tocstop -->

## Installation

Run the command below to install the CLI using your favorite package manager:

```bash
npm install -g @commercelayer/cli
```

```
yarn global add @commercelayer/cli
```

_More installation options, coming soon..._

## Usage

Installing the CLI provides access to the `commercelayer`, `clayer`, and `cl` command.

<!-- usage-DISABLED -->
```sh-session
$ (commercelayer | clayer | cl) COMMAND

$ commercelayer (-v | version | --version) to check the version of the CLI you have installed.

$ commercelayer help [COMMAND]
or
$ commercelayer [COMMAND] (--help | -h) for detailed information about CLI commands.
```
<!-- usagestop-DISABLED -->

Kindly check out this [quick step-by-step example](https://gist.github.com/silviorelli/93424c7e0483780dc5c51fe7a3d215c1) which will show you how to place an order using this CLI.

## Commands

The Commerce Layer CLI supports the following commands:

<!-- commands -->

* [`commercelayer applications`](#commercelayer-applications)
* [`commercelayer applications:add`](#commercelayer-applicationsadd)
* [`commercelayer applications:current`](#commercelayer-applicationscurrent)
* [`commercelayer applications:info`](#commercelayer-applicationsinfo)
* [`commercelayer applications:login`](#commercelayer-applicationslogin)
* [`commercelayer applications:logout`](#commercelayer-applicationslogout)
* [`commercelayer applications:switch`](#commercelayer-applicationsswitch)
* [`commercelayer applications:token`](#commercelayer-applicationstoken)
* [`commercelayer config:default`](#commercelayer-configdefault)
* [`commercelayer config:del PARAM`](#commercelayer-configdel-param)
* [`commercelayer config:get PARAM`](#commercelayer-configget-param)
* [`commercelayer config:set PARAM VALUE`](#commercelayer-configset-param-value)
* [`commercelayer config:show`](#commercelayer-configshow)
* [`commercelayer exec [FILE]`](#commercelayer-exec-file)
* [`commercelayer help [COMMAND]`](#commercelayer-help-command)
* [`commercelayer plugins`](#commercelayer-plugins)
* [`commercelayer plugins:available`](#commercelayer-pluginsavailable)
* [`commercelayer plugins:inspect PLUGIN...`](#commercelayer-pluginsinspect-plugin)
* [`commercelayer plugins:install PLUGIN...`](#commercelayer-pluginsinstall-plugin)
* [`commercelayer plugins:link PLUGIN`](#commercelayer-pluginslink-plugin)
* [`commercelayer plugins:uninstall PLUGIN...`](#commercelayer-pluginsuninstall-plugin)
* [`commercelayer plugins:update`](#commercelayer-pluginsupdate)
* [`commercelayer util:jwt TOKEN`](#commercelayer-utiljwt-token)

### `commercelayer applications`

Show a list of all (logged in) available CLI applications.

```
USAGE
  $ commercelayer applications

OPTIONS
  -a, --alias=alias                         the alias associated to the application
  -k, --kind=cli|sales_channel|integration  application kind
  -m, --mode=test|live                      execution mode
  -o, --organization=organization           organization slug
  --id=id                                   application id
  --live                                    live execution mode

ALIASES
  $ commercelayer app:list
  $ commercelayer applications:list
  $ commercelayer app:available
  $ commercelayer applications:available
  $ commercelayer apps

EXAMPLES
  $ commercelayer applications
  $ cl applications
```

_See code: [src/commands/applications/index.ts](https://github.com/commercelayer/commercelayer-cli/blob/v3.0.0/src/commands/applications/index.ts)_

### `commercelayer applications:add`

Add a new Commerce Layer application to CLI config.

```
USAGE
  $ commercelayer applications:add

OPTIONS
  -S, --scope=scope                access token scope (market, stock location)
  -a, --alias=alias                (required) the alias you want to associate to the application
  -e, --email=email                customer email
  -i, --clientId=clientId          (required) application client_id
  -o, --organization=organization  (required) organization slug
  -p, --password=password          customer secret password
  -s, --clientSecret=clientSecret  application client_secret

ALIASES
  $ commercelayer app:add

EXAMPLE
  $ commercelayer applications:add -o <organizationSlug> -i <clientId> -s <clientSecret> -a <applicationAlias>
```

_See code: [src/commands/applications/add.ts](https://github.com/commercelayer/commercelayer-cli/blob/v3.0.0/src/commands/applications/add.ts)_

### `commercelayer applications:current`

Show the current application.

```
USAGE
  $ commercelayer applications:current

OPTIONS
  -j, --json  show info in JSON format

ALIASES
  $ commercelayer app:current

EXAMPLES
  $ commercelayer applications:current
  $ commercelayer app:current --info
```

_See code: [src/commands/applications/current.ts](https://github.com/commercelayer/commercelayer-cli/blob/v3.0.0/src/commands/applications/current.ts)_

### `commercelayer applications:info`

Show application details.

```
USAGE
  $ commercelayer applications:info

OPTIONS
  -a, --alias=alias                         the alias associated to the application
  -j, --json                                show info in JSON format
  -k, --kind=cli|sales_channel|integration  application kind
  -m, --mode=test|live                      execution mode
  -o, --organization=organization           organization slug
  --id=id                                   application id
  --live                                    live execution mode

ALIASES
  $ commercelayer app:info
```

_See code: [src/commands/applications/info.ts](https://github.com/commercelayer/commercelayer-cli/blob/v3.0.0/src/commands/applications/info.ts)_

### `commercelayer applications:login`

Execute login to a Commerce Layer application.

```
USAGE
  $ commercelayer applications:login

OPTIONS
  -S, --scope=scope                access token scope (market, stock location)
  -a, --alias=alias                (required) the alias you want to associate to the application
  -e, --email=email                customer email
  -i, --clientId=clientId          (required) application client_id
  -o, --organization=organization  (required) organization slug
  -p, --password=password          customer secret password
  -s, --clientSecret=clientSecret  application client_secret

ALIASES
  $ commercelayer app:login

EXAMPLE
  $ commercelayer applications:login -o <organizationSlug> -i <clientId> -s <clientSecret> -a <applicationAlias>
```

_See code: [src/commands/applications/login.ts](https://github.com/commercelayer/commercelayer-cli/blob/v3.0.0/src/commands/applications/login.ts)_

### `commercelayer applications:logout`

Remove an application from CLI local configuration.

```
USAGE
  $ commercelayer applications:logout

OPTIONS
  -a, --alias=alias                         the alias associated to the application
  -k, --kind=cli|sales_channel|integration  application kind
  -m, --mode=test|live                      execution mode
  -o, --organization=organization           organization slug
  -r, --revoke                              revoke current access token
  --id=id                                   application id
  --live                                    live execution mode

ALIASES
  $ commercelayer app:logout
  $ commercelayer app:remove
  $ commercelayer applications:remove
```

_See code: [src/commands/applications/logout.ts](https://github.com/commercelayer/commercelayer-cli/blob/v3.0.0/src/commands/applications/logout.ts)_

### `commercelayer applications:switch`

Switch applications.

```
USAGE
  $ commercelayer applications:switch

OPTIONS
  -a, --alias=alias                         the alias associated to the application
  -k, --kind=cli|sales_channel|integration  application kind
  -m, --mode=test|live                      execution mode
  -o, --organization=organization           organization slug
  --id=id                                   application id
  --live                                    live execution mode

ALIASES
  $ commercelayer app:switch
```

_See code: [src/commands/applications/switch.ts](https://github.com/commercelayer/commercelayer-cli/blob/v3.0.0/src/commands/applications/switch.ts)_

### `commercelayer applications:token`

Get a new access token from Commerce Layer API.

```
USAGE
  $ commercelayer applications:token

OPTIONS
  -a, --alias=alias                         the alias associated to the application
  -i, --info                                show access token info
  -k, --kind=cli|sales_channel|integration  application kind
  -m, --mode=test|live                      execution mode
  -o, --organization=organization           organization slug
  -s, --save                                save access token
  --id=id                                   application id
  --live                                    live execution mode

ALIASES
  $ commercelayer app:token

EXAMPLES
  $ commercelayer applications:token
  $ commercelayer app:token -o <organizationSlug> --live --save
```

_See code: [src/commands/applications/token.ts](https://github.com/commercelayer/commercelayer-cli/blob/v3.0.0/src/commands/applications/token.ts)_

### `commercelayer config:default`

Reset CLI configuration to default values.

```
USAGE
  $ commercelayer config:default
```

_See code: [src/commands/config/default.ts](https://github.com/commercelayer/commercelayer-cli/blob/v3.0.0/src/commands/config/default.ts)_

### `commercelayer config:del PARAM`

Delete a CLI configuration parameter.

```
USAGE
  $ commercelayer config:del PARAM

ARGUMENTS
  PARAM  configuration parameter name
```

_See code: [src/commands/config/del.ts](https://github.com/commercelayer/commercelayer-cli/blob/v3.0.0/src/commands/config/del.ts)_

### `commercelayer config:get PARAM`

Get a CLI configuration parameter.

```
USAGE
  $ commercelayer config:get PARAM

ARGUMENTS
  PARAM  configuration parameter name
```

_See code: [src/commands/config/get.ts](https://github.com/commercelayer/commercelayer-cli/blob/v3.0.0/src/commands/config/get.ts)_

### `commercelayer config:set PARAM VALUE`

Set a CLI configuration parameter.

```
USAGE
  $ commercelayer config:set PARAM VALUE

ARGUMENTS
  PARAM  configuration parameter name
  VALUE  value to be saved in configuration file
```

_See code: [src/commands/config/set.ts](https://github.com/commercelayer/commercelayer-cli/blob/v3.0.0/src/commands/config/set.ts)_

### `commercelayer config:show`

Show current CLI configuration.

```
USAGE
  $ commercelayer config:show
```

_See code: [src/commands/config/show.ts](https://github.com/commercelayer/commercelayer-cli/blob/v3.0.0/src/commands/config/show.ts)_

### `commercelayer exec [FILE]`

Describe the command here.

```
USAGE
  $ commercelayer exec [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/exec.ts](https://github.com/commercelayer/commercelayer-cli/blob/v3.0.0/src/commands/exec.ts)_

### `commercelayer help [COMMAND]`

Display help for commercelayer.

```
USAGE
  $ commercelayer help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.3/src/commands/help.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.10.1/src/commands/plugins/index.ts)_

### `commercelayer plugins:available`

Show all available Commerce Layer CLI plugins.

```
USAGE
  $ commercelayer plugins:available

EXAMPLE
  $ commercelayer plugins:available
```

_See code: [src/commands/plugins/available.ts](https://github.com/commercelayer/commercelayer-cli/blob/v3.0.0/src/commands/plugins/available.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.10.1/src/commands/plugins/inspect.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.10.1/src/commands/plugins/install.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.10.1/src/commands/plugins/link.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.10.1/src/commands/plugins/uninstall.ts)_

### `commercelayer plugins:update`

Update installed plugins.

```
USAGE
  $ commercelayer plugins:update

OPTIONS
  -h, --help     show CLI help
  -v, --verbose
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.10.1/src/commands/plugins/update.ts)_

### `commercelayer util:jwt TOKEN`

Decode a Commerce Layer JWT.

```
USAGE
  $ commercelayer util:jwt TOKEN

ARGUMENTS
  TOKEN  the token to decode

ALIASES
  $ commercelayer jwt
```

_See code: [src/commands/util/jwt.ts](https://github.com/commercelayer/commercelayer-cli/blob/v3.0.0/src/commands/util/jwt.ts)_
<!-- commandsstop -->

## Plugins

The Commerce Layer CLI currently supports the following plugins:

* [`resources`](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/main/README.md) - Execute CRUD operations on API resources.
* [`seeder`](https://github.com/commercelayer/commercelayer-cli-plugin-seeder/blob/main/README.md) - Execute Commerce Layer seeder.
* [`imports`](https://github.com/commercelayer/commercelayer-cli-plugin-imports/blob/main/README.md) - Import resources in Commerce Layer.
* [`webhooks`](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/README.md) - Manage webhooks in Commerce Layer.
* [`orders`](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/README.md) - Execute actions on orders in Commerce Layer.

You can run the command below to get a list of all available CLI plugins:

```sh-session
commercelayer plugins:available
```
You can run the command below to update all available CLI plugins:

```sh-session
commercelayer plugins:update
```

## Contributors Guide

1. Fork [this repository](https://github.com/commercelayer/commercelayer-cli) (learn how to do this [here](https://help.github.com/articles/fork-a-repo)).

2. Clone the forked repository like so:

```bash
git clone https://github.com/<your username>/commercelayer-cli.git && cd commercelayer-cli
```

3. Make your changes and create a pull request ([learn how to do this](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request)).

4. Someone will attend to your pull request and provide some feedback.

## Need help?

1. Request an invite to join [Commerce Layer's Slack community](https://commercelayer.io/developers) (kindly scroll down to the bottom of the page).

2. Create an [issue](https://github.com/commercelayer/commercelayer-cli/issues) in this repository.

3. Ping us [on Twitter](https://twitter.com/commercelayer).

## License

This repository is published under the [MIT](LICENSE) license.
