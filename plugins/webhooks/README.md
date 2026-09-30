# cli-plugin-webhooks

Commerce Layer CLI Webhooks plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli-plugin-webhooks.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-webhooks)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli-plugin-webhooks.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-webhooks)
[![License](https://img.shields.io/npm/l/@commercelayer/cli-plugin-webhooks.svg)](https://github.com/commercelayer/cli-plugin-webhooks/blob/master/package.json)

<!-- toc -->

* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
## Usage
<!-- usage -->

```sh-session
commercelayer COMMAND

commercelayer [COMMAND] (--help | -h) for detailed information about plugin commands.
```
<!-- usagestop -->
## Commands
<!-- commands -->

* [`commercelayer webhooks [ID]`](#commercelayer-webhooks-id)
* [`commercelayer webhooks:create`](#commercelayer-webhookscreate)
* [`commercelayer webhooks:destroy ID`](#commercelayer-webhooksdestroy-id)
* [`commercelayer webhooks:details ID`](#commercelayer-webhooksdetails-id)
* [`commercelayer webhooks:disable ID`](#commercelayer-webhooksdisable-id)
* [`commercelayer webhooks:enable ID`](#commercelayer-webhooksenable-id)
* [`commercelayer webhooks:event ID`](#commercelayer-webhooksevent-id)
* [`commercelayer webhooks:events ID`](#commercelayer-webhooksevents-id)
* [`commercelayer webhooks:list`](#commercelayer-webhookslist)
* [`commercelayer webhooks:listen ID`](#commercelayer-webhookslisten-id)
* [`commercelayer webhooks:payload ID`](#commercelayer-webhookspayload-id)
* [`commercelayer webhooks:reset ID`](#commercelayer-webhooksreset-id)
* [`commercelayer webhooks:topics`](#commercelayer-webhookstopics)
* [`commercelayer webhooks:update ID`](#commercelayer-webhooksupdate-id)

### `commercelayer webhooks [ID]`

List all the registered webhooks or the details of a single webhook.

```sh-session
USAGE
  $ commercelayer webhooks [ID] [-c open|closed] [-t <value>] [-H] [-e]

ARGUMENTS
  ID  unique id of the webhook to get a single webhook

FLAGS
  -H, --hide-empty        hide empty attributes
  -c, --circuit=<option>  show only webhooks with circuit in the declared state
                          <options: open|closed>
  -e, --events            show the last event callbacks associated to the webhook
  -t, --topic=<value>     the event that triggered the webhook

DESCRIPTION
  list all the registered webhooks or the details of a single webhook
```

_See code: [src/commands/webhooks/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/index.ts)_

### `commercelayer webhooks:create`

Create a new webhook.

```sh-session
USAGE
  $ commercelayer webhooks:create -t <value> -u <value> [-i <value>...] [-n <value>]

FLAGS
  -i, --include=<value>...  a comma separated list of related resources to be included
  -n, --name=<value>        the webhook short name
  -t, --topic=<value>       (required) the identifier of the event that will trigger the webhook
  -u, --url=<value>         (required) the callback URL used to POST data

DESCRIPTION
  create a new webhook

ALIASES
  $ commercelayer wh:create

EXAMPLES
  $ commercelayer webhooks:create -t customers.create -u https://callback.url.io

  $ cl wh:create -t orders.place -u http://myurl.com
```

_See code: [src/commands/webhooks/create.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/create.ts)_

### `commercelayer webhooks:destroy ID`

Destroy an existing webhook.

```sh-session
USAGE
  $ commercelayer webhooks:destroy ID

ARGUMENTS
  ID  unique id of the webhook

DESCRIPTION
  destroy an existing webhook

ALIASES
  $ commercelayer webhooks:delete
  $ commercelayer wh:delete
  $ commercelayer wh:destroy

EXAMPLES
  $ commercelayer webhooks:destroy <webhook-id>>

  $ cl wh:destroy <webhook-id>>
```

_See code: [src/commands/webhooks/destroy.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/destroy.ts)_

### `commercelayer webhooks:details ID`

Show the details of an existing webhook.

```sh-session
USAGE
  $ commercelayer webhooks:details ID [-H] [-e]

ARGUMENTS
  ID  unique id of the webhook

FLAGS
  -H, --hide-empty  hide empty attributes
  -e, --events      show the last event callbacks associated to the webhook

DESCRIPTION
  show the details of an existing webhook

ALIASES
  $ commercelayer wh:details

EXAMPLES
  $ commercelayer webhooks:details <webhook-id>

  $ cl webhooks:details <webhook-id> -H

  $ cl wh:details <webhook-id>
```

_See code: [src/commands/webhooks/details.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/details.ts)_

### `commercelayer webhooks:disable ID`

Disable an enabled webhook.

```sh-session
USAGE
  $ commercelayer webhooks:disable ID

ARGUMENTS
  ID  unique id of the webhook

DESCRIPTION
  disable an enabled webhook

ALIASES
  $ commercelayer wh:disable

EXAMPLES
  $ commercelayer webhooks:disable <webhook-id>

  $ cl wh:disable <webhook-id>
```

_See code: [src/commands/webhooks/disable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/disable.ts)_

### `commercelayer webhooks:enable ID`

Enable a disabled webhook.

```sh-session
USAGE
  $ commercelayer webhooks:enable ID

ARGUMENTS
  ID  unique id of the webhook

DESCRIPTION
  enable a disabled webhook

ALIASES
  $ commercelayer wh:enable

EXAMPLES
  $ commercelayer webhooks:enable <webhook-id>

  $ cl wh:enable <webhook-id>
```

_See code: [src/commands/webhooks/enable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/enable.ts)_

### `commercelayer webhooks:event ID`

Show the details of a firedf webhook event.

```sh-session
USAGE
  $ commercelayer webhooks:event ID [-f -p]

ARGUMENTS
  ID  unique id of the webhook

FLAGS
  -f, --format   format the payload output
  -p, --payload  show the event payload sent to the callback endpoint

DESCRIPTION
  show the details of a firedf webhook event

ALIASES
  $ commercelayer wh:event

EXAMPLES
  $ commercelayer webhooks:event <event-id>

  $ cl wh:event <event-id> -p
```

_See code: [src/commands/webhooks/event.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/event.ts)_

### `commercelayer webhooks:events ID`

List all the events associated to the webhook.

```sh-session
USAGE
  $ commercelayer webhooks:events ID [-A | -l <value>]

ARGUMENTS
  ID  unique id of the webhook

FLAGS
  -A, --all            show all events instead of first 25 only
  -l, --limit=<value>  limit number of events in output

DESCRIPTION
  list all the events associated to the webhook

ALIASES
  $ commercelayer wh:events

EXAMPLES
  $ commercelayer webhooks:events <webhook-id>

  $ cl wh:events <webhook-id>
```

_See code: [src/commands/webhooks/events.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/events.ts)_

### `commercelayer webhooks:list`

List all the registered webhooks.

```sh-session
USAGE
  $ commercelayer webhooks:list [-c open|closed] [-t <value>]

FLAGS
  -c, --circuit=<option>  show only webhooks with circuit in the declared state
                          <options: open|closed>
  -t, --topic=<value>     the event that triggered the webhook

DESCRIPTION
  list all the registered webhooks

ALIASES
  $ commercelayer wh:list

EXAMPLES
  $ commercelayer webhooks

  $ cl webhooks:list -c open

  $ cl wh:list
```

_See code: [src/commands/webhooks/list.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/list.ts)_

### `commercelayer webhooks:listen ID`

Listen a webhook for outgoing callbacks.

```sh-session
USAGE
  $ commercelayer webhooks:listen ID [-t <value>]

ARGUMENTS
  ID  unique id of the webhook

FLAGS
  -t, --time=<value>  [default: 120] waiting time for the first event

DESCRIPTION
  listen a webhook for outgoing callbacks

ALIASES
  $ commercelayer wh:listen

EXAMPLES
  $ commercelayer webhooks:listen <webhook-id>

  $ cl wh:listen <webhook-id>
```

_See code: [src/commands/webhooks/listen.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/listen.ts)_

### `commercelayer webhooks:payload ID`

Show the payload associated to an event callback.

```sh-session
USAGE
  $ commercelayer webhooks:payload ID [-f]

ARGUMENTS
  ID  unique id of the webhook

FLAGS
  -f, --format  format the payload output

DESCRIPTION
  show the payload associated to an event callback

ALIASES
  $ commercelayer wh:payload

EXAMPLES
  $ commercelayer webhooks:payload <event-id>

  $ cl wh:payload <event-id> -f
```

_See code: [src/commands/webhooks/payload.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/payload.ts)_

### `commercelayer webhooks:reset ID`

Reset the circuit breaker associated to the webhook.

```sh-session
USAGE
  $ commercelayer webhooks:reset ID

ARGUMENTS
  ID  unique id of the webhook

DESCRIPTION
  reset the circuit breaker associated to the webhook

ALIASES
  $ commercelayer wh:reset

EXAMPLES
  $ commercelayer webhooks:reset <webhook-id>

  $ cl wh:reset <webhook-id>
```

_See code: [src/commands/webhooks/reset.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/reset.ts)_

### `commercelayer webhooks:topics`

Show online documentation for supported events.

```sh-session
USAGE
  $ commercelayer webhooks:topics

DESCRIPTION
  show online documentation for supported events

ALIASES
  $ commercelayer wh:topics

EXAMPLES
  $ commercelayer webhooks:topics

  $ cl wh:topics
```

_See code: [src/commands/webhooks/topics.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/topics.ts)_

### `commercelayer webhooks:update ID`

Update an existing webhook.

```sh-session
USAGE
  $ commercelayer webhooks:update ID [-t <value>] [-u <value>] [-i <value>...] [-n <value>]

ARGUMENTS
  ID  unique id of the webhook

FLAGS
  -i, --include=<value>...  a comma separated list of related resources to be included
  -n, --name=<value>        the webhook short name
  -t, --topic=<value>       the identifier of the event that will trigger the webhook
  -u, --url=<value>         the callback URL used to POST data

DESCRIPTION
  update an existing webhook

ALIASES
  $ commercelayer wh:update

EXAMPLES
  $ commercelayer webhooks:update <webhook-id> -t customers.create -u https://callback.url.io

  $ cl wh:update <webhook-id> -t orders.place -u http://myurl.com
```

_See code: [src/commands/webhooks/update.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/update.ts)_
<!-- commandsstop -->
