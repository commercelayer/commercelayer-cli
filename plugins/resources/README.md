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
@commercelayer/cli-plugin-resources/0.0.1 darwin-x64 node-v14.16.0
$ cl-resources --help [COMMAND]
USAGE
  $ cl-resources COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`cl-resources help [COMMAND]`](#cl-resources-help-command)
* [`cl-resources resources`](#cl-resources-resources)
* [`cl-resources resources:available [FILE]`](#cl-resources-resourcesavailable-file)
* [`cl-resources resources:create`](#cl-resources-resourcescreate)
* [`cl-resources resources:delete`](#cl-resources-resourcesdelete)
* [`cl-resources resources:list`](#cl-resources-resourceslist)
* [`cl-resources resources:retrieve RESOURCE [ID]`](#cl-resources-resourcesretrieve-resource-id)
* [`cl-resources resources:update`](#cl-resources-resourcesupdate)

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

## `cl-resources resources`

list all the available Commerce Layer API resources

```
USAGE
  $ cl-resources resources
```

_See code: [src/commands/resources.ts](https://github.com/commercelayer/cli-plugin-resources/blob/v0.0.1/src/commands/resources.ts)_

## `cl-resources resources:available [FILE]`

describe the command here

```
USAGE
  $ cl-resources resources:available [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/resources/available.ts](https://github.com/commercelayer/cli-plugin-resources/blob/v0.0.1/src/commands/resources/available.ts)_

## `cl-resources resources:create`

describe the command here

```
USAGE
  $ cl-resources resources:create

OPTIONS
  -o, --organization=organization  (required) the slug of your organization

ALIASES
  $ cl-resources create
  $ cl-resources rc
```

_See code: [src/commands/resources/create.ts](https://github.com/commercelayer/cli-plugin-resources/blob/v0.0.1/src/commands/resources/create.ts)_

## `cl-resources resources:delete`

describe the command here

```
USAGE
  $ cl-resources resources:delete

OPTIONS
  -o, --organization=organization  (required) the slug of your organization

ALIASES
  $ cl-resources delete
  $ cl-resources rd
```

_See code: [src/commands/resources/delete.ts](https://github.com/commercelayer/cli-plugin-resources/blob/v0.0.1/src/commands/resources/delete.ts)_

## `cl-resources resources:list`

describe the command here

```
USAGE
  $ cl-resources resources:list

OPTIONS
  -o, --organization=organization  (required) the slug of your organization

ALIASES
  $ cl-resources list
  $ cl-resources rl
```

_See code: [src/commands/resources/list.ts](https://github.com/commercelayer/cli-plugin-resources/blob/v0.0.1/src/commands/resources/list.ts)_

## `cl-resources resources:retrieve RESOURCE [ID]`

describe the command here

```
USAGE
  $ cl-resources resources:retrieve RESOURCE [ID]

ARGUMENTS
  RESOURCE  the resource type
  ID        id of the resource to retrieve

OPTIONS
  -f, --fields=fields              comma separeted list of fields in the format [resource]=field1,field2...
  -i, --include=include            comma separated resources to include
  -o, --organization=organization  (required) the slug of your organization

ALIASES
  $ cl-resources retrieve
  $ cl-resources rr
```

_See code: [src/commands/resources/retrieve.ts](https://github.com/commercelayer/cli-plugin-resources/blob/v0.0.1/src/commands/resources/retrieve.ts)_

## `cl-resources resources:update`

describe the command here

```
USAGE
  $ cl-resources resources:update

OPTIONS
  -o, --organization=organization  (required) the slug of your organization

ALIASES
  $ cl-resources update
  $ cl-resources ru
```

_See code: [src/commands/resources/update.ts](https://github.com/commercelayer/cli-plugin-resources/blob/v0.0.1/src/commands/resources/update.ts)_
<!-- commandsstop -->
