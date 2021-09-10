cli-plugin-webhooks
===================

Commerce Layer CLI Webhooks plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/cli-plugin-webhooks.svg)](https://npmjs.org/package/commercelayer/cli-plugin-webhooks)
[![Downloads/week](https://img.shields.io/npm/dw/cli-plugin-webhooks.svg)](https://npmjs.org/package/commercelayer/cli-plugin-webhooks)
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

* [`cl-webhooks webhooks`](#cl-webhooks-webhooks)
* [`cl-webhooks webhooks:create`](#cl-webhooks-webhookscreate)
* [`cl-webhooks webhooks:destroy ID`](#cl-webhooks-webhooksdestroy-id)
* [`cl-webhooks webhooks:details ID`](#cl-webhooks-webhooksdetails-id)
* [`cl-webhooks webhooks:events [FILE]`](#cl-webhooks-webhooksevents-file)
* [`cl-webhooks webhooks:list`](#cl-webhooks-webhookslist)
* [`cl-webhooks webhooks:reset ID`](#cl-webhooks-webhooksreset-id)
* [`cl-webhooks webhooks:update ID`](#cl-webhooks-webhooksupdate-id)

### `cl-webhooks webhooks`

List all the registered webhooks.

```
USAGE
  $ cl-webhooks webhooks

OPTIONS
  -c, --circuit=open|closed        show only webhooks with circuit in the decalred state
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/webhooks/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/v0.1.3/src/commands/webhooks/index.ts)_

### `cl-webhooks webhooks:create`

Create a new webhook.

```
USAGE
  $ cl-webhooks webhooks:create

OPTIONS
  -i, --include=include            a comma separated list of related resources to be included
  -o, --organization=organization  (required) the slug of your organization
  -t, --topic=topic                (required) the identifier of the event that will trigger the webhook
  -u, --url=url                    (required) the callback URL used to POST data
```

_See code: [src/commands/webhooks/create.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/v0.1.3/src/commands/webhooks/create.ts)_

### `cl-webhooks webhooks:destroy ID`

Destroy an existing webhook.

```
USAGE
  $ cl-webhooks webhooks:destroy ID

ARGUMENTS
  ID  unique id of the webhook

OPTIONS
  -o, --organization=organization  (required) the slug of your organization

ALIASES
  $ cl-webhooks webhooks:delete
  $ cl-webhooks wh:delete
  $ cl-webhooks wh:destroy
```

_See code: [src/commands/webhooks/destroy.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/v0.1.3/src/commands/webhooks/destroy.ts)_

### `cl-webhooks webhooks:details ID`

Show the details of an existing webhook.

```
USAGE
  $ cl-webhooks webhooks:details ID

ARGUMENTS
  ID  unique id of the webhook

OPTIONS
  -H, --hide-empty                 hide empty attributes
  -o, --organization=organization  (required) the slug of your organization

ALIASES
  $ cl-webhooks webhook
  $ cl-webhooks wh:details
```

_See code: [src/commands/webhooks/details.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/v0.1.3/src/commands/webhooks/details.ts)_

### `cl-webhooks webhooks:events [FILE]`

Describe the command here.

```
USAGE
  $ cl-webhooks webhooks:events [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/webhooks/events.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/v0.1.3/src/commands/webhooks/events.ts)_

### `cl-webhooks webhooks:list`

List all the registered webhooks.

```
USAGE
  $ cl-webhooks webhooks:list

OPTIONS
  -c, --circuit=open|closed        show only webhooks with circuit in the decalred state
  -o, --organization=organization  (required) the slug of your organization

ALIASES
  $ cl-webhooks wh:list

EXAMPLES
  $ commercelayer webhooks
  $ cl webhooks:list
  $ cl wh:list
```

_See code: [src/commands/webhooks/list.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/v0.1.3/src/commands/webhooks/list.ts)_

### `cl-webhooks webhooks:reset ID`

Reset the circuit breaker associated to the webhook.

```
USAGE
  $ cl-webhooks webhooks:reset ID

ARGUMENTS
  ID  unique id of the webhook

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/webhooks/reset.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/v0.1.3/src/commands/webhooks/reset.ts)_

### `cl-webhooks webhooks:update ID`

Create a new webhook.

```
USAGE
  $ cl-webhooks webhooks:update ID

ARGUMENTS
  ID  unique id of the webhook

OPTIONS
  -i, --include=include            a comma separated list of related resources to be included
  -o, --organization=organization  (required) the slug of your organization
  -t, --topic=topic                the identifier of the event that will trigger the webhook
  -u, --url=url                    the callback URL used to POST data
```

_See code: [src/commands/webhooks/update.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/v0.1.3/src/commands/webhooks/update.ts)_
<!-- commandsstop -->
