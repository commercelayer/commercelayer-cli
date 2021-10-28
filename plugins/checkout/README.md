@commercelayer/cli-plugin-checkout
===================================

Commerce Layer CLI Checkout plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli-plugin-checkout.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-checkout)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli-plugin-rcheckout.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-checkout)
[![License](https://img.shields.io/npm/l/@commercelayer/cli-plugin-checkout.svg)](https://github.com/commercelayer/cli-plugin-checkout/blob/master/package.json)

<!-- toc -->

* [ Usage](#-usage)
* [ Commands](#-commands)
<!-- tocstop -->
## Usage
<!-- usage -->

```sh-session
$ cl-checkout COMMAND

$ cl-checkout (-v | version | --version) to check the version of the CLI you have installed.

$ cl-checkout [COMMAND] (--help | -h) for detailed information about CLI commands.
```
<!-- usagestop -->
To install as a Commerce Layer CLI plugin run the following command:
```sh-session
$ commercelayer plugins:install checkout
```
## Commands
<!-- commands -->

* [`cl-checkout orders:actions`](#cl-checkout-ordersactions)
* [`cl-checkout orders:approve ID`](#cl-checkout-ordersapprove-id)
* [`cl-checkout orders:approve-and-capture ID`](#cl-checkout-ordersapprove-and-capture-id)
* [`cl-checkout orders:archive ID`](#cl-checkout-ordersarchive-id)
* [`cl-checkout orders:authorize ID`](#cl-checkout-ordersauthorize-id)
* [`cl-checkout orders:billing-address-same-as-shipping ID`](#cl-checkout-ordersbilling-address-same-as-shipping-id)
* [`cl-checkout orders:cancel ID`](#cl-checkout-orderscancel-id)
* [`cl-checkout orders:capture ID`](#cl-checkout-orderscapture-id)
* [`cl-checkout orders:place ID`](#cl-checkout-ordersplace-id)
* [`cl-checkout orders:refresh ID`](#cl-checkout-ordersrefresh-id)
* [`cl-checkout orders:refund ID`](#cl-checkout-ordersrefund-id)
* [`cl-checkout orders:save-billing-address-to-customer-address-book ID`](#cl-checkout-orderssave-billing-address-to-customer-address-book-id)
* [`cl-checkout orders:save-payment-source-to-customer-wallet ID`](#cl-checkout-orderssave-payment-source-to-customer-wallet-id)
* [`cl-checkout orders:save-shipping-address-to-customer-address-book ID`](#cl-checkout-orderssave-shipping-address-to-customer-address-book-id)
* [`cl-checkout orders:shipping-address-same-as-billing ID`](#cl-checkout-ordersshipping-address-same-as-billing-id)
* [`cl-checkout orders:unarchive ID`](#cl-checkout-ordersunarchive-id)
* [`cl-checkout orders:update-taxes ID`](#cl-checkout-ordersupdate-taxes-id)

### `cl-checkout orders:actions`

Show a list of all actions that can be executed on an order.

```
USAGE
  $ cl-checkout orders:actions
```

_See code: [src/commands/orders/actions.ts](https://github.com/commercelayer/commercelayer-cli-plugin-checkout/blob/v1.0.0/src/commands/orders/actions.ts)_

### `cl-checkout orders:approve ID`

Approve a placed order.

```
USAGE
  $ cl-checkout orders:approve ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/approve.ts](https://github.com/commercelayer/commercelayer-cli-plugin-checkout/blob/v1.0.0/src/commands/orders/approve.ts)_

### `cl-checkout orders:approve-and-capture ID`

Approve and capture a placed order.

```
USAGE
  $ cl-checkout orders:approve-and-capture ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/approve-and-capture.ts](https://github.com/commercelayer/commercelayer-cli-plugin-checkout/blob/v1.0.0/src/commands/orders/approve-and-capture.ts)_

### `cl-checkout orders:archive ID`

Archive the order.

```
USAGE
  $ cl-checkout orders:archive ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/archive.ts](https://github.com/commercelayer/commercelayer-cli-plugin-checkout/blob/v1.0.0/src/commands/orders/archive.ts)_

### `cl-checkout orders:authorize ID`

Authorize the order's payment source.

```
USAGE
  $ cl-checkout orders:authorize ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/authorize.ts](https://github.com/commercelayer/commercelayer-cli-plugin-checkout/blob/v1.0.0/src/commands/orders/authorize.ts)_

### `cl-checkout orders:billing-address-same-as-shipping ID`

The billing address to be cloned from the order's shipping address.

```
USAGE
  $ cl-checkout orders:billing-address-same-as-shipping ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/billing-address-same-as-shipping.ts](https://github.com/commercelayer/commercelayer-cli-plugin-checkout/blob/v1.0.0/src/commands/orders/billing-address-same-as-shipping.ts)_

### `cl-checkout orders:cancel ID`

Cancel a placed order (the order's authorization will be automatically voided).

```
USAGE
  $ cl-checkout orders:cancel ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/cancel.ts](https://github.com/commercelayer/commercelayer-cli-plugin-checkout/blob/v1.0.0/src/commands/orders/cancel.ts)_

### `cl-checkout orders:capture ID`

Capture an approved order.

```
USAGE
  $ cl-checkout orders:capture ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/capture.ts](https://github.com/commercelayer/commercelayer-cli-plugin-checkout/blob/v1.0.0/src/commands/orders/capture.ts)_

### `cl-checkout orders:place ID`

Place the order.

```
USAGE
  $ cl-checkout orders:place ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/place.ts](https://github.com/commercelayer/commercelayer-cli-plugin-checkout/blob/v1.0.0/src/commands/orders/place.ts)_

### `cl-checkout orders:refresh ID`

Refresh an order.

```
USAGE
  $ cl-checkout orders:refresh ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/refresh.ts](https://github.com/commercelayer/commercelayer-cli-plugin-checkout/blob/v1.0.0/src/commands/orders/refresh.ts)_

### `cl-checkout orders:refund ID`

Refund a captured order.

```
USAGE
  $ cl-checkout orders:refund ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/refund.ts](https://github.com/commercelayer/commercelayer-cli-plugin-checkout/blob/v1.0.0/src/commands/orders/refund.ts)_

### `cl-checkout orders:save-billing-address-to-customer-address-book ID`

The order's billing address to be saved in the customer's address book as a customer address.

```
USAGE
  $ cl-checkout orders:save-billing-address-to-customer-address-book ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/save-billing-address-to-customer-address-book.ts](https://github.com/commercelayer/commercelayer-cli-plugin-checkout/blob/v1.0.0/src/commands/orders/save-billing-address-to-customer-address-book.ts)_

### `cl-checkout orders:save-payment-source-to-customer-wallet ID`

The order's payment source to be saved in the customer's wallet as a customer payment source.

```
USAGE
  $ cl-checkout orders:save-payment-source-to-customer-wallet ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/save-payment-source-to-customer-wallet.ts](https://github.com/commercelayer/commercelayer-cli-plugin-checkout/blob/v1.0.0/src/commands/orders/save-payment-source-to-customer-wallet.ts)_

### `cl-checkout orders:save-shipping-address-to-customer-address-book ID`

The order's shipping address to be saved in the customer's address book as a customer address.

```
USAGE
  $ cl-checkout orders:save-shipping-address-to-customer-address-book ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/save-shipping-address-to-customer-address-book.ts](https://github.com/commercelayer/commercelayer-cli-plugin-checkout/blob/v1.0.0/src/commands/orders/save-shipping-address-to-customer-address-book.ts)_

### `cl-checkout orders:shipping-address-same-as-billing ID`

The shipping address to be cloned from the order's billing address.

```
USAGE
  $ cl-checkout orders:shipping-address-same-as-billing ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/shipping-address-same-as-billing.ts](https://github.com/commercelayer/commercelayer-cli-plugin-checkout/blob/v1.0.0/src/commands/orders/shipping-address-same-as-billing.ts)_

### `cl-checkout orders:unarchive ID`

Unarchive the order.

```
USAGE
  $ cl-checkout orders:unarchive ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/unarchive.ts](https://github.com/commercelayer/commercelayer-cli-plugin-checkout/blob/v1.0.0/src/commands/orders/unarchive.ts)_

### `cl-checkout orders:update-taxes ID`

Force tax calculation for this order (a tax calculator must be associated to the order's market).

```
USAGE
  $ cl-checkout orders:update-taxes ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/update-taxes.ts](https://github.com/commercelayer/commercelayer-cli-plugin-checkout/blob/v1.0.0/src/commands/orders/update-taxes.ts)_
<!-- commandsstop -->
