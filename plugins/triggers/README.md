commercelayer-cli-plugin-triggers
=================================

Commerce Layer CLI Triggers plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/commercelayer-cli-plugin-triggers.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-triggers)
[![Downloads/week](https://img.shields.io/npm/dw/commercelayer-cli-plugin-triggers.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-triggers)
[![License](https://img.shields.io/npm/l/commercelayer-cli-plugin-triggers.svg)](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @commercelayer/cli-plugin-triggers
$ cl-triggers COMMAND
running command...
$ cl-triggers (-v|--version|version)
@commercelayer/cli-plugin-triggers/1.0.0-alpha.1 darwin-x64 node-v16.13.0
$ cl-triggers --help [COMMAND]
USAGE
  $ cl-triggers COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`cl-triggers adyen_payment ID`](#cl-triggers-adyen_payment-id)
* [`cl-triggers adyen_payment:authorize ID`](#cl-triggers-adyen_paymentauthorize-id)
* [`cl-triggers adyen_payment:details ID`](#cl-triggers-adyen_paymentdetails-id)
* [`cl-triggers authorization ID`](#cl-triggers-authorization-id)
* [`cl-triggers authorization:capture ID`](#cl-triggers-authorizationcapture-id)
* [`cl-triggers authorization:capture_amount_cents ID`](#cl-triggers-authorizationcapture_amount_cents-id)
* [`cl-triggers authorization:void ID`](#cl-triggers-authorizationvoid-id)
* [`cl-triggers bundle ID`](#cl-triggers-bundle-id)
* [`cl-triggers bundle:compute_compare_at_amount ID`](#cl-triggers-bundlecompute_compare_at_amount-id)
* [`cl-triggers capture ID`](#cl-triggers-capture-id)
* [`cl-triggers capture:refund ID`](#cl-triggers-capturerefund-id)
* [`cl-triggers capture:refund_amount_cents ID`](#cl-triggers-capturerefund_amount_cents-id)
* [`cl-triggers checkout_com_payment ID`](#cl-triggers-checkout_com_payment-id)
* [`cl-triggers checkout_com_payment:authorize ID`](#cl-triggers-checkout_com_paymentauthorize-id)
* [`cl-triggers checkout_com_payment:details ID`](#cl-triggers-checkout_com_paymentdetails-id)
* [`cl-triggers checkout_com_payment:refresh ID`](#cl-triggers-checkout_com_paymentrefresh-id)
* [`cl-triggers customer_password_reset ID`](#cl-triggers-customer_password_reset-id)
* [`cl-triggers customer_password_reset:reset_password_token ID`](#cl-triggers-customer_password_resetreset_password_token-id)
* [`cl-triggers gift_card ID`](#cl-triggers-gift_card-id)
* [`cl-triggers gift_card:activate ID`](#cl-triggers-gift_cardactivate-id)
* [`cl-triggers gift_card:balance_change_cents ID`](#cl-triggers-gift_cardbalance_change_cents-id)
* [`cl-triggers gift_card:deactivate ID`](#cl-triggers-gift_carddeactivate-id)
* [`cl-triggers gift_card:purchase ID`](#cl-triggers-gift_cardpurchase-id)
* [`cl-triggers in_stock_subscription ID`](#cl-triggers-in_stock_subscription-id)
* [`cl-triggers in_stock_subscription:activate ID`](#cl-triggers-in_stock_subscriptionactivate-id)
* [`cl-triggers in_stock_subscription:deactivate ID`](#cl-triggers-in_stock_subscriptiondeactivate-id)
* [`cl-triggers order ID`](#cl-triggers-order-id)
* [`cl-triggers order:approve ID`](#cl-triggers-orderapprove-id)
* [`cl-triggers order:approve_and_capture ID`](#cl-triggers-orderapprove_and_capture-id)
* [`cl-triggers order:archive ID`](#cl-triggers-orderarchive-id)
* [`cl-triggers order:authorization_amount_cents ID`](#cl-triggers-orderauthorization_amount_cents-id)
* [`cl-triggers order:authorize ID`](#cl-triggers-orderauthorize-id)
* [`cl-triggers order:billing_address_clone_id ID`](#cl-triggers-orderbilling_address_clone_id-id)
* [`cl-triggers order:billing_address_same_as_shipping ID`](#cl-triggers-orderbilling_address_same_as_shipping-id)
* [`cl-triggers order:cancel ID`](#cl-triggers-ordercancel-id)
* [`cl-triggers order:capture ID`](#cl-triggers-ordercapture-id)
* [`cl-triggers order:customer_payment_source_id ID`](#cl-triggers-ordercustomer_payment_source_id-id)
* [`cl-triggers order:place ID`](#cl-triggers-orderplace-id)
* [`cl-triggers order:refresh ID`](#cl-triggers-orderrefresh-id)
* [`cl-triggers order:refund ID`](#cl-triggers-orderrefund-id)
* [`cl-triggers order:save_billing_address_to_customer_address_book ID`](#cl-triggers-ordersave_billing_address_to_customer_address_book-id)
* [`cl-triggers order:save_payment_source_to_customer_wallet ID`](#cl-triggers-ordersave_payment_source_to_customer_wallet-id)
* [`cl-triggers order:save_shipping_address_to_customer_address_book ID`](#cl-triggers-ordersave_shipping_address_to_customer_address_book-id)
* [`cl-triggers order:shipping_address_clone_id ID`](#cl-triggers-ordershipping_address_clone_id-id)
* [`cl-triggers order:shipping_address_same_as_billing ID`](#cl-triggers-ordershipping_address_same_as_billing-id)
* [`cl-triggers order:unarchive ID`](#cl-triggers-orderunarchive-id)
* [`cl-triggers order:update_taxes ID`](#cl-triggers-orderupdate_taxes-id)
* [`cl-triggers order_subscription ID`](#cl-triggers-order_subscription-id)
* [`cl-triggers order_subscription:activate ID`](#cl-triggers-order_subscriptionactivate-id)
* [`cl-triggers order_subscription:cancel ID`](#cl-triggers-order_subscriptioncancel-id)
* [`cl-triggers order_subscription:deactivate ID`](#cl-triggers-order_subscriptiondeactivate-id)
* [`cl-triggers return ID`](#cl-triggers-return-id)
* [`cl-triggers return:approve ID`](#cl-triggers-returnapprove-id)
* [`cl-triggers return:archive ID`](#cl-triggers-returnarchive-id)
* [`cl-triggers return:cancel ID`](#cl-triggers-returncancel-id)
* [`cl-triggers return:receive ID`](#cl-triggers-returnreceive-id)
* [`cl-triggers return:reject ID`](#cl-triggers-returnreject-id)
* [`cl-triggers return:request ID`](#cl-triggers-returnrequest-id)
* [`cl-triggers return:restock ID`](#cl-triggers-returnrestock-id)
* [`cl-triggers return:ship ID`](#cl-triggers-returnship-id)
* [`cl-triggers return:unarchive ID`](#cl-triggers-returnunarchive-id)
* [`cl-triggers return_line_item ID`](#cl-triggers-return_line_item-id)
* [`cl-triggers return_line_item:restock ID`](#cl-triggers-return_line_itemrestock-id)
* [`cl-triggers shipment ID`](#cl-triggers-shipment-id)
* [`cl-triggers shipment:get_rates ID`](#cl-triggers-shipmentget_rates-id)
* [`cl-triggers shipment:on_hold ID`](#cl-triggers-shipmenton_hold-id)
* [`cl-triggers shipment:packing ID`](#cl-triggers-shipmentpacking-id)
* [`cl-triggers shipment:picking ID`](#cl-triggers-shipmentpicking-id)
* [`cl-triggers shipment:purchase ID`](#cl-triggers-shipmentpurchase-id)
* [`cl-triggers shipment:ready_to_ship ID`](#cl-triggers-shipmentready_to_ship-id)
* [`cl-triggers shipment:ship ID`](#cl-triggers-shipmentship-id)
* [`cl-triggers stock_transfer ID`](#cl-triggers-stock_transfer-id)
* [`cl-triggers stock_transfer:cancel ID`](#cl-triggers-stock_transfercancel-id)
* [`cl-triggers stock_transfer:complete ID`](#cl-triggers-stock_transfercomplete-id)
* [`cl-triggers stock_transfer:in_transit ID`](#cl-triggers-stock_transferin_transit-id)
* [`cl-triggers stock_transfer:picking ID`](#cl-triggers-stock_transferpicking-id)
* [`cl-triggers stock_transfer:upcoming ID`](#cl-triggers-stock_transferupcoming-id)
* [`cl-triggers stripe_payment ID`](#cl-triggers-stripe_payment-id)
* [`cl-triggers stripe_payment:refresh ID`](#cl-triggers-stripe_paymentrefresh-id)
* [`cl-triggers webhook ID`](#cl-triggers-webhook-id)
* [`cl-triggers webhook:reset_circuit ID`](#cl-triggers-webhookreset_circuit-id)

## `cl-triggers adyen_payment ID`

execute an action on a resource of type adyen_payments

```
USAGE
  $ cl-triggers adyen_payment ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/adyen_payment/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/adyen_payment/index.ts)_

## `cl-triggers adyen_payment:authorize ID`

Send this attribute if you want to authorize the payment.

```
USAGE
  $ cl-triggers adyen_payment:authorize ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/adyen_payment/authorize.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/adyen_payment/authorize.ts)_

## `cl-triggers adyen_payment:details ID`

Send this attribute if you want to send additional details the payment request.

```
USAGE
  $ cl-triggers adyen_payment:details ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/adyen_payment/details.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/adyen_payment/details.ts)_

## `cl-triggers authorization ID`

execute an action on a resource of type authorizations

```
USAGE
  $ cl-triggers authorization ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/authorization/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/authorization/index.ts)_

## `cl-triggers authorization:capture ID`

Send this attribute if you want to create a capture for this authorization.

```
USAGE
  $ cl-triggers authorization:capture ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/authorization/capture.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/authorization/capture.ts)_

## `cl-triggers authorization:capture_amount_cents ID`

The associated capture amount, in cents.

```
USAGE
  $ cl-triggers authorization:capture_amount_cents ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/authorization/capture_amount_cents.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/authorization/capture_amount_cents.ts)_

## `cl-triggers authorization:void ID`

Send this attribute if you want to create a void for this authorization.

```
USAGE
  $ cl-triggers authorization:void ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/authorization/void.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/authorization/void.ts)_

## `cl-triggers bundle ID`

execute an action on a resource of type bundles

```
USAGE
  $ cl-triggers bundle ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/bundle/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/bundle/index.ts)_

## `cl-triggers bundle:compute_compare_at_amount ID`

Send this attribute if you want to compute the compare_at_amount_cents as the sum of the prices of the bundle SKUs for the market.

```
USAGE
  $ cl-triggers bundle:compute_compare_at_amount ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/bundle/compute_compare_at_amount.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/bundle/compute_compare_at_amount.ts)_

## `cl-triggers capture ID`

execute an action on a resource of type captures

```
USAGE
  $ cl-triggers capture ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/capture/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/capture/index.ts)_

## `cl-triggers capture:refund ID`

Send this attribute if you want to create a refund for this capture.

```
USAGE
  $ cl-triggers capture:refund ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/capture/refund.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/capture/refund.ts)_

## `cl-triggers capture:refund_amount_cents ID`

The associated refund amount, in cents.

```
USAGE
  $ cl-triggers capture:refund_amount_cents ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/capture/refund_amount_cents.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/capture/refund_amount_cents.ts)_

## `cl-triggers checkout_com_payment ID`

execute an action on a resource of type checkout_com_payments

```
USAGE
  $ cl-triggers checkout_com_payment ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/checkout_com_payment/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/checkout_com_payment/index.ts)_

## `cl-triggers checkout_com_payment:authorize ID`

Send this attribute if you want to authorize the payment.

```
USAGE
  $ cl-triggers checkout_com_payment:authorize ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/checkout_com_payment/authorize.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/checkout_com_payment/authorize.ts)_

## `cl-triggers checkout_com_payment:details ID`

Send this attribute if you want to send additional details the payment request (i.e. upon 3DS check).

```
USAGE
  $ cl-triggers checkout_com_payment:details ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/checkout_com_payment/details.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/checkout_com_payment/details.ts)_

## `cl-triggers checkout_com_payment:refresh ID`

Send this attribute if you want to refresh all the pending transactions, can be used as webhooks fallback logic.

```
USAGE
  $ cl-triggers checkout_com_payment:refresh ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/checkout_com_payment/refresh.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/checkout_com_payment/refresh.ts)_

## `cl-triggers customer_password_reset ID`

execute an action on a resource of type customer_password_resets

```
USAGE
  $ cl-triggers customer_password_reset ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/customer_password_reset/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/customer_password_reset/index.ts)_

## `cl-triggers customer_password_reset:reset_password_token ID`

Send the 'reset_password_token' that you got on create when updating the customer password.

```
USAGE
  $ cl-triggers customer_password_reset:reset_password_token ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/customer_password_reset/reset_password_token.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/customer_password_reset/reset_password_token.ts)_

## `cl-triggers gift_card ID`

execute an action on a resource of type gift_cards

```
USAGE
  $ cl-triggers gift_card ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/gift_card/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/gift_card/index.ts)_

## `cl-triggers gift_card:activate ID`

Send this attribute if you want to activate a gift card.

```
USAGE
  $ cl-triggers gift_card:activate ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/gift_card/activate.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/gift_card/activate.ts)_

## `cl-triggers gift_card:balance_change_cents ID`

The balance change, in cents. Send a negative value to reduces the card balance by the specified amount. Send a positive value to recharge the gift card (if rechargeable).

```
USAGE
  $ cl-triggers gift_card:balance_change_cents ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/gift_card/balance_change_cents.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/gift_card/balance_change_cents.ts)_

## `cl-triggers gift_card:deactivate ID`

Send this attribute if you want to deactivate a gift card.

```
USAGE
  $ cl-triggers gift_card:deactivate ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/gift_card/deactivate.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/gift_card/deactivate.ts)_

## `cl-triggers gift_card:purchase ID`

Send this attribute if you want to confirm a draft gift card. The gift card becomes 'inactive', waiting to be activated.

```
USAGE
  $ cl-triggers gift_card:purchase ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/gift_card/purchase.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/gift_card/purchase.ts)_

## `cl-triggers in_stock_subscription ID`

execute an action on a resource of type in_stock_subscriptions

```
USAGE
  $ cl-triggers in_stock_subscription ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/in_stock_subscription/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/in_stock_subscription/index.ts)_

## `cl-triggers in_stock_subscription:activate ID`

Send this attribute if you want to activate an inactive subscription.

```
USAGE
  $ cl-triggers in_stock_subscription:activate ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/in_stock_subscription/activate.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/in_stock_subscription/activate.ts)_

## `cl-triggers in_stock_subscription:deactivate ID`

Send this attribute if you want to dactivate an active subscription.

```
USAGE
  $ cl-triggers in_stock_subscription:deactivate ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/in_stock_subscription/deactivate.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/in_stock_subscription/deactivate.ts)_

## `cl-triggers order ID`

execute an action on a resource of type orders

```
USAGE
  $ cl-triggers order ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/order/index.ts)_

## `cl-triggers order:approve ID`

Send this attribute if you want to approve a placed order.

```
USAGE
  $ cl-triggers order:approve ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/approve.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/order/approve.ts)_

## `cl-triggers order:approve_and_capture ID`

Send this attribute if you want to approve and capture a placed order.

```
USAGE
  $ cl-triggers order:approve_and_capture ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/approve_and_capture.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/order/approve_and_capture.ts)_

## `cl-triggers order:archive ID`

Send this attribute if you want to archive the order.

```
USAGE
  $ cl-triggers order:archive ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/archive.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/order/archive.ts)_

## `cl-triggers order:authorization_amount_cents ID`

The authorization amount, in cents.

```
USAGE
  $ cl-triggers order:authorization_amount_cents ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/authorization_amount_cents.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/order/authorization_amount_cents.ts)_

## `cl-triggers order:authorize ID`

Send this attribute if you want to authorize the order's payment source.

```
USAGE
  $ cl-triggers order:authorize ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/authorize.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/order/authorize.ts)_

## `cl-triggers order:billing_address_clone_id ID`

The id of the address that you want to clone to create the order's billing address.

```
USAGE
  $ cl-triggers order:billing_address_clone_id ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
  -v, --value=value                (required) the trigger attribute value
```

_See code: [src/commands/order/billing_address_clone_id.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/order/billing_address_clone_id.ts)_

## `cl-triggers order:billing_address_same_as_shipping ID`

Send this attribute if you want the billing address to be cloned from the order's shipping address.

```
USAGE
  $ cl-triggers order:billing_address_same_as_shipping ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/billing_address_same_as_shipping.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/order/billing_address_same_as_shipping.ts)_

## `cl-triggers order:cancel ID`

Send this attribute if you want to cancel a placed order. The order's authorization will be automatically voided.

```
USAGE
  $ cl-triggers order:cancel ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/cancel.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/order/cancel.ts)_

## `cl-triggers order:capture ID`

Send this attribute if you want to capture an approved order.

```
USAGE
  $ cl-triggers order:capture ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/capture.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/order/capture.ts)_

## `cl-triggers order:customer_payment_source_id ID`

The id of the customer payment source (i.e. credit card) that you want to use as the order's payment source.

```
USAGE
  $ cl-triggers order:customer_payment_source_id ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
  -v, --value=value                (required) the trigger attribute value
```

_See code: [src/commands/order/customer_payment_source_id.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/order/customer_payment_source_id.ts)_

## `cl-triggers order:place ID`

Send this attribute if you want to place the order.

```
USAGE
  $ cl-triggers order:place ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/place.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/order/place.ts)_

## `cl-triggers order:refresh ID`

Send this attribute if you want to manually refresh the order.

```
USAGE
  $ cl-triggers order:refresh ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/refresh.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/order/refresh.ts)_

## `cl-triggers order:refund ID`

Send this attribute if you want to refund a captured order.

```
USAGE
  $ cl-triggers order:refund ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/refund.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/order/refund.ts)_

## `cl-triggers order:save_billing_address_to_customer_address_book ID`

Send this attribute if you want the order's billing address to be saved in the customer's address book as a customer address.

```
USAGE
  $ cl-triggers order:save_billing_address_to_customer_address_book ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/save_billing_address_to_customer_address_book.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/order/save_billing_address_to_customer_address_book.ts)_

## `cl-triggers order:save_payment_source_to_customer_wallet ID`

Send this attribute if you want the order's payment source to be saved in the customer's wallet as a customer payment source.

```
USAGE
  $ cl-triggers order:save_payment_source_to_customer_wallet ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/save_payment_source_to_customer_wallet.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/order/save_payment_source_to_customer_wallet.ts)_

## `cl-triggers order:save_shipping_address_to_customer_address_book ID`

Send this attribute if you want the order's shipping address to be saved in the customer's address book as a customer address.

```
USAGE
  $ cl-triggers order:save_shipping_address_to_customer_address_book ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/save_shipping_address_to_customer_address_book.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/order/save_shipping_address_to_customer_address_book.ts)_

## `cl-triggers order:shipping_address_clone_id ID`

The id of the address that you want to clone to create the order's shipping address.

```
USAGE
  $ cl-triggers order:shipping_address_clone_id ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
  -v, --value=value                (required) the trigger attribute value
```

_See code: [src/commands/order/shipping_address_clone_id.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/order/shipping_address_clone_id.ts)_

## `cl-triggers order:shipping_address_same_as_billing ID`

Send this attribute if you want the shipping address to be cloned from the order's billing address.

```
USAGE
  $ cl-triggers order:shipping_address_same_as_billing ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/shipping_address_same_as_billing.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/order/shipping_address_same_as_billing.ts)_

## `cl-triggers order:unarchive ID`

Send this attribute if you want to unarchive the order.

```
USAGE
  $ cl-triggers order:unarchive ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/unarchive.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/order/unarchive.ts)_

## `cl-triggers order:update_taxes ID`

Send this attribute if you want to force tax calculation for this order (a tax calculator must be associated to the order's market).

```
USAGE
  $ cl-triggers order:update_taxes ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/update_taxes.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/order/update_taxes.ts)_

## `cl-triggers order_subscription ID`

execute an action on a resource of type order_subscriptions

```
USAGE
  $ cl-triggers order_subscription ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order_subscription/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/order_subscription/index.ts)_

## `cl-triggers order_subscription:activate ID`

Send this attribute if you want to mark this subscription as active.

```
USAGE
  $ cl-triggers order_subscription:activate ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order_subscription/activate.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/order_subscription/activate.ts)_

## `cl-triggers order_subscription:cancel ID`

Send this attribute if you want to mark this subscription as cancelled.

```
USAGE
  $ cl-triggers order_subscription:cancel ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order_subscription/cancel.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/order_subscription/cancel.ts)_

## `cl-triggers order_subscription:deactivate ID`

Send this attribute if you want to mark this subscription as inactive.

```
USAGE
  $ cl-triggers order_subscription:deactivate ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order_subscription/deactivate.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/order_subscription/deactivate.ts)_

## `cl-triggers return ID`

execute an action on a resource of type returns

```
USAGE
  $ cl-triggers return ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/return/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/return/index.ts)_

## `cl-triggers return:approve ID`

Send this attribute if you want to mark this return as approved.

```
USAGE
  $ cl-triggers return:approve ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/return/approve.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/return/approve.ts)_

## `cl-triggers return:archive ID`

Send this attribute if you want to archive the return.

```
USAGE
  $ cl-triggers return:archive ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/return/archive.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/return/archive.ts)_

## `cl-triggers return:cancel ID`

Send this attribute if you want to mark this return as cancelled.

```
USAGE
  $ cl-triggers return:cancel ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/return/cancel.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/return/cancel.ts)_

## `cl-triggers return:receive ID`

Send this attribute if you want to mark this return as received.

```
USAGE
  $ cl-triggers return:receive ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/return/receive.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/return/receive.ts)_

## `cl-triggers return:reject ID`

Send this attribute if you want to mark this return as rejected.

```
USAGE
  $ cl-triggers return:reject ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/return/reject.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/return/reject.ts)_

## `cl-triggers return:request ID`

Send this attribute if you want to activate this return.

```
USAGE
  $ cl-triggers return:request ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/return/request.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/return/request.ts)_

## `cl-triggers return:restock ID`

Send this attribute if you want to restock all of the return line items.

```
USAGE
  $ cl-triggers return:restock ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/return/restock.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/return/restock.ts)_

## `cl-triggers return:ship ID`

Send this attribute if you want to mark this return as shipped.

```
USAGE
  $ cl-triggers return:ship ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/return/ship.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/return/ship.ts)_

## `cl-triggers return:unarchive ID`

Send this attribute if you want to unarchive the return.

```
USAGE
  $ cl-triggers return:unarchive ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/return/unarchive.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/return/unarchive.ts)_

## `cl-triggers return_line_item ID`

execute an action on a resource of type return_line_items

```
USAGE
  $ cl-triggers return_line_item ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/return_line_item/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/return_line_item/index.ts)_

## `cl-triggers return_line_item:restock ID`

Send this attribute if you want to restock the line item.

```
USAGE
  $ cl-triggers return_line_item:restock ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/return_line_item/restock.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/return_line_item/restock.ts)_

## `cl-triggers shipment ID`

execute an action on a resource of type shipments

```
USAGE
  $ cl-triggers shipment ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/shipment/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/shipment/index.ts)_

## `cl-triggers shipment:get_rates ID`

Send this attribute if you want get the shipping rates from the associated carrier accounts.

```
USAGE
  $ cl-triggers shipment:get_rates ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/shipment/get_rates.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/shipment/get_rates.ts)_

## `cl-triggers shipment:on_hold ID`

Send this attribute if you want to put this shipment on hold.

```
USAGE
  $ cl-triggers shipment:on_hold ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/shipment/on_hold.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/shipment/on_hold.ts)_

## `cl-triggers shipment:packing ID`

Send this attribute if you want to start packing this shipment.

```
USAGE
  $ cl-triggers shipment:packing ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/shipment/packing.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/shipment/packing.ts)_

## `cl-triggers shipment:picking ID`

Send this attribute if you want to start picking this shipment.

```
USAGE
  $ cl-triggers shipment:picking ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/shipment/picking.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/shipment/picking.ts)_

## `cl-triggers shipment:purchase ID`

Send this attribute if you want to purchase this shipment with the selected rate.

```
USAGE
  $ cl-triggers shipment:purchase ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/shipment/purchase.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/shipment/purchase.ts)_

## `cl-triggers shipment:ready_to_ship ID`

Send this attribute if you want to mark this shipment as ready to ship.

```
USAGE
  $ cl-triggers shipment:ready_to_ship ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/shipment/ready_to_ship.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/shipment/ready_to_ship.ts)_

## `cl-triggers shipment:ship ID`

Send this attribute if you want to mark this shipment as shipped.

```
USAGE
  $ cl-triggers shipment:ship ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/shipment/ship.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/shipment/ship.ts)_

## `cl-triggers stock_transfer ID`

execute an action on a resource of type stock_transfers

```
USAGE
  $ cl-triggers stock_transfer ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/stock_transfer/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/stock_transfer/index.ts)_

## `cl-triggers stock_transfer:cancel ID`

Send this attribute if you want to cancel this stock transfer.

```
USAGE
  $ cl-triggers stock_transfer:cancel ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/stock_transfer/cancel.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/stock_transfer/cancel.ts)_

## `cl-triggers stock_transfer:complete ID`

Send this attribute if you want to complete this stock transfer.

```
USAGE
  $ cl-triggers stock_transfer:complete ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/stock_transfer/complete.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/stock_transfer/complete.ts)_

## `cl-triggers stock_transfer:in_transit ID`

Send this attribute if you want to mark this stock transfer as in transit.

```
USAGE
  $ cl-triggers stock_transfer:in_transit ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/stock_transfer/in_transit.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/stock_transfer/in_transit.ts)_

## `cl-triggers stock_transfer:picking ID`

Send this attribute if you want to start picking this stock transfer.

```
USAGE
  $ cl-triggers stock_transfer:picking ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/stock_transfer/picking.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/stock_transfer/picking.ts)_

## `cl-triggers stock_transfer:upcoming ID`

Send this attribute if you want to mark this stock transfer as upcoming.

```
USAGE
  $ cl-triggers stock_transfer:upcoming ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/stock_transfer/upcoming.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/stock_transfer/upcoming.ts)_

## `cl-triggers stripe_payment ID`

execute an action on a resource of type stripe_payments

```
USAGE
  $ cl-triggers stripe_payment ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/stripe_payment/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/stripe_payment/index.ts)_

## `cl-triggers stripe_payment:refresh ID`

Send this attribute if you want to refresh the payment status, can be used as webhooks fallback logic.

```
USAGE
  $ cl-triggers stripe_payment:refresh ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/stripe_payment/refresh.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/stripe_payment/refresh.ts)_

## `cl-triggers webhook ID`

execute an action on a resource of type webhooks

```
USAGE
  $ cl-triggers webhook ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/webhook/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/webhook/index.ts)_

## `cl-triggers webhook:reset_circuit ID`

Send this attribute if you want to reset the circuit breaker associated to this webhook to 'closed' state and zero failures count.

```
USAGE
  $ cl-triggers webhook:reset_circuit ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/webhook/reset_circuit.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/v1.0.0-alpha.1/src/commands/webhook/reset_circuit.ts)_
<!-- commandsstop -->
