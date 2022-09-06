# cli-plugin-imports

Commerce Layer CLI Imports plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli-plugin-imports.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-imports)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli-plugin-imports.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-imports)
[![License](https://img.shields.io/npm/l/@commercelayer/cli-plugin-imports.svg)](https://github.com/commercelayer/cli-plugin-imports/blob/master/package.json)

<!-- toc -->

* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
## Usage
<!-- usage -->

```sh-session
$ commercelayer COMMAND

$ commercelayer [COMMAND] (--help | -h) for detailed information about plugin commands.
```
<!-- usagestop -->
## Commands
<!-- commands -->

* [`commercelayer imp:create`](#commercelayer-impcreate)
* [`commercelayer imp:delete ID`](#commercelayer-impdelete-id)
* [`commercelayer imp:details ID`](#commercelayer-impdetails-id)
* [`commercelayer imp:group GROUP_ID`](#commercelayer-impgroup-group_id)
* [`commercelayer imp:list`](#commercelayer-implist)
* [`commercelayer imp:types`](#commercelayer-imptypes)
* [`commercelayer import`](#commercelayer-import)
* [`commercelayer imports`](#commercelayer-imports)
* [`commercelayer imports:create`](#commercelayer-importscreate)
* [`commercelayer imports:delete ID`](#commercelayer-importsdelete-id)
* [`commercelayer imports:details ID`](#commercelayer-importsdetails-id)
* [`commercelayer imports:group GROUP_ID`](#commercelayer-importsgroup-group_id)
* [`commercelayer imports:list`](#commercelayer-importslist)
* [`commercelayer imports:types`](#commercelayer-importstypes)

### `commercelayer imp:create`

Create a new import.

```sh-session
USAGE
  $ commercelayer imp:create [FAKE-ARG] -o <value> -t
    orders|coupons|skus|sku_lists|sku_list_items|prices|stock_items|gift_cards|customers|customer_subscriptions|tax_cate
    gories [-p <value>] [-D ,|;|||TAB (-C -i <value>)] [-b | -q | ]

FLAGS
  -C, --csv                                     accept input file in CSV format
  -D, --delimiter=(,|;|||TAB)                   the delimiter character used in the CSV input file (one of ',', ';',
                                                '|', TAB)
  -b, --blind                                   execute in blind mode without showing the progress monitor
  -i, --inputs=<value>                          (required) the path of the file containing the data to import
  -o, --organization=<value>                    (required) the slug of your organization
  -p, --parent=<value>                          the id of the parent resource to be associated with imported data
  -q, --quiet                                   execute command without showing warning messages
  -t, --type=orders|coupons|skus|sku_lists|...  (required) the type of resource being imported

DESCRIPTION
  create a new import

ALIASES
  $ commercelayer imp:create
  $ commercelayer import

EXAMPLES
  $ commercelayer imports:create -t stock_items -p <stock_location-id> -i <input-file-path>

  $ cl imp:create -t skus -i <input-file-path>
```

### `commercelayer imp:delete ID`

Delete an existing import.

```sh-session
USAGE
  $ commercelayer imp:delete [ID] -o <value>

ARGUMENTS
  ID  unique id of the import

FLAGS
  -o, --organization=<value>  (required) the slug of your organization

DESCRIPTION
  delete an existing import

ALIASES
  $ commercelayer imp:delete

EXAMPLES
  $ commercelayer imports:delete <import-id>>

  $ cl imp:delete <import-id>>
```

### `commercelayer imp:details ID`

Show the details of an existing import.

```sh-session
USAGE
  $ commercelayer imp:details [ID] -o <value> [-i] [-l]

ARGUMENTS
  ID  unique id of the import

FLAGS
  -i, --inputs                show input items associated with the import
  -l, --logs                  show warning and error logs related to the import process
  -o, --organization=<value>  (required) the slug of your organization

DESCRIPTION
  show the details of an existing import

ALIASES
  $ commercelayer imp:details

EXAMPLES
  $ commercelayer imports:details <import-id>

  $ cl imp:details <import-id> -i

  $ cl imp:details <import-id> -i -l
```

### `commercelayer imp:group GROUP_ID`

List all the imports related to an import group.

```sh-session
USAGE
  $ commercelayer imp:group [GROUP_ID] -o <value>

ARGUMENTS
  GROUP_ID  unique id of the group import

FLAGS
  -o, --organization=<value>  (required) the slug of your organization

DESCRIPTION
  list all the imports related to an import group

ALIASES
  $ commercelayer imp:group

EXAMPLES
  $ commercelayer imports:group <group-id>

  $ cl imp:group <group-id>
```

### `commercelayer imp:list`

List all the created imports.

```sh-session
USAGE
  $ commercelayer imp:list [FAKE-ARG] -o <value> [-A | -l <value>] [-t
    orders|coupons|skus|sku_lists|sku_list_items|prices|stock_items|gift_cards|customers|customer_subscriptions|tax_cate
    gories] [-g <value> | ] [-s in_progress|pending|completed|interrupted] [-e] [-w]

FLAGS
  -A, --all                   show all imports instead of first 25 only
  -e, --errors                show only imports with errors
  -g, --group=<value>         the group ID associated to the import in case of multi-chunk imports
  -l, --limit=<value>         limit number of imports in output
  -o, --organization=<value>  (required) the slug of your organization
  -s, --status=<option>       the import job status
                              <options: in_progress|pending|completed|interrupted>
  -t, --type=<option>         the type of resource imported
                              <options: orders|coupons|skus|sku_lists|sku_list_items|prices|stock_items|gift_cards|custo
                              mers|customer_subscriptions|tax_categories>
  -w, --warnings              show only import with warnings

DESCRIPTION
  list all the created imports

ALIASES
  $ commercelayer imports
  $ commercelayer imp:list

EXAMPLES
  $ commercelayer imports

  $ cl imports:list -A

  $ cl imp:list
```

### `commercelayer imp:types`

Show online documentation for supported resources.

```sh-session
USAGE
  $ commercelayer imp:types

DESCRIPTION
  show online documentation for supported resources

ALIASES
  $ commercelayer imp:types

EXAMPLES
  $ commercelayer imports:types

  $ cl imp:types
```

### `commercelayer import`

Create a new import.

```sh-session
USAGE
  $ commercelayer import [FAKE-ARG] -o <value> -t
    orders|coupons|skus|sku_lists|sku_list_items|prices|stock_items|gift_cards|customers|customer_subscriptions|tax_cate
    gories [-p <value>] [-D ,|;|||TAB (-C -i <value>)] [-b | -q | ]

FLAGS
  -C, --csv                                     accept input file in CSV format
  -D, --delimiter=(,|;|||TAB)                   the delimiter character used in the CSV input file (one of ',', ';',
                                                '|', TAB)
  -b, --blind                                   execute in blind mode without showing the progress monitor
  -i, --inputs=<value>                          (required) the path of the file containing the data to import
  -o, --organization=<value>                    (required) the slug of your organization
  -p, --parent=<value>                          the id of the parent resource to be associated with imported data
  -q, --quiet                                   execute command without showing warning messages
  -t, --type=orders|coupons|skus|sku_lists|...  (required) the type of resource being imported

DESCRIPTION
  create a new import

ALIASES
  $ commercelayer imp:create
  $ commercelayer import

EXAMPLES
  $ commercelayer imports:create -t stock_items -p <stock_location-id> -i <input-file-path>

  $ cl imp:create -t skus -i <input-file-path>
```

### `commercelayer imports`

List all the created imports.

```sh-session
USAGE
  $ commercelayer imports -o <value> [-A | -l <value>] [-t
    orders|coupons|skus|sku_lists|sku_list_items|prices|stock_items|gift_cards|customers|customer_subscriptions|tax_cate
    gories] [-g <value> | ] [-s in_progress|pending|completed|interrupted] [-e] [-w]

FLAGS
  -A, --all                   show all imports instead of first 25 only
  -e, --errors                show only imports with errors
  -g, --group=<value>         the group ID associated to the import in case of multi-chunk imports
  -l, --limit=<value>         limit number of imports in output
  -o, --organization=<value>  (required) the slug of your organization
  -s, --status=<option>       the import job status
                              <options: in_progress|pending|completed|interrupted>
  -t, --type=<option>         the type of resource imported
                              <options: orders|coupons|skus|sku_lists|sku_list_items|prices|stock_items|gift_cards|custo
                              mers|customer_subscriptions|tax_categories>
  -w, --warnings              show only import with warnings

DESCRIPTION
  list all the created imports
```

_See code: [src/commands/imports/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-imports/blob/main/src/commands/imports/index.ts)_

### `commercelayer imports:create`

Create a new import.

```sh-session
USAGE
  $ commercelayer imports:create [FAKE-ARG] -o <value> -t
    orders|coupons|skus|sku_lists|sku_list_items|prices|stock_items|gift_cards|customers|customer_subscriptions|tax_cate
    gories [-p <value>] [-D ,|;|||TAB (-C -i <value>)] [-b | -q | ]

FLAGS
  -C, --csv                                     accept input file in CSV format
  -D, --delimiter=(,|;|||TAB)                   the delimiter character used in the CSV input file (one of ',', ';',
                                                '|', TAB)
  -b, --blind                                   execute in blind mode without showing the progress monitor
  -i, --inputs=<value>                          (required) the path of the file containing the data to import
  -o, --organization=<value>                    (required) the slug of your organization
  -p, --parent=<value>                          the id of the parent resource to be associated with imported data
  -q, --quiet                                   execute command without showing warning messages
  -t, --type=orders|coupons|skus|sku_lists|...  (required) the type of resource being imported

DESCRIPTION
  create a new import

ALIASES
  $ commercelayer imp:create
  $ commercelayer import

EXAMPLES
  $ commercelayer imports:create -t stock_items -p <stock_location-id> -i <input-file-path>

  $ cl imp:create -t skus -i <input-file-path>
```

_See code: [src/commands/imports/create.ts](https://github.com/commercelayer/commercelayer-cli-plugin-imports/blob/main/src/commands/imports/create.ts)_

### `commercelayer imports:delete ID`

Delete an existing import.

```sh-session
USAGE
  $ commercelayer imports:delete [ID] -o <value>

ARGUMENTS
  ID  unique id of the import

FLAGS
  -o, --organization=<value>  (required) the slug of your organization

DESCRIPTION
  delete an existing import

ALIASES
  $ commercelayer imp:delete

EXAMPLES
  $ commercelayer imports:delete <import-id>>

  $ cl imp:delete <import-id>>
```

_See code: [src/commands/imports/delete.ts](https://github.com/commercelayer/commercelayer-cli-plugin-imports/blob/main/src/commands/imports/delete.ts)_

### `commercelayer imports:details ID`

Show the details of an existing import.

```sh-session
USAGE
  $ commercelayer imports:details [ID] -o <value> [-i] [-l]

ARGUMENTS
  ID  unique id of the import

FLAGS
  -i, --inputs                show input items associated with the import
  -l, --logs                  show warning and error logs related to the import process
  -o, --organization=<value>  (required) the slug of your organization

DESCRIPTION
  show the details of an existing import

ALIASES
  $ commercelayer imp:details

EXAMPLES
  $ commercelayer imports:details <import-id>

  $ cl imp:details <import-id> -i

  $ cl imp:details <import-id> -i -l
```

_See code: [src/commands/imports/details.ts](https://github.com/commercelayer/commercelayer-cli-plugin-imports/blob/main/src/commands/imports/details.ts)_

### `commercelayer imports:group GROUP_ID`

List all the imports related to an import group.

```sh-session
USAGE
  $ commercelayer imports:group [GROUP_ID] -o <value>

ARGUMENTS
  GROUP_ID  unique id of the group import

FLAGS
  -o, --organization=<value>  (required) the slug of your organization

DESCRIPTION
  list all the imports related to an import group

ALIASES
  $ commercelayer imp:group

EXAMPLES
  $ commercelayer imports:group <group-id>

  $ cl imp:group <group-id>
```

_See code: [src/commands/imports/group.ts](https://github.com/commercelayer/commercelayer-cli-plugin-imports/blob/main/src/commands/imports/group.ts)_

### `commercelayer imports:list`

List all the created imports.

```sh-session
USAGE
  $ commercelayer imports:list [FAKE-ARG] -o <value> [-A | -l <value>] [-t
    orders|coupons|skus|sku_lists|sku_list_items|prices|stock_items|gift_cards|customers|customer_subscriptions|tax_cate
    gories] [-g <value> | ] [-s in_progress|pending|completed|interrupted] [-e] [-w]

FLAGS
  -A, --all                   show all imports instead of first 25 only
  -e, --errors                show only imports with errors
  -g, --group=<value>         the group ID associated to the import in case of multi-chunk imports
  -l, --limit=<value>         limit number of imports in output
  -o, --organization=<value>  (required) the slug of your organization
  -s, --status=<option>       the import job status
                              <options: in_progress|pending|completed|interrupted>
  -t, --type=<option>         the type of resource imported
                              <options: orders|coupons|skus|sku_lists|sku_list_items|prices|stock_items|gift_cards|custo
                              mers|customer_subscriptions|tax_categories>
  -w, --warnings              show only import with warnings

DESCRIPTION
  list all the created imports

ALIASES
  $ commercelayer imports
  $ commercelayer imp:list

EXAMPLES
  $ commercelayer imports

  $ cl imports:list -A

  $ cl imp:list
```

_See code: [src/commands/imports/list.ts](https://github.com/commercelayer/commercelayer-cli-plugin-imports/blob/main/src/commands/imports/list.ts)_

### `commercelayer imports:types`

Show online documentation for supported resources.

```sh-session
USAGE
  $ commercelayer imports:types

DESCRIPTION
  show online documentation for supported resources

ALIASES
  $ commercelayer imp:types

EXAMPLES
  $ commercelayer imports:types

  $ cl imp:types
```

_See code: [src/commands/imports/types.ts](https://github.com/commercelayer/commercelayer-cli-plugin-imports/blob/main/src/commands/imports/types.ts)_
<!-- commandsstop -->
