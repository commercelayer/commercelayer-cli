cli-plugin-imports

Commerce Layer CLI Imports plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli-plugin-imports.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-imports)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli-plugin-imports.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-imports)
[![License](https://img.shields.io/npm/l/@commercelayer/cli-plugin-imports.svg)](https://github.com/commercelayer/cli-plugin-imports/blob/master/package.json)


<!-- toc -->


<!-- tocstop -->
# Usage
<!-- usage -->

```sh-session
$ @commercelayer/cli-plugin-imports COMMAND

$ @commercelayer/cli-plugin-imports (-v | version | --version) to check the version of the CLI you have installed.

$ @commercelayer/cli-plugin-imports [COMMAND] (--help | -h) for detailed information about CLI commands.
```
<!-- usagestop -->
# Commands
<!-- commands -->

* [`@commercelayer/cli-plugin-imports imports`](#commercelayercli-plugin-imports-imports)
* [`@commercelayer/cli-plugin-imports imports:create`](#commercelayercli-plugin-imports-importscreate)
* [`@commercelayer/cli-plugin-imports imports:delete ID`](#commercelayercli-plugin-imports-importsdelete-id)
* [`@commercelayer/cli-plugin-imports imports:details ID`](#commercelayercli-plugin-imports-importsdetails-id)
* [`@commercelayer/cli-plugin-imports imports:group GROUP_ID`](#commercelayercli-plugin-imports-importsgroup-group_id)
* [`@commercelayer/cli-plugin-imports imports:list`](#commercelayercli-plugin-imports-importslist)
* [`@commercelayer/cli-plugin-imports imports:types`](#commercelayercli-plugin-imports-importstypes)

### `@commercelayer/cli-plugin-imports imports`

List all the created imports.

```
USAGE
  $ @commercelayer/cli-plugin-imports imports

OPTIONS
  -A, --all
      show all imports instead of first 25 only

  -e, --errors
      show only imports with errors

  -g, --group=group
      the group ID associated to the import in case of multi-chunk imports

  -l, --limit=limit
      limit number of imports in output

  -o, --organization=organization
      (required) the slug of your organization

  -s, --status=in_progress|pending|completed|interrupted
      the import job status

  -t, 
  --type=orders|coupons|skus|sku_lists|sku_list_items|prices|stock_items|gift_cards|customers|customer_subscriptions|tax
  _categories
      the type of resource imported

  -w, --warnings
      show only import with warnings
```

_See code: [src/commands/imports/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-imports/blob/main/src/commands/imports/index.ts)_

### `@commercelayer/cli-plugin-imports imports:create`

Create a new import.

```
USAGE
  $ @commercelayer/cli-plugin-imports imports:create

OPTIONS
  -C, --csv                                     accept input file in CSV format
  -b, --blind                                   execute in blind mode without showing the progress monitor
  -i, --inputs=inputs                           (required) the path of the file containing the data to import
  -o, --organization=organization               (required) the slug of your organization
  -p, --parent=parent                           the id of the parent resource to be associated with imported data
  -q, --quiet                                   execute command without showing warning messages
  -t, --type=orders|coupons|skus|sku_lists|...  (required) the type of resource being imported

EXAMPLES
  $ commercelayer imports:create -t stock_items -p <stock_location-id> -i <input-file-path>
  $ cl imp:create skus -c -i <input-file-path>
```

_See code: [src/commands/imports/create.ts](https://github.com/commercelayer/commercelayer-cli-plugin-imports/blob/main/src/commands/imports/create.ts)_

### `@commercelayer/cli-plugin-imports imports:delete ID`

Delete an existing import.

```
USAGE
  $ @commercelayer/cli-plugin-imports imports:delete ID

ARGUMENTS
  ID  unique id of the import

OPTIONS
  -o, --organization=organization  (required) the slug of your organization

ALIASES
  $ @commercelayer/cli-plugin-imports imp:delete

EXAMPLES
  $ commercelayer imports:delete <import-id>>
  $ cl imp:delete <import-id>>
```

_See code: [src/commands/imports/delete.ts](https://github.com/commercelayer/commercelayer-cli-plugin-imports/blob/main/src/commands/imports/delete.ts)_

### `@commercelayer/cli-plugin-imports imports:details ID`

Show the details of an existing import.

```
USAGE
  $ @commercelayer/cli-plugin-imports imports:details ID

ARGUMENTS
  ID  unique id of the import

OPTIONS
  -i, --inputs                     show input items associated with the import
  -l, --logs                       show warning and error logs related to the import process
  -o, --organization=organization  (required) the slug of your organization

ALIASES
  $ @commercelayer/cli-plugin-imports import
  $ @commercelayer/cli-plugin-imports imp:details

EXAMPLES
  $ commercelayer imports:details <import-id>
  $ cl import <import-id> -i
  $ cl imp:details <import-id> -i -l
```

_See code: [src/commands/imports/details.ts](https://github.com/commercelayer/commercelayer-cli-plugin-imports/blob/main/src/commands/imports/details.ts)_

### `@commercelayer/cli-plugin-imports imports:group GROUP_ID`

List all the imports related to an import group.

```
USAGE
  $ @commercelayer/cli-plugin-imports imports:group GROUP_ID

ARGUMENTS
  GROUP_ID  unique id of the group import

OPTIONS
  -o, --organization=organization  (required) the slug of your organization

ALIASES
  $ @commercelayer/cli-plugin-imports imp:group

EXAMPLES
  $ commercelayer imports:group <group-id>
  $ cl imports:ghroup <group-id>
```

_See code: [src/commands/imports/group.ts](https://github.com/commercelayer/commercelayer-cli-plugin-imports/blob/main/src/commands/imports/group.ts)_

### `@commercelayer/cli-plugin-imports imports:list`

List all the created imports.

```
USAGE
  $ @commercelayer/cli-plugin-imports imports:list

OPTIONS
  -A, --all
      show all imports instead of first 25 only

  -e, --errors
      show only imports with errors

  -g, --group=group
      the group ID associated to the import in case of multi-chunk imports

  -l, --limit=limit
      limit number of imports in output

  -o, --organization=organization
      (required) the slug of your organization

  -s, --status=in_progress|pending|completed|interrupted
      the import job status

  -t, 
  --type=orders|coupons|skus|sku_lists|sku_list_items|prices|stock_items|gift_cards|customers|customer_subscriptions|tax
  _categories
      the type of resource imported

  -w, --warnings
      show only import with warnings

ALIASES
  $ @commercelayer/cli-plugin-imports imp:list

EXAMPLES
  $ commercelayer imports
  $ cl imports:list -A
  $ cl imp:list
```

_See code: [src/commands/imports/list.ts](https://github.com/commercelayer/commercelayer-cli-plugin-imports/blob/main/src/commands/imports/list.ts)_

### `@commercelayer/cli-plugin-imports imports:types`

Show online documentation for supported resources.

```
USAGE
  $ @commercelayer/cli-plugin-imports imports:types
```

_See code: [src/commands/imports/types.ts](https://github.com/commercelayer/commercelayer-cli-plugin-imports/blob/main/src/commands/imports/types.ts)_
<!-- commandsstop -->
