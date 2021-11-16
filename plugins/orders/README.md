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
* [`cl-orders orders:approve ID`](#cl-orders-ordersapprove-id)
* [`cl-orders orders:approve_and_capture ID`](#cl-orders-ordersapprove_and_capture-id)
* [`cl-orders orders:archive ID`](#cl-orders-ordersarchive-id)
* [`cl-orders orders:authorization_amount_cents ID`](#cl-orders-ordersauthorization_amount_cents-id)
* [`cl-orders orders:authorize ID`](#cl-orders-ordersauthorize-id)
* [`cl-orders orders:billing_address_clone_id ID`](#cl-orders-ordersbilling_address_clone_id-id)
* [`cl-orders orders:billing_address_same_as_shipping ID`](#cl-orders-ordersbilling_address_same_as_shipping-id)
* [`cl-orders orders:cancel ID`](#cl-orders-orderscancel-id)
* [`cl-orders orders:capture ID`](#cl-orders-orderscapture-id)
* [`cl-orders orders:customer_payment_source_id ID`](#cl-orders-orderscustomer_payment_source_id-id)
* [`cl-orders orders:place ID`](#cl-orders-ordersplace-id)
* [`cl-orders orders:refresh ID`](#cl-orders-ordersrefresh-id)
* [`cl-orders orders:refund ID`](#cl-orders-ordersrefund-id)
* [`cl-orders orders:save_billing_address_to_customer_address_book ID`](#cl-orders-orderssave_billing_address_to_customer_address_book-id)
* [`cl-orders orders:save_payment_source_to_customer_wallet ID`](#cl-orders-orderssave_payment_source_to_customer_wallet-id)
* [`cl-orders orders:save_shipping_address_to_customer_address_book ID`](#cl-orders-orderssave_shipping_address_to_customer_address_book-id)
* [`cl-orders orders:shipping_address_clone_id ID`](#cl-orders-ordersshipping_address_clone_id-id)
* [`cl-orders orders:shipping_address_same_as_billing ID`](#cl-orders-ordersshipping_address_same_as_billing-id)
* [`cl-orders orders:unarchive ID`](#cl-orders-ordersunarchive-id)
* [`cl-orders orders:update_taxes ID`](#cl-orders-ordersupdate_taxes-id)

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

_See code: [src/commands/orders/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v2.0.0-beta.0/src/commands/orders/index.ts)_

### `cl-orders orders:approve ID`

Send this attribute if you want to approve a placed order..

```
USAGE
  $ cl-orders orders:approve ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/approve.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v2.0.0-beta.0/src/commands/orders/approve.ts)_

### `cl-orders orders:approve_and_capture ID`

Send this attribute if you want to approve and capture a placed order..

```
USAGE
  $ cl-orders orders:approve_and_capture ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/approve_and_capture.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v2.0.0-beta.0/src/commands/orders/approve_and_capture.ts)_

### `cl-orders orders:archive ID`

Send this attribute if you want to archive the order..

```
USAGE
  $ cl-orders orders:archive ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/archive.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v2.0.0-beta.0/src/commands/orders/archive.ts)_

### `cl-orders orders:authorization_amount_cents ID`

The authorization amount, in cents..

```
USAGE
  $ cl-orders orders:authorization_amount_cents ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/authorization_amount_cents.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v2.0.0-beta.0/src/commands/orders/authorization_amount_cents.ts)_

### `cl-orders orders:authorize ID`

Send this attribute if you want to authorize the order's payment source..

```
USAGE
  $ cl-orders orders:authorize ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/authorize.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v2.0.0-beta.0/src/commands/orders/authorize.ts)_

### `cl-orders orders:billing_address_clone_id ID`

The id of the address that you want to clone to create the order's billing address..

```
USAGE
  $ cl-orders orders:billing_address_clone_id ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
  -v, --value=value                (required) the trigger attribute value
```

_See code: [src/commands/orders/billing_address_clone_id.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v2.0.0-beta.0/src/commands/orders/billing_address_clone_id.ts)_

### `cl-orders orders:billing_address_same_as_shipping ID`

Send this attribute if you want the billing address to be cloned from the order's shipping address..

```
USAGE
  $ cl-orders orders:billing_address_same_as_shipping ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/billing_address_same_as_shipping.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v2.0.0-beta.0/src/commands/orders/billing_address_same_as_shipping.ts)_

### `cl-orders orders:cancel ID`

Send this attribute if you want to cancel a placed order. The order's authorization will be automatically voided..

```
USAGE
  $ cl-orders orders:cancel ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/cancel.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v2.0.0-beta.0/src/commands/orders/cancel.ts)_

### `cl-orders orders:capture ID`

Send this attribute if you want to capture an approved order..

```
USAGE
  $ cl-orders orders:capture ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/capture.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v2.0.0-beta.0/src/commands/orders/capture.ts)_

### `cl-orders orders:customer_payment_source_id ID`

The id of the customer payment source (i.e. credit card) that you want to use as the order's payment source..

```
USAGE
  $ cl-orders orders:customer_payment_source_id ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
  -v, --value=value                (required) the trigger attribute value
```

_See code: [src/commands/orders/customer_payment_source_id.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v2.0.0-beta.0/src/commands/orders/customer_payment_source_id.ts)_

### `cl-orders orders:place ID`

Send this attribute if you want to place the order..

```
USAGE
  $ cl-orders orders:place ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/place.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v2.0.0-beta.0/src/commands/orders/place.ts)_

### `cl-orders orders:refresh ID`

Send this attribute if you want to manually refresh the order..

```
USAGE
  $ cl-orders orders:refresh ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/refresh.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v2.0.0-beta.0/src/commands/orders/refresh.ts)_

### `cl-orders orders:refund ID`

Send this attribute if you want to refund a captured order..

```
USAGE
  $ cl-orders orders:refund ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/refund.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v2.0.0-beta.0/src/commands/orders/refund.ts)_

### `cl-orders orders:save_billing_address_to_customer_address_book ID`

Send this attribute if you want the order's billing address to be saved in the customer's address book as a customer address..

```
USAGE
  $ cl-orders orders:save_billing_address_to_customer_address_book ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/save_billing_address_to_customer_address_book.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v2.0.0-beta.0/src/commands/orders/save_billing_address_to_customer_address_book.ts)_

### `cl-orders orders:save_payment_source_to_customer_wallet ID`

Send this attribute if you want the order's payment source to be saved in the customer's wallet as a customer payment source..

```
USAGE
  $ cl-orders orders:save_payment_source_to_customer_wallet ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/save_payment_source_to_customer_wallet.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v2.0.0-beta.0/src/commands/orders/save_payment_source_to_customer_wallet.ts)_

### `cl-orders orders:save_shipping_address_to_customer_address_book ID`

Send this attribute if you want the order's shipping address to be saved in the customer's address book as a customer address..

```
USAGE
  $ cl-orders orders:save_shipping_address_to_customer_address_book ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/save_shipping_address_to_customer_address_book.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v2.0.0-beta.0/src/commands/orders/save_shipping_address_to_customer_address_book.ts)_

### `cl-orders orders:shipping_address_clone_id ID`

The id of the address that you want to clone to create the order's shipping address..

```
USAGE
  $ cl-orders orders:shipping_address_clone_id ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
  -v, --value=value                (required) the trigger attribute value
```

_See code: [src/commands/orders/shipping_address_clone_id.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v2.0.0-beta.0/src/commands/orders/shipping_address_clone_id.ts)_

### `cl-orders orders:shipping_address_same_as_billing ID`

Send this attribute if you want the shipping address to be cloned from the order's billing address..

```
USAGE
  $ cl-orders orders:shipping_address_same_as_billing ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/shipping_address_same_as_billing.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v2.0.0-beta.0/src/commands/orders/shipping_address_same_as_billing.ts)_

### `cl-orders orders:unarchive ID`

Send this attribute if you want to unarchive the order..

```
USAGE
  $ cl-orders orders:unarchive ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/unarchive.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v2.0.0-beta.0/src/commands/orders/unarchive.ts)_

### `cl-orders orders:update_taxes ID`

Send this attribute if you want to force tax calculation for this order (a tax calculator must be associated to the order's market)..

```
USAGE
  $ cl-orders orders:update_taxes ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/orders/update_taxes.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/v2.0.0-beta.0/src/commands/orders/update_taxes.ts)_
<!-- commandsstop -->
