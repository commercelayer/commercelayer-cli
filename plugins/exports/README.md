# @commercelayer/cli-plugin-exports

Commerce Layer CLI Exports plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli-plugin-exports.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-exports)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli-plugin-exports.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-exports)
[![License](https://img.shields.io/npm/l/@commercelayer/cli-plugin-exports.svg)](https://github.com/@commercelayer/cli-plugin-exports/blob/master/package.json)

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

* [`commercelayer exports [ID]`](#commercelayer-exports-id)
* [`commercelayer exports:all`](#commercelayer-exportsall)
* [`commercelayer exports:create`](#commercelayer-exportscreate)
* [`commercelayer exports:details ID`](#commercelayer-exportsdetails-id)
* [`commercelayer exports:group GROUP_ID`](#commercelayer-exportsgroup-group_id)
* [`commercelayer exports:list`](#commercelayer-exportslist)
* [`commercelayer exports:types`](#commercelayer-exportstypes)

### `commercelayer exports [ID]`

List all the created exports or show details of a single export.

```sh-session
USAGE
  $ commercelayer exports [ID] [-A | -l <value>] [-t
    addresses|authorizations|bundles|captures|coupons|customer_addresses|customer_payment_sources|customer_subscriptions
    |customers|gift_cards|line_items|line_item_options|orders|payment_methods|price_tiers|prices|refunds|shipments|shipp
    ing_categories|shipping_methods|sku_lists|sku_list_items|sku_options|skus|stock_items|stock_transfers|tags|tax_categ
    ories|transactions|voids] [-s in_progress|pending|completed|interrupted]

ARGUMENTS
  ID  unique id of the export to be retrieved

FLAGS
  -A, --all
      show all exports instead of first 25 only

  -l, --limit=<value>
      limit number of exports in output

  -s, --status=<option>
      the export job status
      <options: in_progress|pending|completed|interrupted>

  -t, --type=<option>
      the type of resource exported
      <options: addresses|authorizations|bundles|captures|coupons|customer_addresses|customer_payment_sources|customer_sub
      scriptions|customers|gift_cards|line_items|line_item_options|orders|payment_methods|price_tiers|prices|refunds|shipm
      ents|shipping_categories|shipping_methods|sku_lists|sku_list_items|sku_options|skus|stock_items|stock_transfers|tags
      |tax_categories|transactions|voids>

DESCRIPTION
  list all the created exports or show details of a single export
```

_See code: [src/commands/exports/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-exports/blob/main/src/commands/exports/index.ts)_

### `commercelayer exports:all`

Export all the records.

```sh-session
USAGE
  $ commercelayer exports:all -t addresses|authorizations|bundles|captures|... [-i <value>...] [-w <value>...]
    [-D] [-F csv|json | -C | ] [-x <value> | -X <value>] [-b] [-P | ] [-O] [-q] [-k]

FLAGS
  -C, --csv                                                 export data in CSV format
  -D, --dry-data                                            skip redundant attributes
  -F, --format=<option>                                     [default: json] export file format
                                                            <options: csv|json>
  -O, --open                                                open automatically the file after a successful export
  -P, --prettify                                            prettify json output format
  -X, --save-path=<value>                                   save command output to file and create missing path
                                                            directories
  -b, --blind                                               execute in blind mode without showing the progress monitor
  -i, --include=<value>...                                  comma separated resources to include
  -k, --keep                                                keep original export files in temp dir
  -q, --quiet                                               execute command without showing warning messages
  -t, --type=addresses|authorizations|bundles|captures|...  (required) the type of resource being exported
  -w, --where=<value>...                                    comma separated list of query filters
  -x, --save=<value>                                        save command output to file

DESCRIPTION
  export all the records

ALIASES
  $ commercelayer exp:all
  $ commercelayer export

EXAMPLES
  $ commercelayer exports:all -t cusorderstomers -X <output-file-path>

  $ cl exp:all -t customers -i customer_subscriptions -w email_end=@test.org -X <output-file-path>

  $ cl export -t skus -w code_start=SHIRT -X <output-file-path> --csv
```

_See code: [src/commands/exports/all.ts](https://github.com/commercelayer/commercelayer-cli-plugin-exports/blob/main/src/commands/exports/all.ts)_

### `commercelayer exports:create`

Create a new export.

```sh-session
USAGE
  $ commercelayer exports:create -t addresses|authorizations|bundles|captures|... [-i <value>...] [-w <value>...]
    [-D] [-F csv|json | -C | ] [-x <value> | -X <value>] [-b] [-P | ] [-O]

FLAGS
  -C, --csv                                                 export data in CSV format
  -D, --dry-data                                            skip redundant attributes
  -F, --format=<option>                                     [default: json] export file format
                                                            <options: csv|json>
  -O, --open                                                open automatically the file after a successful export
  -P, --prettify                                            prettify json output format
  -X, --save-path=<value>                                   save command output to file and create missing path
                                                            directories
  -b, --blind                                               execute in blind mode without showing the progress monitor
  -i, --include=<value>...                                  comma separated resources to include
  -t, --type=addresses|authorizations|bundles|captures|...  (required) the type of resource being exported
  -w, --where=<value>...                                    comma separated list of query filters
  -x, --save=<value>                                        save command output to file

DESCRIPTION
  create a new export

ALIASES
  $ commercelayer exp:create

EXAMPLES
  $ commercelayer exports:create -t orders -X <output-file-path>

  $ cl exp:create -t customers -i customer_subscriptions -w email_end=@test.org -X <output-file-path> --csv
```

_See code: [src/commands/exports/create.ts](https://github.com/commercelayer/commercelayer-cli-plugin-exports/blob/main/src/commands/exports/create.ts)_

### `commercelayer exports:details ID`

Show the details of an existing export.

```sh-session
USAGE
  $ commercelayer exports:details ID

ARGUMENTS
  ID  unique id of the export

DESCRIPTION
  show the details of an existing export

ALIASES
  $ commercelayer exp:details

EXAMPLES
  $ commercelayer exports:details <export-id>

  $ cl exp:details <export-id>
```

_See code: [src/commands/exports/details.ts](https://github.com/commercelayer/commercelayer-cli-plugin-exports/blob/main/src/commands/exports/details.ts)_

### `commercelayer exports:group GROUP_ID`

List all the exports related to an export group.

```sh-session
USAGE
  $ commercelayer exports:group GROUP_ID

ARGUMENTS
  GROUP_ID  unique id of the group export

DESCRIPTION
  list all the exports related to an export group

ALIASES
  $ commercelayer exp:group

EXAMPLES
  $ commercelayer exports:group <group-id>

  $ cl exp:group <group-id>
```

_See code: [src/commands/exports/group.ts](https://github.com/commercelayer/commercelayer-cli-plugin-exports/blob/main/src/commands/exports/group.ts)_

### `commercelayer exports:list`

List all the created exports.

```sh-session
USAGE
  $ commercelayer exports:list [-A | -l <value>] [-t
    addresses|authorizations|bundles|captures|coupons|customer_addresses|customer_payment_sources|customer_subscriptions
    |customers|gift_cards|line_items|line_item_options|orders|payment_methods|price_tiers|prices|refunds|shipments|shipp
    ing_categories|shipping_methods|sku_lists|sku_list_items|sku_options|skus|stock_items|stock_transfers|tags|tax_categ
    ories|transactions|voids] [-s in_progress|pending|completed|interrupted]

FLAGS
  -A, --all
      show all exports instead of first 25 only

  -l, --limit=<value>
      limit number of exports in output

  -s, --status=<option>
      the export job status
      <options: in_progress|pending|completed|interrupted>

  -t, --type=<option>
      the type of resource exported
      <options: addresses|authorizations|bundles|captures|coupons|customer_addresses|customer_payment_sources|customer_sub
      scriptions|customers|gift_cards|line_items|line_item_options|orders|payment_methods|price_tiers|prices|refunds|shipm
      ents|shipping_categories|shipping_methods|sku_lists|sku_list_items|sku_options|skus|stock_items|stock_transfers|tags
      |tax_categories|transactions|voids>

DESCRIPTION
  list all the created exports

ALIASES
  $ commercelayer exp:list

EXAMPLES
  $ commercelayer exports

  $ cl exports:list -A

  $ cl exp:list
```

_See code: [src/commands/exports/list.ts](https://github.com/commercelayer/commercelayer-cli-plugin-exports/blob/main/src/commands/exports/list.ts)_

### `commercelayer exports:types`

Show online documentation for supported resources.

```sh-session
USAGE
  $ commercelayer exports:types [-O]

FLAGS
  -O, --open  open online documentation page

DESCRIPTION
  show online documentation for supported resources

ALIASES
  $ commercelayer exp:types

EXAMPLES
  $ commercelayer exports:types

  $ cl exp:types
```

_See code: [src/commands/exports/types.ts](https://github.com/commercelayer/commercelayer-cli-plugin-exports/blob/main/src/commands/exports/types.ts)_
<!-- commandsstop -->
