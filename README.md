commercelayer-cli
=================

The official [Commerce Layer](https://commercelayer.io) CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/commercelayer-cli.svg)](https://npmjs.org/package/@commercelayer/commercelayer-cli)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/commercelayer-cli.svg)](https://npmjs.org/package/@commercelayer/commercelayer-cli)
[![License](https://img.shields.io/npm/l/@commercelayer/commercelayer-cli.svg)](https://github.com/commercelayer/commercelayer-cli/blob/master/package.json)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
* [Command Topics](#command-topics)
* [Plugins](#plugins)
<!-- tocstop -->
* [Plugins](#plugins)
# Usage
<!-- usage -->
```sh-session
$ npm install -g @commercelayer/commercelayer-cli
$ commercelayer COMMAND
running command...
$ commercelayer (-v|--version|version)
@commercelayer/commercelayer-cli/0.7.0 darwin-x64 node-v15.13.0
$ commercelayer --help [COMMAND]
USAGE
  $ commercelayer COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
# Command Topics

* [`commercelayer applications`](docs/applications.md) - Manage login to CLI applications
* [`commercelayer help`](docs/help.md) - display help for commercelayer
* [`commercelayer plugins`](docs/plugins.md) - Manage CLI plugins

<!-- commandsstop -->
# Plugins

* [`resources`](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/main/README.md) - Execute CRUD operations on API resources
* [`seeder`](https://github.com/commercelayer/commercelayer-cli-plugin-seeder/blob/main/README.md) - Execute Commerce Layer seeder

Run the following command to get a list pf all available CLI plugins:
```sh-session
commercelayer plugins:available
```
