`commercelayer applications`
============================

Manage login to CLI applications.

* [`commercelayer applications`](#commercelayer-applications)
* [`commercelayer applications:add`](#commercelayer-applicationsadd)
* [`commercelayer applications:current`](#commercelayer-applicationscurrent)
* [`commercelayer applications:info`](#commercelayer-applicationsinfo)
* [`commercelayer applications:login`](#commercelayer-applicationslogin)
* [`commercelayer applications:logout`](#commercelayer-applicationslogout)
* [`commercelayer applications:switch`](#commercelayer-applicationsswitch)
* [`commercelayer applications:token`](#commercelayer-applicationstoken)

### `commercelayer applications`

Show a list of all (logged in) available CLI applications.

```
USAGE
  $ commercelayer applications

OPTIONS
  -a, --alias=alias                         the alias associated to the application
  -k, --kind=cli|sales_channel|integration  application kind
  -m, --mode=test|live                      execution mode
  -o, --organization=organization           organization slug
  --id=id                                   application id
  --live                                    live execution mode

ALIASES
  $ commercelayer app:list
  $ commercelayer applications:list
  $ commercelayer app:available
  $ commercelayer applications:available
  $ commercelayer apps

EXAMPLES
  $ commercelayer applications
  $ cl applications
```

_See code: [src/commands/applications/index.ts](https://github.com/commercelayer/commercelayer-cli/blob/v3.0.2/src/commands/applications/index.ts)_

### `commercelayer applications:add`

Add a new Commerce Layer application to CLI config.

```
USAGE
  $ commercelayer applications:add

OPTIONS
  -S, --scope=scope                access token scope (market, stock location)
  -a, --alias=alias                (required) the alias you want to associate to the application
  -e, --email=email                customer email
  -i, --clientId=clientId          (required) application client_id
  -o, --organization=organization  (required) organization slug
  -p, --password=password          customer secret password
  -s, --clientSecret=clientSecret  application client_secret

ALIASES
  $ commercelayer app:add

EXAMPLE
  $ commercelayer applications:add -o <organizationSlug> -i <clientId> -s <clientSecret> -a <applicationAlias>
```

_See code: [src/commands/applications/add.ts](https://github.com/commercelayer/commercelayer-cli/blob/v3.0.2/src/commands/applications/add.ts)_

### `commercelayer applications:current`

Show the current application.

```
USAGE
  $ commercelayer applications:current

OPTIONS
  -j, --json  show info in JSON format

ALIASES
  $ commercelayer app:current

EXAMPLES
  $ commercelayer applications:current
  $ commercelayer app:current --info
```

_See code: [src/commands/applications/current.ts](https://github.com/commercelayer/commercelayer-cli/blob/v3.0.2/src/commands/applications/current.ts)_

### `commercelayer applications:info`

Show application details.

```
USAGE
  $ commercelayer applications:info

OPTIONS
  -a, --alias=alias                         the alias associated to the application
  -j, --json                                show info in JSON format
  -k, --kind=cli|sales_channel|integration  application kind
  -m, --mode=test|live                      execution mode
  -o, --organization=organization           organization slug
  --id=id                                   application id
  --live                                    live execution mode

ALIASES
  $ commercelayer app:info
```

_See code: [src/commands/applications/info.ts](https://github.com/commercelayer/commercelayer-cli/blob/v3.0.2/src/commands/applications/info.ts)_

### `commercelayer applications:login`

Execute login to a Commerce Layer application.

```
USAGE
  $ commercelayer applications:login

OPTIONS
  -S, --scope=scope                access token scope (market, stock location)
  -a, --alias=alias                (required) the alias you want to associate to the application
  -e, --email=email                customer email
  -i, --clientId=clientId          (required) application client_id
  -o, --organization=organization  (required) organization slug
  -p, --password=password          customer secret password
  -s, --clientSecret=clientSecret  application client_secret

ALIASES
  $ commercelayer app:login

EXAMPLE
  $ commercelayer applications:login -o <organizationSlug> -i <clientId> -s <clientSecret> -a <applicationAlias>
```

_See code: [src/commands/applications/login.ts](https://github.com/commercelayer/commercelayer-cli/blob/v3.0.2/src/commands/applications/login.ts)_

### `commercelayer applications:logout`

Remove an application from CLI local configuration.

```
USAGE
  $ commercelayer applications:logout

OPTIONS
  -a, --alias=alias                         the alias associated to the application
  -k, --kind=cli|sales_channel|integration  application kind
  -m, --mode=test|live                      execution mode
  -o, --organization=organization           organization slug
  -r, --revoke                              revoke current access token
  --id=id                                   application id
  --live                                    live execution mode

ALIASES
  $ commercelayer app:logout
  $ commercelayer app:remove
  $ commercelayer applications:remove
```

_See code: [src/commands/applications/logout.ts](https://github.com/commercelayer/commercelayer-cli/blob/v3.0.2/src/commands/applications/logout.ts)_

### `commercelayer applications:switch`

Switch applications.

```
USAGE
  $ commercelayer applications:switch

OPTIONS
  -a, --alias=alias                         the alias associated to the application
  -k, --kind=cli|sales_channel|integration  application kind
  -m, --mode=test|live                      execution mode
  -o, --organization=organization           organization slug
  --id=id                                   application id
  --live                                    live execution mode

ALIASES
  $ commercelayer app:switch
```

_See code: [src/commands/applications/switch.ts](https://github.com/commercelayer/commercelayer-cli/blob/v3.0.2/src/commands/applications/switch.ts)_

### `commercelayer applications:token`

Get a new access token from Commerce Layer API.

```
USAGE
  $ commercelayer applications:token

OPTIONS
  -a, --alias=alias                         the alias associated to the application
  -i, --info                                show access token info
  -k, --kind=cli|sales_channel|integration  application kind
  -m, --mode=test|live                      execution mode
  -o, --organization=organization           organization slug
  -s, --save                                save access token
  --id=id                                   application id
  --live                                    live execution mode

ALIASES
  $ commercelayer app:token

EXAMPLES
  $ commercelayer applications:token
  $ commercelayer app:token -o <organizationSlug> --live --save
```

_See code: [src/commands/applications/token.ts](https://github.com/commercelayer/commercelayer-cli/blob/v3.0.2/src/commands/applications/token.ts)_
