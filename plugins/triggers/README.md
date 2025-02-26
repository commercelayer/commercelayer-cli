# commercelayer-cli-plugin-triggers

Commerce Layer CLI Triggers plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli-plugin-triggers.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-triggers)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli-plugin-triggers.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-triggers)
[![License](https://img.shields.io/npm/l/@commercelayer/cli-plugin-triggers.svg)](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/master/package.json)

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
$ commercelayer plugins:install triggers
```

## Commands
<!-- commands -->

* [`commercelayer adyen_payment ID`](#commercelayer-adyen_payment-id)
* [`commercelayer adyen_payment:authorize ID`](#commercelayer-adyen_paymentauthorize-id)
* [`commercelayer adyen_payment:details ID`](#commercelayer-adyen_paymentdetails-id)
* [`commercelayer authorization ID`](#commercelayer-authorization-id)
* [`commercelayer authorization:cancel ID`](#commercelayer-authorizationcancel-id)
* [`commercelayer authorization:capture ID`](#commercelayer-authorizationcapture-id)
* [`commercelayer authorization:capture_amount_cents ID`](#commercelayer-authorizationcapture_amount_cents-id)
* [`commercelayer authorization:forward ID`](#commercelayer-authorizationforward-id)
* [`commercelayer authorization:void ID`](#commercelayer-authorizationvoid-id)
* [`commercelayer axerve_payment ID`](#commercelayer-axerve_payment-id)
* [`commercelayer axerve_payment:update ID`](#commercelayer-axerve_paymentupdate-id)
* [`commercelayer bundle ID`](#commercelayer-bundle-id)
* [`commercelayer bundle:compute_compare_at_amount ID`](#commercelayer-bundlecompute_compare_at_amount-id)
* [`commercelayer bundle:compute_price_amount ID`](#commercelayer-bundlecompute_price_amount-id)
* [`commercelayer buy_x_pay_y_promotion ID`](#commercelayer-buy_x_pay_y_promotion-id)
* [`commercelayer buy_x_pay_y_promotion:disable ID`](#commercelayer-buy_x_pay_y_promotiondisable-id)
* [`commercelayer buy_x_pay_y_promotion:enable ID`](#commercelayer-buy_x_pay_y_promotionenable-id)
* [`commercelayer capture ID`](#commercelayer-capture-id)
* [`commercelayer capture:cancel ID`](#commercelayer-capturecancel-id)
* [`commercelayer capture:forward ID`](#commercelayer-captureforward-id)
* [`commercelayer capture:refund ID`](#commercelayer-capturerefund-id)
* [`commercelayer capture:refund_amount_cents ID`](#commercelayer-capturerefund_amount_cents-id)
* [`commercelayer checkout_com_payment ID`](#commercelayer-checkout_com_payment-id)
* [`commercelayer checkout_com_payment:details ID`](#commercelayer-checkout_com_paymentdetails-id)
* [`commercelayer checkout_com_payment:refresh ID`](#commercelayer-checkout_com_paymentrefresh-id)
* [`commercelayer cleanup ID`](#commercelayer-cleanup-id)
* [`commercelayer cleanup:interrupt ID`](#commercelayer-cleanupinterrupt-id)
* [`commercelayer customer_password_reset ID`](#commercelayer-customer_password_reset-id)
* [`commercelayer customer_password_reset:reset_password_token ID`](#commercelayer-customer_password_resetreset_password_token-id)
* [`commercelayer easypost_pickup ID`](#commercelayer-easypost_pickup-id)
* [`commercelayer easypost_pickup:purchase ID`](#commercelayer-easypost_pickuppurchase-id)
* [`commercelayer event ID`](#commercelayer-event-id)
* [`commercelayer event:trigger ID`](#commercelayer-eventtrigger-id)
* [`commercelayer export ID`](#commercelayer-export-id)
* [`commercelayer export:interrupt ID`](#commercelayer-exportinterrupt-id)
* [`commercelayer external_gateway ID`](#commercelayer-external_gateway-id)
* [`commercelayer external_gateway:reset_circuit ID`](#commercelayer-external_gatewayreset_circuit-id)
* [`commercelayer external_promotion ID`](#commercelayer-external_promotion-id)
* [`commercelayer external_promotion:disable ID`](#commercelayer-external_promotiondisable-id)
* [`commercelayer external_promotion:enable ID`](#commercelayer-external_promotionenable-id)
* [`commercelayer external_promotion:reset_circuit ID`](#commercelayer-external_promotionreset_circuit-id)
* [`commercelayer external_tax_calculator ID`](#commercelayer-external_tax_calculator-id)
* [`commercelayer external_tax_calculator:reset_circuit ID`](#commercelayer-external_tax_calculatorreset_circuit-id)
* [`commercelayer fixed_amount_promotion ID`](#commercelayer-fixed_amount_promotion-id)
* [`commercelayer fixed_amount_promotion:disable ID`](#commercelayer-fixed_amount_promotiondisable-id)
* [`commercelayer fixed_amount_promotion:enable ID`](#commercelayer-fixed_amount_promotionenable-id)
* [`commercelayer fixed_price_promotion ID`](#commercelayer-fixed_price_promotion-id)
* [`commercelayer fixed_price_promotion:disable ID`](#commercelayer-fixed_price_promotiondisable-id)
* [`commercelayer fixed_price_promotion:enable ID`](#commercelayer-fixed_price_promotionenable-id)
* [`commercelayer flex_promotion ID`](#commercelayer-flex_promotion-id)
* [`commercelayer flex_promotion:disable ID`](#commercelayer-flex_promotiondisable-id)
* [`commercelayer flex_promotion:enable ID`](#commercelayer-flex_promotionenable-id)
* [`commercelayer free_gift_promotion ID`](#commercelayer-free_gift_promotion-id)
* [`commercelayer free_gift_promotion:disable ID`](#commercelayer-free_gift_promotiondisable-id)
* [`commercelayer free_gift_promotion:enable ID`](#commercelayer-free_gift_promotionenable-id)
* [`commercelayer free_shipping_promotion ID`](#commercelayer-free_shipping_promotion-id)
* [`commercelayer free_shipping_promotion:disable ID`](#commercelayer-free_shipping_promotiondisable-id)
* [`commercelayer free_shipping_promotion:enable ID`](#commercelayer-free_shipping_promotionenable-id)
* [`commercelayer gift_card ID`](#commercelayer-gift_card-id)
* [`commercelayer gift_card:activate ID`](#commercelayer-gift_cardactivate-id)
* [`commercelayer gift_card:balance_change_cents ID`](#commercelayer-gift_cardbalance_change_cents-id)
* [`commercelayer gift_card:deactivate ID`](#commercelayer-gift_carddeactivate-id)
* [`commercelayer gift_card:purchase ID`](#commercelayer-gift_cardpurchase-id)
* [`commercelayer import ID`](#commercelayer-import-id)
* [`commercelayer import:interrupt ID`](#commercelayer-importinterrupt-id)
* [`commercelayer in_stock_subscription ID`](#commercelayer-in_stock_subscription-id)
* [`commercelayer in_stock_subscription:activate ID`](#commercelayer-in_stock_subscriptionactivate-id)
* [`commercelayer in_stock_subscription:deactivate ID`](#commercelayer-in_stock_subscriptiondeactivate-id)
* [`commercelayer klarna_payment ID`](#commercelayer-klarna_payment-id)
* [`commercelayer klarna_payment:update ID`](#commercelayer-klarna_paymentupdate-id)
* [`commercelayer line_item ID`](#commercelayer-line_item-id)
* [`commercelayer line_item:external_price ID`](#commercelayer-line_itemexternal_price-id)
* [`commercelayer line_item:reserve_stock ID`](#commercelayer-line_itemreserve_stock-id)
* [`commercelayer line_item:reset_circuit ID`](#commercelayer-line_itemreset_circuit-id)
* [`commercelayer link ID`](#commercelayer-link-id)
* [`commercelayer link:disable ID`](#commercelayer-linkdisable-id)
* [`commercelayer link:enable ID`](#commercelayer-linkenable-id)
* [`commercelayer market ID`](#commercelayer-market-id)
* [`commercelayer market:disable ID`](#commercelayer-marketdisable-id)
* [`commercelayer market:enable ID`](#commercelayer-marketenable-id)
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
* [`commercelayer order:commit_invoice ID`](#commercelayer-ordercommit_invoice-id)
* [`commercelayer order:create_subscriptions ID`](#commercelayer-ordercreate_subscriptions-id)
* [`commercelayer order:customer_payment_source_id ID`](#commercelayer-ordercustomer_payment_source_id-id)
* [`commercelayer order:fix_payment_source ID`](#commercelayer-orderfix_payment_source-id)
* [`commercelayer order:fulfill ID`](#commercelayer-orderfulfill-id)
* [`commercelayer order:nullify_payment_source ID`](#commercelayer-ordernullify_payment_source-id)
* [`commercelayer order:pending ID`](#commercelayer-orderpending-id)
* [`commercelayer order:place ID`](#commercelayer-orderplace-id)
* [`commercelayer order:refresh ID`](#commercelayer-orderrefresh-id)
* [`commercelayer order:refund ID`](#commercelayer-orderrefund-id)
* [`commercelayer order:refund_invoice ID`](#commercelayer-orderrefund_invoice-id)
* [`commercelayer order:reset_circuit ID`](#commercelayer-orderreset_circuit-id)
* [`commercelayer order:save_billing_address_to_customer_address_book ID`](#commercelayer-ordersave_billing_address_to_customer_address_book-id)
* [`commercelayer order:save_payment_source_to_customer_wallet ID`](#commercelayer-ordersave_payment_source_to_customer_wallet-id)
* [`commercelayer order:save_shipping_address_to_customer_address_book ID`](#commercelayer-ordersave_shipping_address_to_customer_address_book-id)
* [`commercelayer order:shipping_address_clone_id ID`](#commercelayer-ordershipping_address_clone_id-id)
* [`commercelayer order:shipping_address_same_as_billing ID`](#commercelayer-ordershipping_address_same_as_billing-id)
* [`commercelayer order:start_editing ID`](#commercelayer-orderstart_editing-id)
* [`commercelayer order:stop_editing ID`](#commercelayer-orderstop_editing-id)
* [`commercelayer order:unarchive ID`](#commercelayer-orderunarchive-id)
* [`commercelayer order:update_taxes ID`](#commercelayer-orderupdate_taxes-id)
* [`commercelayer order:validate ID`](#commercelayer-ordervalidate-id)
* [`commercelayer order_subscription ID`](#commercelayer-order_subscription-id)
* [`commercelayer order_subscription:activate ID`](#commercelayer-order_subscriptionactivate-id)
* [`commercelayer order_subscription:cancel ID`](#commercelayer-order_subscriptioncancel-id)
* [`commercelayer order_subscription:convert ID`](#commercelayer-order_subscriptionconvert-id)
* [`commercelayer order_subscription:deactivate ID`](#commercelayer-order_subscriptiondeactivate-id)
* [`commercelayer payment_method ID`](#commercelayer-payment_method-id)
* [`commercelayer payment_method:disable ID`](#commercelayer-payment_methoddisable-id)
* [`commercelayer payment_method:enable ID`](#commercelayer-payment_methodenable-id)
* [`commercelayer percentage_discount_promotion ID`](#commercelayer-percentage_discount_promotion-id)
* [`commercelayer percentage_discount_promotion:disable ID`](#commercelayer-percentage_discount_promotiondisable-id)
* [`commercelayer percentage_discount_promotion:enable ID`](#commercelayer-percentage_discount_promotionenable-id)
* [`commercelayer price_list_scheduler ID`](#commercelayer-price_list_scheduler-id)
* [`commercelayer price_list_scheduler:disable ID`](#commercelayer-price_list_schedulerdisable-id)
* [`commercelayer price_list_scheduler:enable ID`](#commercelayer-price_list_schedulerenable-id)
* [`commercelayer refund ID`](#commercelayer-refund-id)
* [`commercelayer refund:forward ID`](#commercelayer-refundforward-id)
* [`commercelayer return ID`](#commercelayer-return-id)
* [`commercelayer return:approve ID`](#commercelayer-returnapprove-id)
* [`commercelayer return:archive ID`](#commercelayer-returnarchive-id)
* [`commercelayer return:cancel ID`](#commercelayer-returncancel-id)
* [`commercelayer return:receive ID`](#commercelayer-returnreceive-id)
* [`commercelayer return:refund ID`](#commercelayer-returnrefund-id)
* [`commercelayer return:refund_amount_cents ID`](#commercelayer-returnrefund_amount_cents-id)
* [`commercelayer return:reject ID`](#commercelayer-returnreject-id)
* [`commercelayer return:request ID`](#commercelayer-returnrequest-id)
* [`commercelayer return:restock ID`](#commercelayer-returnrestock-id)
* [`commercelayer return:ship ID`](#commercelayer-returnship-id)
* [`commercelayer return:unarchive ID`](#commercelayer-returnunarchive-id)
* [`commercelayer return_line_item ID`](#commercelayer-return_line_item-id)
* [`commercelayer return_line_item:restock ID`](#commercelayer-return_line_itemrestock-id)
* [`commercelayer satispay_payment ID`](#commercelayer-satispay_payment-id)
* [`commercelayer satispay_payment:refresh ID`](#commercelayer-satispay_paymentrefresh-id)
* [`commercelayer shipment ID`](#commercelayer-shipment-id)
* [`commercelayer shipment:cancel ID`](#commercelayer-shipmentcancel-id)
* [`commercelayer shipment:decrement_stock ID`](#commercelayer-shipmentdecrement_stock-id)
* [`commercelayer shipment:deliver ID`](#commercelayer-shipmentdeliver-id)
* [`commercelayer shipment:get_rates ID`](#commercelayer-shipmentget_rates-id)
* [`commercelayer shipment:on_hold ID`](#commercelayer-shipmenton_hold-id)
* [`commercelayer shipment:packing ID`](#commercelayer-shipmentpacking-id)
* [`commercelayer shipment:picking ID`](#commercelayer-shipmentpicking-id)
* [`commercelayer shipment:purchase ID`](#commercelayer-shipmentpurchase-id)
* [`commercelayer shipment:ready_to_ship ID`](#commercelayer-shipmentready_to_ship-id)
* [`commercelayer shipment:release_stock ID`](#commercelayer-shipmentrelease_stock-id)
* [`commercelayer shipment:reserve_stock ID`](#commercelayer-shipmentreserve_stock-id)
* [`commercelayer shipment:ship ID`](#commercelayer-shipmentship-id)
* [`commercelayer shipment:upcoming ID`](#commercelayer-shipmentupcoming-id)
* [`commercelayer shipping_method ID`](#commercelayer-shipping_method-id)
* [`commercelayer shipping_method:disable ID`](#commercelayer-shipping_methoddisable-id)
* [`commercelayer shipping_method:enable ID`](#commercelayer-shipping_methodenable-id)
* [`commercelayer shipping_method:reset_circuit ID`](#commercelayer-shipping_methodreset_circuit-id)
* [`commercelayer stock_item ID`](#commercelayer-stock_item-id)
* [`commercelayer stock_item:validate ID`](#commercelayer-stock_itemvalidate-id)
* [`commercelayer stock_line_item ID`](#commercelayer-stock_line_item-id)
* [`commercelayer stock_line_item:decrement_stock ID`](#commercelayer-stock_line_itemdecrement_stock-id)
* [`commercelayer stock_line_item:release_stock ID`](#commercelayer-stock_line_itemrelease_stock-id)
* [`commercelayer stock_line_item:reserve_stock ID`](#commercelayer-stock_line_itemreserve_stock-id)
* [`commercelayer stock_reservation ID`](#commercelayer-stock_reservation-id)
* [`commercelayer stock_reservation:pending ID`](#commercelayer-stock_reservationpending-id)
* [`commercelayer stock_transfer ID`](#commercelayer-stock_transfer-id)
* [`commercelayer stock_transfer:cancel ID`](#commercelayer-stock_transfercancel-id)
* [`commercelayer stock_transfer:complete ID`](#commercelayer-stock_transfercomplete-id)
* [`commercelayer stock_transfer:in_transit ID`](#commercelayer-stock_transferin_transit-id)
* [`commercelayer stock_transfer:on_hold ID`](#commercelayer-stock_transferon_hold-id)
* [`commercelayer stock_transfer:picking ID`](#commercelayer-stock_transferpicking-id)
* [`commercelayer stock_transfer:upcoming ID`](#commercelayer-stock_transferupcoming-id)
* [`commercelayer stripe_payment ID`](#commercelayer-stripe_payment-id)
* [`commercelayer stripe_payment:refresh ID`](#commercelayer-stripe_paymentrefresh-id)
* [`commercelayer stripe_payment:update ID`](#commercelayer-stripe_paymentupdate-id)
* [`commercelayer vertex_account ID`](#commercelayer-vertex_account-id)
* [`commercelayer vertex_account:refresh_token ID`](#commercelayer-vertex_accountrefresh_token-id)
* [`commercelayer void ID`](#commercelayer-void-id)
* [`commercelayer void:forward ID`](#commercelayer-voidforward-id)
* [`commercelayer webhook ID`](#commercelayer-webhook-id)
* [`commercelayer webhook:disable ID`](#commercelayer-webhookdisable-id)
* [`commercelayer webhook:enable ID`](#commercelayer-webhookenable-id)
* [`commercelayer webhook:reset_circuit ID`](#commercelayer-webhookreset_circuit-id)

### `commercelayer adyen_payment ID`

Execute an action on a resource of type adyen_payments.

```sh-session
USAGE
  $ commercelayer adyen_payment ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type adyen_payments
```

_See code: [src/commands/adyen_payment/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/adyen_payment/index.ts)_

### `commercelayer adyen_payment:authorize ID`

Send this attribute if you want to authorize the payment.

```sh-session
USAGE
  $ commercelayer adyen_payment:authorize ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to authorize the payment.
```

_See code: [src/commands/adyen_payment/authorize.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/adyen_payment/authorize.ts)_

### `commercelayer adyen_payment:details ID`

Send this attribute if you want to send additional details the payment request.

```sh-session
USAGE
  $ commercelayer adyen_payment:details ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to send additional details the payment request.
```

_See code: [src/commands/adyen_payment/details.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/adyen_payment/details.ts)_

### `commercelayer authorization ID`

Execute an action on a resource of type authorizations.

```sh-session
USAGE
  $ commercelayer authorization ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type authorizations
```

_See code: [src/commands/authorization/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/authorization/index.ts)_

### `commercelayer authorization:cancel ID`

Send this attribute if you want to void a succeeded authorization of a pending order (which is left unpaid).

```sh-session
USAGE
  $ commercelayer authorization:cancel ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to void a succeeded authorization of a pending order (which is left unpaid).
```

_See code: [src/commands/authorization/cancel.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/authorization/cancel.ts)_

### `commercelayer authorization:capture ID`

Send this attribute if you want to create a capture for this authorization.

```sh-session
USAGE
  $ commercelayer authorization:capture ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to create a capture for this authorization.
```

_See code: [src/commands/authorization/capture.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/authorization/capture.ts)_

### `commercelayer authorization:capture_amount_cents ID`

Send this attribute as a value in cents if you want to overwrite the amount to be captured.

```sh-session
USAGE
  $ commercelayer authorization:capture_amount_cents ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute as a value in cents if you want to overwrite the amount to be captured.
```

_See code: [src/commands/authorization/capture_amount_cents.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/authorization/capture_amount_cents.ts)_

### `commercelayer authorization:forward ID`

Send this attribute if you want to forward a stuck transaction to succeeded and update associated order states accordingly.

```sh-session
USAGE
  $ commercelayer authorization:forward ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to forward a stuck transaction to succeeded and update associated order states
  accordingly.
```

_See code: [src/commands/authorization/forward.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/authorization/forward.ts)_

### `commercelayer authorization:void ID`

Send this attribute if you want to create a void for this authorization.

```sh-session
USAGE
  $ commercelayer authorization:void ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to create a void for this authorization.
```

_See code: [src/commands/authorization/void.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/authorization/void.ts)_

### `commercelayer axerve_payment ID`

Execute an action on a resource of type axerve_payments.

```sh-session
USAGE
  $ commercelayer axerve_payment ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type axerve_payments
```

_See code: [src/commands/axerve_payment/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/axerve_payment/index.ts)_

### `commercelayer axerve_payment:update ID`

Send this attribute if you want to update the payment with fresh order data.

```sh-session
USAGE
  $ commercelayer axerve_payment:update ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to update the payment with fresh order data.
```

_See code: [src/commands/axerve_payment/update.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/axerve_payment/update.ts)_

### `commercelayer bundle ID`

Execute an action on a resource of type bundles.

```sh-session
USAGE
  $ commercelayer bundle ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type bundles
```

_See code: [src/commands/bundle/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/bundle/index.ts)_

### `commercelayer bundle:compute_compare_at_amount ID`

Send this attribute if you want to compute the compare_at_amount_cents as the sum of the prices of the bundle SKUs for the market.

```sh-session
USAGE
  $ commercelayer bundle:compute_compare_at_amount ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to compute the compare_at_amount_cents as the sum of the prices of the bundle SKUs for
  the market.
```

_See code: [src/commands/bundle/compute_compare_at_amount.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/bundle/compute_compare_at_amount.ts)_

### `commercelayer bundle:compute_price_amount ID`

Send this attribute if you want to compute the price_amount_cents as the sum of the prices of the bundle SKUs for the market.

```sh-session
USAGE
  $ commercelayer bundle:compute_price_amount ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to compute the price_amount_cents as the sum of the prices of the bundle SKUs for the
  market.
```

_See code: [src/commands/bundle/compute_price_amount.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/bundle/compute_price_amount.ts)_

### `commercelayer buy_x_pay_y_promotion ID`

Execute an action on a resource of type buy_x_pay_y_promotions.

```sh-session
USAGE
  $ commercelayer buy_x_pay_y_promotion ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type buy_x_pay_y_promotions
```

_See code: [src/commands/buy_x_pay_y_promotion/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/buy_x_pay_y_promotion/index.ts)_

### `commercelayer buy_x_pay_y_promotion:disable ID`

Send this attribute if you want to mark this resource as disabled.

```sh-session
USAGE
  $ commercelayer buy_x_pay_y_promotion:disable ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this resource as disabled.
```

_See code: [src/commands/buy_x_pay_y_promotion/disable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/buy_x_pay_y_promotion/disable.ts)_

### `commercelayer buy_x_pay_y_promotion:enable ID`

Send this attribute if you want to mark this resource as enabled.

```sh-session
USAGE
  $ commercelayer buy_x_pay_y_promotion:enable ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this resource as enabled.
```

_See code: [src/commands/buy_x_pay_y_promotion/enable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/buy_x_pay_y_promotion/enable.ts)_

### `commercelayer capture ID`

Execute an action on a resource of type captures.

```sh-session
USAGE
  $ commercelayer capture ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type captures
```

_See code: [src/commands/capture/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/capture/index.ts)_

### `commercelayer capture:cancel ID`

Send this attribute if you want to refund a succeeded capture of a pending order (which is left unpaid).

```sh-session
USAGE
  $ commercelayer capture:cancel ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to refund a succeeded capture of a pending order (which is left unpaid).
```

_See code: [src/commands/capture/cancel.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/capture/cancel.ts)_

### `commercelayer capture:forward ID`

Send this attribute if you want to forward a stuck transaction to succeeded and update associated order states accordingly.

```sh-session
USAGE
  $ commercelayer capture:forward ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to forward a stuck transaction to succeeded and update associated order states
  accordingly.
```

_See code: [src/commands/capture/forward.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/capture/forward.ts)_

### `commercelayer capture:refund ID`

Send this attribute if you want to create a refund for this capture.

```sh-session
USAGE
  $ commercelayer capture:refund ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to create a refund for this capture.
```

_See code: [src/commands/capture/refund.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/capture/refund.ts)_

### `commercelayer capture:refund_amount_cents ID`

Send this attribute as a value in cents if you want to overwrite the amount to be refunded.

```sh-session
USAGE
  $ commercelayer capture:refund_amount_cents ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute as a value in cents if you want to overwrite the amount to be refunded.
```

_See code: [src/commands/capture/refund_amount_cents.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/capture/refund_amount_cents.ts)_

### `commercelayer checkout_com_payment ID`

Execute an action on a resource of type checkout_com_payments.

```sh-session
USAGE
  $ commercelayer checkout_com_payment ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type checkout_com_payments
```

_See code: [src/commands/checkout_com_payment/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/checkout_com_payment/index.ts)_

### `commercelayer checkout_com_payment:details ID`

Send this attribute if you want to send additional details the payment request (i.e. upon 3DS check).

```sh-session
USAGE
  $ commercelayer checkout_com_payment:details ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to send additional details the payment request (i.e. upon 3DS check).
```

_See code: [src/commands/checkout_com_payment/details.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/checkout_com_payment/details.ts)_

### `commercelayer checkout_com_payment:refresh ID`

Send this attribute if you want to refresh all the pending transactions, can be used as webhooks fallback logic.

```sh-session
USAGE
  $ commercelayer checkout_com_payment:refresh ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to refresh all the pending transactions, can be used as webhooks fallback logic.
```

_See code: [src/commands/checkout_com_payment/refresh.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/checkout_com_payment/refresh.ts)_

### `commercelayer cleanup ID`

Execute an action on a resource of type cleanups.

```sh-session
USAGE
  $ commercelayer cleanup ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type cleanups
```

_See code: [src/commands/cleanup/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/cleanup/index.ts)_

### `commercelayer cleanup:interrupt ID`

Send this attribute if you want to mark status as 'interrupted'.

```sh-session
USAGE
  $ commercelayer cleanup:interrupt ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark status as 'interrupted'.
```

_See code: [src/commands/cleanup/interrupt.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/cleanup/interrupt.ts)_

### `commercelayer customer_password_reset ID`

Execute an action on a resource of type customer_password_resets.

```sh-session
USAGE
  $ commercelayer customer_password_reset ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type customer_password_resets
```

_See code: [src/commands/customer_password_reset/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/customer_password_reset/index.ts)_

### `commercelayer customer_password_reset:reset_password_token ID`

Send the 'reset_password_token' that you got on create when updating the customer password.

```sh-session
USAGE
  $ commercelayer customer_password_reset:reset_password_token ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send the 'reset_password_token' that you got on create when updating the customer password.
```

_See code: [src/commands/customer_password_reset/reset_password_token.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/customer_password_reset/reset_password_token.ts)_

### `commercelayer easypost_pickup ID`

Execute an action on a resource of type easypost_pickups.

```sh-session
USAGE
  $ commercelayer easypost_pickup ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type easypost_pickups
```

_See code: [src/commands/easypost_pickup/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/easypost_pickup/index.ts)_

### `commercelayer easypost_pickup:purchase ID`

Send this attribute if you want to purchase this pick up with the selected rate.

```sh-session
USAGE
  $ commercelayer easypost_pickup:purchase ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to purchase this pick up with the selected rate.
```

_See code: [src/commands/easypost_pickup/purchase.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/easypost_pickup/purchase.ts)_

### `commercelayer event ID`

Execute an action on a resource of type events.

```sh-session
USAGE
  $ commercelayer event ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type events
```

_See code: [src/commands/event/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/event/index.ts)_

### `commercelayer event:trigger ID`

Send this attribute if you want to force webhooks execution for this event. Cannot be passed by sales channels.

```sh-session
USAGE
  $ commercelayer event:trigger ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to force webhooks execution for this event. Cannot be passed by sales channels.
```

_See code: [src/commands/event/trigger.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/event/trigger.ts)_

### `commercelayer export ID`

Execute an action on a resource of type exports.

```sh-session
USAGE
  $ commercelayer export ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type exports
```

_See code: [src/commands/export/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/export/index.ts)_

### `commercelayer export:interrupt ID`

Send this attribute if you want to mark status as 'interrupted'.

```sh-session
USAGE
  $ commercelayer export:interrupt ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark status as 'interrupted'.
```

_See code: [src/commands/export/interrupt.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/export/interrupt.ts)_

### `commercelayer external_gateway ID`

Execute an action on a resource of type external_gateways.

```sh-session
USAGE
  $ commercelayer external_gateway ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type external_gateways
```

_See code: [src/commands/external_gateway/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/external_gateway/index.ts)_

### `commercelayer external_gateway:reset_circuit ID`

Send this attribute if you want to reset the circuit breaker associated to this resource to 'closed' state and zero failures count. Cannot be passed by sales channels.

```sh-session
USAGE
  $ commercelayer external_gateway:reset_circuit ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to reset the circuit breaker associated to this resource to 'closed' state and zero
  failures count. Cannot be passed by sales channels.
```

_See code: [src/commands/external_gateway/reset_circuit.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/external_gateway/reset_circuit.ts)_

### `commercelayer external_promotion ID`

Execute an action on a resource of type external_promotions.

```sh-session
USAGE
  $ commercelayer external_promotion ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type external_promotions
```

_See code: [src/commands/external_promotion/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/external_promotion/index.ts)_

### `commercelayer external_promotion:disable ID`

Send this attribute if you want to mark this resource as disabled.

```sh-session
USAGE
  $ commercelayer external_promotion:disable ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this resource as disabled.
```

_See code: [src/commands/external_promotion/disable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/external_promotion/disable.ts)_

### `commercelayer external_promotion:enable ID`

Send this attribute if you want to mark this resource as enabled.

```sh-session
USAGE
  $ commercelayer external_promotion:enable ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this resource as enabled.
```

_See code: [src/commands/external_promotion/enable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/external_promotion/enable.ts)_

### `commercelayer external_promotion:reset_circuit ID`

Send this attribute if you want to reset the circuit breaker associated to this resource to 'closed' state and zero failures count. Cannot be passed by sales channels.

```sh-session
USAGE
  $ commercelayer external_promotion:reset_circuit ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to reset the circuit breaker associated to this resource to 'closed' state and zero
  failures count. Cannot be passed by sales channels.
```

_See code: [src/commands/external_promotion/reset_circuit.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/external_promotion/reset_circuit.ts)_

### `commercelayer external_tax_calculator ID`

Execute an action on a resource of type external_tax_calculators.

```sh-session
USAGE
  $ commercelayer external_tax_calculator ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type external_tax_calculators
```

_See code: [src/commands/external_tax_calculator/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/external_tax_calculator/index.ts)_

### `commercelayer external_tax_calculator:reset_circuit ID`

Send this attribute if you want to reset the circuit breaker associated to this resource to 'closed' state and zero failures count. Cannot be passed by sales channels.

```sh-session
USAGE
  $ commercelayer external_tax_calculator:reset_circuit ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to reset the circuit breaker associated to this resource to 'closed' state and zero
  failures count. Cannot be passed by sales channels.
```

_See code: [src/commands/external_tax_calculator/reset_circuit.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/external_tax_calculator/reset_circuit.ts)_

### `commercelayer fixed_amount_promotion ID`

Execute an action on a resource of type fixed_amount_promotions.

```sh-session
USAGE
  $ commercelayer fixed_amount_promotion ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type fixed_amount_promotions
```

_See code: [src/commands/fixed_amount_promotion/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/fixed_amount_promotion/index.ts)_

### `commercelayer fixed_amount_promotion:disable ID`

Send this attribute if you want to mark this resource as disabled.

```sh-session
USAGE
  $ commercelayer fixed_amount_promotion:disable ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this resource as disabled.
```

_See code: [src/commands/fixed_amount_promotion/disable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/fixed_amount_promotion/disable.ts)_

### `commercelayer fixed_amount_promotion:enable ID`

Send this attribute if you want to mark this resource as enabled.

```sh-session
USAGE
  $ commercelayer fixed_amount_promotion:enable ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this resource as enabled.
```

_See code: [src/commands/fixed_amount_promotion/enable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/fixed_amount_promotion/enable.ts)_

### `commercelayer fixed_price_promotion ID`

Execute an action on a resource of type fixed_price_promotions.

```sh-session
USAGE
  $ commercelayer fixed_price_promotion ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type fixed_price_promotions
```

_See code: [src/commands/fixed_price_promotion/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/fixed_price_promotion/index.ts)_

### `commercelayer fixed_price_promotion:disable ID`

Send this attribute if you want to mark this resource as disabled.

```sh-session
USAGE
  $ commercelayer fixed_price_promotion:disable ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this resource as disabled.
```

_See code: [src/commands/fixed_price_promotion/disable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/fixed_price_promotion/disable.ts)_

### `commercelayer fixed_price_promotion:enable ID`

Send this attribute if you want to mark this resource as enabled.

```sh-session
USAGE
  $ commercelayer fixed_price_promotion:enable ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this resource as enabled.
```

_See code: [src/commands/fixed_price_promotion/enable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/fixed_price_promotion/enable.ts)_

### `commercelayer flex_promotion ID`

Execute an action on a resource of type flex_promotions.

```sh-session
USAGE
  $ commercelayer flex_promotion ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type flex_promotions
```

_See code: [src/commands/flex_promotion/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/flex_promotion/index.ts)_

### `commercelayer flex_promotion:disable ID`

Send this attribute if you want to mark this resource as disabled.

```sh-session
USAGE
  $ commercelayer flex_promotion:disable ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this resource as disabled.
```

_See code: [src/commands/flex_promotion/disable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/flex_promotion/disable.ts)_

### `commercelayer flex_promotion:enable ID`

Send this attribute if you want to mark this resource as enabled.

```sh-session
USAGE
  $ commercelayer flex_promotion:enable ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this resource as enabled.
```

_See code: [src/commands/flex_promotion/enable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/flex_promotion/enable.ts)_

### `commercelayer free_gift_promotion ID`

Execute an action on a resource of type free_gift_promotions.

```sh-session
USAGE
  $ commercelayer free_gift_promotion ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type free_gift_promotions
```

_See code: [src/commands/free_gift_promotion/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/free_gift_promotion/index.ts)_

### `commercelayer free_gift_promotion:disable ID`

Send this attribute if you want to mark this resource as disabled.

```sh-session
USAGE
  $ commercelayer free_gift_promotion:disable ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this resource as disabled.
```

_See code: [src/commands/free_gift_promotion/disable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/free_gift_promotion/disable.ts)_

### `commercelayer free_gift_promotion:enable ID`

Send this attribute if you want to mark this resource as enabled.

```sh-session
USAGE
  $ commercelayer free_gift_promotion:enable ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this resource as enabled.
```

_See code: [src/commands/free_gift_promotion/enable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/free_gift_promotion/enable.ts)_

### `commercelayer free_shipping_promotion ID`

Execute an action on a resource of type free_shipping_promotions.

```sh-session
USAGE
  $ commercelayer free_shipping_promotion ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type free_shipping_promotions
```

_See code: [src/commands/free_shipping_promotion/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/free_shipping_promotion/index.ts)_

### `commercelayer free_shipping_promotion:disable ID`

Send this attribute if you want to mark this resource as disabled.

```sh-session
USAGE
  $ commercelayer free_shipping_promotion:disable ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this resource as disabled.
```

_See code: [src/commands/free_shipping_promotion/disable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/free_shipping_promotion/disable.ts)_

### `commercelayer free_shipping_promotion:enable ID`

Send this attribute if you want to mark this resource as enabled.

```sh-session
USAGE
  $ commercelayer free_shipping_promotion:enable ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this resource as enabled.
```

_See code: [src/commands/free_shipping_promotion/enable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/free_shipping_promotion/enable.ts)_

### `commercelayer gift_card ID`

Execute an action on a resource of type gift_cards.

```sh-session
USAGE
  $ commercelayer gift_card ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type gift_cards
```

_See code: [src/commands/gift_card/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/gift_card/index.ts)_

### `commercelayer gift_card:activate ID`

Send this attribute if you want to activate a gift card.

```sh-session
USAGE
  $ commercelayer gift_card:activate ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to activate a gift card.
```

_See code: [src/commands/gift_card/activate.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/gift_card/activate.ts)_

### `commercelayer gift_card:balance_change_cents ID`

The balance change, in cents. Send a negative value to reduces the card balance by the specified amount. Send a positive value to recharge the gift card (if rechargeable).

```sh-session
USAGE
  $ commercelayer gift_card:balance_change_cents ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  The balance change, in cents. Send a negative value to reduces the card balance by the specified amount. Send a
  positive value to recharge the gift card (if rechargeable).
```

_See code: [src/commands/gift_card/balance_change_cents.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/gift_card/balance_change_cents.ts)_

### `commercelayer gift_card:deactivate ID`

Send this attribute if you want to deactivate a gift card.

```sh-session
USAGE
  $ commercelayer gift_card:deactivate ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to deactivate a gift card.
```

_See code: [src/commands/gift_card/deactivate.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/gift_card/deactivate.ts)_

### `commercelayer gift_card:purchase ID`

Send this attribute if you want to confirm a draft gift card. The gift card becomes 'inactive', waiting to be activated.

```sh-session
USAGE
  $ commercelayer gift_card:purchase ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to confirm a draft gift card. The gift card becomes 'inactive', waiting to be
  activated.
```

_See code: [src/commands/gift_card/purchase.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/gift_card/purchase.ts)_

### `commercelayer import ID`

Execute an action on a resource of type imports.

```sh-session
USAGE
  $ commercelayer import ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type imports
```

_See code: [src/commands/import/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/import/index.ts)_

### `commercelayer import:interrupt ID`

Send this attribute if you want to mark status as 'interrupted'.

```sh-session
USAGE
  $ commercelayer import:interrupt ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark status as 'interrupted'.
```

_See code: [src/commands/import/interrupt.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/import/interrupt.ts)_

### `commercelayer in_stock_subscription ID`

Execute an action on a resource of type in_stock_subscriptions.

```sh-session
USAGE
  $ commercelayer in_stock_subscription ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type in_stock_subscriptions
```

_See code: [src/commands/in_stock_subscription/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/in_stock_subscription/index.ts)_

### `commercelayer in_stock_subscription:activate ID`

Send this attribute if you want to activate an inactive subscription.

```sh-session
USAGE
  $ commercelayer in_stock_subscription:activate ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to activate an inactive subscription.
```

_See code: [src/commands/in_stock_subscription/activate.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/in_stock_subscription/activate.ts)_

### `commercelayer in_stock_subscription:deactivate ID`

Send this attribute if you want to dactivate an active subscription.

```sh-session
USAGE
  $ commercelayer in_stock_subscription:deactivate ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to dactivate an active subscription.
```

_See code: [src/commands/in_stock_subscription/deactivate.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/in_stock_subscription/deactivate.ts)_

### `commercelayer klarna_payment ID`

Execute an action on a resource of type klarna_payments.

```sh-session
USAGE
  $ commercelayer klarna_payment ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type klarna_payments
```

_See code: [src/commands/klarna_payment/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/klarna_payment/index.ts)_

### `commercelayer klarna_payment:update ID`

Send this attribute if you want to update the payment session with fresh order data.

```sh-session
USAGE
  $ commercelayer klarna_payment:update ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to update the payment session with fresh order data.
```

_See code: [src/commands/klarna_payment/update.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/klarna_payment/update.ts)_

### `commercelayer line_item ID`

Execute an action on a resource of type line_items.

```sh-session
USAGE
  $ commercelayer line_item ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type line_items
```

_See code: [src/commands/line_item/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/line_item/index.ts)_

### `commercelayer line_item:external_price ID`

When creating or updating a new line item, set this attribute to '1' if you want to inject the unit_amount_cents price from an external source. Any successive price computation will be done externally, until the attribute is reset to '0'.

```sh-session
USAGE
  $ commercelayer line_item:external_price ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  When creating or updating a new line item, set this attribute to '1' if you want to inject the unit_amount_cents price
  from an external source. Any successive price computation will be done externally, until the attribute is reset to
  '0'.
```

_See code: [src/commands/line_item/external_price.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/line_item/external_price.ts)_

### `commercelayer line_item:reserve_stock ID`

Send this attribute if you want to reserve the stock for the line item's SKUs quantity. Stock reservations expiration depends on the inventory model's cutoff. When used on update the existing active stock reservations are renewed. Cannot be passed by sales channels.

```sh-session
USAGE
  $ commercelayer line_item:reserve_stock ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to reserve the stock for the line item's SKUs quantity. Stock reservations expiration
  depends on the inventory model's cutoff. When used on update the existing active stock reservations are renewed.
  Cannot be passed by sales channels.
```

_See code: [src/commands/line_item/reserve_stock.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/line_item/reserve_stock.ts)_

### `commercelayer line_item:reset_circuit ID`

Send this attribute if you want to reset the circuit breaker associated to this resource to 'closed' state and zero failures count. Cannot be passed by sales channels.

```sh-session
USAGE
  $ commercelayer line_item:reset_circuit ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to reset the circuit breaker associated to this resource to 'closed' state and zero
  failures count. Cannot be passed by sales channels.
```

_See code: [src/commands/line_item/reset_circuit.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/line_item/reset_circuit.ts)_

### `commercelayer link ID`

Execute an action on a resource of type links.

```sh-session
USAGE
  $ commercelayer link ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type links
```

_See code: [src/commands/link/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/link/index.ts)_

### `commercelayer link:disable ID`

Send this attribute if you want to mark this resource as disabled.

```sh-session
USAGE
  $ commercelayer link:disable ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this resource as disabled.
```

_See code: [src/commands/link/disable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/link/disable.ts)_

### `commercelayer link:enable ID`

Send this attribute if you want to mark this resource as enabled.

```sh-session
USAGE
  $ commercelayer link:enable ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this resource as enabled.
```

_See code: [src/commands/link/enable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/link/enable.ts)_

### `commercelayer market ID`

Execute an action on a resource of type markets.

```sh-session
USAGE
  $ commercelayer market ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type markets
```

_See code: [src/commands/market/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/market/index.ts)_

### `commercelayer market:disable ID`

Send this attribute if you want to mark this resource as disabled.

```sh-session
USAGE
  $ commercelayer market:disable ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this resource as disabled.
```

_See code: [src/commands/market/disable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/market/disable.ts)_

### `commercelayer market:enable ID`

Send this attribute if you want to mark this resource as enabled.

```sh-session
USAGE
  $ commercelayer market:enable ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this resource as enabled.
```

_See code: [src/commands/market/enable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/market/enable.ts)_

### `commercelayer order ID`

Execute an action on a resource of type orders.

```sh-session
USAGE
  $ commercelayer order ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type orders
```

_See code: [src/commands/order/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/index.ts)_

### `commercelayer order:approve ID`

Send this attribute if you want to approve a placed order. Cannot be passed by sales channels.

```sh-session
USAGE
  $ commercelayer order:approve ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to approve a placed order. Cannot be passed by sales channels.
```

_See code: [src/commands/order/approve.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/approve.ts)_

### `commercelayer order:approve_and_capture ID`

Send this attribute if you want to approve and capture a placed order. Cannot be passed by sales channels.

```sh-session
USAGE
  $ commercelayer order:approve_and_capture ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to approve and capture a placed order. Cannot be passed by sales channels.
```

_See code: [src/commands/order/approve_and_capture.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/approve_and_capture.ts)_

### `commercelayer order:archive ID`

Send this attribute if you want to archive the order.

```sh-session
USAGE
  $ commercelayer order:archive ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to archive the order.
```

_See code: [src/commands/order/archive.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/archive.ts)_

### `commercelayer order:authorization_amount_cents ID`

Send this attribute as a value in cents if you want to overwrite the amount to be authorized.

```sh-session
USAGE
  $ commercelayer order:authorization_amount_cents ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute as a value in cents if you want to overwrite the amount to be authorized.
```

_See code: [src/commands/order/authorization_amount_cents.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/authorization_amount_cents.ts)_

### `commercelayer order:authorize ID`

Send this attribute if you want to authorize the order's payment source.

```sh-session
USAGE
  $ commercelayer order:authorize ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to authorize the order's payment source.
```

_See code: [src/commands/order/authorize.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/authorize.ts)_

### `commercelayer order:billing_address_clone_id ID`

The id of the address that you want to clone to create the order's billing address.

```sh-session
USAGE
  $ commercelayer order:billing_address_clone_id ID -v <value> [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json           print result in JSON format
  -p, --print          print out the modified resource
  -u, --unformatted    print JSON output without indentation
  -v, --value=<value>  (required) the trigger attribute value

DESCRIPTION
  The id of the address that you want to clone to create the order's billing address.
```

_See code: [src/commands/order/billing_address_clone_id.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/billing_address_clone_id.ts)_

### `commercelayer order:billing_address_same_as_shipping ID`

Send this attribute if you want the billing address to be cloned from the order's shipping address.

```sh-session
USAGE
  $ commercelayer order:billing_address_same_as_shipping ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want the billing address to be cloned from the order's shipping address.
```

_See code: [src/commands/order/billing_address_same_as_shipping.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/billing_address_same_as_shipping.ts)_

### `commercelayer order:cancel ID`

Send this attribute if you want to cancel a placed order. The order's authorization will be automatically voided.

```sh-session
USAGE
  $ commercelayer order:cancel ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to cancel a placed order. The order's authorization will be automatically voided.
```

_See code: [src/commands/order/cancel.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/cancel.ts)_

### `commercelayer order:capture ID`

Send this attribute if you want to capture an authorized order. Cannot be passed by sales channels.

```sh-session
USAGE
  $ commercelayer order:capture ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to capture an authorized order. Cannot be passed by sales channels.
```

_See code: [src/commands/order/capture.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/capture.ts)_

### `commercelayer order:commit_invoice ID`

Send this attribute if you want commit the sales tax invoice to the associated tax calculator (currently supported by Avalara).

```sh-session
USAGE
  $ commercelayer order:commit_invoice ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want commit the sales tax invoice to the associated tax calculator (currently supported by
  Avalara).
```

_See code: [src/commands/order/commit_invoice.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/commit_invoice.ts)_

### `commercelayer order:create_subscriptions ID`

Send this attribute upon/after placing the order if you want to create order subscriptions from the line items that have a frequency.

```sh-session
USAGE
  $ commercelayer order:create_subscriptions ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute upon/after placing the order if you want to create order subscriptions from the line items that
  have a frequency.
```

_See code: [src/commands/order/create_subscriptions.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/create_subscriptions.ts)_

### `commercelayer order:customer_payment_source_id ID`

The id of the customer payment source (i.e. credit card) that you want to use as the order's payment source.

```sh-session
USAGE
  $ commercelayer order:customer_payment_source_id ID -v <value> [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json           print result in JSON format
  -p, --print          print out the modified resource
  -u, --unformatted    print JSON output without indentation
  -v, --value=<value>  (required) the trigger attribute value

DESCRIPTION
  The id of the customer payment source (i.e. credit card) that you want to use as the order's payment source.
```

_See code: [src/commands/order/customer_payment_source_id.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/customer_payment_source_id.ts)_

### `commercelayer order:fix_payment_source ID`

Send this attribute if you want to set the payment source associated with the last succeeded authorization. At the end of the fix the order should be placed and authorized and ready to be approved. A tentative to fix the payment source is done before approval automatically. Cannot be passed by sales channels.

```sh-session
USAGE
  $ commercelayer order:fix_payment_source ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to set the payment source associated with the last succeeded authorization. At the end
  of the fix the order should be placed and authorized and ready to be approved. A tentative to fix the payment source
  is done before approval automatically. Cannot be passed by sales channels.
```

_See code: [src/commands/order/fix_payment_source.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/fix_payment_source.ts)_

### `commercelayer order:fulfill ID`

Send this attribute if you want to mark as fulfilled the order (shipments must be cancelled, shipped or delivered, alternatively order must be approved). Cannot be passed by sales channels.

```sh-session
USAGE
  $ commercelayer order:fulfill ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark as fulfilled the order (shipments must be cancelled, shipped or delivered,
  alternatively order must be approved). Cannot be passed by sales channels.
```

_See code: [src/commands/order/fulfill.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/fulfill.ts)_

### `commercelayer order:nullify_payment_source ID`

Send this attribute if you want to nullify the payment source for this order.

```sh-session
USAGE
  $ commercelayer order:nullify_payment_source ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to nullify the payment source for this order.
```

_See code: [src/commands/order/nullify_payment_source.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/nullify_payment_source.ts)_

### `commercelayer order:pending ID`

Send this attribute if you want to move a draft or placing order to pending. Cannot be passed by sales channels.

```sh-session
USAGE
  $ commercelayer order:pending ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to move a draft or placing order to pending. Cannot be passed by sales channels.
```

_See code: [src/commands/order/pending.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/pending.ts)_

### `commercelayer order:place ID`

Send this attribute if you want to place the order.

```sh-session
USAGE
  $ commercelayer order:place ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to place the order.
```

_See code: [src/commands/order/place.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/place.ts)_

### `commercelayer order:refresh ID`

Send this attribute if you want to manually refresh the order.

```sh-session
USAGE
  $ commercelayer order:refresh ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to manually refresh the order.
```

_See code: [src/commands/order/refresh.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/refresh.ts)_

### `commercelayer order:refund ID`

Send this attribute if you want to refund a captured order. Cannot be passed by sales channels.

```sh-session
USAGE
  $ commercelayer order:refund ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to refund a captured order. Cannot be passed by sales channels.
```

_See code: [src/commands/order/refund.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/refund.ts)_

### `commercelayer order:refund_invoice ID`

Send this attribute if you want refund the sales tax invoice to the associated tax calculator (currently supported by Avalara).

```sh-session
USAGE
  $ commercelayer order:refund_invoice ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want refund the sales tax invoice to the associated tax calculator (currently supported by
  Avalara).
```

_See code: [src/commands/order/refund_invoice.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/refund_invoice.ts)_

### `commercelayer order:reset_circuit ID`

Send this attribute if you want to reset the circuit breaker associated to this resource to 'closed' state and zero failures count. Cannot be passed by sales channels.

```sh-session
USAGE
  $ commercelayer order:reset_circuit ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to reset the circuit breaker associated to this resource to 'closed' state and zero
  failures count. Cannot be passed by sales channels.
```

_See code: [src/commands/order/reset_circuit.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/reset_circuit.ts)_

### `commercelayer order:save_billing_address_to_customer_address_book ID`

Send this attribute if you want the order's billing address to be saved in the customer's address book as a customer address.

```sh-session
USAGE
  $ commercelayer order:save_billing_address_to_customer_address_book ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want the order's billing address to be saved in the customer's address book as a customer
  address.
```

_See code: [src/commands/order/save_billing_address_to_customer_address_book.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/save_billing_address_to_customer_address_book.ts)_

### `commercelayer order:save_payment_source_to_customer_wallet ID`

Send this attribute if you want the order's payment source to be saved in the customer's wallet as a customer payment source.

```sh-session
USAGE
  $ commercelayer order:save_payment_source_to_customer_wallet ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want the order's payment source to be saved in the customer's wallet as a customer payment
  source.
```

_See code: [src/commands/order/save_payment_source_to_customer_wallet.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/save_payment_source_to_customer_wallet.ts)_

### `commercelayer order:save_shipping_address_to_customer_address_book ID`

Send this attribute if you want the order's shipping address to be saved in the customer's address book as a customer address.

```sh-session
USAGE
  $ commercelayer order:save_shipping_address_to_customer_address_book ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want the order's shipping address to be saved in the customer's address book as a customer
  address.
```

_See code: [src/commands/order/save_shipping_address_to_customer_address_book.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/save_shipping_address_to_customer_address_book.ts)_

### `commercelayer order:shipping_address_clone_id ID`

The id of the address that you want to clone to create the order's shipping address.

```sh-session
USAGE
  $ commercelayer order:shipping_address_clone_id ID -v <value> [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json           print result in JSON format
  -p, --print          print out the modified resource
  -u, --unformatted    print JSON output without indentation
  -v, --value=<value>  (required) the trigger attribute value

DESCRIPTION
  The id of the address that you want to clone to create the order's shipping address.
```

_See code: [src/commands/order/shipping_address_clone_id.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/shipping_address_clone_id.ts)_

### `commercelayer order:shipping_address_same_as_billing ID`

Send this attribute if you want the shipping address to be cloned from the order's billing address.

```sh-session
USAGE
  $ commercelayer order:shipping_address_same_as_billing ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want the shipping address to be cloned from the order's billing address.
```

_See code: [src/commands/order/shipping_address_same_as_billing.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/shipping_address_same_as_billing.ts)_

### `commercelayer order:start_editing ID`

Send this attribute if you want to edit the order after it is placed. Remember you cannot exceed the original total amount. Cannot be passed by sales channels.

```sh-session
USAGE
  $ commercelayer order:start_editing ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to edit the order after it is placed. Remember you cannot exceed the original total
  amount. Cannot be passed by sales channels.
```

_See code: [src/commands/order/start_editing.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/start_editing.ts)_

### `commercelayer order:stop_editing ID`

Send this attribute to stop the editing for the order and return back to placed status. Cannot be passed by sales channels.

```sh-session
USAGE
  $ commercelayer order:stop_editing ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute to stop the editing for the order and return back to placed status. Cannot be passed by sales
  channels.
```

_See code: [src/commands/order/stop_editing.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/stop_editing.ts)_

### `commercelayer order:unarchive ID`

Send this attribute if you want to unarchive the order.

```sh-session
USAGE
  $ commercelayer order:unarchive ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to unarchive the order.
```

_See code: [src/commands/order/unarchive.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/unarchive.ts)_

### `commercelayer order:update_taxes ID`

Send this attribute if you want to force tax calculation for this order (a tax calculator must be associated to the order's market).

```sh-session
USAGE
  $ commercelayer order:update_taxes ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to force tax calculation for this order (a tax calculator must be associated to the
  order's market).
```

_See code: [src/commands/order/update_taxes.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/update_taxes.ts)_

### `commercelayer order:validate ID`

Send this attribute if you want to trigger the external validation for the order.

```sh-session
USAGE
  $ commercelayer order:validate ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to trigger the external validation for the order.
```

_See code: [src/commands/order/validate.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order/validate.ts)_

### `commercelayer order_subscription ID`

Execute an action on a resource of type order_subscriptions.

```sh-session
USAGE
  $ commercelayer order_subscription ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type order_subscriptions
```

_See code: [src/commands/order_subscription/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order_subscription/index.ts)_

### `commercelayer order_subscription:activate ID`

Send this attribute if you want to mark this subscription as active.

```sh-session
USAGE
  $ commercelayer order_subscription:activate ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this subscription as active.
```

_See code: [src/commands/order_subscription/activate.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order_subscription/activate.ts)_

### `commercelayer order_subscription:cancel ID`

Send this attribute if you want to mark this subscription as cancelled.

```sh-session
USAGE
  $ commercelayer order_subscription:cancel ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this subscription as cancelled.
```

_See code: [src/commands/order_subscription/cancel.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order_subscription/cancel.ts)_

### `commercelayer order_subscription:convert ID`

Send this attribute if you want to convert a manual subscription to an automatic one. A subscription model is required before conversion.

```sh-session
USAGE
  $ commercelayer order_subscription:convert ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to convert a manual subscription to an automatic one. A subscription model is required
  before conversion.
```

_See code: [src/commands/order_subscription/convert.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order_subscription/convert.ts)_

### `commercelayer order_subscription:deactivate ID`

Send this attribute if you want to mark this subscription as inactive.

```sh-session
USAGE
  $ commercelayer order_subscription:deactivate ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this subscription as inactive.
```

_See code: [src/commands/order_subscription/deactivate.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/order_subscription/deactivate.ts)_

### `commercelayer payment_method ID`

Execute an action on a resource of type payment_methods.

```sh-session
USAGE
  $ commercelayer payment_method ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type payment_methods
```

_See code: [src/commands/payment_method/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/payment_method/index.ts)_

### `commercelayer payment_method:disable ID`

Send this attribute if you want to mark this resource as disabled.

```sh-session
USAGE
  $ commercelayer payment_method:disable ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this resource as disabled.
```

_See code: [src/commands/payment_method/disable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/payment_method/disable.ts)_

### `commercelayer payment_method:enable ID`

Send this attribute if you want to mark this resource as enabled.

```sh-session
USAGE
  $ commercelayer payment_method:enable ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this resource as enabled.
```

_See code: [src/commands/payment_method/enable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/payment_method/enable.ts)_

### `commercelayer percentage_discount_promotion ID`

Execute an action on a resource of type percentage_discount_promotions.

```sh-session
USAGE
  $ commercelayer percentage_discount_promotion ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type percentage_discount_promotions
```

_See code: [src/commands/percentage_discount_promotion/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/percentage_discount_promotion/index.ts)_

### `commercelayer percentage_discount_promotion:disable ID`

Send this attribute if you want to mark this resource as disabled.

```sh-session
USAGE
  $ commercelayer percentage_discount_promotion:disable ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this resource as disabled.
```

_See code: [src/commands/percentage_discount_promotion/disable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/percentage_discount_promotion/disable.ts)_

### `commercelayer percentage_discount_promotion:enable ID`

Send this attribute if you want to mark this resource as enabled.

```sh-session
USAGE
  $ commercelayer percentage_discount_promotion:enable ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this resource as enabled.
```

_See code: [src/commands/percentage_discount_promotion/enable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/percentage_discount_promotion/enable.ts)_

### `commercelayer price_list_scheduler ID`

Execute an action on a resource of type price_list_schedulers.

```sh-session
USAGE
  $ commercelayer price_list_scheduler ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type price_list_schedulers
```

_See code: [src/commands/price_list_scheduler/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/price_list_scheduler/index.ts)_

### `commercelayer price_list_scheduler:disable ID`

Send this attribute if you want to mark this resource as disabled.

```sh-session
USAGE
  $ commercelayer price_list_scheduler:disable ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this resource as disabled.
```

_See code: [src/commands/price_list_scheduler/disable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/price_list_scheduler/disable.ts)_

### `commercelayer price_list_scheduler:enable ID`

Send this attribute if you want to mark this resource as enabled.

```sh-session
USAGE
  $ commercelayer price_list_scheduler:enable ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this resource as enabled.
```

_See code: [src/commands/price_list_scheduler/enable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/price_list_scheduler/enable.ts)_

### `commercelayer refund ID`

Execute an action on a resource of type refunds.

```sh-session
USAGE
  $ commercelayer refund ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type refunds
```

_See code: [src/commands/refund/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/refund/index.ts)_

### `commercelayer refund:forward ID`

Send this attribute if you want to forward a stuck transaction to succeeded and update associated order states accordingly.

```sh-session
USAGE
  $ commercelayer refund:forward ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to forward a stuck transaction to succeeded and update associated order states
  accordingly.
```

_See code: [src/commands/refund/forward.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/refund/forward.ts)_

### `commercelayer return ID`

Execute an action on a resource of type returns.

```sh-session
USAGE
  $ commercelayer return ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type returns
```

_See code: [src/commands/return/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/return/index.ts)_

### `commercelayer return:approve ID`

Send this attribute if you want to mark this return as approved.

```sh-session
USAGE
  $ commercelayer return:approve ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this return as approved.
```

_See code: [src/commands/return/approve.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/return/approve.ts)_

### `commercelayer return:archive ID`

Send this attribute if you want to archive the return.

```sh-session
USAGE
  $ commercelayer return:archive ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to archive the return.
```

_See code: [src/commands/return/archive.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/return/archive.ts)_

### `commercelayer return:cancel ID`

Send this attribute if you want to mark this return as cancelled.

```sh-session
USAGE
  $ commercelayer return:cancel ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this return as cancelled.
```

_See code: [src/commands/return/cancel.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/return/cancel.ts)_

### `commercelayer return:receive ID`

Send this attribute if you want to mark this return as received.

```sh-session
USAGE
  $ commercelayer return:receive ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this return as received.
```

_See code: [src/commands/return/receive.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/return/receive.ts)_

### `commercelayer return:refund ID`

Send this attribute if you want to create a refund for this return.

```sh-session
USAGE
  $ commercelayer return:refund ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to create a refund for this return.
```

_See code: [src/commands/return/refund.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/return/refund.ts)_

### `commercelayer return:refund_amount_cents ID`

Send this attribute as a value in cents to specify the amount to be refunded.

```sh-session
USAGE
  $ commercelayer return:refund_amount_cents ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute as a value in cents to specify the amount to be refunded.
```

_See code: [src/commands/return/refund_amount_cents.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/return/refund_amount_cents.ts)_

### `commercelayer return:reject ID`

Send this attribute if you want to mark this return as rejected.

```sh-session
USAGE
  $ commercelayer return:reject ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this return as rejected.
```

_See code: [src/commands/return/reject.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/return/reject.ts)_

### `commercelayer return:request ID`

Send this attribute if you want to activate this return.

```sh-session
USAGE
  $ commercelayer return:request ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to activate this return.
```

_See code: [src/commands/return/request.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/return/request.ts)_

### `commercelayer return:restock ID`

Send this attribute if you want to restock all of the return line items.

```sh-session
USAGE
  $ commercelayer return:restock ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to restock all of the return line items.
```

_See code: [src/commands/return/restock.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/return/restock.ts)_

### `commercelayer return:ship ID`

Send this attribute if you want to mark this return as shipped.

```sh-session
USAGE
  $ commercelayer return:ship ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this return as shipped.
```

_See code: [src/commands/return/ship.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/return/ship.ts)_

### `commercelayer return:unarchive ID`

Send this attribute if you want to unarchive the return.

```sh-session
USAGE
  $ commercelayer return:unarchive ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to unarchive the return.
```

_See code: [src/commands/return/unarchive.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/return/unarchive.ts)_

### `commercelayer return_line_item ID`

Execute an action on a resource of type return_line_items.

```sh-session
USAGE
  $ commercelayer return_line_item ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type return_line_items
```

_See code: [src/commands/return_line_item/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/return_line_item/index.ts)_

### `commercelayer return_line_item:restock ID`

Send this attribute if you want to restock the line item.

```sh-session
USAGE
  $ commercelayer return_line_item:restock ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to restock the line item.
```

_See code: [src/commands/return_line_item/restock.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/return_line_item/restock.ts)_

### `commercelayer satispay_payment ID`

Execute an action on a resource of type satispay_payments.

```sh-session
USAGE
  $ commercelayer satispay_payment ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type satispay_payments
```

_See code: [src/commands/satispay_payment/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/satispay_payment/index.ts)_

### `commercelayer satispay_payment:refresh ID`

Send this attribute if you want to refresh all the pending transactions, can be used as webhooks fallback logic.

```sh-session
USAGE
  $ commercelayer satispay_payment:refresh ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to refresh all the pending transactions, can be used as webhooks fallback logic.
```

_See code: [src/commands/satispay_payment/refresh.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/satispay_payment/refresh.ts)_

### `commercelayer shipment ID`

Execute an action on a resource of type shipments.

```sh-session
USAGE
  $ commercelayer shipment ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type shipments
```

_See code: [src/commands/shipment/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/shipment/index.ts)_

### `commercelayer shipment:cancel ID`

Send this attribute if you want to mark this shipment as cancelled (unless already shipped or delivered). Cannot be passed by sales channels.

```sh-session
USAGE
  $ commercelayer shipment:cancel ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this shipment as cancelled (unless already shipped or delivered). Cannot be
  passed by sales channels.
```

_See code: [src/commands/shipment/cancel.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/shipment/cancel.ts)_

### `commercelayer shipment:decrement_stock ID`

Send this attribute if you want to automatically decrement and release the stock for each of the associated stock line item. Can be done only when fulfillment is in progress. Cannot be passed by sales channels.

```sh-session
USAGE
  $ commercelayer shipment:decrement_stock ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to automatically decrement and release the stock for each of the associated stock line
  item. Can be done only when fulfillment is in progress. Cannot be passed by sales channels.
```

_See code: [src/commands/shipment/decrement_stock.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/shipment/decrement_stock.ts)_

### `commercelayer shipment:deliver ID`

Send this attribute if you want to mark this shipment as delivered.

```sh-session
USAGE
  $ commercelayer shipment:deliver ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this shipment as delivered.
```

_See code: [src/commands/shipment/deliver.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/shipment/deliver.ts)_

### `commercelayer shipment:get_rates ID`

Send this attribute if you want get the shipping rates from the associated carrier accounts.

```sh-session
USAGE
  $ commercelayer shipment:get_rates ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want get the shipping rates from the associated carrier accounts.
```

_See code: [src/commands/shipment/get_rates.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/shipment/get_rates.ts)_

### `commercelayer shipment:on_hold ID`

Send this attribute if you want to put this shipment on hold.

```sh-session
USAGE
  $ commercelayer shipment:on_hold ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to put this shipment on hold.
```

_See code: [src/commands/shipment/on_hold.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/shipment/on_hold.ts)_

### `commercelayer shipment:packing ID`

Send this attribute if you want to start packing this shipment.

```sh-session
USAGE
  $ commercelayer shipment:packing ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to start packing this shipment.
```

_See code: [src/commands/shipment/packing.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/shipment/packing.ts)_

### `commercelayer shipment:picking ID`

Send this attribute if you want to start picking this shipment.

```sh-session
USAGE
  $ commercelayer shipment:picking ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to start picking this shipment.
```

_See code: [src/commands/shipment/picking.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/shipment/picking.ts)_

### `commercelayer shipment:purchase ID`

Send this attribute if you want to purchase this shipment with the selected rate.

```sh-session
USAGE
  $ commercelayer shipment:purchase ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to purchase this shipment with the selected rate.
```

_See code: [src/commands/shipment/purchase.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/shipment/purchase.ts)_

### `commercelayer shipment:ready_to_ship ID`

Send this attribute if you want to mark this shipment as ready to ship.

```sh-session
USAGE
  $ commercelayer shipment:ready_to_ship ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this shipment as ready to ship.
```

_See code: [src/commands/shipment/ready_to_ship.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/shipment/ready_to_ship.ts)_

### `commercelayer shipment:release_stock ID`

Send this attribute if you want to automatically destroy the stock reservations for each of the associated stock line item. Can be done only when fulfillment is in progress. Cannot be passed by sales channels.

```sh-session
USAGE
  $ commercelayer shipment:release_stock ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to automatically destroy the stock reservations for each of the associated stock line
  item. Can be done only when fulfillment is in progress. Cannot be passed by sales channels.
```

_See code: [src/commands/shipment/release_stock.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/shipment/release_stock.ts)_

### `commercelayer shipment:reserve_stock ID`

Send this attribute if you want to automatically reserve the stock for each of the associated stock line item. Can be done only when fulfillment is in progress. Cannot be passed by sales channels.

```sh-session
USAGE
  $ commercelayer shipment:reserve_stock ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to automatically reserve the stock for each of the associated stock line item. Can be
  done only when fulfillment is in progress. Cannot be passed by sales channels.
```

_See code: [src/commands/shipment/reserve_stock.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/shipment/reserve_stock.ts)_

### `commercelayer shipment:ship ID`

Send this attribute if you want to mark this shipment as shipped.

```sh-session
USAGE
  $ commercelayer shipment:ship ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this shipment as shipped.
```

_See code: [src/commands/shipment/ship.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/shipment/ship.ts)_

### `commercelayer shipment:upcoming ID`

Send this attribute if you want to mark this shipment as upcoming. Cannot be passed by sales channels.

```sh-session
USAGE
  $ commercelayer shipment:upcoming ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this shipment as upcoming. Cannot be passed by sales channels.
```

_See code: [src/commands/shipment/upcoming.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/shipment/upcoming.ts)_

### `commercelayer shipping_method ID`

Execute an action on a resource of type shipping_methods.

```sh-session
USAGE
  $ commercelayer shipping_method ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type shipping_methods
```

_See code: [src/commands/shipping_method/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/shipping_method/index.ts)_

### `commercelayer shipping_method:disable ID`

Send this attribute if you want to mark this resource as disabled.

```sh-session
USAGE
  $ commercelayer shipping_method:disable ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this resource as disabled.
```

_See code: [src/commands/shipping_method/disable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/shipping_method/disable.ts)_

### `commercelayer shipping_method:enable ID`

Send this attribute if you want to mark this resource as enabled.

```sh-session
USAGE
  $ commercelayer shipping_method:enable ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this resource as enabled.
```

_See code: [src/commands/shipping_method/enable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/shipping_method/enable.ts)_

### `commercelayer shipping_method:reset_circuit ID`

Send this attribute if you want to reset the circuit breaker associated to this resource to 'closed' state and zero failures count. Cannot be passed by sales channels.

```sh-session
USAGE
  $ commercelayer shipping_method:reset_circuit ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to reset the circuit breaker associated to this resource to 'closed' state and zero
  failures count. Cannot be passed by sales channels.
```

_See code: [src/commands/shipping_method/reset_circuit.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/shipping_method/reset_circuit.ts)_

### `commercelayer stock_item ID`

Execute an action on a resource of type stock_items.

```sh-session
USAGE
  $ commercelayer stock_item ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type stock_items
```

_See code: [src/commands/stock_item/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/stock_item/index.ts)_

### `commercelayer stock_item:validate ID`

Send this attribute if you want to validate the stock item quantity against the existing reserved stock one, returns an error in case the former is smaller. Cannot be passed by sales channels.

```sh-session
USAGE
  $ commercelayer stock_item:validate ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to validate the stock item quantity against the existing reserved stock one, returns
  an error in case the former is smaller. Cannot be passed by sales channels.
```

_See code: [src/commands/stock_item/validate.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/stock_item/validate.ts)_

### `commercelayer stock_line_item ID`

Execute an action on a resource of type stock_line_items.

```sh-session
USAGE
  $ commercelayer stock_line_item ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type stock_line_items
```

_See code: [src/commands/stock_line_item/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/stock_line_item/index.ts)_

### `commercelayer stock_line_item:decrement_stock ID`

Send this attribute if you want to automatically decrement and release the stock this stock line item. Can be done only when fulfillment is in progress. Cannot be passed by sales channels.

```sh-session
USAGE
  $ commercelayer stock_line_item:decrement_stock ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to automatically decrement and release the stock this stock line item. Can be done
  only when fulfillment is in progress. Cannot be passed by sales channels.
```

_See code: [src/commands/stock_line_item/decrement_stock.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/stock_line_item/decrement_stock.ts)_

### `commercelayer stock_line_item:release_stock ID`

Send this attribute if you want to automatically destroy the stock reservation for this stock line item. Can be done only when fulfillment is in progress. Cannot be passed by sales channels.

```sh-session
USAGE
  $ commercelayer stock_line_item:release_stock ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to automatically destroy the stock reservation for this stock line item. Can be done
  only when fulfillment is in progress. Cannot be passed by sales channels.
```

_See code: [src/commands/stock_line_item/release_stock.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/stock_line_item/release_stock.ts)_

### `commercelayer stock_line_item:reserve_stock ID`

Send this attribute if you want to automatically reserve the stock for this stock line item. Can be done only when fulfillment is in progress. Cannot be passed by sales channels.

```sh-session
USAGE
  $ commercelayer stock_line_item:reserve_stock ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to automatically reserve the stock for this stock line item. Can be done only when
  fulfillment is in progress. Cannot be passed by sales channels.
```

_See code: [src/commands/stock_line_item/reserve_stock.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/stock_line_item/reserve_stock.ts)_

### `commercelayer stock_reservation ID`

Execute an action on a resource of type stock_reservations.

```sh-session
USAGE
  $ commercelayer stock_reservation ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type stock_reservations
```

_See code: [src/commands/stock_reservation/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/stock_reservation/index.ts)_

### `commercelayer stock_reservation:pending ID`

Send this attribute if you want to mark this stock reservation as pending.

```sh-session
USAGE
  $ commercelayer stock_reservation:pending ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this stock reservation as pending.
```

_See code: [src/commands/stock_reservation/pending.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/stock_reservation/pending.ts)_

### `commercelayer stock_transfer ID`

Execute an action on a resource of type stock_transfers.

```sh-session
USAGE
  $ commercelayer stock_transfer ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type stock_transfers
```

_See code: [src/commands/stock_transfer/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/stock_transfer/index.ts)_

### `commercelayer stock_transfer:cancel ID`

Send this attribute if you want to cancel this stock transfer.

```sh-session
USAGE
  $ commercelayer stock_transfer:cancel ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to cancel this stock transfer.
```

_See code: [src/commands/stock_transfer/cancel.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/stock_transfer/cancel.ts)_

### `commercelayer stock_transfer:complete ID`

Send this attribute if you want to complete this stock transfer.

```sh-session
USAGE
  $ commercelayer stock_transfer:complete ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to complete this stock transfer.
```

_See code: [src/commands/stock_transfer/complete.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/stock_transfer/complete.ts)_

### `commercelayer stock_transfer:in_transit ID`

Send this attribute if you want to mark this stock transfer as in transit.

```sh-session
USAGE
  $ commercelayer stock_transfer:in_transit ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this stock transfer as in transit.
```

_See code: [src/commands/stock_transfer/in_transit.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/stock_transfer/in_transit.ts)_

### `commercelayer stock_transfer:on_hold ID`

Send this attribute if you want to put this stock transfer on hold.

```sh-session
USAGE
  $ commercelayer stock_transfer:on_hold ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to put this stock transfer on hold.
```

_See code: [src/commands/stock_transfer/on_hold.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/stock_transfer/on_hold.ts)_

### `commercelayer stock_transfer:picking ID`

Send this attribute if you want to start picking this stock transfer.

```sh-session
USAGE
  $ commercelayer stock_transfer:picking ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to start picking this stock transfer.
```

_See code: [src/commands/stock_transfer/picking.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/stock_transfer/picking.ts)_

### `commercelayer stock_transfer:upcoming ID`

Send this attribute if you want to mark this stock transfer as upcoming.

```sh-session
USAGE
  $ commercelayer stock_transfer:upcoming ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this stock transfer as upcoming.
```

_See code: [src/commands/stock_transfer/upcoming.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/stock_transfer/upcoming.ts)_

### `commercelayer stripe_payment ID`

Execute an action on a resource of type stripe_payments.

```sh-session
USAGE
  $ commercelayer stripe_payment ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type stripe_payments
```

_See code: [src/commands/stripe_payment/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/stripe_payment/index.ts)_

### `commercelayer stripe_payment:refresh ID`

Send this attribute if you want to refresh the payment status, can be used as webhooks fallback logic.

```sh-session
USAGE
  $ commercelayer stripe_payment:refresh ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to refresh the payment status, can be used as webhooks fallback logic.
```

_See code: [src/commands/stripe_payment/refresh.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/stripe_payment/refresh.ts)_

### `commercelayer stripe_payment:update ID`

Send this attribute if you want to update the created payment intent with fresh order data.

```sh-session
USAGE
  $ commercelayer stripe_payment:update ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to update the created payment intent with fresh order data.
```

_See code: [src/commands/stripe_payment/update.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/stripe_payment/update.ts)_

### `commercelayer vertex_account ID`

Execute an action on a resource of type vertex_accounts.

```sh-session
USAGE
  $ commercelayer vertex_account ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type vertex_accounts
```

_See code: [src/commands/vertex_account/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/vertex_account/index.ts)_

### `commercelayer vertex_account:refresh_token ID`

Send this attribute if you want to manually refresh the access token.

```sh-session
USAGE
  $ commercelayer vertex_account:refresh_token ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to manually refresh the access token.
```

_See code: [src/commands/vertex_account/refresh_token.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/vertex_account/refresh_token.ts)_

### `commercelayer void ID`

Execute an action on a resource of type voids.

```sh-session
USAGE
  $ commercelayer void ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type voids
```

_See code: [src/commands/void/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/void/index.ts)_

### `commercelayer void:forward ID`

Send this attribute if you want to forward a stuck transaction to succeeded and update associated order states accordingly.

```sh-session
USAGE
  $ commercelayer void:forward ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to forward a stuck transaction to succeeded and update associated order states
  accordingly.
```

_See code: [src/commands/void/forward.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/void/forward.ts)_

### `commercelayer webhook ID`

Execute an action on a resource of type webhooks.

```sh-session
USAGE
  $ commercelayer webhook ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  execute an action on a resource of type webhooks
```

_See code: [src/commands/webhook/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/webhook/index.ts)_

### `commercelayer webhook:disable ID`

Send this attribute if you want to mark this resource as disabled.

```sh-session
USAGE
  $ commercelayer webhook:disable ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this resource as disabled.
```

_See code: [src/commands/webhook/disable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/webhook/disable.ts)_

### `commercelayer webhook:enable ID`

Send this attribute if you want to mark this resource as enabled.

```sh-session
USAGE
  $ commercelayer webhook:enable ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to mark this resource as enabled.
```

_See code: [src/commands/webhook/enable.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/webhook/enable.ts)_

### `commercelayer webhook:reset_circuit ID`

Send this attribute if you want to reset the circuit breaker associated to this resource to 'closed' state and zero failures count. Cannot be passed by sales channels.

```sh-session
USAGE
  $ commercelayer webhook:reset_circuit ID [-u [-j -p]]

ARGUMENTS
  ID  the unique id of the resource

FLAGS
  -j, --json         print result in JSON format
  -p, --print        print out the modified resource
  -u, --unformatted  print JSON output without indentation

DESCRIPTION
  Send this attribute if you want to reset the circuit breaker associated to this resource to 'closed' state and zero
  failures count. Cannot be passed by sales channels.
```

_See code: [src/commands/webhook/reset_circuit.ts](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/src/commands/webhook/reset_circuit.ts)_
<!-- commandsstop -->
