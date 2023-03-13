# commercelayer-cli-plugin-token

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli-plugin-token.svg)](https://npmjs.org/package/commercelayer-cli-plugin-token)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli-plugin-token.svg)](https://npmjs.org/package/@commercelayer-/li-plugin-token)
[![License](https://img.shields.io/npm/l/@commercelayer/cli-plugin-token.svg)](https://github.com/pviti/@commercelayer/cli-plugin-token/blob/master/package.json)

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

* [`commercelayer token:decode TOKEN`](#commercelayer-tokendecode-token)
* [`commercelayer token:generate`](#commercelayer-tokengenerate)
* [`commercelayer token:get`](#commercelayer-tokenget)
* [`commercelayer token:revoke TOKEN`](#commercelayer-tokenrevoke-token)

### `commercelayer token:decode TOKEN`

Decode a Commerce Layer access token.

```sh-session
USAGE
  $ commercelayer token:decode TOKEN

ARGUMENTS
  TOKEN  the access token to be decoded

DESCRIPTION
  decode a Commerce Layer access token

ALIASES
  $ commercelayer token:info

EXAMPLES
  $ commercelayer token:decode <accessToken>

  $ cl token:info <accessToken>
```

_See code: [src/commands/token/decode.ts](https://github.com/commercelayer/commercelayer-cli-plugin-token/blob/main/src/commands/token/decode.ts)_

### `commercelayer token:generate`

Start a wizard to generate a custom access token.

```sh-session
USAGE
  $ commercelayer token:generate [-i] [-c]

FLAGS
  -c, --check  check generated access token
  -i, --info   print generated token info

DESCRIPTION
  start a wizard to generate a custom access token

EXAMPLES
  $ commercelayer token:generate

  $ cl token:generate
```

_See code: [src/commands/token/generate.ts](https://github.com/commercelayer/commercelayer-cli-plugin-token/blob/main/src/commands/token/generate.ts)_

### `commercelayer token:get`

Get a new access token.

```sh-session
USAGE
  $ commercelayer token:get -o <value> (-s <value> -i <value>) [-S <value> ] [-e <value> -p <value>] [--info]

FLAGS
  -S, --scope=<value>...      access token scope (market, stock location)
  -e, --email=<value>         customer email
  -i, --clientId=<value>      (required) application client_id
  -o, --organization=<value>  (required) the slug of your organization
  -p, --password=<value>      customer secret password
  -s, --clientSecret=<value>  application client_secret
  --info                      show access token info

DESCRIPTION
  get a new access token

EXAMPLES
  $ commercelayer token:get -o <organizationSlug> -i <clientId> -s <clientSecret>

  $ cl token:get -o <organizationSlug> -i <clientId> -S <scope> --info
```

_See code: [src/commands/token/get.ts](https://github.com/commercelayer/commercelayer-cli-plugin-token/blob/main/src/commands/token/get.ts)_

### `commercelayer token:revoke TOKEN`

Revoke a Commerce Layer access token.

```sh-session
USAGE
  $ commercelayer token:revoke TOKEN -o <value> (-s <value> -i <value>) [-S <value> ]

ARGUMENTS
  TOKEN  access token to revoke

FLAGS
  -S, --scope=<value>...      access token scope
  -i, --clientId=<value>      (required) application client_id
  -o, --organization=<value>  (required) the slug of your organization
  -s, --clientSecret=<value>  application client_secret

DESCRIPTION
  revoke a Commerce Layer access token

EXAMPLES
  $ commercelayer token:revoke -o <organizationSlug> <accessToken> -i <clientId>

  $ cl token:revoke -o <organizationSlug> <accessToken> -i <clientId>
```

_See code: [src/commands/token/revoke.ts](https://github.com/commercelayer/commercelayer-cli-plugin-token/blob/main/src/commands/token/revoke.ts)_
<!-- commandsstop -->
