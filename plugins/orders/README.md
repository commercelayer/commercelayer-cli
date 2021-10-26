@commercelayer/cli-plugin-resources
===================================

Commerce Layer CLI Resources plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli-plugin-resources.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-resources)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli-plugin-resources.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-resources)
[![License](https://img.shields.io/npm/l/@commercelayer/cli-plugin-resources.svg)](https://github.com/commercelayer/cli-plugin-resources/blob/master/package.json)

<!-- toc -->

* [ Usage](#-usage)
* [ Commands](#-commands)
<!-- tocstop -->
## Usage
<!-- usage -->

```sh-session
$ cl-orders COMMAND

$ cl-orders (-v | version | --version) to check the version of the CLI you have installed.

$ cl-orders [COMMAND] (--help | -h) for detailed information about CLI commands.
```
<!-- usagestop -->
To install as a Commerce Layer CLI plugin run the following command:
```sh-session
$ commercelayer plugins:install resources
```
## Commands
<!-- commands -->

* [`cl-orders orders [FILE]`](#cl-orders-orders-file)
* [`cl-orders orders:actions`](#cl-orders-ordersactions)
* [`cl-orders orders:approve ID`](#cl-orders-ordersapprove-id)
* [`cl-orders orders:capture ID`](#cl-orders-orderscapture-id)
* [`cl-orders orders:place ID`](#cl-orders-ordersplace-id)

### `cl-orders orders [FILE]`

Describe the command here.

```
USAGE
  $ cl-orders orders [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/orders/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v0.0.1/src/commands/orders/index.ts)_

### `cl-orders orders:actions`

Show a list of possible actions.

```
USAGE
  $ cl-orders orders:actions
```

_See code: [src/commands/orders/actions.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v0.0.1/src/commands/orders/actions.ts)_

### `cl-orders orders:approve ID`

Approve an order.

```
USAGE
  $ cl-orders orders:approve ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/approve.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v0.0.1/src/commands/orders/approve.ts)_

### `cl-orders orders:capture ID`

Capture an order.

```
USAGE
  $ cl-orders orders:capture ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/capture.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v0.0.1/src/commands/orders/capture.ts)_

### `cl-orders orders:place ID`

Place an order.

```
USAGE
  $ cl-orders orders:place ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/place.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v0.0.1/src/commands/orders/place.ts)_
<!-- commandsstop -->
