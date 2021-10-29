@commercelayer/cli-plugin-orders
===================================

Commerce Layer CLI Orders plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli-plugin-orders.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-orders)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli-plugin-orders.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-orders)
[![License](https://img.shields.io/npm/l/@commercelayer/cli-plugin-orders.svg)](https://github.com/commercelayer/cli-plugin-orders/blob/master/package.json)

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
$ commercelayer plugins:install orders
```
## Commands
<!-- commands -->

* [`cl-orders orders ID`](#cl-orders-orders-id)
* [`cl-orders orders:actions`](#cl-orders-ordersactions)
* [`cl-orders orders:approve ID`](#cl-orders-ordersapprove-id)
* [`cl-orders orders:approve-and-capture ID`](#cl-orders-ordersapprove-and-capture-id)
* [`cl-orders orders:archive ID`](#cl-orders-ordersarchive-id)
* [`cl-orders orders:authorize ID`](#cl-orders-ordersauthorize-id)
* [`cl-orders orders:billing-address-same-as-shipping ID`](#cl-orders-ordersbilling-address-same-as-shipping-id)
* [`cl-orders orders:cancel ID`](#cl-orders-orderscancel-id)
* [`cl-orders orders:capture ID`](#cl-orders-orderscapture-id)
* [`cl-orders orders:place ID`](#cl-orders-ordersplace-id)
* [`cl-orders orders:refresh ID`](#cl-orders-ordersrefresh-id)
* [`cl-orders orders:refund ID`](#cl-orders-ordersrefund-id)
* [`cl-orders orders:save-billing-address-to-customer-address-book ID`](#cl-orders-orderssave-billing-address-to-customer-address-book-id)
* [`cl-orders orders:save-payment-source-to-customer-wallet ID`](#cl-orders-orderssave-payment-source-to-customer-wallet-id)
* [`cl-orders orders:save-shipping-address-to-customer-address-book ID`](#cl-orders-orderssave-shipping-address-to-customer-address-book-id)
* [`cl-orders orders:shipping-address-same-as-billing ID`](#cl-orders-ordersshipping-address-same-as-billing-id)
* [`cl-orders orders:unarchive ID`](#cl-orders-ordersunarchive-id)
* [`cl-orders orders:update-taxes ID`](#cl-orders-ordersupdate-taxes-id)

### `cl-orders orders ID`

Execute an action on an order.

```
USAGE
  $ cl-orders orders ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v1.1.0/src/commands/orders/index.ts)_

### `cl-orders orders:actions`

Show a list of all actions that can be executed on an order.

```
USAGE
  $ cl-orders orders:actions
```

_See code: [src/commands/orders/actions.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v1.1.0/src/commands/orders/actions.ts)_

### `cl-orders orders:approve ID`

Approve a placed order.

```
USAGE
  $ cl-orders orders:approve ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/approve.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v1.1.0/src/commands/orders/approve.ts)_

### `cl-orders orders:approve-and-capture ID`

Approve and capture a placed order.

```
USAGE
  $ cl-orders orders:approve-and-capture ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/approve-and-capture.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v1.1.0/src/commands/orders/approve-and-capture.ts)_

### `cl-orders orders:archive ID`

Archive the order.

```
USAGE
  $ cl-orders orders:archive ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/archive.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v1.1.0/src/commands/orders/archive.ts)_

### `cl-orders orders:authorize ID`

Authorize the order's payment source.

```
USAGE
  $ cl-orders orders:authorize ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/authorize.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v1.1.0/src/commands/orders/authorize.ts)_

### `cl-orders orders:billing-address-same-as-shipping ID`

The billing address to be cloned from the order's shipping address.

```
USAGE
  $ cl-orders orders:billing-address-same-as-shipping ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/billing-address-same-as-shipping.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v1.1.0/src/commands/orders/billing-address-same-as-shipping.ts)_

### `cl-orders orders:cancel ID`

Cancel a placed order (the order's authorization will be automatically voided).

```
USAGE
  $ cl-orders orders:cancel ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/cancel.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v1.1.0/src/commands/orders/cancel.ts)_

### `cl-orders orders:capture ID`

Capture an approved order.

```
USAGE
  $ cl-orders orders:capture ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/capture.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v1.1.0/src/commands/orders/capture.ts)_

### `cl-orders orders:place ID`

Place the order.

```
USAGE
  $ cl-orders orders:place ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/place.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v1.1.0/src/commands/orders/place.ts)_

### `cl-orders orders:refresh ID`

Refresh an order.

```
USAGE
  $ cl-orders orders:refresh ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/refresh.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v1.1.0/src/commands/orders/refresh.ts)_

### `cl-orders orders:refund ID`

Refund a captured order.

```
USAGE
  $ cl-orders orders:refund ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/refund.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v1.1.0/src/commands/orders/refund.ts)_

### `cl-orders orders:save-billing-address-to-customer-address-book ID`

The order's billing address to be saved in the customer's address book as a customer address.

```
USAGE
  $ cl-orders orders:save-billing-address-to-customer-address-book ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/save-billing-address-to-customer-address-book.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v1.1.0/src/commands/orders/save-billing-address-to-customer-address-book.ts)_

### `cl-orders orders:save-payment-source-to-customer-wallet ID`

The order's payment source to be saved in the customer's wallet as a customer payment source.

```
USAGE
  $ cl-orders orders:save-payment-source-to-customer-wallet ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/save-payment-source-to-customer-wallet.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v1.1.0/src/commands/orders/save-payment-source-to-customer-wallet.ts)_

### `cl-orders orders:save-shipping-address-to-customer-address-book ID`

The order's shipping address to be saved in the customer's address book as a customer address.

```
USAGE
  $ cl-orders orders:save-shipping-address-to-customer-address-book ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/save-shipping-address-to-customer-address-book.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v1.1.0/src/commands/orders/save-shipping-address-to-customer-address-book.ts)_

### `cl-orders orders:shipping-address-same-as-billing ID`

The shipping address to be cloned from the order's billing address.

```
USAGE
  $ cl-orders orders:shipping-address-same-as-billing ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/shipping-address-same-as-billing.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v1.1.0/src/commands/orders/shipping-address-same-as-billing.ts)_

### `cl-orders orders:unarchive ID`

Unarchive the order.

```
USAGE
  $ cl-orders orders:unarchive ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/unarchive.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v1.1.0/src/commands/orders/unarchive.ts)_

### `cl-orders orders:update-taxes ID`

Force tax calculation for this order (a tax calculator must be associated to the order's market).

```
USAGE
  $ cl-orders orders:update-taxes ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/update-taxes.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v1.1.0/src/commands/orders/update-taxes.ts)_
<!-- commandsstop -->
