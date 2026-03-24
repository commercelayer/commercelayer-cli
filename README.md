# Commerce Layer CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli.svg)](https://npmjs.org/package/@commercelayer/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli.svg)](https://npmjs.org/package/@commercelayer/cli)
[![License](https://img.shields.io/npm/l/@commercelayer/commercelayer-cli.svg)](https://github.com/commercelayer/commercelayer-cli/blob/master/package.json)
[![CodeQL](https://github.com/commercelayer/commercelayer-cli/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/commercelayer/commercelayer-cli/actions/workflows/codeql-analysis.yml)

The official Commerce Layer CLI which helps you to manage your Commerce Layer applications right from the terminal.

![Commerce Layer CLI demo](assets/home.gif)

## What is Commerce Layer?

[Commerce Layer](https://commercelayer.io) is a multi-market commerce API and order management system that lets you add global shopping capabilities to any website, mobile app, chatbot, wearable, voice, or IoT device, with ease. Compose your stack with the best-of-breed tools you already mastered and love. Make any experience shoppable, anywhere, through a blazing-fast, enterprise-grade, and secure API.

## Table of contents

<!-- toc -->

* [Installation](#installation)
* [Usage](#usage)
* [Commands](#commands)
* [Plugins](#plugins)
* [Contributors Guide](#contributors-guide)
* [Need help?](#need-help)
* [License](#license)
<!-- tocstop -->

## Installation

Run the command below to install the CLI using your favorite package manager:

```bash
npm install -g @commercelayer/cli
```

```bash
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
* [`commercelayer applications:provisioning`](#commercelayer-applicationsprovisioning)
* [`commercelayer applications:scope SCOPE`](#commercelayer-applicationsscope-scope)
* [`commercelayer applications:switch`](#commercelayer-applicationsswitch)
* [`commercelayer autocomplete [SHELL]`](#commercelayer-autocomplete-shell)
* [`commercelayer cli:dir`](#commercelayer-clidir)
* [`commercelayer cli:update`](#commercelayer-cliupdate)
* [`commercelayer cli:version`](#commercelayer-cliversion)
* [`commercelayer help [COMMAND]`](#commercelayer-help-command)
* [`commercelayer plugins`](#commercelayer-plugins)
* [`commercelayer plugins:available`](#commercelayer-pluginsavailable)
* [`commercelayer plugins:inspect PLUGIN...`](#commercelayer-pluginsinspect-plugin)
* [`commercelayer plugins:install PLUGIN`](#commercelayer-pluginsinstall-plugin)
* [`commercelayer plugins:latest [PLUGIN]`](#commercelayer-pluginslatest-plugin)
* [`commercelayer plugins:link PATH`](#commercelayer-pluginslink-path)
* [`commercelayer plugins:reset`](#commercelayer-pluginsreset)
* [`commercelayer plugins:uninstall [PLUGIN]`](#commercelayer-pluginsuninstall-plugin)
* [`commercelayer plugins:update`](#commercelayer-pluginsupdate)

### `commercelayer applications`

Show a list of all (logged in) available CLI applications.

```sh-session
USAGE
  $ commercelayer applications [-k integration|sales_channel|user] [--live | -m test|live] [-a <value> | --id
    <value>] [-A core|provisioning | -o <value>] [-S]

FLAGS
  -A, --api=<option>          specific API application
                              <options: core|provisioning>
  -S, --sort                  sort applications by Organization and Application name
  -a, --alias=<value>         the alias associated to the application
  -k, --kind=<option>         application kind
                              <options: integration|sales_channel|user>
  -m, --mode=<option>         execution mode
                              <options: test|live>
  -o, --organization=<value>  organization slug
      --id=<value>            application id
      --live                  live execution mode

DESCRIPTION
  show a list of all (logged in) available CLI applications

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

_See code: [src/commands/applications/index.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/src/commands/applications/index.ts)_

### `commercelayer applications:add`

Add a new Commerce Layer application to CLI config (application must be of kind 'integration' or 'sales_channel').

```sh-session
USAGE
  $ commercelayer applications:add -a <value> [-o <value>] (-s <value> -i <value>) [-S <value>... ] [-e <value> -p
    <value>]

FLAGS
  -S, --scope=<value>...      access token scope (market, stock location)
  -a, --alias=<value>         (required) the alias you want to associate to the application
  -e, --email=<value>         customer email
  -i, --clientId=<value>      (required) application client_id
  -o, --organization=<value>  organization slug
  -p, --password=<value>      customer secret password
  -s, --clientSecret=<value>  application client_secret

DESCRIPTION
  add a new Commerce Layer application to CLI config (application must be of kind 'integration' or 'sales_channel')

ALIASES
  $ commercelayer app:add

EXAMPLES
  $ commercelayer applications:add -o <organizationSlug> -i <clientId> -s <clientSecret> -a <applicationAlias>

  $ cl app:add -i <clientId> -s <clientSecret> -a <applicationAlias>
```

_See code: [src/commands/applications/add.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/src/commands/applications/add.ts)_

### `commercelayer applications:current`

Show the current application.

```sh-session
USAGE
  $ commercelayer applications:current [-j ]

FLAGS
  -j, --json  show info in JSON format

DESCRIPTION
  show the current application

ALIASES
  $ commercelayer app:current

EXAMPLES
  $ commercelayer applications:current

  $ commercelayer app:current --info
```

_See code: [src/commands/applications/current.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/src/commands/applications/current.ts)_

### `commercelayer applications:info`

Show application details.

```sh-session
USAGE
  $ commercelayer applications:info [-k integration|sales_channel|user] [--live | -m test|live] [-a <value> | --id
    <value>] [-A core|provisioning | -o <value>] [-j]

FLAGS
  -A, --api=<option>          specific API application
                              <options: core|provisioning>
  -a, --alias=<value>         the alias associated to the application
  -j, --json                  show info in JSON format
  -k, --kind=<option>         application kind
                              <options: integration|sales_channel|user>
  -m, --mode=<option>         execution mode
                              <options: test|live>
  -o, --organization=<value>  organization slug
      --id=<value>            application id
      --live                  live execution mode

DESCRIPTION
  show application details

ALIASES
  $ commercelayer app:info
```

_See code: [src/commands/applications/info.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/src/commands/applications/info.ts)_

### `commercelayer applications:login`

Execute login to a Commerce Layer application (application must be of kind 'integration' or 'sales_channel').

```sh-session
USAGE
  $ commercelayer applications:login -a <value> [-o <value>] (-s <value> -i <value>) [-S <value>... ] [-e <value> -p
    <value>]

FLAGS
  -S, --scope=<value>...      access token scope (market, stock location)
  -a, --alias=<value>         (required) the alias you want to associate to the application
  -e, --email=<value>         customer email
  -i, --clientId=<value>      (required) application client_id
  -o, --organization=<value>  organization slug
  -p, --password=<value>      customer secret password
  -s, --clientSecret=<value>  application client_secret

DESCRIPTION
  execute login to a Commerce Layer application (application must be of kind 'integration' or 'sales_channel')

ALIASES
  $ commercelayer app:login
  $ commercelayer login

EXAMPLES
  $ commercelayer applications:login -o <organizationSlug> -i <clientId> -s <clientSecret> -a <applicationAlias>

  $ cl app:login -i <clientId> -s <clientSecret> -a <applicationAlias>
```

_See code: [src/commands/applications/login.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/src/commands/applications/login.ts)_

### `commercelayer applications:logout`

Remove an application from CLI local configuration.

```sh-session
USAGE
  $ commercelayer applications:logout [-k integration|sales_channel|user] [--live | -m test|live] [-a <value> | --id
    <value>] [-A core|provisioning | -o <value>] [-r]

FLAGS
  -A, --api=<option>          specific API application
                              <options: core|provisioning>
  -a, --alias=<value>         the alias associated to the application
  -k, --kind=<option>         application kind
                              <options: integration|sales_channel|user>
  -m, --mode=<option>         execution mode
                              <options: test|live>
  -o, --organization=<value>  organization slug
  -r, --revoke                revoke current access token
      --id=<value>            application id
      --live                  live execution mode

DESCRIPTION
  remove an application from CLI local configuration

ALIASES
  $ commercelayer app:logout
  $ commercelayer app:remove
  $ commercelayer applications:remove
  $ commercelayer logout
```

_See code: [src/commands/applications/logout.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/src/commands/applications/logout.ts)_

### `commercelayer applications:provisioning`

Show all Provisioning applications.

```sh-session
USAGE
  $ commercelayer applications:provisioning [-k integration|sales_channel|user] [--live | -m test|live] [-a <value> | --id
    <value>] [-A core|provisioning | -o <value>] [-S]

FLAGS
  -A, --api=<option>          specific API application
                              <options: core|provisioning>
  -S, --sort                  sort applications by Organization and Application name
  -a, --alias=<value>         the alias associated to the application
  -k, --kind=<option>         application kind
                              <options: integration|sales_channel|user>
  -m, --mode=<option>         execution mode
                              <options: test|live>
  -o, --organization=<value>  organization slug
      --id=<value>            application id
      --live                  live execution mode

DESCRIPTION
  show all Provisioning applications

ALIASES
  $ commercelayer app:prov
  $ commercelayer app:provisioning
  $ commercelayer prov:apps
  $ commercelayer prov:applications

EXAMPLES
  $ commercelayer applications:provisioning

  $ cl app:provisioning

  $ cl prov:apps
```

_See code: [src/commands/applications/provisioning.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/src/commands/applications/provisioning.ts)_

### `commercelayer applications:scope SCOPE`

Switch scope of current application.

```sh-session
USAGE
  $ commercelayer applications:scope SCOPE [-a <value>]

ARGUMENTS
  SCOPE  the application scope

FLAGS
  -a, --alias=<value>  the alias you want to associate to the application

DESCRIPTION
  switch scope of current application

ALIASES
  $ commercelayer app:scope

EXAMPLES
  $ commercelayer applications:scope market:code:1234

  $ cl app:scope market:id:aBcDeFgHij
```

_See code: [src/commands/applications/scope.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/src/commands/applications/scope.ts)_

### `commercelayer applications:switch`

Switch applications.

```sh-session
USAGE
  $ commercelayer applications:switch [-k integration|sales_channel|user] [--live | -m test|live] [-a <value> | --id
    <value>] [-A core|provisioning | -o <value>]

FLAGS
  -A, --api=<option>          specific API application
                              <options: core|provisioning>
  -a, --alias=<value>         the alias associated to the application
  -k, --kind=<option>         application kind
                              <options: integration|sales_channel|user>
  -m, --mode=<option>         execution mode
                              <options: test|live>
  -o, --organization=<value>  organization slug
      --id=<value>            application id
      --live                  live execution mode

DESCRIPTION
  switch applications

ALIASES
  $ commercelayer app:switch
  $ commercelayer app:use
```

_See code: [src/commands/applications/switch.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/src/commands/applications/switch.ts)_

### `commercelayer autocomplete [SHELL]`

Display autocomplete installation instructions.

```sh-session
USAGE
  $ commercelayer autocomplete [SHELL] [-r]

ARGUMENTS
  [SHELL]  (zsh|bash|powershell) Shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  Display autocomplete installation instructions.

EXAMPLES
  $ commercelayer autocomplete

  $ commercelayer autocomplete bash

  $ commercelayer autocomplete zsh

  $ commercelayer autocomplete powershell

  $ commercelayer autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v3.2.42/src/commands/autocomplete/index.ts)_

### `commercelayer cli:dir`

Show working directories used by the cli.

```sh-session
USAGE
  $ commercelayer cli:dir

DESCRIPTION
  show working directories used by the cli

ALIASES
  $ commercelayer dir
  $ commercelayer paths
  $ commercelayer cli:paths

EXAMPLES
  cl cli:dir
```

_See code: [src/commands/cli/dir.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/src/commands/cli/dir.ts)_

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

### `commercelayer help [COMMAND]`

Display help for commercelayer.

```sh-session
USAGE
  $ commercelayer help [COMMAND...] [-n]

ARGUMENTS
  [COMMAND...]  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for commercelayer.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/6.2.40/src/commands/help.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.59/src/commands/plugins/index.ts)_

### `commercelayer plugins:available`

Show all available Commerce Layer CLI plugins.

```sh-session
USAGE
  $ commercelayer plugins:available [-S]

FLAGS
  -S, --sort  order by plugin name

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.59/src/commands/plugins/inspect.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.59/src/commands/plugins/install.ts)_

### `commercelayer plugins:latest [PLUGIN]`

Show latest version of available plugins.

```sh-session
USAGE
  $ commercelayer plugins:latest [PLUGIN] [-b]

ARGUMENTS
  [PLUGIN]  the name of the plugin

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.59/src/commands/plugins/link.ts)_

### `commercelayer plugins:reset`

Remove all user-installed and linked plugins.

```sh-session
USAGE
  $ commercelayer plugins:reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.59/src/commands/plugins/reset.ts)_

### `commercelayer plugins:uninstall [PLUGIN]`

Removes a plugin from the CLI.

```sh-session
USAGE
  $ commercelayer plugins:uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.59/src/commands/plugins/uninstall.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.59/src/commands/plugins/update.ts)_
<!-- commandsstop -->

## Plugins

The Commerce Layer CLI currently supports the following plugins:

* [`resources`](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/main/README.md) - Execute CRUD operations on API resources.
* [`seeder`](https://github.com/commercelayer/commercelayer-cli-plugin-seeder/blob/main/README.md) - Execute Commerce Layer seeder.
* [`imports`](https://github.com/commercelayer/commercelayer-cli-plugin-imports/blob/main/README.md) - Import resources in Commerce Layer.
* [`webhooks`](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/README.md) - Manage webhooks in Commerce Layer.
* [`orders`](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/README.md) - Execute actions on orders in Commerce Layer.
* [`checkout`](https://github.com/commercelayer/commercelayer-cli-plugin-checkout/blob/main/README.md) - Generate checkout URLs.
* [`triggers`](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/README.md) - Execute actions on resources in Commerce Layer.
* [`token`](https://github.com/commercelayer/commercelayer-cli-plugin-token/blob/main/README.md) - Manage Commerce Layer access tokens.
* [`microstore`](https://github.com/commercelayer/commercelayer-cli-plugin-microstore/blob/main/README.md) - Generate Microstore URLs.
* [`exports`](https://github.com/commercelayer/commercelayer-cli-plugin-exports/blob/main/README.md) - Export resources from Commerce Layer.
* [`cleanups`](https://github.com/commercelayer/commercelayer-cli-plugin-cleanups/blob/main/README.md) - Cleanup resources from Commerce Layer.
* [`tags`](https://github.com/commercelayer/commercelayer-cli-plugin-tags/blob/main/README.md) - Manage resources tags in Commerce Layer.
* [`provisioning`](https://github.com/commercelayer/commercelayer-cli-plugin-provisioning/blob/main/README.md) - Make requests to Commerce Layer's Provisioning API.
* [`links`](https://github.com/commercelayer/commercelayer-cli-plugin-links/blob/main/README.md) - Generate short links for shoppable resources.
* [`metrics`](https://github.com/commercelayer/commercelayer-cli-plugin-metrics/blob/main/README.md) - Make requests to Commerce Layer's Metrics API.

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

* Join [Commerce Layer's Discord community](https://discord.gg/commercelayer).
* Ping us on [Bluesky](https://bsky.app/profile/commercelayer.io), [X (formerly Twitter)](https://x.com/commercelayer), or [LinkedIn](https://www.linkedin.com/company/commerce-layer).
* Is there a bug? Create an [issue](https://github.com/commercelayer/commercelayer-cli/issues) on this repository.

## License

This repository is published under the [MIT](LICENSE) license.
