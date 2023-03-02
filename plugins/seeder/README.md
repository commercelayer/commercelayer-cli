# @commercelayer/cli-plugin-seeder

Commerce Layer CLI seeder plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli-plugin-seeder.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-seeder)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli-plugin-seeder.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-seeder)
[![License](https://img.shields.io/npm/l/@commercelayer/cli-plugin-seeder.svg)](https://github.com/commercelayer/cli-plugin-seeder/blob/master/package.json)

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

* [`commercelayer seeder:check`](#commercelayer-seedercheck)
* [`commercelayer seeder:clean`](#commercelayer-seederclean)
* [`commercelayer seeder:seed`](#commercelayer-seederseed)

### `commercelayer seeder:check`

Execute a check on seeder data.

```sh-session
USAGE
  $ commercelayer seeder:check [-b single_sku|multi_market|custom] [-n <value> -u <value>] [-r]

FLAGS
  -b, --businessModel=<option>  [default: single_sku] the kind of business model you want to import
                                <options: single_sku|multi_market|custom>
  -n, --name=<value>            the name of the business model file to use
  -r, --relationships           check resource relationships
  -u, --url=<value>             [default: https://data.commercelayer.app/seeder] seeder data URL

DESCRIPTION
  execute a check on seeder data

EXAMPLES
  $ commercelayer seeder:check -u <seedUrl>

  $ cl seeder:check -b single_sku
```

_See code: [src/commands/seeder/check.ts](https://github.com/commercelayer/commercelayer-cli-plugin-seeder/blob/main/src/commands/seeder/check.ts)_

### `commercelayer seeder:clean`

Clean previously imported seeder data.

```sh-session
USAGE
  $ commercelayer seeder:clean -o <value> [-b single_sku|multi_market|custom] [-n <value> -u <value>]

FLAGS
  -b, --businessModel=<option>  [default: single_sku] the kind of business model you want to import
                                <options: single_sku|multi_market|custom>
  -n, --name=<value>            the name of the business model file to use
  -o, --organization=<value>    (required) the slug of your organization
  -u, --url=<value>             [default: https://data.commercelayer.app/seeder] seeder data URL

DESCRIPTION
  clean previously imported seeder data

EXAMPLES
  $ commercelayer seeder:clean -u <seedUrl>

  $ cl seeder:clean -b multi_market
```

_See code: [src/commands/seeder/clean.ts](https://github.com/commercelayer/commercelayer-cli-plugin-seeder/blob/main/src/commands/seeder/clean.ts)_

### `commercelayer seeder:seed`

Execute Commerce Layer seeder.

```sh-session
USAGE
  $ commercelayer seeder:seed -o <value> [-b single_sku|multi_market|custom] [-n <value> -u <value>] [-k]

FLAGS
  -b, --businessModel=<option>  [default: single_sku] the kind of business model you want to import
                                <options: single_sku|multi_market|custom>
  -k, --keep                    keep existing resources without updating them
  -n, --name=<value>            the name of the business model file to use
  -o, --organization=<value>    (required) the slug of your organization
  -u, --url=<value>             [default: https://data.commercelayer.app/seeder] seeder data URL

DESCRIPTION
  execute Commerce Layer seeder

ALIASES
  $ commercelayer seed

EXAMPLES
  $ commercelayer seeder:seed -u <seedUrl>

  $ cl seed -b multi_market
```

_See code: [src/commands/seeder/seed.ts](https://github.com/commercelayer/commercelayer-cli-plugin-seeder/blob/main/src/commands/seeder/seed.ts)_
<!-- commandsstop -->
