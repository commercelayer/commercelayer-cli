cli-plugin-webhooks
===================

Commerce Lsyer CLI Webhooks Plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/cli-plugin-webhooks.svg)](https://npmjs.org/package/cli-plugin-webhooks)
[![Downloads/week](https://img.shields.io/npm/dw/cli-plugin-webhooks.svg)](https://npmjs.org/package/cli-plugin-webhooks)
[![License](https://img.shields.io/npm/l/cli-plugin-webhooks.svg)](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/master/package.json)

<!-- toc -->


<!-- tocstop -->
# Usage
<!-- usage -->

```sh-session
$ cl-webhooks COMMAND

$ cl-webhooks (-v | version | --version) to check the version of the CLI you have installed.

$ cl-webhooks [COMMAND] (--help | -h) for detailed information about CLI commands.
```
<!-- usagestop -->
# Commands
<!-- commands -->

* [`cl-webhooks webhooks [FILE]`](#cl-webhooks-webhooks-file)
* [`cl-webhooks webhooks:details ID`](#cl-webhooks-webhooksdetails-id)
* [`cl-webhooks webhooks:list`](#cl-webhooks-webhookslist)
* [`cl-webhooks webhooks:reset [FILE]`](#cl-webhooks-webhooksreset-file)

### `cl-webhooks webhooks [FILE]`

Describe the command here.

```
USAGE
  $ cl-webhooks webhooks [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/webhooks/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/v0.0.0/src/commands/webhooks/index.ts)_

### `cl-webhooks webhooks:details ID`

Show the details of a webhook.

```
USAGE
  $ cl-webhooks webhooks:details ID

ARGUMENTS
  ID  unique id of the webhook

OPTIONS
  -o, --organization=organization  (required) the slug of your organization

ALIASES
  $ cl-webhooks webhook
  $ cl-webhooks wh:details
```

_See code: [src/commands/webhooks/details.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/v0.0.0/src/commands/webhooks/details.ts)_

### `cl-webhooks webhooks:list`

List all the registered webhooks.

```
USAGE
  $ cl-webhooks webhooks:list

OPTIONS
  -o, --organization=organization  (required) the slug of your organization

ALIASES
  $ cl-webhooks wh:list

EXAMPLES
  $ commercelayer webhooks
  $ cl webhooks:list
  $ cl wh:list
```

_See code: [src/commands/webhooks/list.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/v0.0.0/src/commands/webhooks/list.ts)_

### `cl-webhooks webhooks:reset [FILE]`

Describe the command here.

```
USAGE
  $ cl-webhooks webhooks:reset [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/webhooks/reset.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/v0.0.0/src/commands/webhooks/reset.ts)_
<!-- commandsstop -->
