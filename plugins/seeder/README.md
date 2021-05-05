@commercelayer/cli-plugin-seeder
================================

Commerce Layer CLI seeder plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli-plugin-seeder.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-seeder)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli-plugin-seeder.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-seeder)
[![License](https://img.shields.io/npm/l/@commercelayer/cli-plugin-seeder.svg)](https://github.com/commercelayer/cli-plugin-seeder/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @commercelayer/cli-plugin-seeder
$ cl-seeder COMMAND
running command...
$ cl-seeder (-v|--version|version)
@commercelayer/cli-plugin-seeder/1.0.0-beta.15 darwin-x64 node-v15.13.0
$ cl-seeder --help [COMMAND]
USAGE
  $ cl-seeder COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`cl-seeder seed`](#cl-seeder-seed)

## `cl-seeder seed`

execute Commerce Layer seeder

```
USAGE
  $ cl-seeder seed

OPTIONS
  -b, --businessModel=multi_market|custom  [default: multi_market] the kind of business model you want to import
  -h, --help                               show CLI help
  -m, --maxItems=maxItems                  [default: all] the maximum number of SKUs that will be imported
  -o, --organization=organization          (required) the slug of your organization

  -u, --resourcesUrl=resourcesUrl          [default: https://data.commercelayer.app/seed] the resources URL or local
                                           path

EXAMPLES
  $ cl-seeder seed -o <organizationSlug> -i <clientId> -s <clientSecret> --accessToken=<accessToken> -u <seedUrl>
  $ cl seed -m all -u <seedUrl> -b multi_market
```

_See code: [src/commands/seed.ts](https://github.com/commercelayer/commercelayer-cli-plugin-seeder/blob/v1.0.0-beta.15/src/commands/seed.ts)_
<!-- commandsstop -->
