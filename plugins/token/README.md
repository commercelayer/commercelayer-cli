commercelayer-cli-plugin-token
==============================



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/commercelayer-cli-plugin-token.svg)](https://npmjs.org/package/commercelayer-cli-plugin-token)
[![Downloads/week](https://img.shields.io/npm/dw/commercelayer-cli-plugin-token.svg)](https://npmjs.org/package/commercelayer-cli-plugin-token)
[![License](https://img.shields.io/npm/l/commercelayer-cli-plugin-token.svg)](https://github.com/pviti/commercelayer-cli-plugin-token/blob/master/package.json)

<!-- toc -->


<!-- tocstop -->
# Usage
<!-- usage -->


<!-- usagestop -->
# Commands
<!-- commands -->

* [`cl-token token:create`](#cl-token-tokencreate)
* [`cl-token token:decode [TOKEN]`](#cl-token-tokendecode-token)
* [`cl-token token:get`](#cl-token-tokenget)
* [`cl-token token:revoke [TOKEN]`](#cl-token-tokenrevoke-token)

### `cl-token token:create`

Create a new custom access token.

```
USAGE
  $ cl-token token:create

OPTIONS
  -m, --minutes=minutes            (required) minutes to token expiration [2, 120]
  -o, --organization=organization  (required) the slug of your organization
  -s, --shared=shared              (required) organization shared secret
  --info                           show access token info

EXAMPLES
  $ commercelayer token:create -s <sharedSecret> -m 30
  $ cl token:create -s <sharedSecret> -m 15 --info
```

_See code: [src/commands/token/create.ts](https://github.com/commercelayer/commercelayer-cli-plugin-token/blob/main/src/commands/token/create.ts)_

### `cl-token token:decode [TOKEN]`

Decode a Commerce Layer access token.

```
USAGE
  $ cl-token token:decode [TOKEN]

ARGUMENTS
  TOKEN  the access token to decode

OPTIONS
  -o, --organization=organization  (required) the slug of your organization

ALIASES
  $ cl-token token:info

EXAMPLES
  $ commercelayer token:decode
  $ cl token:info -a <accessToken>
```

_See code: [src/commands/token/decode.ts](https://github.com/commercelayer/commercelayer-cli-plugin-token/blob/main/src/commands/token/decode.ts)_

### `cl-token token:get`

Get a new access token.

```
USAGE
  $ cl-token token:get

OPTIONS
  -S, --scope=scope                access token scope (market, stock location)
  -e, --email=email                customer email
  -i, --clientId=clientId          (required) application client_id
  -o, --organization=organization  (required) the slug of your organization
  -p, --password=password          customer secret password
  -s, --clientSecret=clientSecret  application client_secret
  --info                           show access token info

EXAMPLES
  $ commercelayer token:get
  $ cl token:get --info
```

_See code: [src/commands/token/get.ts](https://github.com/commercelayer/commercelayer-cli-plugin-token/blob/main/src/commands/token/get.ts)_

### `cl-token token:revoke [TOKEN]`

Revoke a Commerce Layer access token.

```
USAGE
  $ cl-token token:revoke [TOKEN]

ARGUMENTS
  TOKEN  access token to revoke

OPTIONS
  -i, --clientId=clientId          (required) application client_id
  -o, --organization=organization  (required) the slug of your organization
  -s, --clientSecret=clientSecret  (required) application client_secret

EXAMPLES
  $ commercelayer token:revoke
  $ cl token:revoke -a <accessToken>
```

_See code: [src/commands/token/revoke.ts](https://github.com/commercelayer/commercelayer-cli-plugin-token/blob/main/src/commands/token/revoke.ts)_
<!-- commandsstop -->
