cli-plugin-webhooks
===================

Commerce Layer CLI Webhooks plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli-plugin-webhooks.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-webhooks)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli-plugin-webhooks.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-webhooks)
[![License](https://img.shields.io/npm/l/@commercelayer/cli-plugin-webhooks.svg)](https://github.com/commercelayer/cli-plugin-webhooks/blob/master/package.json)

<!-- toc -->


<!-- tocstop -->
# Usage
<!-- usage -->


<!-- usagestop -->
# Commands
<!-- commands -->

* [`cl-webhooks webhooks [ID]`](#cl-webhooks-webhooks-id)
* [`cl-webhooks webhooks:create`](#cl-webhooks-webhookscreate)
* [`cl-webhooks webhooks:destroy ID`](#cl-webhooks-webhooksdestroy-id)
* [`cl-webhooks webhooks:details ID`](#cl-webhooks-webhooksdetails-id)
* [`cl-webhooks webhooks:event ID`](#cl-webhooks-webhooksevent-id)
* [`cl-webhooks webhooks:events ID`](#cl-webhooks-webhooksevents-id)
* [`cl-webhooks webhooks:list`](#cl-webhooks-webhookslist)
* [`cl-webhooks webhooks:listen ID`](#cl-webhooks-webhookslisten-id)
* [`cl-webhooks webhooks:payload ID`](#cl-webhooks-webhookspayload-id)
* [`cl-webhooks webhooks:reset ID`](#cl-webhooks-webhooksreset-id)
* [`cl-webhooks webhooks:topics`](#cl-webhooks-webhookstopics)
* [`cl-webhooks webhooks:update ID`](#cl-webhooks-webhooksupdate-id)

### `cl-webhooks webhooks [ID]`

List all the registered webhooks.

```
USAGE
  $ cl-webhooks webhooks [ID]

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

### `cl-webhooks webhooks:create`

Create a new webhook.

```
USAGE
  $ cl-webhooks webhooks:create

OPTIONS
  -i, --include=include            a comma separated list of related resources to be included
  -n, --name=name                  the webhook short name
  -o, --organization=organization  (required) the slug of your organization
  -t, --topic=topic                (required) the identifier of the event that will trigger the webhook
  -u, --url=url                    (required) the callback URL used to POST data

EXAMPLES
  $ commercelayer webhooks:create -t customers.create -u https://callback.url.io
  $ cl wh:create -t orders.place -u http://myurl.com
```

_See code: [src/commands/webhooks/create.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/create.ts)_

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
  $ cl-webhooks webhook:delete
  $ cl-webhooks webhook:destroy

EXAMPLES
  $ commercelayer webhooks:destroy <webhook-id>>
  $ cl wh:destroy <webhook-id>>
```

_See code: [src/commands/webhooks/destroy.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/destroy.ts)_

### `cl-webhooks webhooks:details ID`

Show the details of an existing webhook.

```
USAGE
  $ cl-webhooks webhooks:details ID

ARGUMENTS
  ID  unique id of the webhook

OPTIONS
  -H, --hide-empty                 hide empty attributes
  -e, --events                     show the last event callbacks associated to the webhook
  -o, --organization=organization  (required) the slug of your organization

ALIASES
  $ cl-webhooks webhook
  $ cl-webhooks wh:details
  $ cl-webhooks webhook:details

EXAMPLES
  $ commercelayer webhooks:details <webhook-id>
  $ cl webhook <webhook-id> -H
  $ cl wh:details <webhook-id>
```

_See code: [src/commands/webhooks/details.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/details.ts)_

### `cl-webhooks webhooks:event ID`

Show the details of a firedf webhook event.

```
USAGE
  $ cl-webhooks webhooks:event ID

ARGUMENTS
  ID  unique id of the webhook event

OPTIONS
  -f, --format                     format the payload output
  -o, --organization=organization  (required) the slug of your organization
  -p, --payload                    show the event payload sent to the callback endpoint

ALIASES
  $ cl-webhooks wh:event
  $ cl-webhooks webhook:event

EXAMPLES
  $ commercelayer webhooks:event <event-id>
  $ cl webhooks:event <event-id> -p
```

_See code: [src/commands/webhooks/event.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/event.ts)_

### `cl-webhooks webhooks:events ID`

List all the events associated to the webhook.

```
USAGE
  $ cl-webhooks webhooks:events ID

ARGUMENTS
  ID  unique id of the webhook

OPTIONS
  -A, --all                        show all events instead of first 25 only
  -l, --limit=limit                limit number of events in output
  -o, --organization=organization  (required) the slug of your organization

ALIASES
  $ cl-webhooks wh:events
  $ cl-webhooks webhook:events

EXAMPLES
  $ commercelayer webhooks:events <webhook-id>
  $ cl wh:events <webhook-id>
```

_See code: [src/commands/webhooks/events.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/events.ts)_

### `cl-webhooks webhooks:list`

List all the registered webhooks.

```
USAGE
  $ cl-webhooks webhooks:list

OPTIONS
  -c, --circuit=open|closed        show only webhooks with circuit in the declared state
  -o, --organization=organization  (required) the slug of your organization
  -t, --topic=topic                the event that triggered the webhook

ALIASES
  $ cl-webhooks wh:list

EXAMPLES
  $ commercelayer webhooks
  $ cl webhooks:list -c open
  $ cl wh:list
```

_See code: [src/commands/webhooks/list.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/list.ts)_

### `cl-webhooks webhooks:listen ID`

Listen a webhook for outgoing callbacks.

```
USAGE
  $ cl-webhooks webhooks:listen ID

ARGUMENTS
  ID  unique id of the webhook

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
  -t, --time=time                  [default: 120] waiting time for the first event

ALIASES
  $ cl-webhooks wh:listen
  $ cl-webhooks webhook:listen

EXAMPLES
  $ commercelayer webhooks:listen <webhook-id>
  $ cl wh:listen <webhook-id>
```

_See code: [src/commands/webhooks/listen.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/listen.ts)_

### `cl-webhooks webhooks:payload ID`

Show the payload associated to an event callback.

```
USAGE
  $ cl-webhooks webhooks:payload ID

ARGUMENTS
  ID  unique id of the webhook event

OPTIONS
  -f, --format                     format the payload output
  -o, --organization=organization  (required) the slug of your organization

ALIASES
  $ cl-webhooks wh:payload
  $ cl-webhooks webhook:payload

EXAMPLES
  $ commercelayer webhooks:payload <event-id>
  $ cl webhook:payload <event-id>
  $ cl wh:payload <event-id> -f
```

_See code: [src/commands/webhooks/payload.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/payload.ts)_

### `cl-webhooks webhooks:reset ID`

Reset the circuit breaker associated to the webhook.

```
USAGE
  $ cl-webhooks webhooks:reset ID

ARGUMENTS
  ID  unique id of the webhook

OPTIONS
  -o, --organization=organization  (required) the slug of your organization

ALIASES
  $ cl-webhooks wh:reset
  $ cl-webhooks webhook:reset

EXAMPLES
  $ commercelayer webhooks:reset <webhook-id>
  $ cl wh:reset <webhook-id>
```

_See code: [src/commands/webhooks/reset.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/reset.ts)_

### `cl-webhooks webhooks:topics`

Show online documentation for supported events.

```
USAGE
  $ cl-webhooks webhooks:topics
```

_See code: [src/commands/webhooks/topics.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/topics.ts)_

### `cl-webhooks webhooks:update ID`

Update an existing webhook.

```
USAGE
  $ cl-webhooks webhooks:update ID

ARGUMENTS
  ID  unique id of the webhook

OPTIONS
  -i, --include=include            a comma separated list of related resources to be included
  -n, --name=name                  the webhook short name
  -o, --organization=organization  (required) the slug of your organization
  -t, --topic=topic                the identifier of the event that will trigger the webhook
  -u, --url=url                    the callback URL used to POST data

EXAMPLES
  $ commercelayer webhooks:update -t customers.create -u https://callback.url.io
  $ cl wh:update -i customer_group
```

_See code: [src/commands/webhooks/update.ts](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/src/commands/webhooks/update.ts)_
<!-- commandsstop -->
