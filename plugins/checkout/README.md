@commercelayer/cli-plugin-checkout
==================================

Commerce Layer CLI Checkout plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli-plugin-checkout.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-checkout)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli-plugin-checkout.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-checkout)
[![License](https://img.shields.io/npm/l/@commercelayer/cli-plugin-checkout.svg)](https://github.com/commercelayer/commercelayer-cli-plugin-checkout/blob/master/package.json)

<!-- toc -->


<!-- tocstop -->
# Usage
<!-- usage -->

```sh-session
$ cl-checkout COMMAND

$ cl-checkout (-v | version | --version) to check the version of the CLI you have installed.

$ cl-checkout [COMMAND] (--help | -h) for detailed information about CLI commands.
```
<!-- usagestop -->
# Commands
<!-- commands -->

* [`cl-checkout checkout`](#cl-checkout-checkout)
* [`cl-checkout checkout:order ID`](#cl-checkout-checkoutorder-id)

### `cl-checkout checkout`

Create checkout URLs.

```
USAGE
  $ cl-checkout checkout

OPTIONS
  -O, --order=order                an order id
  -S, --sku=sku                    an SKU code
  -a, --accessToken=accessToken    (required)
  -c, --coupon=coupon              a promo code
  -e, --email=email                a customer email
  -m, --market=market              a market number
  -o, --organization=organization  (required) the slug of your organization
  --open                           open checkout URL in default browser
```

_See code: [src/commands/checkout/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-checkout/blob/v1.1.0/src/commands/checkout/index.ts)_

### `cl-checkout checkout:order ID`

Create checkout URLs starting from an existing order.

```
USAGE
  $ cl-checkout checkout:order ID

ARGUMENTS
  ID  unique id of the order

OPTIONS
  -a, --accessToken=accessToken    (required)
  -o, --organization=organization  (required) the slug of your organization
  --open                           open checkout URL in default browser
```

_See code: [src/commands/checkout/order.ts](https://github.com/commercelayer/commercelayer-cli-plugin-checkout/blob/v1.1.0/src/commands/checkout/order.ts)_
<!-- commandsstop -->
