# @commercelayer/cli-plugin-exports

Commerce Layer CLI Exports plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli-plugin-exports.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-exports)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli-plugin-exports.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-exports)
[![License](https://img.shields.io/npm/l/@commercelayer/cli-plugin-exports.svg)](https://github.com/@commercelayer/cli-plugin-exports/blob/master/package.json)

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

* [`commercelayer exports [ID]`](#commercelayer-exports-id)
* [`commercelayer exports:create`](#commercelayer-exportscreate)
* [`commercelayer exports:details ID`](#commercelayer-exportsdetails-id)
* [`commercelayer exports:group GROUP_ID`](#commercelayer-exportsgroup-group_id)
* [`commercelayer exports:interrupt ID`](#commercelayer-exportsinterrupt-id)
* [`commercelayer exports:list`](#commercelayer-exportslist)
* [`commercelayer exports:types`](#commercelayer-exportstypes)

### `commercelayer exports [ID]`

List all the created exports or show details of a single export.

```sh-session
USAGE
  $ commercelayer exports [ID] [-A | -l <value>] [-t
    addresses|adjustments|adyen_payments|applications|attachments|axerve_payments|braintree_payments|bundles|business_ru
    les|carrier_accounts|checkout_com_payments|coupons|customer_addresses|customer_groups|customer_password_resets|custo
    mer_payment_sources|customer_subscriptions|customers|delivery_lead_times|discount_engine_items|discount_engines|even
    t_callbacks|event_stores|events|external_payments|geocoders|gift_cards|in_stock_subscriptions|inventory_models|inven
    tory_return_locations|inventory_stock_locations|klarna_payments|line_item_options|line_items|links|markets|merchants
    |notifications|order_factories|order_subscription_items|order_subscriptions|order_validation_rules|orders|packages|p
    arcel_line_items|parcels|payment_gateways|payment_links|payment_methods|payment_options|payment_sessions|payment_set
    tings|payment_transactions|payment_wallets|paypal_payments|pickups|price_list_schedulers|price_lists|price_tiers|pri
    ces|promotion_rules|promotions|reserved_stocks|resource_errors|return_line_items|returns|satispay_payments|shipments
    |shipping_categories|shipping_method_tiers|shipping_methods|shipping_zones|sku_list_items|sku_lists|sku_options|skus
    |stock_items|stock_line_items|stock_locations|stock_reservations|stock_transfers|stores|stripe_payments|subscription
    _models|tags|tax_calculators|tax_categories|tax_rules|transactions|webhooks|wire_transfers] [-s
    in_progress|pending|completed|interrupted]

ARGUMENTS
  [ID]  unique id of the export to be retrieved

FLAGS
  -A, --all
      show all exports instead of first 25 only

  -l, --limit=<value>
      limit number of exports in output

  -s, --status=<option>
      the export job status
      <options: in_progress|pending|completed|interrupted>

  -t, --type=<option>
      the type of resource exported
      <options: addresses|adjustments|adyen_payments|applications|attachments|axerve_payments|braintree_payments|bundles|b
      usiness_rules|carrier_accounts|checkout_com_payments|coupons|customer_addresses|customer_groups|customer_password_re
      sets|customer_payment_sources|customer_subscriptions|customers|delivery_lead_times|discount_engine_items|discount_en
      gines|event_callbacks|event_stores|events|external_payments|geocoders|gift_cards|in_stock_subscriptions|inventory_mo
      dels|inventory_return_locations|inventory_stock_locations|klarna_payments|line_item_options|line_items|links|markets
      |merchants|notifications|order_factories|order_subscription_items|order_subscriptions|order_validation_rules|orders|
      packages|parcel_line_items|parcels|payment_gateways|payment_links|payment_methods|payment_options|payment_sessions|p
      ayment_settings|payment_transactions|payment_wallets|paypal_payments|pickups|price_list_schedulers|price_lists|price
      _tiers|prices|promotion_rules|promotions|reserved_stocks|resource_errors|return_line_items|returns|satispay_payments
      |shipments|shipping_categories|shipping_method_tiers|shipping_methods|shipping_zones|sku_list_items|sku_lists|sku_op
      tions|skus|stock_items|stock_line_items|stock_locations|stock_reservations|stock_transfers|stores|stripe_payments|su
      bscription_models|tags|tax_calculators|tax_categories|tax_rules|transactions|webhooks|wire_transfers>

DESCRIPTION
  list all the created exports or show details of a single export
```

_See code: [src/commands/exports/index.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/plugins/exports/src/commands/exports/index.ts)_

### `commercelayer exports:create`

Create a new export.

```sh-session
USAGE
  $ commercelayer exports:create -t <value> [-i <value>...] [-w <value>...] [-f <value>...] [-D] [-F csv|json | -C |
    ] [-x <value> | -X <value>] [-b] [-P | ] [-O]

FLAGS
  -C, --csv                 export data in CSV format
  -D, --dry-data            skip redundant attributes
  -F, --format=<option>     [default: json] export file format
                            <options: csv|json>
  -O, --open                open automatically the file after a successful export
  -P, --prettify            prettify json output format
  -X, --save-path=<value>   save command output to file and create missing path directories
  -b, --blind               execute in blind mode without showing the progress monitor
  -f, --fields=<value>...   comma separated list of fields to include in the export
  -i, --include=<value>...  comma separated resources to include
  -t, --type=<value>        (required) the type of resource being exported
  -w, --where=<value>...    comma separated list of query filters
  -x, --save=<value>        save command output to file

DESCRIPTION
  create a new export

ALIASES
  $ commercelayer exp:create
  $ commercelayer export

EXAMPLES
  $ commercelayer exports:create -t orders -f number -X <output-file-path>

  $ cl exp:create -t customers -i customer_subscriptions -w email_end=@test.org -X <output-file-path> --csv

  $ cl export -t return -f number -X desktop/returns.json
```

_See code: [src/commands/exports/create.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/plugins/exports/src/commands/exports/create.ts)_

### `commercelayer exports:details ID`

Show the details of an existing export.

```sh-session
USAGE
  $ commercelayer exports:details ID

ARGUMENTS
  ID  id of the export resource

DESCRIPTION
  show the details of an existing export

ALIASES
  $ commercelayer exp:details

EXAMPLES
  $ commercelayer exports:details <export-id>

  $ cl exp:details <export-id>
```

_See code: [src/commands/exports/details.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/plugins/exports/src/commands/exports/details.ts)_

### `commercelayer exports:group GROUP_ID`

List all the exports related to an export group.

```sh-session
USAGE
  $ commercelayer exports:group GROUP_ID

ARGUMENTS
  GROUP_ID  unique id of the group export

DESCRIPTION
  list all the exports related to an export group

ALIASES
  $ commercelayer exp:group

EXAMPLES
  $ commercelayer exports:group <group-id>

  $ cl exp:group <group-id>
```

_See code: [src/commands/exports/group.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/plugins/exports/src/commands/exports/group.ts)_

### `commercelayer exports:interrupt ID`

Show the details of an existing export.

```sh-session
USAGE
  $ commercelayer exports:interrupt ID [-D]

ARGUMENTS
  ID  id of the export resource

FLAGS
  -D, --details  show export details after command execution

DESCRIPTION
  show the details of an existing export

ALIASES
  $ commercelayer exp:interrupt

EXAMPLES
  $ commercelayer exports:interrupt <export-id>

  $ cl exp:interrupt <export-id>
```

_See code: [src/commands/exports/interrupt.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/plugins/exports/src/commands/exports/interrupt.ts)_

### `commercelayer exports:list`

List all the created exports.

```sh-session
USAGE
  $ commercelayer exports:list [-A | -l <value>] [-t
    addresses|adjustments|adyen_payments|applications|attachments|axerve_payments|braintree_payments|bundles|business_ru
    les|carrier_accounts|checkout_com_payments|coupons|customer_addresses|customer_groups|customer_password_resets|custo
    mer_payment_sources|customer_subscriptions|customers|delivery_lead_times|discount_engine_items|discount_engines|even
    t_callbacks|event_stores|events|external_payments|geocoders|gift_cards|in_stock_subscriptions|inventory_models|inven
    tory_return_locations|inventory_stock_locations|klarna_payments|line_item_options|line_items|links|markets|merchants
    |notifications|order_factories|order_subscription_items|order_subscriptions|order_validation_rules|orders|packages|p
    arcel_line_items|parcels|payment_gateways|payment_links|payment_methods|payment_options|payment_sessions|payment_set
    tings|payment_transactions|payment_wallets|paypal_payments|pickups|price_list_schedulers|price_lists|price_tiers|pri
    ces|promotion_rules|promotions|reserved_stocks|resource_errors|return_line_items|returns|satispay_payments|shipments
    |shipping_categories|shipping_method_tiers|shipping_methods|shipping_zones|sku_list_items|sku_lists|sku_options|skus
    |stock_items|stock_line_items|stock_locations|stock_reservations|stock_transfers|stores|stripe_payments|subscription
    _models|tags|tax_calculators|tax_categories|tax_rules|transactions|webhooks|wire_transfers] [-s
    in_progress|pending|completed|interrupted]

FLAGS
  -A, --all
      show all exports instead of first 25 only

  -l, --limit=<value>
      limit number of exports in output

  -s, --status=<option>
      the export job status
      <options: in_progress|pending|completed|interrupted>

  -t, --type=<option>
      the type of resource exported
      <options: addresses|adjustments|adyen_payments|applications|attachments|axerve_payments|braintree_payments|bundles|b
      usiness_rules|carrier_accounts|checkout_com_payments|coupons|customer_addresses|customer_groups|customer_password_re
      sets|customer_payment_sources|customer_subscriptions|customers|delivery_lead_times|discount_engine_items|discount_en
      gines|event_callbacks|event_stores|events|external_payments|geocoders|gift_cards|in_stock_subscriptions|inventory_mo
      dels|inventory_return_locations|inventory_stock_locations|klarna_payments|line_item_options|line_items|links|markets
      |merchants|notifications|order_factories|order_subscription_items|order_subscriptions|order_validation_rules|orders|
      packages|parcel_line_items|parcels|payment_gateways|payment_links|payment_methods|payment_options|payment_sessions|p
      ayment_settings|payment_transactions|payment_wallets|paypal_payments|pickups|price_list_schedulers|price_lists|price
      _tiers|prices|promotion_rules|promotions|reserved_stocks|resource_errors|return_line_items|returns|satispay_payments
      |shipments|shipping_categories|shipping_method_tiers|shipping_methods|shipping_zones|sku_list_items|sku_lists|sku_op
      tions|skus|stock_items|stock_line_items|stock_locations|stock_reservations|stock_transfers|stores|stripe_payments|su
      bscription_models|tags|tax_calculators|tax_categories|tax_rules|transactions|webhooks|wire_transfers>

DESCRIPTION
  list all the created exports

ALIASES
  $ commercelayer exp:list

EXAMPLES
  $ commercelayer exports

  $ cl exports:list -A

  $ cl exp:list
```

_See code: [src/commands/exports/list.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/plugins/exports/src/commands/exports/list.ts)_

### `commercelayer exports:types`

Show online documentation for supported resources.

```sh-session
USAGE
  $ commercelayer exports:types [-O]

FLAGS
  -O, --open  open online documentation page

DESCRIPTION
  show online documentation for supported resources

ALIASES
  $ commercelayer exp:types

EXAMPLES
  $ commercelayer exports:types

  $ cl exp:types
```

_See code: [src/commands/exports/types.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/plugins/exports/src/commands/exports/types.ts)_
<!-- commandsstop -->
