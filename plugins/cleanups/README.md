# @commercelayer/cli-plugin-cleanups

Commerce Layer CLI Cleanups plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli-plugin-cleanups.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-cleanups)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli-plugin-cleanups.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-cleanups)
[![License](https://img.shields.io/npm/l/@commercelayer/cli-plugin-cleanups.svg)](https://github.com/@commercelayer/cli-plugin-cleanups/blob/master/package.json)

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

* [`commercelayer cleanups [ID]`](#commercelayer-cleanups-id)
* [`commercelayer cleanups:create`](#commercelayer-cleanupscreate)
* [`commercelayer cleanups:details ID`](#commercelayer-cleanupsdetails-id)
* [`commercelayer cleanups:group GROUP_ID`](#commercelayer-cleanupsgroup-group_id)
* [`commercelayer cleanups:list`](#commercelayer-cleanupslist)
* [`commercelayer cleanups:types`](#commercelayer-cleanupstypes)

### `commercelayer cleanups [ID]`

List all the created cleanups or show details of a single cleanup.

```sh-session
USAGE
  $ commercelayer cleanups [ID] [-A | -l <value>] [-t
    bundles|gift_cards|prices|promotions|sku_lists|sku_options|skus|stock_items] [-s
    in_progress|pending|completed|interrupted]

ARGUMENTS
  ID  unique id of the cleanup to be retrieved

FLAGS
  -A, --all              show all cleanups instead of first 25 only
  -l, --limit=<value>    limit number of cleanups in output
  -s, --status=<option>  the cleanup job status
                         <options: in_progress|pending|completed|interrupted>
  -t, --type=<option>    the type of resource cleaned
                         <options: bundles|gift_cards|prices|promotions|sku_lists|sku_options|skus|stock_items>

DESCRIPTION
  list all the created cleanups or show details of a single cleanup
```

_See code: [src/commands/cleanups/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-cleanups/blob/main/src/commands/cleanups/index.ts)_

### `commercelayer cleanups:create`

Create a new cleanup.

```sh-session
USAGE
  $ commercelayer cleanups:create -t bundles|gift_cards|prices|promotions|sku_lists|sku_options|skus|stock_items [-w
    <value>] [-b | -q | ]

FLAGS
  -b, --blind                                          execute in blind mode without showing the progress monitor
  -q, --quiet                                          execute command without showing warning messages
  -t, --type=bundles|gift_cards|prices|promotions|...  (required) the type of resource to clean up
  -w, --where=<value>...                               comma separated list of query filters

DESCRIPTION
  create a new cleanup

ALIASES
  $ commercelayer clp:create
  $ commercelayer cleanup

EXAMPLES
  $ commercelayer cleanups:create -t skus

  $ cl clp:create -t stock_items

  $ cl cleanup -t skus -w reference_origin_eq=<ref-id>
```

_See code: [src/commands/cleanups/create.ts](https://github.com/commercelayer/commercelayer-cli-plugin-cleanups/blob/main/src/commands/cleanups/create.ts)_

### `commercelayer cleanups:details ID`

Show the details of an existing cleanup.

```sh-session
USAGE
  $ commercelayer cleanups:details ID [-l]

ARGUMENTS
  ID  unique id of the cleanup

FLAGS
  -l, --logs  show error logs related to the cleanup process

DESCRIPTION
  show the details of an existing cleanup

ALIASES
  $ commercelayer clp:details

EXAMPLES
  $ commercelayer cleanups:details <cleanup-id>

  $ cl clp:details <cleanup-id>
```

_See code: [src/commands/cleanups/details.ts](https://github.com/commercelayer/commercelayer-cli-plugin-cleanups/blob/main/src/commands/cleanups/details.ts)_

### `commercelayer cleanups:group GROUP_ID`

List all the cleanups related to a cleanup group.

```sh-session
USAGE
  $ commercelayer cleanups:group GROUP_ID

ARGUMENTS
  GROUP_ID  unique id of the group cleanup

DESCRIPTION
  list all the cleanups related to a cleanup group

ALIASES
  $ commercelayer clp:group

EXAMPLES
  $ commercelayer cleanups:group <group-id>

  $ cl clp:group <group-id>
```

_See code: [src/commands/cleanups/group.ts](https://github.com/commercelayer/commercelayer-cli-plugin-cleanups/blob/main/src/commands/cleanups/group.ts)_

### `commercelayer cleanups:list`

List all the created cleanups.

```sh-session
USAGE
  $ commercelayer cleanups:list [-A | -l <value>] [-t
    bundles|gift_cards|prices|promotions|sku_lists|sku_options|skus|stock_items] [-s
    in_progress|pending|completed|interrupted]

FLAGS
  -A, --all              show all cleanups instead of first 25 only
  -l, --limit=<value>    limit number of cleanups in output
  -s, --status=<option>  the cleanup job status
                         <options: in_progress|pending|completed|interrupted>
  -t, --type=<option>    the type of resource cleaned
                         <options: bundles|gift_cards|prices|promotions|sku_lists|sku_options|skus|stock_items>

DESCRIPTION
  list all the created cleanups

ALIASES
  $ commercelayer clp:list

EXAMPLES
  $ commercelayer cleanups

  $ cl cleanups:list -A

  $ cl clp:list
```

_See code: [src/commands/cleanups/list.ts](https://github.com/commercelayer/commercelayer-cli-plugin-cleanups/blob/main/src/commands/cleanups/list.ts)_

### `commercelayer cleanups:types`

Show online documentation for supported resources.

```sh-session
USAGE
  $ commercelayer cleanups:types [-O]

FLAGS
  -O, --open  open online documentation page

DESCRIPTION
  show online documentation for supported resources

ALIASES
  $ commercelayer clp:types

EXAMPLES
  $ commercelayer cleanups:types

  $ cl clp:types
```

_See code: [src/commands/cleanups/types.ts](https://github.com/commercelayer/commercelayer-cli-plugin-cleanups/blob/main/src/commands/cleanups/types.ts)_
<!-- commandsstop -->
