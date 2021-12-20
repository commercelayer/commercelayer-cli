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


<!-- usagestop -->
To install as a Commerce Layer CLI plugin run the following command:
```sh-session
$ commercelayer plugins:install orders
```
## Commands
<!-- commands -->

* [`commercelayer orders ID`](#commercelayer-orders-id)
* [`commercelayer orders:approve ID`](#commercelayer-ordersapprove-id)
* [`commercelayer orders:approve_and_capture ID`](#commercelayer-ordersapprove_and_capture-id)
* [`commercelayer orders:archive ID`](#commercelayer-ordersarchive-id)
* [`commercelayer orders:authorization_amount_cents ID`](#commercelayer-ordersauthorization_amount_cents-id)
* [`commercelayer orders:authorize ID`](#commercelayer-ordersauthorize-id)
* [`commercelayer orders:billing_address_clone_id ID`](#commercelayer-ordersbilling_address_clone_id-id)
* [`commercelayer orders:billing_address_same_as_shipping ID`](#commercelayer-ordersbilling_address_same_as_shipping-id)
* [`commercelayer orders:cancel ID`](#commercelayer-orderscancel-id)
* [`commercelayer orders:capture ID`](#commercelayer-orderscapture-id)
* [`commercelayer orders:customer_payment_source_id ID`](#commercelayer-orderscustomer_payment_source_id-id)
* [`commercelayer orders:place ID`](#commercelayer-ordersplace-id)
* [`commercelayer orders:refresh ID`](#commercelayer-ordersrefresh-id)
* [`commercelayer orders:refund ID`](#commercelayer-ordersrefund-id)
* [`commercelayer orders:save_billing_address_to_customer_address_book ID`](#commercelayer-orderssave_billing_address_to_customer_address_book-id)
* [`commercelayer orders:save_payment_source_to_customer_wallet ID`](#commercelayer-orderssave_payment_source_to_customer_wallet-id)
* [`commercelayer orders:save_shipping_address_to_customer_address_book ID`](#commercelayer-orderssave_shipping_address_to_customer_address_book-id)
* [`commercelayer orders:shipping_address_clone_id ID`](#commercelayer-ordersshipping_address_clone_id-id)
* [`commercelayer orders:shipping_address_same_as_billing ID`](#commercelayer-ordersshipping_address_same_as_billing-id)
* [`commercelayer orders:unarchive ID`](#commercelayer-ordersunarchive-id)
* [`commercelayer orders:update_taxes ID`](#commercelayer-ordersupdate_taxes-id)

### `commercelayer orders ID`

Execute an action on an order.

```
USAGE
  $ commercelayer orders ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -j, --json                       print result in JSON format
  -o, --organization=organization  (required) the slug of your organization
  -p, --print                      print out the modified order
  -u, --unformatted                print JSON output without indentation
```

_See code: [src/commands/orders/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/index.ts)_

### `commercelayer orders:approve ID`

Send this attribute if you want to approve a placed order..

```
USAGE
  $ commercelayer orders:approve ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -j, --json                       print result in JSON format
  -o, --organization=organization  (required) the slug of your organization
  -p, --print                      print out the modified order
  -u, --unformatted                print JSON output without indentation
```

_See code: [src/commands/orders/approve.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/approve.ts)_

### `commercelayer orders:approve_and_capture ID`

Send this attribute if you want to approve and capture a placed order..

```
USAGE
  $ commercelayer orders:approve_and_capture ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -j, --json                       print result in JSON format
  -o, --organization=organization  (required) the slug of your organization
  -p, --print                      print out the modified order
  -u, --unformatted                print JSON output without indentation
```

_See code: [src/commands/orders/approve_and_capture.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/approve_and_capture.ts)_

### `commercelayer orders:archive ID`

Send this attribute if you want to archive the order..

```
USAGE
  $ commercelayer orders:archive ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -j, --json                       print result in JSON format
  -o, --organization=organization  (required) the slug of your organization
  -p, --print                      print out the modified order
  -u, --unformatted                print JSON output without indentation
```

_See code: [src/commands/orders/archive.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/archive.ts)_

### `commercelayer orders:authorization_amount_cents ID`

The authorization amount, in cents..

```
USAGE
  $ commercelayer orders:authorization_amount_cents ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -j, --json                       print result in JSON format
  -o, --organization=organization  (required) the slug of your organization
  -p, --print                      print out the modified order
  -u, --unformatted                print JSON output without indentation
```

_See code: [src/commands/orders/authorization_amount_cents.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/authorization_amount_cents.ts)_

### `commercelayer orders:authorize ID`

Send this attribute if you want to authorize the order's payment source..

```
USAGE
  $ commercelayer orders:authorize ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -j, --json                       print result in JSON format
  -o, --organization=organization  (required) the slug of your organization
  -p, --print                      print out the modified order
  -u, --unformatted                print JSON output without indentation
```

_See code: [src/commands/orders/authorize.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/authorize.ts)_

### `commercelayer orders:billing_address_clone_id ID`

The id of the address that you want to clone to create the order's billing address..

```
USAGE
  $ commercelayer orders:billing_address_clone_id ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -j, --json                       print result in JSON format
  -o, --organization=organization  (required) the slug of your organization
  -p, --print                      print out the modified order
  -u, --unformatted                print JSON output without indentation
  -v, --value=value                (required) the trigger attribute value
```

_See code: [src/commands/orders/billing_address_clone_id.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/billing_address_clone_id.ts)_

### `commercelayer orders:billing_address_same_as_shipping ID`

Send this attribute if you want the billing address to be cloned from the order's shipping address..

```
USAGE
  $ commercelayer orders:billing_address_same_as_shipping ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -j, --json                       print result in JSON format
  -o, --organization=organization  (required) the slug of your organization
  -p, --print                      print out the modified order
  -u, --unformatted                print JSON output without indentation
```

_See code: [src/commands/orders/billing_address_same_as_shipping.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/billing_address_same_as_shipping.ts)_

### `commercelayer orders:cancel ID`

Send this attribute if you want to cancel a placed order. The order's authorization will be automatically voided..

```
USAGE
  $ commercelayer orders:cancel ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -j, --json                       print result in JSON format
  -o, --organization=organization  (required) the slug of your organization
  -p, --print                      print out the modified order
  -u, --unformatted                print JSON output without indentation
```

_See code: [src/commands/orders/cancel.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/cancel.ts)_

### `commercelayer orders:capture ID`

Send this attribute if you want to capture an approved order..

```
USAGE
  $ commercelayer orders:capture ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -j, --json                       print result in JSON format
  -o, --organization=organization  (required) the slug of your organization
  -p, --print                      print out the modified order
  -u, --unformatted                print JSON output without indentation
```

_See code: [src/commands/orders/capture.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/capture.ts)_

### `commercelayer orders:customer_payment_source_id ID`

The id of the customer payment source (i.e. credit card) that you want to use as the order's payment source..

```
USAGE
  $ commercelayer orders:customer_payment_source_id ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -j, --json                       print result in JSON format
  -o, --organization=organization  (required) the slug of your organization
  -p, --print                      print out the modified order
  -u, --unformatted                print JSON output without indentation
  -v, --value=value                (required) the trigger attribute value
```

_See code: [src/commands/orders/customer_payment_source_id.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/customer_payment_source_id.ts)_

### `commercelayer orders:place ID`

Send this attribute if you want to place the order..

```
USAGE
  $ commercelayer orders:place ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -j, --json                       print result in JSON format
  -o, --organization=organization  (required) the slug of your organization
  -p, --print                      print out the modified order
  -u, --unformatted                print JSON output without indentation
```

_See code: [src/commands/orders/place.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/place.ts)_

### `commercelayer orders:refresh ID`

Send this attribute if you want to manually refresh the order..

```
USAGE
  $ commercelayer orders:refresh ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -j, --json                       print result in JSON format
  -o, --organization=organization  (required) the slug of your organization
  -p, --print                      print out the modified order
  -u, --unformatted                print JSON output without indentation
```

_See code: [src/commands/orders/refresh.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/refresh.ts)_

### `commercelayer orders:refund ID`

Send this attribute if you want to refund a captured order..

```
USAGE
  $ commercelayer orders:refund ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -j, --json                       print result in JSON format
  -o, --organization=organization  (required) the slug of your organization
  -p, --print                      print out the modified order
  -u, --unformatted                print JSON output without indentation
```

_See code: [src/commands/orders/refund.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/refund.ts)_

### `commercelayer orders:save_billing_address_to_customer_address_book ID`

Send this attribute if you want the order's billing address to be saved in the customer's address book as a customer address..

```
USAGE
  $ commercelayer orders:save_billing_address_to_customer_address_book ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -j, --json                       print result in JSON format
  -o, --organization=organization  (required) the slug of your organization
  -p, --print                      print out the modified order
  -u, --unformatted                print JSON output without indentation
```

_See code: [src/commands/orders/save_billing_address_to_customer_address_book.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/save_billing_address_to_customer_address_book.ts)_

### `commercelayer orders:save_payment_source_to_customer_wallet ID`

Send this attribute if you want the order's payment source to be saved in the customer's wallet as a customer payment source..

```
USAGE
  $ commercelayer orders:save_payment_source_to_customer_wallet ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -j, --json                       print result in JSON format
  -o, --organization=organization  (required) the slug of your organization
  -p, --print                      print out the modified order
  -u, --unformatted                print JSON output without indentation
```

_See code: [src/commands/orders/save_payment_source_to_customer_wallet.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/save_payment_source_to_customer_wallet.ts)_

### `commercelayer orders:save_shipping_address_to_customer_address_book ID`

Send this attribute if you want the order's shipping address to be saved in the customer's address book as a customer address..

```
USAGE
  $ commercelayer orders:save_shipping_address_to_customer_address_book ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -j, --json                       print result in JSON format
  -o, --organization=organization  (required) the slug of your organization
  -p, --print                      print out the modified order
  -u, --unformatted                print JSON output without indentation
```

_See code: [src/commands/orders/save_shipping_address_to_customer_address_book.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/save_shipping_address_to_customer_address_book.ts)_

### `commercelayer orders:shipping_address_clone_id ID`

The id of the address that you want to clone to create the order's shipping address..

```
USAGE
  $ commercelayer orders:shipping_address_clone_id ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -j, --json                       print result in JSON format
  -o, --organization=organization  (required) the slug of your organization
  -p, --print                      print out the modified order
  -u, --unformatted                print JSON output without indentation
  -v, --value=value                (required) the trigger attribute value
```

_See code: [src/commands/orders/shipping_address_clone_id.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/shipping_address_clone_id.ts)_

### `commercelayer orders:shipping_address_same_as_billing ID`

Send this attribute if you want the shipping address to be cloned from the order's billing address..

```
USAGE
  $ commercelayer orders:shipping_address_same_as_billing ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -j, --json                       print result in JSON format
  -o, --organization=organization  (required) the slug of your organization
  -p, --print                      print out the modified order
  -u, --unformatted                print JSON output without indentation
```

_See code: [src/commands/orders/shipping_address_same_as_billing.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/shipping_address_same_as_billing.ts)_

### `commercelayer orders:unarchive ID`

Send this attribute if you want to unarchive the order..

```
USAGE
  $ commercelayer orders:unarchive ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -j, --json                       print result in JSON format
  -o, --organization=organization  (required) the slug of your organization
  -p, --print                      print out the modified order
  -u, --unformatted                print JSON output without indentation
```

_See code: [src/commands/orders/unarchive.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/unarchive.ts)_

### `commercelayer orders:update_taxes ID`

Send this attribute if you want to force tax calculation for this order (a tax calculator must be associated to the order's market)..

```
USAGE
  $ commercelayer orders:update_taxes ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -j, --json                       print result in JSON format
  -o, --organization=organization  (required) the slug of your organization
  -p, --print                      print out the modified order
  -u, --unformatted                print JSON output without indentation
```

_See code: [src/commands/orders/update_taxes.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/update_taxes.ts)_
<!-- commandsstop -->
