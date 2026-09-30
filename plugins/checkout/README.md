# @commercelayer/cli-plugin-checkout

Commerce Layer CLI Checkout plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli-plugin-checkout.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-checkout)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli-plugin-checkout.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-checkout)
[![License](https://img.shields.io/npm/l/@commercelayer/cli-plugin-checkout.svg)](https://github.com/commercelayer/commercelayer-cli-plugin-checkout/blob/master/package.json)

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
$ commercelayer plugins:install checkout
```

## Commands
<!-- commands -->

* [`commercelayer checkout`](#commercelayer-checkout)
* [`commercelayer checkout:order ID`](#commercelayer-checkoutorder-id)

### `commercelayer checkout`

Create checkout URLs.

```sh-session
USAGE
  $ commercelayer checkout (-a <value> ) [--open] [-m <value> | [-O <value> | -S <value>... | -B <value>...]]
    [-c <value> | ] [-e <value> | ]

FLAGS
  -B, --bundle=<value>...    a bundle code
  -O, --order=<value>        an order id
  -S, --sku=<value>...       an SKU code
  -a, --accessToken=<value>  (required) custom access token to use instead of the one used for login
  -c, --coupon=<value>       a promo code
  -e, --email=<value>        a customer email
  -m, --market=<value>       a market number
      --open                 open checkout URL in default browser

DESCRIPTION
  create checkout URLs

EXAMPLES
  $ commercelayer checkout -O <order-id>

  $ cl checkout -S <sku-code> -m <market-id> -c <coupon-code> -e <email-address>

  $ cl checkout -S <sku-code-1> -S <sku-code-2> -m <market-id>
```

_See code: [src/commands/checkout/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-checkout/blob/main/src/commands/checkout/index.ts)_

### `commercelayer checkout:order ID`

Create checkout URLs starting from an existing order.

```sh-session
USAGE
  $ commercelayer checkout:order ID (-a <value> ) [--open]

ARGUMENTS
  ID  unique id of the order

FLAGS
  -a, --accessToken=<value>  (required) custom access token to use instead of the one used for login
      --open                 open checkout URL in default browser

DESCRIPTION
  create checkout URLs starting from an existing order

EXAMPLES
  $ commercelayer checkout:order <order-id>
```

_See code: [src/commands/checkout/order.ts](https://github.com/commercelayer/commercelayer-cli-plugin-checkout/blob/main/src/commands/checkout/order.ts)_
<!-- commandsstop -->
