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
$ commercelayer COMMAND

$ commercelayer (-v | version | --version) to check the version of the CLI you have installed.

$ commercelayer [COMMAND] (--help | -h) for detailed information about CLI commands.
```
<!-- usagestop -->
# Commands
<!-- commands -->

* [`commercelayer checkout`](#commercelayer-checkout)
* [`commercelayer checkout:order ID`](#commercelayer-checkoutorder-id)

### `commercelayer checkout`

Create checkout URLs.

```
USAGE
  $ commercelayer checkout

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

_See code: [src/commands/checkout/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-checkout/blob/main/src/commands/checkout/index.ts)_

### `commercelayer checkout:order ID`

Create checkout URLs starting from an existing order.

```
USAGE
  $ commercelayer checkout:order ID

ARGUMENTS
  ID  unique id of the order

OPTIONS
  -a, --accessToken=accessToken    (required)
  -o, --organization=organization  (required) the slug of your organization
  --open                           open checkout URL in default browser
```

_See code: [src/commands/checkout/order.ts](https://github.com/commercelayer/commercelayer-cli-plugin-checkout/blob/main/src/commands/checkout/order.ts)_
<!-- commandsstop -->
