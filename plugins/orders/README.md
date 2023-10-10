# @commercelayer/cli-plugin-orders

Commerce Layer CLI Orders plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli-plugin-orders.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-orders)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli-plugin-orders.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-orders)
[![License](https://img.shields.io/npm/l/@commercelayer/cli-plugin-orders.svg)](https://github.com/commercelayer/cli-plugin-orders/blob/master/package.json)

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
* [`commercelayer orders:commit_invoice ID`](#commercelayer-orderscommit_invoice-id)
* [`commercelayer orders:create_subscriptions ID`](#commercelayer-orderscreate_subscriptions-id)
* [`commercelayer orders:customer_payment_source_id ID`](#commercelayer-orderscustomer_payment_source_id-id)
* [`commercelayer orders:nullify_payment_source ID`](#commercelayer-ordersnullify_payment_source-id)
* [`commercelayer orders:place ID`](#commercelayer-ordersplace-id)
* [`commercelayer orders:refresh ID`](#commercelayer-ordersrefresh-id)
* [`commercelayer orders:refund ID`](#commercelayer-ordersrefund-id)
* [`commercelayer orders:refund_invoice ID`](#commercelayer-ordersrefund_invoice-id)
* [`commercelayer orders:save_billing_address_to_customer_address_book ID`](#commercelayer-orderssave_billing_address_to_customer_address_book-id)
* [`commercelayer orders:save_payment_source_to_customer_wallet ID`](#commercelayer-orderssave_payment_source_to_customer_wallet-id)
* [`commercelayer orders:save_shipping_address_to_customer_address_book ID`](#commercelayer-orderssave_shipping_address_to_customer_address_book-id)
* [`commercelayer orders:shipping_address_clone_id ID`](#commercelayer-ordersshipping_address_clone_id-id)
* [`commercelayer orders:shipping_address_same_as_billing ID`](#commercelayer-ordersshipping_address_same_as_billing-id)
* [`commercelayer orders:start_editing ID`](#commercelayer-ordersstart_editing-id)
* [`commercelayer orders:stop_editing ID`](#commercelayer-ordersstop_editing-id)
* [`commercelayer orders:unarchive ID`](#commercelayer-ordersunarchive-id)
* [`commercelayer orders:update_taxes ID`](#commercelayer-ordersupdate_taxes-id)
* [`commercelayer orders:validate ID`](#commercelayer-ordersvalidate-id)

### `commercelayer orders ID`

Execute an action on an order.

```sh-session
USAGE
  $ commercelayer orders ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the order

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified order
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on an order
```

_See code: [src/commands/orders/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/index.ts)_

### `commercelayer orders:approve ID`

Send this attribute if you want to approve a placed order.

```sh-session
USAGE
  $ commercelayer orders:approve ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the order

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified order
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to approve a placed order.
```

_See code: [src/commands/orders/approve.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/approve.ts)_

### `commercelayer orders:approve_and_capture ID`

Send this attribute if you want to approve and capture a placed order.

```sh-session
USAGE
  $ commercelayer orders:approve_and_capture ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the order

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified order
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to approve and capture a placed order.
```

_See code: [src/commands/orders/approve_and_capture.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/approve_and_capture.ts)_

### `commercelayer orders:archive ID`

Send this attribute if you want to archive the order.

```sh-session
USAGE
  $ commercelayer orders:archive ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the order

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified order
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to archive the order.
```

_See code: [src/commands/orders/archive.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/archive.ts)_

### `commercelayer orders:authorization_amount_cents ID`

The authorization amount, in cents.

```sh-session
USAGE
  $ commercelayer orders:authorization_amount_cents ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the order

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified order
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  The authorization amount, in cents.
```

_See code: [src/commands/orders/authorization_amount_cents.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/authorization_amount_cents.ts)_

### `commercelayer orders:authorize ID`

Send this attribute if you want to authorize the order's payment source.

```sh-session
USAGE
  $ commercelayer orders:authorize ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the order

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified order
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to authorize the order's payment source.
```

_See code: [src/commands/orders/authorize.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/authorize.ts)_

### `commercelayer orders:billing_address_clone_id ID`

The id of the address that you want to clone to create the order's billing address.

```sh-session
USAGE
  $ commercelayer orders:billing_address_clone_id ID -v <value> [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the order

FLAGS
  -j, --json           print result in JSON format
  -p, --print          print out the modified order
  -u, --unformatted    print JSON output without indentation
  -v, --value=<value>  (required) the trigger attribute value

DESCRIPTION
  The id of the address that you want to clone to create the order's billing address.
```

_See code: [src/commands/orders/billing_address_clone_id.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/billing_address_clone_id.ts)_

### `commercelayer orders:billing_address_same_as_shipping ID`

Send this attribute if you want the billing address to be cloned from the order's shipping address.

```sh-session
USAGE
  $ commercelayer orders:billing_address_same_as_shipping ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the order

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified order
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want the billing address to be cloned from the order's shipping address.
```

_See code: [src/commands/orders/billing_address_same_as_shipping.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/billing_address_same_as_shipping.ts)_

### `commercelayer orders:cancel ID`

Send this attribute if you want to cancel a placed order. The order's authorization will be automatically voided.

```sh-session
USAGE
  $ commercelayer orders:cancel ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the order

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified order
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to cancel a placed order. The order's authorization will be automatically voided.
```

_See code: [src/commands/orders/cancel.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/cancel.ts)_

### `commercelayer orders:capture ID`

Send this attribute if you want to capture an authorized order.

```sh-session
USAGE
  $ commercelayer orders:capture ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the order

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified order
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to capture an authorized order.
```

_See code: [src/commands/orders/capture.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/capture.ts)_

### `commercelayer orders:commit_invoice ID`

Send this attribute if you want commit the sales tax invoice to the associated tax calculator (currently supported by Avalara).

```sh-session
USAGE
  $ commercelayer orders:commit_invoice ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the order

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified order
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want commit the sales tax invoice to the associated tax calculator (currently supported by
  Avalara).
```

_See code: [src/commands/orders/commit_invoice.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/commit_invoice.ts)_

### `commercelayer orders:create_subscriptions ID`

Send this attribute upon/after placing the order if you want to create order subscriptions from the line items that have a frequency.

```sh-session
USAGE
  $ commercelayer orders:create_subscriptions ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the order

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified order
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute upon/after placing the order if you want to create order subscriptions from the line items that
  have a frequency.
```

_See code: [src/commands/orders/create_subscriptions.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/create_subscriptions.ts)_

### `commercelayer orders:customer_payment_source_id ID`

The id of the customer payment source (i.e. credit card) that you want to use as the order's payment source.

```sh-session
USAGE
  $ commercelayer orders:customer_payment_source_id ID -v <value> [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the order

FLAGS
  -j, --json           print result in JSON format
  -p, --print          print out the modified order
  -u, --unformatted    print JSON output without indentation
  -v, --value=<value>  (required) the trigger attribute value

DESCRIPTION
  The id of the customer payment source (i.e. credit card) that you want to use as the order's payment source.
```

_See code: [src/commands/orders/customer_payment_source_id.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/customer_payment_source_id.ts)_

### `commercelayer orders:nullify_payment_source ID`

Send this attribute if you want to nullify the payment source for this order.

```sh-session
USAGE
  $ commercelayer orders:nullify_payment_source ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the order

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified order
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to nullify the payment source for this order.
```

_See code: [src/commands/orders/nullify_payment_source.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/nullify_payment_source.ts)_

### `commercelayer orders:place ID`

Send this attribute if you want to place the order.

```sh-session
USAGE
  $ commercelayer orders:place ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the order

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified order
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to place the order.
```

_See code: [src/commands/orders/place.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/place.ts)_

### `commercelayer orders:refresh ID`

Send this attribute if you want to manually refresh the order.

```sh-session
USAGE
  $ commercelayer orders:refresh ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the order

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified order
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to manually refresh the order.
```

_See code: [src/commands/orders/refresh.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/refresh.ts)_

### `commercelayer orders:refund ID`

Send this attribute if you want to refund a captured order.

```sh-session
USAGE
  $ commercelayer orders:refund ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the order

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified order
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to refund a captured order.
```

_See code: [src/commands/orders/refund.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/refund.ts)_

### `commercelayer orders:refund_invoice ID`

Send this attribute if you want refund the sales tax invoice to the associated tax calculator (currently supported by Avalara).

```sh-session
USAGE
  $ commercelayer orders:refund_invoice ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the order

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified order
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want refund the sales tax invoice to the associated tax calculator (currently supported by
  Avalara).
```

_See code: [src/commands/orders/refund_invoice.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/refund_invoice.ts)_

### `commercelayer orders:save_billing_address_to_customer_address_book ID`

Send this attribute if you want the order's billing address to be saved in the customer's address book as a customer address.

```sh-session
USAGE
  $ commercelayer orders:save_billing_address_to_customer_address_book ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the order

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified order
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want the order's billing address to be saved in the customer's address book as a customer
  address.
```

_See code: [src/commands/orders/save_billing_address_to_customer_address_book.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/save_billing_address_to_customer_address_book.ts)_

### `commercelayer orders:save_payment_source_to_customer_wallet ID`

Send this attribute if you want the order's payment source to be saved in the customer's wallet as a customer payment source.

```sh-session
USAGE
  $ commercelayer orders:save_payment_source_to_customer_wallet ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the order

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified order
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want the order's payment source to be saved in the customer's wallet as a customer payment
  source.
```

_See code: [src/commands/orders/save_payment_source_to_customer_wallet.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/save_payment_source_to_customer_wallet.ts)_

### `commercelayer orders:save_shipping_address_to_customer_address_book ID`

Send this attribute if you want the order's shipping address to be saved in the customer's address book as a customer address.

```sh-session
USAGE
  $ commercelayer orders:save_shipping_address_to_customer_address_book ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the order

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified order
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want the order's shipping address to be saved in the customer's address book as a customer
  address.
```

_See code: [src/commands/orders/save_shipping_address_to_customer_address_book.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/save_shipping_address_to_customer_address_book.ts)_

### `commercelayer orders:shipping_address_clone_id ID`

The id of the address that you want to clone to create the order's shipping address.

```sh-session
USAGE
  $ commercelayer orders:shipping_address_clone_id ID -v <value> [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the order

FLAGS
  -j, --json           print result in JSON format
  -p, --print          print out the modified order
  -u, --unformatted    print JSON output without indentation
  -v, --value=<value>  (required) the trigger attribute value

DESCRIPTION
  The id of the address that you want to clone to create the order's shipping address.
```

_See code: [src/commands/orders/shipping_address_clone_id.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/shipping_address_clone_id.ts)_

### `commercelayer orders:shipping_address_same_as_billing ID`

Send this attribute if you want the shipping address to be cloned from the order's billing address.

```sh-session
USAGE
  $ commercelayer orders:shipping_address_same_as_billing ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the order

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified order
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want the shipping address to be cloned from the order's billing address.
```

_See code: [src/commands/orders/shipping_address_same_as_billing.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/shipping_address_same_as_billing.ts)_

### `commercelayer orders:start_editing ID`

Send this attribute if you want to edit the order after it is placed. Remember you cannot exceed the original total amount.

```sh-session
USAGE
  $ commercelayer orders:start_editing ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the order

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified order
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to edit the order after it is placed. Remember you cannot exceed the original total
  amount.
```

_See code: [src/commands/orders/start_editing.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/start_editing.ts)_

### `commercelayer orders:stop_editing ID`

Send this attribute to stop the editing for the order and return back to placed status.

```sh-session
USAGE
  $ commercelayer orders:stop_editing ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the order

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified order
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute to stop the editing for the order and return back to placed status.
```

_See code: [src/commands/orders/stop_editing.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/stop_editing.ts)_

### `commercelayer orders:unarchive ID`

Send this attribute if you want to unarchive the order.

```sh-session
USAGE
  $ commercelayer orders:unarchive ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the order

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified order
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to unarchive the order.
```

_See code: [src/commands/orders/unarchive.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/unarchive.ts)_

### `commercelayer orders:update_taxes ID`

Send this attribute if you want to force tax calculation for this order (a tax calculator must be associated to the order's market).

```sh-session
USAGE
  $ commercelayer orders:update_taxes ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the order

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified order
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to force tax calculation for this order (a tax calculator must be associated to the
  order's market).
```

_See code: [src/commands/orders/update_taxes.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/update_taxes.ts)_

### `commercelayer orders:validate ID`

Send this attribute if you want to trigger the external validation for the order.

```sh-session
USAGE
  $ commercelayer orders:validate ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the order

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified order
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to trigger the external validation for the order.
```

_See code: [src/commands/orders/validate.ts](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/src/commands/orders/validate.ts)_
<!-- commandsstop -->
