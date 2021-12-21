cli-plugin-webhooks
===================

Commerce Layer CLI Webhooks plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli-plugin-webhooks.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-webhooks)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli-plugin-webhooks.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-webhooks)
[![License](https://img.shields.io/npm/l/@commercelayer/cli-plugin-webhooks.svg)](https://github.com/commercelayer/cli-plugin-webhooks/blob/master/package.json)

<!-- toc -->


<!-- tocstop -->
# Commands
<!-- commands -->

* [`commercelayer webhooks [ID]`](#commercelayer-webhooks-id)
* [`commercelayer webhooks:create`](#commercelayer-webhookscreate)
* [`commercelayer webhooks:destroy ID`](#commercelayer-webhooksdestroy-id)
* [`commercelayer webhooks:details ID`](#commercelayer-webhooksdetails-id)
* [`commercelayer webhooks:event ID`](#commercelayer-webhooksevent-id)
* [`commercelayer webhooks:events ID`](#commercelayer-webhooksevents-id)
* [`commercelayer webhooks:list`](#commercelayer-webhookslist)
* [`commercelayer webhooks:listen ID`](#commercelayer-webhookslisten-id)
* [`commercelayer webhooks:payload ID`](#commercelayer-webhookspayload-id)
* [`commercelayer webhooks:reset ID`](#commercelayer-webhooksreset-id)
* [`commercelayer webhooks:topics`](#commercelayer-webhookstopics)
* [`commercelayer webhooks:update ID`](#commercelayer-webhooksupdate-id)

### `commercelayer webhooks [ID]`

List all the registered webhooks.

```
USAGE
  $ commercelayer webhooks [ID]

ARGUMENTS
  ID  unique id of the webhook

OPTIONS
  -H, --hide-empty                 hide empty attributes
  -c, --circuit=open|closed        show only webhooks with circuit in the declared state
  -e, --events                     show the last event callbacks associated to the webhook
  -o, --organization=organization  (required) the slug of your organization
  -t, --topic=topic                the event that triggered the webhook
```

_See code: [src/commands/webhooks/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/index.ts)_

### `commercelayer webhooks:create`

Create a new webhook.

```
USAGE
  $ commercelayer webhooks:create

OPTIONS
  -i, --include=include            a comma separated list of related resources to be included
  -n, --name=name                  the webhook short name
  -o, --organization=organization  (required) the slug of your organization
  -t, --topic=topic                (required) the identifier of the event that will trigger the webhook
  -u, --url=url                    (required) the callback URL used to POST data

ALIASES
  $ commercelayer wh:create

EXAMPLES
  $ commercelayer webhooks:create -t customers.create -u https://callback.url.io
  $ cl wh:create -t orders.place -u http://myurl.com
```

_See code: [src/commands/webhooks/create.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/create.ts)_

### `commercelayer webhooks:destroy ID`

Destroy an existing webhook.

```
USAGE
  $ commercelayer webhooks:destroy ID

ARGUMENTS
  ID  unique id of the webhook

OPTIONS
  -o, --organization=organization  (required) the slug of your organization

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

```
USAGE
  $ commercelayer webhooks:details ID

ARGUMENTS
  ID  unique id of the webhook

OPTIONS
  -H, --hide-empty                 hide empty attributes
  -e, --events                     show the last event callbacks associated to the webhook
  -o, --organization=organization  (required) the slug of your organization

ALIASES
  $ commercelayer wh:details
  $ commercelayer webhook:details

EXAMPLES
  $ commercelayer webhooks:details <webhook-id>
  $ cl webhooks:details <webhook-id> -H
  $ cl wh:details <webhook-id>
```

_See code: [src/commands/webhooks/details.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/details.ts)_

### `commercelayer webhooks:event ID`

Show the details of a firedf webhook event.

```
USAGE
  $ commercelayer webhooks:event ID

ARGUMENTS
  ID  unique id of the webhook event

OPTIONS
  -f, --format                     format the payload output
  -o, --organization=organization  (required) the slug of your organization
  -p, --payload                    show the event payload sent to the callback endpoint

ALIASES
  $ commercelayer wh:event

EXAMPLES
  $ commercelayer webhooks:event <event-id>
  $ cl wh:event <event-id> -p
```

_See code: [src/commands/webhooks/event.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/event.ts)_

### `commercelayer webhooks:events ID`

List all the events associated to the webhook.

```
USAGE
  $ commercelayer webhooks:events ID

ARGUMENTS
  ID  unique id of the webhook

OPTIONS
  -A, --all                        show all events instead of first 25 only
  -l, --limit=limit                limit number of events in output
  -o, --organization=organization  (required) the slug of your organization

ALIASES
  $ commercelayer wh:events

EXAMPLES
  $ commercelayer webhooks:events <webhook-id>
  $ cl wh:events <webhook-id>
```

_See code: [src/commands/webhooks/events.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/events.ts)_

### `commercelayer webhooks:list`

List all the registered webhooks.

```
USAGE
  $ commercelayer webhooks:list

OPTIONS
  -c, --circuit=open|closed        show only webhooks with circuit in the declared state
  -o, --organization=organization  (required) the slug of your organization
  -t, --topic=topic                the event that triggered the webhook

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

```
USAGE
  $ commercelayer webhooks:listen ID

ARGUMENTS
  ID  unique id of the webhook

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
  -t, --time=time                  [default: 120] waiting time for the first event

ALIASES
  $ commercelayer wh:listen

EXAMPLES
  $ commercelayer webhooks:listen <webhook-id>
  $ cl wh:listen <webhook-id>
```

_See code: [src/commands/webhooks/listen.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/listen.ts)_

### `commercelayer webhooks:payload ID`

Show the payload associated to an event callback.

```
USAGE
  $ commercelayer webhooks:payload ID

ARGUMENTS
  ID  unique id of the webhook event

OPTIONS
  -f, --format                     format the payload output
  -o, --organization=organization  (required) the slug of your organization

ALIASES
  $ commercelayer wh:payload

EXAMPLES
  $ commercelayer webhooks:payload <event-id>
  $ cl webhook:payload <event-id>
  $ cl wh:payload <event-id> -f
```

_See code: [src/commands/webhooks/payload.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/payload.ts)_

### `commercelayer webhooks:reset ID`

Reset the circuit breaker associated to the webhook.

```
USAGE
  $ commercelayer webhooks:reset ID

ARGUMENTS
  ID  unique id of the webhook

OPTIONS
  -o, --organization=organization  (required) the slug of your organization

ALIASES
  $ commercelayer wh:reset

EXAMPLES
  $ commercelayer webhooks:reset <webhook-id>
  $ cl wh:reset <webhook-id>
```

_See code: [src/commands/webhooks/reset.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/reset.ts)_

### `commercelayer webhooks:topics`

Show online documentation for supported events.

```
USAGE
  $ commercelayer webhooks:topics

ALIASES
  $ commercelayer wh:topics

EXAMPLES
  $ commercelayer webhooks:topics
  $ cl wh:topics
```

_See code: [src/commands/webhooks/topics.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/topics.ts)_

### `commercelayer webhooks:update ID`

Update an existing webhook.

```
USAGE
  $ commercelayer webhooks:update ID

ARGUMENTS
  ID  unique id of the webhook

OPTIONS
  -i, --include=include            a comma separated list of related resources to be included
  -n, --name=name                  the webhook short name
  -o, --organization=organization  (required) the slug of your organization
  -t, --topic=topic                the identifier of the event that will trigger the webhook
  -u, --url=url                    the callback URL used to POST data

ALIASES
  $ commercelayer wh:update

EXAMPLES
  $ commercelayer webhooks:update -t customers.create -u https://callback.url.io
  $ cl wh:update -i customer_group
```

_See code: [src/commands/webhooks/update.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/update.ts)_
<!-- commandsstop -->
