# @commercelayer/cli-plugin-links

Commerce Layer CLI Links plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli-plugin-links.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-links)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli-plugin-links.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-links)
[![License](https://img.shields.io/npm/l/@commercelayer/cli-plugin-links.svg)](https://github.com/@commercelayer/cli-plugin-links/blob/master/package.json)

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

* [`commercelayer links [ID]`](#commercelayer-links-id)
* [`commercelayer links:create`](#commercelayer-linkscreate)
* [`commercelayer links:delete ID`](#commercelayer-linksdelete-id)
* [`commercelayer links:details ID`](#commercelayer-linksdetails-id)
* [`commercelayer links:disable ID`](#commercelayer-linksdisable-id)
* [`commercelayer links:enable ID`](#commercelayer-linksenable-id)
* [`commercelayer links:list`](#commercelayer-linkslist)
* [`commercelayer links:open ID`](#commercelayer-linksopen-id)
* [`commercelayer links:resources`](#commercelayer-linksresources)
* [`commercelayer links:update ID`](#commercelayer-linksupdate-id)

### `commercelayer links [ID]`

List all the links or the details of a single link.

```sh-session
USAGE
  $ commercelayer links [ID] [-A | -l <value>] [-n <value>] [-S <value>] [-s <value>...] [-e <value>...]
    [--sort <value>...] [-L] [-H]

ARGUMENTS
  ID  unique id of the link to get a single link

FLAGS
  -A, --all                 show all links instead of first 25 only
  -H, --hide-empty          hide empty attributes
  -L, --locale              show dates in locale time zone and format
  -S, --link_scope=<value>  the scope of the link
  -e, --expires=<value>...  the link's expiration date and time
  -l, --limit=<value>       limit number of links in output
  -n, --name=<value>        the name of the link
  -s, --starts=<value>...   the link's start date and time
      --sort=<value>...     a comma separated list of fields to sort by

DESCRIPTION
  list all the links or the details of a single link

FLAG DESCRIPTIONS
  -e, --expires=<value>...  the link's expiration date and time

    Use the standard ISO format with operators [gt, gteq, eq, lt, lteq].
    A maximum of 2 parameters can be used for date filters.
    If the operator is omitted the default operator 'eq' will be used.

    If only one parameter is defined without an operator, it is interpreted as a range of values
    Examples:
    -s 2024 will be translated into -s gteq=2024-01-01T00:00:00Z lt=2025-01-01T00:00:00Z
    -s 2024-04-10 will be translated into -s gteq=2024-04-10T00:00:00Z lt=2024-04-11T00:00:00Z
    -s 2024-04-10T13:15:00 will be translated into -s gteq 2024-04-10T13:15:00Z lt=2024-04-10T13:16:00Z

  -s, --starts=<value>...  the link's start date and time

    Look at the description of flag 'expires' for details
```

_See code: [src/commands/links/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-links/blob/main/src/commands/links/index.ts)_

### `commercelayer links:create`

Create a new resource link.

```sh-session
USAGE
  $ commercelayer links:create [-t orders|skus|sku_lists] [-i <value>] [-I <value>] [-S <value>...] [-n <value>]
    [-s <value>] [-e <value>] [-D <value>] [--open]

FLAGS
  -D, --link_domain=<value>    [default: c11r.link] the domain of the link
  -I, --client_id=<value>      the client_id of the application of kind sales_channel to be used with the link
  -S, --link_scope=<value>...  the scope of the link
  -e, --expires=<value>        the link's expiration date and time
  -i, --item_id=<value>        the id of the resource for which the link is created
  -n, --name=<value>           the name associated to the the link
  -s, --starts=<value>         the link's start date and time
  -t, --item_type=<option>     the type of the resource for which the link is created
                               <options: orders|skus|sku_lists>
      --open                   open link in default browser

DESCRIPTION
  create a new resource link

ALIASES
  $ commercelayer link

EXAMPLES
  $ commercelayer links:create -t <item-type> -i <item-id> -S market:<market-id> -n <link-name> -e 2050-12-15 -I <sales_channel-client-id>

FLAG DESCRIPTIONS
  -e, --expires=<value>  the link's expiration date and time

    Use the standard ISO format:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format

  -s, --starts=<value>  the link's start date and time

    Use the standard ISO format:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format
```

_See code: [src/commands/links/create.ts](https://github.com/commercelayer/commercelayer-cli-plugin-links/blob/main/src/commands/links/create.ts)_

### `commercelayer links:delete ID`

Delete an existent resource link.

```sh-session
USAGE
  $ commercelayer links:delete ID

ARGUMENTS
  ID  the id of the link

DESCRIPTION
  delete an existent resource link

EXAMPLES
  $ commercelayer links:delete <link-id>
```

_See code: [src/commands/links/delete.ts](https://github.com/commercelayer/commercelayer-cli-plugin-links/blob/main/src/commands/links/delete.ts)_

### `commercelayer links:details ID`

Show link details.

```sh-session
USAGE
  $ commercelayer links:details ID [-H] [-L]

ARGUMENTS
  ID  the id of the link

FLAGS
  -H, --hide-empty  hide empty attributes
  -L, --locale      show dates in locale time zone and format

DESCRIPTION
  show link details

ALIASES
  $ commercelayer links:show
  $ commercelayer links:get

EXAMPLES
  $ commercelayer links:details <link-id>

  $ cl links:details <link-id> -H

  $ cl links:show <link-id>
```

_See code: [src/commands/links/details.ts](https://github.com/commercelayer/commercelayer-cli-plugin-links/blob/main/src/commands/links/details.ts)_

### `commercelayer links:disable ID`

Disable an existent enabled link.

```sh-session
USAGE
  $ commercelayer links:disable ID

ARGUMENTS
  ID  the id of the link

DESCRIPTION
  disable an existent enabled link

EXAMPLES
  $ commercelayer links:disable <link-id>
```

_See code: [src/commands/links/disable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-links/blob/main/src/commands/links/disable.ts)_

### `commercelayer links:enable ID`

Enable an existent disabled link.

```sh-session
USAGE
  $ commercelayer links:enable ID

ARGUMENTS
  ID  the id of the link

DESCRIPTION
  enable an existent disabled link

EXAMPLES
  $ commercelayer links:enable <link-id>
```

_See code: [src/commands/links/enable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-links/blob/main/src/commands/links/enable.ts)_

### `commercelayer links:list`

List all the created links.

```sh-session
USAGE
  $ commercelayer links:list [-A | -l <value>] [-n <value>] [-S <value>] [-s <value>...] [-e <value>...] [--sort
    <value>...] [-L]

FLAGS
  -A, --all                 show all links instead of first 25 only
  -L, --locale              show dates in locale time zone and format
  -S, --link_scope=<value>  the scope of the link
  -e, --expires=<value>...  the link's expiration date and time
  -l, --limit=<value>       limit number of links in output
  -n, --name=<value>        the name of the link
  -s, --starts=<value>...   the link's start date and time
      --sort=<value>...     a comma separated list of fields to sort by

DESCRIPTION
  list all the created links

EXAMPLES
  $ commercelayer links

  $ cl links:list -A

  $ cl links --status=pending

FLAG DESCRIPTIONS
  -e, --expires=<value>...  the link's expiration date and time

    Use the standard ISO format with operators [gt, gteq, eq, lt, lteq].
    A maximum of 2 parameters can be used for date filters.
    If the operator is omitted the default operator 'eq' will be used.

    If only one parameter is defined without an operator, it is interpreted as a range of values
    Examples:
    -s 2024 will be translated into -s gteq=2024-01-01T00:00:00Z lt=2025-01-01T00:00:00Z
    -s 2024-04-10 will be translated into -s gteq=2024-04-10T00:00:00Z lt=2024-04-11T00:00:00Z
    -s 2024-04-10T13:15:00 will be translated into -s gteq 2024-04-10T13:15:00Z lt=2024-04-10T13:16:00Z

  -s, --starts=<value>...  the link's start date and time

    Look at the description of flag 'expires' for details
```

_See code: [src/commands/links/list.ts](https://github.com/commercelayer/commercelayer-cli-plugin-links/blob/main/src/commands/links/list.ts)_

### `commercelayer links:open ID`

Open an existent resource link.

```sh-session
USAGE
  $ commercelayer links:open ID

ARGUMENTS
  ID  the id of the link

DESCRIPTION
  open an existent resource link

EXAMPLES
  $ commercelayer links:open <link-id>
```

_See code: [src/commands/links/open.ts](https://github.com/commercelayer/commercelayer-cli-plugin-links/blob/main/src/commands/links/open.ts)_

### `commercelayer links:resources`

Show linkable resources.

```sh-session
USAGE
  $ commercelayer links:resources [-O]

FLAGS
  -O, --open  open online documentation page

DESCRIPTION
  show linkable resources

EXAMPLES
  $ commercelayer links:resources
```

_See code: [src/commands/links/resources.ts](https://github.com/commercelayer/commercelayer-cli-plugin-links/blob/main/src/commands/links/resources.ts)_

### `commercelayer links:update ID`

Create a new resource link.

```sh-session
USAGE
  $ commercelayer links:update ID [-t orders|skus|sku_lists] [-i <value>] [-I <value>] [-S <value>...] [-n
    <value>] [-s <value>] [-e <value>] [-D <value>] [--open]

ARGUMENTS
  ID  the id of the link

FLAGS
  -D, --link_domain=<value>    [default: c11r.link] the domain of the link
  -I, --client_id=<value>      the client_id of the application of kind sales_channel to be used with the link
  -S, --link_scope=<value>...  the scope of the link
  -e, --expires=<value>        the link's expiration date and time
  -i, --item_id=<value>        the id of the resource for which the link is created
  -n, --name=<value>           the name associated to the the link
  -s, --starts=<value>         the link's start date and time
  -t, --item_type=<option>     the type of the resource for which the link is created
                               <options: orders|skus|sku_lists>
      --open                   open link in default browser

DESCRIPTION
  create a new resource link

EXAMPLES
  $ commercelayer links:update -t <item-type> -i <item-id> -S market:<market-id> -n <link-name> -e 2050-12-15 -I <sales_channel-client-id>

FLAG DESCRIPTIONS
  -e, --expires=<value>  the link's expiration date and time

    Use the standard ISO format:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format

  -s, --starts=<value>  the link's start date and time

    Use the standard ISO format:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format
```

_See code: [src/commands/links/update.ts](https://github.com/commercelayer/commercelayer-cli-plugin-links/blob/main/src/commands/links/update.ts)_
<!-- commandsstop -->
