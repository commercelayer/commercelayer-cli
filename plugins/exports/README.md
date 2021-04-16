@commercelayer/cli-plugin-exporter
==================================

Commerce Layer CLI exporter plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli-plugin-exporter.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-exporter)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli-plugin-exporter.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-exporter)
[![License](https://img.shields.io/npm/l/@commercelayer/cli-plugin-exporter.svg)](https://github.com/@commercelayer/cli-plugin-exporter/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @commercelayer/cli-plugin-exporter
$ cl-exporter COMMAND
running command...
$ cl-exporter (-v|--version|version)
@commercelayer/cli-plugin-exporter/0.0.0 darwin-x64 node-v15.13.0
$ cl-exporter --help [COMMAND]
USAGE
  $ cl-exporter COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`cl-exporter export [FILE]`](#cl-exporter-export-file)
* [`cl-exporter hello [FILE]`](#cl-exporter-hello-file)
* [`cl-exporter help [COMMAND]`](#cl-exporter-help-command)

## `cl-exporter export [FILE]`

describe the command here

```
USAGE
  $ cl-exporter export [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/export.ts](https://github.com/commercelayer/commercelayer-cli-plugin-exporter/blob/v0.0.0/src/commands/export.ts)_

## `cl-exporter hello [FILE]`

describe the command here

```
USAGE
  $ cl-exporter hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ cl-exporter hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/commercelayer/commercelayer-cli-plugin-exporter/blob/v0.0.0/src/commands/hello.ts)_

## `cl-exporter help [COMMAND]`

display help for cl-exporter

```
USAGE
  $ cl-exporter help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_
<!-- commandsstop -->
