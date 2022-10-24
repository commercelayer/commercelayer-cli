# @commercelayer/cli-plugin-microstore

Commerce Layer CLI Microstore plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli-plugin-microstore.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-microstore)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli-plugin-microstore.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-microstore)
[![License](https://img.shields.io/npm/l/@commercelayer/cli-plugin-microstore.svg)](https://github.com/commercelayer/cli-plugin-microstore/blob/master/package.json)

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
$ commercelayer plugins:install microstore
```

## Commands
<!-- commands -->

* [`commercelayer microstore`](#commercelayer-microstore)

### `commercelayer microstore`

Create Microstore URLs.

```sh-session
USAGE
  $ commercelayer microstore -o <value> -a <value> -S <value> [--open] [-A] [-I -C]

FLAGS
  -A, --all                   activate the Buy All button
  -C, --cart                  activate the Cart application
  -I, --inline                disable redirect to Cart application
  -S, --skuListId=<value>     (required) the sku list id
  -a, --accessToken=<value>   (required)
  -o, --organization=<value>  (required) the slug of your organization
  --open                      open microstore URL in default browser

DESCRIPTION
  create Microstore URLs

EXAMPLES
  $ commercelayer microstore -S <sku-list-id>

  $ cl microstore -S <sku-list-id> --all --cart

  $ cl microstore -S <sku-list-id> --cart --inline --open
```

_See code: [src/commands/microstore/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-microstore/blob/main/src/commands/microstore/index.ts)_
<!-- commandsstop -->
