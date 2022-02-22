@commercelayer/cli-plugin-seeder
================================

Commerce Layer CLI seeder plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli-plugin-seeder.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-seeder)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli-plugin-seeder.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-seeder)
[![License](https://img.shields.io/npm/l/@commercelayer/cli-plugin-seeder.svg)](https://github.com/commercelayer/cli-plugin-seeder/blob/master/package.json)

<!-- toc -->

* [ Usage](#-usage)
* [ Commands](#-commands)
<!-- tocstop -->
## Usage
<!-- usage -->


<!-- usagestop -->
## Commands
<!-- commands -->

* [`commercelayer seeder:check ID`](#commercelayer-seedercheck-id)
* [`commercelayer seeder:clean ID`](#commercelayer-seederclean-id)
* [`commercelayer seeder:seed ID`](#commercelayer-seederseed-id)

### `commercelayer seeder:check ID`

Execute a check on seeder data.

```
USAGE
  $ commercelayer seeder:check ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -b, --businessModel=single_sku|multi_market|custom  [default: single_sku] the kind of business model you want to
                                                      import

  -n, --name=name                                     the name of the business model file to use

  -r, --relationships                                 check resource relationships

  -u, --url=url                                       [default: https://data.commercelayer.app/seeder] seeder data URL

EXAMPLES
  $ commercelayer seeder:check -u <seedUrl>
  $ cl seeder:check -b single_sku
```

_See code: [src/commands/seeder/check.ts](https://github.com/commercelayer/commercelayer-cli-plugin-seeder/blob/main/src/commands/seeder/check.ts)_

### `commercelayer seeder:clean ID`

Clean previously imported seeder data.

```
USAGE
  $ commercelayer seeder:clean ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -b, --businessModel=single_sku|multi_market|custom  [default: single_sku] the kind of business model you want to
                                                      import

  -n, --name=name                                     the name of the business model file to use

  -o, --organization=organization                     (required) the slug of your organization

  -u, --url=url                                       [default: https://data.commercelayer.app/seeder] seeder data URL

EXAMPLES
  $ commercelayer seeder:clean -u <seedUrl>
  $ cl seeder:clean -b multi_market
```

_See code: [src/commands/seeder/clean.ts](https://github.com/commercelayer/commercelayer-cli-plugin-seeder/blob/main/src/commands/seeder/clean.ts)_

### `commercelayer seeder:seed ID`

Execute Commerce Layer seeder.

```
USAGE
  $ commercelayer seeder:seed ID

ARGUMENTS
  ID  the unique id of the order

OPTIONS
  -b, --businessModel=single_sku|multi_market|custom  [default: single_sku] the kind of business model you want to
                                                      import

  -k, --keep                                          keep existing resources without updating them

  -n, --name=name                                     the name of the business model file to use

  -o, --organization=organization                     (required) the slug of your organization

  -u, --url=url                                       [default: https://data.commercelayer.app/seeder] seeder data URL

ALIASES
  $ commercelayer seed

EXAMPLES
  $ commercelayer seeder:seed -u <seedUrl>
  $ cl seed -b multi_market
```

_See code: [src/commands/seeder/seed.ts](https://github.com/commercelayer/commercelayer-cli-plugin-seeder/blob/main/src/commands/seeder/seed.ts)_
<!-- commandsstop -->
