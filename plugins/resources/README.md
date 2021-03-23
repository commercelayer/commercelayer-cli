@commercelayer/cli-plugin-resources
===================================

Commerce Layer CLI Resources plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli-plugin-resources.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-resources)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli-plugin-resources.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-resources)
[![License](https://img.shields.io/npm/l/@commercelayer/cli-plugin-resources.svg)](https://github.com/commercelayer/cli-plugin-resources/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @commercelayer/cli-plugin-resources
$ cl-resources COMMAND
running command...
$ cl-resources (-v|--version|version)
@commercelayer/cli-plugin-resources/0.0.0 darwin-x64 node-v14.16.0
$ cl-resources --help [COMMAND]
USAGE
  $ cl-resources COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`cl-resources hello [FILE]`](#cl-resources-hello-file)
* [`cl-resources help [COMMAND]`](#cl-resources-help-command)
* [`cl-resources resources:create [FILE]`](#cl-resources-resourcescreate-file)
* [`cl-resources resources:delete [FILE]`](#cl-resources-resourcesdelete-file)
* [`cl-resources resources:list [FILE]`](#cl-resources-resourceslist-file)
* [`cl-resources resources:retrieve [FILE]`](#cl-resources-resourcesretrieve-file)
* [`cl-resources resources:update [FILE]`](#cl-resources-resourcesupdate-file)

## `cl-resources hello [FILE]`

describe the command here

```
USAGE
  $ cl-resources hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ cl-resources hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/commercelayer/cli-plugin-resources/blob/v0.0.0/src/commands/hello.ts)_

## `cl-resources help [COMMAND]`

display help for cl-resources

```
USAGE
  $ cl-resources help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `cl-resources resources:create [FILE]`

describe the command here

```
USAGE
  $ cl-resources resources:create [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/resources/create.ts](https://github.com/commercelayer/cli-plugin-resources/blob/v0.0.0/src/commands/resources/create.ts)_

## `cl-resources resources:delete [FILE]`

describe the command here

```
USAGE
  $ cl-resources resources:delete [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/resources/delete.ts](https://github.com/commercelayer/cli-plugin-resources/blob/v0.0.0/src/commands/resources/delete.ts)_

## `cl-resources resources:list [FILE]`

describe the command here

```
USAGE
  $ cl-resources resources:list [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

ALIASES
  $ cl-resources list
  $ cl-resources l
```

_See code: [src/commands/resources/list.ts](https://github.com/commercelayer/cli-plugin-resources/blob/v0.0.0/src/commands/resources/list.ts)_

## `cl-resources resources:retrieve [FILE]`

describe the command here

```
USAGE
  $ cl-resources resources:retrieve [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

ALIASES
  $ cl-resources retrieve
  $ cl-resources r
```

_See code: [src/commands/resources/retrieve.ts](https://github.com/commercelayer/cli-plugin-resources/blob/v0.0.0/src/commands/resources/retrieve.ts)_

## `cl-resources resources:update [FILE]`

describe the command here

```
USAGE
  $ cl-resources resources:update [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/resources/update.ts](https://github.com/commercelayer/cli-plugin-resources/blob/v0.0.0/src/commands/resources/update.ts)_
<!-- commandsstop -->
