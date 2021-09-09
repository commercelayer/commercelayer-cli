`commercelayer applications`
============================

Manage login to CLI applications.

* [`commercelayer applications`](#commercelayer-applications)
* [`commercelayer applications:current`](#commercelayer-applicationscurrent)
* [`commercelayer applications:login`](#commercelayer-applicationslogin)
* [`commercelayer applications:logout`](#commercelayer-applicationslogout)
* [`commercelayer applications:token`](#commercelayer-applicationstoken)

### `commercelayer applications`

Show a list of all (logged in) available CLI applications.

```
USAGE
  $ commercelayer applications

ALIASES
  $ commercelayer app:list
  $ commercelayer applications:list
  $ commercelayer app:available
  $ commercelayer applications:available

EXAMPLES
  $ commercelayer applications
  $ cl applications
```

_See code: [src/commands/applications/index.ts](https://github.com/commercelayer/commercelayer-cli/blob/v1.0.2/src/commands/applications/index.ts)_

### `commercelayer applications:current`

Set or show the current CLI application.

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

_See code: [src/commands/applications/current.ts](https://github.com/commercelayer/commercelayer-cli/blob/v1.0.2/src/commands/applications/current.ts)_

### `commercelayer applications:login`

Execute login to a CLI Commerce Layer application.

```
USAGE
  $ commercelayer applications:login

OPTIONS
  -i, --clientId=clientId          (required) organization client_id
  -o, --organization=organization  (required) organization slug
  -s, --clientSecret=clientSecret  (required) organization client_secret

ALIASES
  $ commercelayer app:login
  $ commercelayer app:add
  $ commercelayer applications:add

EXAMPLE
  $ commercelayer applications:login -o <organizationSlug> -i <clientId> -s <clientSecret>
```

_See code: [src/commands/applications/login.ts](https://github.com/commercelayer/commercelayer-cli/blob/v1.0.2/src/commands/applications/login.ts)_

### `commercelayer applications:logout`

Remove an application from CLI local configuration.

```
USAGE
  $ commercelayer applications:logout

OPTIONS
  -o, --organization=organization  (required) organization slug
  --live                           live execution mode

ALIASES
  $ commercelayer app:logout
  $ commercelayer app:remove
  $ commercelayer applications:remove
```

_See code: [src/commands/applications/logout.ts](https://github.com/commercelayer/commercelayer-cli/blob/v1.0.2/src/commands/applications/logout.ts)_

### `commercelayer applications:token`

Get a new access token from Commerce Layer API.

```
USAGE
  $ commercelayer applications:token

OPTIONS
  -i, --info                       show token info
  -o, --organization=organization  organization slug
  -s, --save                       save access token
  --live                           live execution mode

ALIASES
  $ commercelayer app:token

EXAMPLES
  $ commercelayer applications:token
  $ commercelayer app:token -o <organizationSlug> --live --save
```

_See code: [src/commands/applications/token.ts](https://github.com/commercelayer/commercelayer-cli/blob/v1.0.2/src/commands/applications/token.ts)_
