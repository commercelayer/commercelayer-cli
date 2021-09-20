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
$ cl-imports COMMAND

$ cl-imports (-v | version | --version) to check the version of the CLI you have installed.

$ cl-imports [COMMAND] (--help | -h) for detailed information about CLI commands.
```
<!-- usagestop -->
# Commands
<!-- commands -->

* [`cl-imports imports`](#cl-imports-imports)
* [`cl-imports imports:create`](#cl-imports-importscreate)
* [`cl-imports imports:delete ID`](#cl-imports-importsdelete-id)
* [`cl-imports imports:details ID`](#cl-imports-importsdetails-id)
* [`cl-imports imports:group [FILE]`](#cl-imports-importsgroup-file)
* [`cl-imports imports:list`](#cl-imports-importslist)

### `cl-imports imports`

List all the created imports.

```
USAGE
  $ cl-imports imports

OPTIONS
  -A, --all                                               show all imports instead of first 25 only

  -g, --group=group                                       the group ID associated to the import in case of multi-chunk
                                                          imports

  -o, --organization=organization                         (required) [default: cli-test-org] the slug of your
                                                          organization

  -s, --status=in_progress|pending|completed|interrupted  the import job status
```

_See code: [src/commands/imports/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-imports/blob/v0.0.1/src/commands/imports/index.ts)_

### `cl-imports imports:create`

Create a new import.

```
USAGE
  $ cl-imports imports:create

OPTIONS
  -b, --blind
      execute in blind mode without showing the progress monitor

  -c, --csv
      accept input file in CSV format

  -i, --inputs=inputs
      (required) the path of the file containing teh resource data to import in CSV format

  -o, --organization=organization
      (required) [default: cli-test-org] the slug of your organization

  -p, --parent=parent
      the id of the parent resource to be associated with imported data

  -t, --type=orders|coupons|skus|prices|stock_items|gift_cards|customers|customer_subscriptions|tax_categories
      (required) the type of resource being imported

  -x, --cleanup
      delete all other existing items

EXAMPLES
  $ commercelayer imports:create -r stock_items -p <stock_location-id>
  $ cl imp:create skus -c
```

_See code: [src/commands/imports/create.ts](https://github.com/commercelayer/commercelayer-cli-plugin-imports/blob/v0.0.1/src/commands/imports/create.ts)_

### `cl-imports imports:delete ID`

Delete an existing import.

```
USAGE
  $ cl-imports imports:delete ID

ARGUMENTS
  ID  unique id of the import

OPTIONS
  -o, --organization=organization  (required) [default: cli-test-org] the slug of your organization

ALIASES
  $ cl-imports imp:delete

EXAMPLES
  $ commercelayer imports:delete <import-id>>
  $ cl imp:delete <import-id>>
```

_See code: [src/commands/imports/delete.ts](https://github.com/commercelayer/commercelayer-cli-plugin-imports/blob/v0.0.1/src/commands/imports/delete.ts)_

### `cl-imports imports:details ID`

Show the details of an existing import.

```
USAGE
  $ cl-imports imports:details ID

ARGUMENTS
  ID  unique id of the import

OPTIONS
  -H, --hide-empty                 hide empty attributes
  -o, --organization=organization  (required) [default: cli-test-org] the slug of your organization

ALIASES
  $ cl-imports import
  $ cl-imports imp:details

EXAMPLES
  $ commercelayer imports:details <import-id>
  $ cl import <import-id> -H
  $ cl imp:details <import-id>
```

_See code: [src/commands/imports/details.ts](https://github.com/commercelayer/commercelayer-cli-plugin-imports/blob/v0.0.1/src/commands/imports/details.ts)_

### `cl-imports imports:group [FILE]`

Describe the command here.

```
USAGE
  $ cl-imports imports:group [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/imports/group.ts](https://github.com/commercelayer/commercelayer-cli-plugin-imports/blob/v0.0.1/src/commands/imports/group.ts)_

### `cl-imports imports:list`

List all the created imports.

```
USAGE
  $ cl-imports imports:list

OPTIONS
  -A, --all                                               show all imports instead of first 25 only

  -g, --group=group                                       the group ID associated to the import in case of multi-chunk
                                                          imports

  -o, --organization=organization                         (required) [default: cli-test-org] the slug of your
                                                          organization

  -s, --status=in_progress|pending|completed|interrupted  the import job status

ALIASES
  $ cl-imports imp:list

EXAMPLES
  $ commercelayer imports
  $ cl imports:list -A
  $ cl imp:list
```

_See code: [src/commands/imports/list.ts](https://github.com/commercelayer/commercelayer-cli-plugin-imports/blob/v0.0.1/src/commands/imports/list.ts)_
<!-- commandsstop -->
