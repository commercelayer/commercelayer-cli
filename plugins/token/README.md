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

* [`commercelayer token:create`](#commercelayer-tokencreate)
* [`commercelayer token:decode [TOKEN]`](#commercelayer-tokendecode-token)
* [`commercelayer token:generate`](#commercelayer-tokengenerate)
* [`commercelayer token:get`](#commercelayer-tokenget)
* [`commercelayer token:info [TOKEN]`](#commercelayer-tokeninfo-token)
* [`commercelayer token:revoke [TOKEN]`](#commercelayer-tokenrevoke-token)

### `commercelayer token:create`

Create a new custom access token for the current application.

```sh-session
USAGE
  $ commercelayer token:create -s <value> -m <value> [--info]

FLAGS
  -m, --minutes=<value>  (required) minutes to token expiration [2, 120]
  -s, --shared=<value>   (required) organization shared secret
  --info                 show access token info

DESCRIPTION
  create a new custom access token for the current application

EXAMPLES
  $ commercelayer token:create -s <sharedSecret> -m 30

  $ cl token:create -s <sharedSecret> -m 15 --info
```

_See code: [src/commands/token/create.ts](https://github.com/commercelayer/commercelayer-cli-plugin-token/blob/main/src/commands/token/create.ts)_

### `commercelayer token:decode [TOKEN]`

Decode a Commerce Layer access token.

```sh-session
USAGE
  $ commercelayer token:decode [TOKEN]

ARGUMENTS
  TOKEN  the access token to decode

DESCRIPTION
  decode a Commerce Layer access token

ALIASES
  $ commercelayer token:info

EXAMPLES
  $ commercelayer token:decode

  $ cl token:info -a <accessToken>
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
  $ commercelayer token:get -i <value> [-s <value>] [-S <value>] [-e <value> -p <value>] [--info]

FLAGS
  -S, --scope=<value>...      access token scope (market, stock location)
  -e, --email=<value>         customer email
  -i, --clientId=<value>      (required) application client_id
  -p, --password=<value>      customer secret password
  -s, --clientSecret=<value>  application client_secret
  --info                      show access token info

DESCRIPTION
  get a new access token

EXAMPLES
  $ commercelayer token:get

  $ cl token:get --info
```

_See code: [src/commands/token/get.ts](https://github.com/commercelayer/commercelayer-cli-plugin-token/blob/main/src/commands/token/get.ts)_

### `commercelayer token:info [TOKEN]`

Decode a Commerce Layer access token.

```sh-session
USAGE
  $ commercelayer token:info [TOKEN]

ARGUMENTS
  TOKEN  the access token to decode

DESCRIPTION
  decode a Commerce Layer access token

ALIASES
  $ commercelayer token:info

EXAMPLES
  $ commercelayer token:decode

  $ cl token:info -a <accessToken>
```

### `commercelayer token:revoke [TOKEN]`

Revoke a Commerce Layer access token.

```sh-session
USAGE
  $ commercelayer token:revoke [TOKEN]

ARGUMENTS
  TOKEN  access token to revoke

DESCRIPTION
  revoke a Commerce Layer access token

EXAMPLES
  $ commercelayer token:revoke

  $ cl token:revoke -a <accessToken>
```

_See code: [src/commands/token/revoke.ts](https://github.com/commercelayer/commercelayer-cli-plugin-token/blob/main/src/commands/token/revoke.ts)_
<!-- commandsstop -->
