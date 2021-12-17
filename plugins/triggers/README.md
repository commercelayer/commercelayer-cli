commercelayer-cli-plugin-triggers
=================================

Commerce Layer CLI Triggers plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/commercelayer-cli-plugin-triggers.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-triggers)
[![Downloads/week](https://img.shields.io/npm/dw/commercelayer-cli-plugin-triggers.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-triggers)
[![License](https://img.shields.io/npm/l/commercelayer-cli-plugin-triggers.svg)](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/master/package.json)

<!-- toc -->


<!-- tocstop -->
# Usage
<!-- usage -->


<!-- usagestop -->
# Commands
<!-- commands -->

* [`commercelayer adyen_payment ID`](#commercelayer-adyen_payment-id)
* [`commercelayer adyen_payment:authorize ID`](#commercelayer-adyen_paymentauthorize-id)
* [`commercelayer adyen_payment:details ID`](#commercelayer-adyen_paymentdetails-id)
* [`commercelayer authorization ID`](#commercelayer-authorization-id)
* [`commercelayer authorization:capture ID`](#commercelayer-authorizationcapture-id)
* [`commercelayer authorization:capture_amount_cents ID`](#commercelayer-authorizationcapture_amount_cents-id)
* [`commercelayer authorization:void ID`](#commercelayer-authorizationvoid-id)
* [`commercelayer bundle ID`](#commercelayer-bundle-id)
* [`commercelayer bundle:compute_compare_at_amount ID`](#commercelayer-bundlecompute_compare_at_amount-id)
* [`commercelayer capture ID`](#commercelayer-capture-id)
* [`commercelayer capture:refund ID`](#commercelayer-capturerefund-id)
* [`commercelayer capture:refund_amount_cents ID`](#commercelayer-capturerefund_amount_cents-id)
* [`commercelayer checkout_com_payment ID`](#commercelayer-checkout_com_payment-id)
* [`commercelayer checkout_com_payment:authorize ID`](#commercelayer-checkout_com_paymentauthorize-id)
* [`commercelayer checkout_com_payment:details ID`](#commercelayer-checkout_com_paymentdetails-id)
* [`commercelayer checkout_com_payment:refresh ID`](#commercelayer-checkout_com_paymentrefresh-id)
* [`commercelayer customer_password_reset ID`](#commercelayer-customer_password_reset-id)
* [`commercelayer customer_password_reset:reset_password_token ID`](#commercelayer-customer_password_resetreset_password_token-id)
* [`commercelayer gift_card ID`](#commercelayer-gift_card-id)
* [`commercelayer gift_card:activate ID`](#commercelayer-gift_cardactivate-id)
* [`commercelayer gift_card:balance_change_cents ID`](#commercelayer-gift_cardbalance_change_cents-id)
* [`commercelayer gift_card:deactivate ID`](#commercelayer-gift_carddeactivate-id)
* [`commercelayer gift_card:purchase ID`](#commercelayer-gift_cardpurchase-id)
* [`commercelayer in_stock_subscription ID`](#commercelayer-in_stock_subscription-id)
* [`commercelayer in_stock_subscription:activate ID`](#commercelayer-in_stock_subscriptionactivate-id)
* [`commercelayer in_stock_subscription:deactivate ID`](#commercelayer-in_stock_subscriptiondeactivate-id)
* [`commercelayer order ID`](#commercelayer-order-id)
* [`commercelayer order:approve ID`](#commercelayer-orderapprove-id)
* [`commercelayer order:approve_and_capture ID`](#commercelayer-orderapprove_and_capture-id)
* [`commercelayer order:archive ID`](#commercelayer-orderarchive-id)
* [`commercelayer order:authorization_amount_cents ID`](#commercelayer-orderauthorization_amount_cents-id)
* [`commercelayer order:authorize ID`](#commercelayer-orderauthorize-id)
* [`commercelayer order:billing_address_clone_id ID`](#commercelayer-orderbilling_address_clone_id-id)
* [`commercelayer order:billing_address_same_as_shipping ID`](#commercelayer-orderbilling_address_same_as_shipping-id)
* [`commercelayer order:cancel ID`](#commercelayer-ordercancel-id)
* [`commercelayer order:capture ID`](#commercelayer-ordercapture-id)
* [`commercelayer order:customer_payment_source_id ID`](#commercelayer-ordercustomer_payment_source_id-id)
* [`commercelayer order:place ID`](#commercelayer-orderplace-id)
* [`commercelayer order:refresh ID`](#commercelayer-orderrefresh-id)
* [`commercelayer order:refund ID`](#commercelayer-orderrefund-id)
* [`commercelayer order:save_billing_address_to_customer_address_book ID`](#commercelayer-ordersave_billing_address_to_customer_address_book-id)
* [`commercelayer order:save_payment_source_to_customer_wallet ID`](#commercelayer-ordersave_payment_source_to_customer_wallet-id)
* [`commercelayer order:save_shipping_address_to_customer_address_book ID`](#commercelayer-ordersave_shipping_address_to_customer_address_book-id)
* [`commercelayer order:shipping_address_clone_id ID`](#commercelayer-ordershipping_address_clone_id-id)
* [`commercelayer order:shipping_address_same_as_billing ID`](#commercelayer-ordershipping_address_same_as_billing-id)
* [`commercelayer order:unarchive ID`](#commercelayer-orderunarchive-id)
* [`commercelayer order:update_taxes ID`](#commercelayer-orderupdate_taxes-id)
* [`commercelayer order_subscription ID`](#commercelayer-order_subscription-id)
* [`commercelayer order_subscription:activate ID`](#commercelayer-order_subscriptionactivate-id)
* [`commercelayer order_subscription:cancel ID`](#commercelayer-order_subscriptioncancel-id)
* [`commercelayer order_subscription:deactivate ID`](#commercelayer-order_subscriptiondeactivate-id)
* [`commercelayer return ID`](#commercelayer-return-id)
* [`commercelayer return:approve ID`](#commercelayer-returnapprove-id)
* [`commercelayer return:archive ID`](#commercelayer-returnarchive-id)
* [`commercelayer return:cancel ID`](#commercelayer-returncancel-id)
* [`commercelayer return:receive ID`](#commercelayer-returnreceive-id)
* [`commercelayer return:reject ID`](#commercelayer-returnreject-id)
* [`commercelayer return:request ID`](#commercelayer-returnrequest-id)
* [`commercelayer return:restock ID`](#commercelayer-returnrestock-id)
* [`commercelayer return:ship ID`](#commercelayer-returnship-id)
* [`commercelayer return:unarchive ID`](#commercelayer-returnunarchive-id)
* [`commercelayer return_line_item ID`](#commercelayer-return_line_item-id)
* [`commercelayer return_line_item:restock ID`](#commercelayer-return_line_itemrestock-id)
* [`commercelayer shipment ID`](#commercelayer-shipment-id)
* [`commercelayer shipment:get_rates ID`](#commercelayer-shipmentget_rates-id)
* [`commercelayer shipment:on_hold ID`](#commercelayer-shipmenton_hold-id)
* [`commercelayer shipment:packing ID`](#commercelayer-shipmentpacking-id)
* [`commercelayer shipment:picking ID`](#commercelayer-shipmentpicking-id)
* [`commercelayer shipment:purchase ID`](#commercelayer-shipmentpurchase-id)
* [`commercelayer shipment:ready_to_ship ID`](#commercelayer-shipmentready_to_ship-id)
* [`commercelayer shipment:ship ID`](#commercelayer-shipmentship-id)
* [`commercelayer stock_transfer ID`](#commercelayer-stock_transfer-id)
* [`commercelayer stock_transfer:cancel ID`](#commercelayer-stock_transfercancel-id)
* [`commercelayer stock_transfer:complete ID`](#commercelayer-stock_transfercomplete-id)
* [`commercelayer stock_transfer:in_transit ID`](#commercelayer-stock_transferin_transit-id)
* [`commercelayer stock_transfer:picking ID`](#commercelayer-stock_transferpicking-id)
* [`commercelayer stock_transfer:upcoming ID`](#commercelayer-stock_transferupcoming-id)
* [`commercelayer stripe_payment ID`](#commercelayer-stripe_payment-id)
* [`commercelayer stripe_payment:refresh ID`](#commercelayer-stripe_paymentrefresh-id)
* [`commercelayer webhook ID`](#commercelayer-webhook-id)
* [`commercelayer webhook:reset_circuit ID`](#commercelayer-webhookreset_circuit-id)

### `commercelayer adyen_payment ID`

Execute an action on a resource of type adyen_payments.

```
USAGE
  $ commercelayer adyen_payment ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/adyen_payment/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/adyen_payment/index.ts)_

### `commercelayer adyen_payment:authorize ID`

Send this attribute if you want to authorize the payment..

```
USAGE
  $ commercelayer adyen_payment:authorize ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/adyen_payment/authorize.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/adyen_payment/authorize.ts)_

### `commercelayer adyen_payment:details ID`

Send this attribute if you want to send additional details the payment request..

```
USAGE
  $ commercelayer adyen_payment:details ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/adyen_payment/details.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/adyen_payment/details.ts)_

### `commercelayer authorization ID`

Execute an action on a resource of type authorizations.

```
USAGE
  $ commercelayer authorization ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/authorization/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/authorization/index.ts)_

### `commercelayer authorization:capture ID`

Send this attribute if you want to create a capture for this authorization..

```
USAGE
  $ commercelayer authorization:capture ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/authorization/capture.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/authorization/capture.ts)_

### `commercelayer authorization:capture_amount_cents ID`

The associated capture amount, in cents..

```
USAGE
  $ commercelayer authorization:capture_amount_cents ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/authorization/capture_amount_cents.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/authorization/capture_amount_cents.ts)_

### `commercelayer authorization:void ID`

Send this attribute if you want to create a void for this authorization..

```
USAGE
  $ commercelayer authorization:void ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/authorization/void.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/authorization/void.ts)_

### `commercelayer bundle ID`

Execute an action on a resource of type bundles.

```
USAGE
  $ commercelayer bundle ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/bundle/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/bundle/index.ts)_

### `commercelayer bundle:compute_compare_at_amount ID`

Send this attribute if you want to compute the compare_at_amount_cents as the sum of the prices of the bundle SKUs for the market..

```
USAGE
  $ commercelayer bundle:compute_compare_at_amount ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/bundle/compute_compare_at_amount.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/bundle/compute_compare_at_amount.ts)_

### `commercelayer capture ID`

Execute an action on a resource of type captures.

```
USAGE
  $ commercelayer capture ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/capture/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/capture/index.ts)_

### `commercelayer capture:refund ID`

Send this attribute if you want to create a refund for this capture..

```
USAGE
  $ commercelayer capture:refund ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/capture/refund.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/capture/refund.ts)_

### `commercelayer capture:refund_amount_cents ID`

The associated refund amount, in cents..

```
USAGE
  $ commercelayer capture:refund_amount_cents ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/capture/refund_amount_cents.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/capture/refund_amount_cents.ts)_

### `commercelayer checkout_com_payment ID`

Execute an action on a resource of type checkout_com_payments.

```
USAGE
  $ commercelayer checkout_com_payment ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/checkout_com_payment/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/checkout_com_payment/index.ts)_

### `commercelayer checkout_com_payment:authorize ID`

Send this attribute if you want to authorize the payment..

```
USAGE
  $ commercelayer checkout_com_payment:authorize ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/checkout_com_payment/authorize.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/checkout_com_payment/authorize.ts)_

### `commercelayer checkout_com_payment:details ID`

Send this attribute if you want to send additional details the payment request (i.e. upon 3DS check)..

```
USAGE
  $ commercelayer checkout_com_payment:details ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/checkout_com_payment/details.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/checkout_com_payment/details.ts)_

### `commercelayer checkout_com_payment:refresh ID`

Send this attribute if you want to refresh all the pending transactions, can be used as webhooks fallback logic..

```
USAGE
  $ commercelayer checkout_com_payment:refresh ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/checkout_com_payment/refresh.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/checkout_com_payment/refresh.ts)_

### `commercelayer customer_password_reset ID`

Execute an action on a resource of type customer_password_resets.

```
USAGE
  $ commercelayer customer_password_reset ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/customer_password_reset/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/customer_password_reset/index.ts)_

### `commercelayer customer_password_reset:reset_password_token ID`

Send the 'reset_password_token' that you got on create when updating the customer password..

```
USAGE
  $ commercelayer customer_password_reset:reset_password_token ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/customer_password_reset/reset_password_token.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/customer_password_reset/reset_password_token.ts)_

### `commercelayer gift_card ID`

Execute an action on a resource of type gift_cards.

```
USAGE
  $ commercelayer gift_card ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/gift_card/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/gift_card/index.ts)_

### `commercelayer gift_card:activate ID`

Send this attribute if you want to activate a gift card..

```
USAGE
  $ commercelayer gift_card:activate ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/gift_card/activate.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/gift_card/activate.ts)_

### `commercelayer gift_card:balance_change_cents ID`

The balance change, in cents. Send a negative value to reduces the card balance by the specified amount. Send a positive value to recharge the gift card (if rechargeable)..

```
USAGE
  $ commercelayer gift_card:balance_change_cents ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/gift_card/balance_change_cents.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/gift_card/balance_change_cents.ts)_

### `commercelayer gift_card:deactivate ID`

Send this attribute if you want to deactivate a gift card..

```
USAGE
  $ commercelayer gift_card:deactivate ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/gift_card/deactivate.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/gift_card/deactivate.ts)_

### `commercelayer gift_card:purchase ID`

Send this attribute if you want to confirm a draft gift card. The gift card becomes 'inactive', waiting to be activated..

```
USAGE
  $ commercelayer gift_card:purchase ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/gift_card/purchase.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/gift_card/purchase.ts)_

### `commercelayer in_stock_subscription ID`

Execute an action on a resource of type in_stock_subscriptions.

```
USAGE
  $ commercelayer in_stock_subscription ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/in_stock_subscription/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/in_stock_subscription/index.ts)_

### `commercelayer in_stock_subscription:activate ID`

Send this attribute if you want to activate an inactive subscription..

```
USAGE
  $ commercelayer in_stock_subscription:activate ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/in_stock_subscription/activate.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/in_stock_subscription/activate.ts)_

### `commercelayer in_stock_subscription:deactivate ID`

Send this attribute if you want to dactivate an active subscription..

```
USAGE
  $ commercelayer in_stock_subscription:deactivate ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/in_stock_subscription/deactivate.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/in_stock_subscription/deactivate.ts)_

### `commercelayer order ID`

Execute an action on a resource of type orders.

```
USAGE
  $ commercelayer order ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/index.ts)_

### `commercelayer order:approve ID`

Send this attribute if you want to approve a placed order..

```
USAGE
  $ commercelayer order:approve ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/approve.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/approve.ts)_

### `commercelayer order:approve_and_capture ID`

Send this attribute if you want to approve and capture a placed order..

```
USAGE
  $ commercelayer order:approve_and_capture ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/approve_and_capture.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/approve_and_capture.ts)_

### `commercelayer order:archive ID`

Send this attribute if you want to archive the order..

```
USAGE
  $ commercelayer order:archive ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/archive.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/archive.ts)_

### `commercelayer order:authorization_amount_cents ID`

The authorization amount, in cents..

```
USAGE
  $ commercelayer order:authorization_amount_cents ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/authorization_amount_cents.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/authorization_amount_cents.ts)_

### `commercelayer order:authorize ID`

Send this attribute if you want to authorize the order's payment source..

```
USAGE
  $ commercelayer order:authorize ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/authorize.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/authorize.ts)_

### `commercelayer order:billing_address_clone_id ID`

The id of the address that you want to clone to create the order's billing address..

```
USAGE
  $ commercelayer order:billing_address_clone_id ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
  -v, --value=value                (required) the trigger attribute value
```

_See code: [src/commands/order/billing_address_clone_id.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/billing_address_clone_id.ts)_

### `commercelayer order:billing_address_same_as_shipping ID`

Send this attribute if you want the billing address to be cloned from the order's shipping address..

```
USAGE
  $ commercelayer order:billing_address_same_as_shipping ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/billing_address_same_as_shipping.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/billing_address_same_as_shipping.ts)_

### `commercelayer order:cancel ID`

Send this attribute if you want to cancel a placed order. The order's authorization will be automatically voided..

```
USAGE
  $ commercelayer order:cancel ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/cancel.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/cancel.ts)_

### `commercelayer order:capture ID`

Send this attribute if you want to capture an approved order..

```
USAGE
  $ commercelayer order:capture ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/capture.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/capture.ts)_

### `commercelayer order:customer_payment_source_id ID`

The id of the customer payment source (i.e. credit card) that you want to use as the order's payment source..

```
USAGE
  $ commercelayer order:customer_payment_source_id ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
  -v, --value=value                (required) the trigger attribute value
```

_See code: [src/commands/order/customer_payment_source_id.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/customer_payment_source_id.ts)_

### `commercelayer order:place ID`

Send this attribute if you want to place the order..

```
USAGE
  $ commercelayer order:place ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/place.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/place.ts)_

### `commercelayer order:refresh ID`

Send this attribute if you want to manually refresh the order..

```
USAGE
  $ commercelayer order:refresh ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/refresh.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/refresh.ts)_

### `commercelayer order:refund ID`

Send this attribute if you want to refund a captured order..

```
USAGE
  $ commercelayer order:refund ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/refund.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/refund.ts)_

### `commercelayer order:save_billing_address_to_customer_address_book ID`

Send this attribute if you want the order's billing address to be saved in the customer's address book as a customer address..

```
USAGE
  $ commercelayer order:save_billing_address_to_customer_address_book ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/save_billing_address_to_customer_address_book.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/save_billing_address_to_customer_address_book.ts)_

### `commercelayer order:save_payment_source_to_customer_wallet ID`

Send this attribute if you want the order's payment source to be saved in the customer's wallet as a customer payment source..

```
USAGE
  $ commercelayer order:save_payment_source_to_customer_wallet ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/save_payment_source_to_customer_wallet.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/save_payment_source_to_customer_wallet.ts)_

### `commercelayer order:save_shipping_address_to_customer_address_book ID`

Send this attribute if you want the order's shipping address to be saved in the customer's address book as a customer address..

```
USAGE
  $ commercelayer order:save_shipping_address_to_customer_address_book ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/save_shipping_address_to_customer_address_book.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/save_shipping_address_to_customer_address_book.ts)_

### `commercelayer order:shipping_address_clone_id ID`

The id of the address that you want to clone to create the order's shipping address..

```
USAGE
  $ commercelayer order:shipping_address_clone_id ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
  -v, --value=value                (required) the trigger attribute value
```

_See code: [src/commands/order/shipping_address_clone_id.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/shipping_address_clone_id.ts)_

### `commercelayer order:shipping_address_same_as_billing ID`

Send this attribute if you want the shipping address to be cloned from the order's billing address..

```
USAGE
  $ commercelayer order:shipping_address_same_as_billing ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/shipping_address_same_as_billing.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/shipping_address_same_as_billing.ts)_

### `commercelayer order:unarchive ID`

Send this attribute if you want to unarchive the order..

```
USAGE
  $ commercelayer order:unarchive ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/unarchive.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/unarchive.ts)_

### `commercelayer order:update_taxes ID`

Send this attribute if you want to force tax calculation for this order (a tax calculator must be associated to the order's market)..

```
USAGE
  $ commercelayer order:update_taxes ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order/update_taxes.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/update_taxes.ts)_

### `commercelayer order_subscription ID`

Execute an action on a resource of type order_subscriptions.

```
USAGE
  $ commercelayer order_subscription ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order_subscription/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order_subscription/index.ts)_

### `commercelayer order_subscription:activate ID`

Send this attribute if you want to mark this subscription as active..

```
USAGE
  $ commercelayer order_subscription:activate ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order_subscription/activate.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order_subscription/activate.ts)_

### `commercelayer order_subscription:cancel ID`

Send this attribute if you want to mark this subscription as cancelled..

```
USAGE
  $ commercelayer order_subscription:cancel ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order_subscription/cancel.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order_subscription/cancel.ts)_

### `commercelayer order_subscription:deactivate ID`

Send this attribute if you want to mark this subscription as inactive..

```
USAGE
  $ commercelayer order_subscription:deactivate ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/order_subscription/deactivate.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order_subscription/deactivate.ts)_

### `commercelayer return ID`

Execute an action on a resource of type returns.

```
USAGE
  $ commercelayer return ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/return/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/return/index.ts)_

### `commercelayer return:approve ID`

Send this attribute if you want to mark this return as approved..

```
USAGE
  $ commercelayer return:approve ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/return/approve.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/return/approve.ts)_

### `commercelayer return:archive ID`

Send this attribute if you want to archive the return..

```
USAGE
  $ commercelayer return:archive ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/return/archive.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/return/archive.ts)_

### `commercelayer return:cancel ID`

Send this attribute if you want to mark this return as cancelled..

```
USAGE
  $ commercelayer return:cancel ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/return/cancel.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/return/cancel.ts)_

### `commercelayer return:receive ID`

Send this attribute if you want to mark this return as received..

```
USAGE
  $ commercelayer return:receive ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/return/receive.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/return/receive.ts)_

### `commercelayer return:reject ID`

Send this attribute if you want to mark this return as rejected..

```
USAGE
  $ commercelayer return:reject ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/return/reject.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/return/reject.ts)_

### `commercelayer return:request ID`

Send this attribute if you want to activate this return..

```
USAGE
  $ commercelayer return:request ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/return/request.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/return/request.ts)_

### `commercelayer return:restock ID`

Send this attribute if you want to restock all of the return line items..

```
USAGE
  $ commercelayer return:restock ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/return/restock.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/return/restock.ts)_

### `commercelayer return:ship ID`

Send this attribute if you want to mark this return as shipped..

```
USAGE
  $ commercelayer return:ship ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/return/ship.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/return/ship.ts)_

### `commercelayer return:unarchive ID`

Send this attribute if you want to unarchive the return..

```
USAGE
  $ commercelayer return:unarchive ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/return/unarchive.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/return/unarchive.ts)_

### `commercelayer return_line_item ID`

Execute an action on a resource of type return_line_items.

```
USAGE
  $ commercelayer return_line_item ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/return_line_item/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/return_line_item/index.ts)_

### `commercelayer return_line_item:restock ID`

Send this attribute if you want to restock the line item..

```
USAGE
  $ commercelayer return_line_item:restock ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/return_line_item/restock.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/return_line_item/restock.ts)_

### `commercelayer shipment ID`

Execute an action on a resource of type shipments.

```
USAGE
  $ commercelayer shipment ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/shipment/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/shipment/index.ts)_

### `commercelayer shipment:get_rates ID`

Send this attribute if you want get the shipping rates from the associated carrier accounts..

```
USAGE
  $ commercelayer shipment:get_rates ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/shipment/get_rates.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/shipment/get_rates.ts)_

### `commercelayer shipment:on_hold ID`

Send this attribute if you want to put this shipment on hold..

```
USAGE
  $ commercelayer shipment:on_hold ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/shipment/on_hold.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/shipment/on_hold.ts)_

### `commercelayer shipment:packing ID`

Send this attribute if you want to start packing this shipment..

```
USAGE
  $ commercelayer shipment:packing ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/shipment/packing.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/shipment/packing.ts)_

### `commercelayer shipment:picking ID`

Send this attribute if you want to start picking this shipment..

```
USAGE
  $ commercelayer shipment:picking ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/shipment/picking.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/shipment/picking.ts)_

### `commercelayer shipment:purchase ID`

Send this attribute if you want to purchase this shipment with the selected rate..

```
USAGE
  $ commercelayer shipment:purchase ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/shipment/purchase.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/shipment/purchase.ts)_

### `commercelayer shipment:ready_to_ship ID`

Send this attribute if you want to mark this shipment as ready to ship..

```
USAGE
  $ commercelayer shipment:ready_to_ship ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/shipment/ready_to_ship.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/shipment/ready_to_ship.ts)_

### `commercelayer shipment:ship ID`

Send this attribute if you want to mark this shipment as shipped..

```
USAGE
  $ commercelayer shipment:ship ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/shipment/ship.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/shipment/ship.ts)_

### `commercelayer stock_transfer ID`

Execute an action on a resource of type stock_transfers.

```
USAGE
  $ commercelayer stock_transfer ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/stock_transfer/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/stock_transfer/index.ts)_

### `commercelayer stock_transfer:cancel ID`

Send this attribute if you want to cancel this stock transfer..

```
USAGE
  $ commercelayer stock_transfer:cancel ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/stock_transfer/cancel.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/stock_transfer/cancel.ts)_

### `commercelayer stock_transfer:complete ID`

Send this attribute if you want to complete this stock transfer..

```
USAGE
  $ commercelayer stock_transfer:complete ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/stock_transfer/complete.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/stock_transfer/complete.ts)_

### `commercelayer stock_transfer:in_transit ID`

Send this attribute if you want to mark this stock transfer as in transit..

```
USAGE
  $ commercelayer stock_transfer:in_transit ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/stock_transfer/in_transit.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/stock_transfer/in_transit.ts)_

### `commercelayer stock_transfer:picking ID`

Send this attribute if you want to start picking this stock transfer..

```
USAGE
  $ commercelayer stock_transfer:picking ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/stock_transfer/picking.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/stock_transfer/picking.ts)_

### `commercelayer stock_transfer:upcoming ID`

Send this attribute if you want to mark this stock transfer as upcoming..

```
USAGE
  $ commercelayer stock_transfer:upcoming ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/stock_transfer/upcoming.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/stock_transfer/upcoming.ts)_

### `commercelayer stripe_payment ID`

Execute an action on a resource of type stripe_payments.

```
USAGE
  $ commercelayer stripe_payment ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/stripe_payment/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/stripe_payment/index.ts)_

### `commercelayer stripe_payment:refresh ID`

Send this attribute if you want to refresh the payment status, can be used as webhooks fallback logic..

```
USAGE
  $ commercelayer stripe_payment:refresh ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/stripe_payment/refresh.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/stripe_payment/refresh.ts)_

### `commercelayer webhook ID`

Execute an action on a resource of type webhooks.

```
USAGE
  $ commercelayer webhook ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/webhook/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/webhook/index.ts)_

### `commercelayer webhook:reset_circuit ID`

Send this attribute if you want to reset the circuit breaker associated to this webhook to 'closed' state and zero failures count..

```
USAGE
  $ commercelayer webhook:reset_circuit ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -o, --organization=organization  (required) the slug of your organization
```

_See code: [src/commands/webhook/reset_circuit.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/webhook/reset_circuit.ts)_
<!-- commandsstop -->
