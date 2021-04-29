`commercelayer applications`
============================

Manage login to CLI applications

* [`commercelayer applications`](#commercelayer-applications)
* [`commercelayer applications:current`](#commercelayer-applicationscurrent)
* [`commercelayer applications:login`](#commercelayer-applicationslogin)
* [`commercelayer applications:token`](#commercelayer-applicationstoken)

## `commercelayer applications`

show a list of all (logged in) available CLI applications

```
USAGE
  $ commercelayer applications

EXAMPLES
  $ commercelayer applications
  $ cl applications
```

_See code: [src/commands/applications.ts](https://github.com/commercelayer/commercelayer-cli/blob/v0.5.14/src/commands/applications.ts)_

## `commercelayer applications:current`

set or show the current CLI application

```
USAGE
  $ commercelayer applications:current

OPTIONS
  -o, --organization=organization  organization slug
  --live                           live execution mode

ALIASES
  $ commercelayer app:current

EXAMPLES
  $ commercelayer applications:current
  $ commercelayer app:current -o <organizationSlug> --live
```

_See code: [src/commands/applications/current.ts](https://github.com/commercelayer/commercelayer-cli/blob/v0.5.14/src/commands/applications/current.ts)_

## `commercelayer applications:login`

execute login to a CLI Commerce Layer application

```
USAGE
  $ commercelayer applications:login

OPTIONS
  -i, --clientId=clientId          (required) organization client_id
  -o, --organization=organization  (required) organization slug
  -s, --clientSecret=clientSecret  (required) organization client_secret

ALIASES
  $ commercelayer app:login

EXAMPLE
  $ commercelayer applications:login -o <organizationSlug> -i <clientId> -s <clientSecret>
```

_See code: [src/commands/applications/login.ts](https://github.com/commercelayer/commercelayer-cli/blob/v0.5.14/src/commands/applications/login.ts)_

## `commercelayer applications:token`

get a new access token from Commerce Layer API

```
USAGE
  $ commercelayer applications:token

OPTIONS
  -o, --organization=organization  (required) [default: cli-test-org] organization slug
  --live                           live execution mode
  --save                           save access token

ALIASES
  $ commercelayer app:token

EXAMPLES
  $ commercelayer applications:token
  $ commercelayer app:token -o <organizationSlug> --live --save
```

_See code: [src/commands/applications/token.ts](https://github.com/commercelayer/commercelayer-cli/blob/v0.5.14/src/commands/applications/token.ts)_
