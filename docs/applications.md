# `commercelayer applications`

Manage login to CLI applications.

* [`commercelayer applications`](#commercelayer-applications)
* [`commercelayer applications:add`](#commercelayer-applicationsadd)
* [`commercelayer applications:current`](#commercelayer-applicationscurrent)
* [`commercelayer applications:info`](#commercelayer-applicationsinfo)
* [`commercelayer applications:login`](#commercelayer-applicationslogin)
* [`commercelayer applications:logout`](#commercelayer-applicationslogout)
* [`commercelayer applications:provisioning`](#commercelayer-applicationsprovisioning)
* [`commercelayer applications:scope SCOPE`](#commercelayer-applicationsscope-scope)
* [`commercelayer applications:switch`](#commercelayer-applicationsswitch)

### `commercelayer applications`

Show a list of all (logged in) available CLI applications.

```sh-session
USAGE
  $ commercelayer applications [-k integration|sales_channel|user] [--live | -m test|live] [-a <value> | --id
    <value>] [-A <value> | -o <value>] [-S]

FLAGS
  -A, --api=<value>           specific API application
  -S, --sort                  sort applications by Organization and Application name
  -a, --alias=<value>         the alias associated to the application
  -k, --kind=<option>         application kind
                              <options: integration|sales_channel|user>
  -m, --mode=<option>         execution mode
                              <options: test|live>
  -o, --organization=<value>  organization slug
      --id=<value>            application id
      --live                  live execution mode

DESCRIPTION
  show a list of all (logged in) available CLI applications

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

_See code: [src/commands/applications/index.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/src/commands/applications/index.ts)_

### `commercelayer applications:add`

Add a new Commerce Layer application to CLI config (application must be of kind 'integration' or 'sales_channel').

```sh-session
USAGE
  $ commercelayer applications:add -a <value> [-o <value>] (-s <value> -i <value>) [-S <value> ] [-e <value> -p
    <value>]

FLAGS
  -S, --scope=<value>...      access token scope (market, stock location)
  -a, --alias=<value>         (required) the alias you want to associate to the application
  -e, --email=<value>         customer email
  -i, --clientId=<value>      (required) application client_id
  -o, --organization=<value>  organization slug
  -p, --password=<value>      customer secret password
  -s, --clientSecret=<value>  application client_secret

DESCRIPTION
  add a new Commerce Layer application to CLI config (application must be of kind 'integration' or 'sales_channel')

ALIASES
  $ commercelayer app:add

EXAMPLES
  $ commercelayer applications:add -o <organizationSlug> -i <clientId> -s <clientSecret> -a <applicationAlias>

  $ cl app:add -i <clientId> -s <clientSecret> -a <applicationAlias>
```

_See code: [src/commands/applications/add.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/src/commands/applications/add.ts)_

### `commercelayer applications:current`

Show the current application.

```sh-session
USAGE
  $ commercelayer applications:current [-j ]

FLAGS
  -j, --json  show info in JSON format

DESCRIPTION
  show the current application

ALIASES
  $ commercelayer app:current

EXAMPLES
  $ commercelayer applications:current

  $ commercelayer app:current --info
```

_See code: [src/commands/applications/current.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/src/commands/applications/current.ts)_

### `commercelayer applications:info`

Show application details.

```sh-session
USAGE
  $ commercelayer applications:info [-k integration|sales_channel|user] [--live | -m test|live] [-a <value> | --id
    <value>] [-A <value> | -o <value>] [-j]

FLAGS
  -A, --api=<value>           specific API application
  -a, --alias=<value>         the alias associated to the application
  -j, --json                  show info in JSON format
  -k, --kind=<option>         application kind
                              <options: integration|sales_channel|user>
  -m, --mode=<option>         execution mode
                              <options: test|live>
  -o, --organization=<value>  organization slug
      --id=<value>            application id
      --live                  live execution mode

DESCRIPTION
  show application details

ALIASES
  $ commercelayer app:info
```

_See code: [src/commands/applications/info.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/src/commands/applications/info.ts)_

### `commercelayer applications:login`

Execute login to a Commerce Layer application (application must be of kind 'integration' or 'sales_channel').

```sh-session
USAGE
  $ commercelayer applications:login -a <value> [-o <value>] (-s <value> -i <value>) [-S <value> ] [-e <value> -p
    <value>]

FLAGS
  -S, --scope=<value>...      access token scope (market, stock location)
  -a, --alias=<value>         (required) the alias you want to associate to the application
  -e, --email=<value>         customer email
  -i, --clientId=<value>      (required) application client_id
  -o, --organization=<value>  organization slug
  -p, --password=<value>      customer secret password
  -s, --clientSecret=<value>  application client_secret

DESCRIPTION
  execute login to a Commerce Layer application (application must be of kind 'integration' or 'sales_channel')

ALIASES
  $ commercelayer app:login
  $ commercelayer login

EXAMPLES
  $ commercelayer applications:login -o <organizationSlug> -i <clientId> -s <clientSecret> -a <applicationAlias>

  $ cl app:login -i <clientId> -s <clientSecret> -a <applicationAlias>
```

_See code: [src/commands/applications/login.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/src/commands/applications/login.ts)_

### `commercelayer applications:logout`

Remove an application from CLI local configuration.

```sh-session
USAGE
  $ commercelayer applications:logout [-k integration|sales_channel|user] [--live | -m test|live] [-a <value> | --id
    <value>] [-A <value> | -o <value>] [-r]

FLAGS
  -A, --api=<value>           specific API application
  -a, --alias=<value>         the alias associated to the application
  -k, --kind=<option>         application kind
                              <options: integration|sales_channel|user>
  -m, --mode=<option>         execution mode
                              <options: test|live>
  -o, --organization=<value>  organization slug
  -r, --revoke                revoke current access token
      --id=<value>            application id
      --live                  live execution mode

DESCRIPTION
  remove an application from CLI local configuration

ALIASES
  $ commercelayer app:logout
  $ commercelayer app:remove
  $ commercelayer applications:remove
  $ commercelayer logout
```

_See code: [src/commands/applications/logout.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/src/commands/applications/logout.ts)_

### `commercelayer applications:provisioning`

Show all Provisioning applications.

```sh-session
USAGE
  $ commercelayer applications:provisioning [-k integration|sales_channel|user] [--live | -m test|live] [-a <value> | --id
    <value>] [-A <value> | -o <value>] [-S]

FLAGS
  -A, --api=<value>           specific API application
  -S, --sort                  sort applications by Organization and Application name
  -a, --alias=<value>         the alias associated to the application
  -k, --kind=<option>         application kind
                              <options: integration|sales_channel|user>
  -m, --mode=<option>         execution mode
                              <options: test|live>
  -o, --organization=<value>  organization slug
      --id=<value>            application id
      --live                  live execution mode

DESCRIPTION
  show all Provisioning applications

ALIASES
  $ commercelayer prov:list
  $ commercelayer app:provisioning
  $ commercelayer prov:apps
  $ commercelayer prov:applications

EXAMPLES
  $ commercelayer applications:provisioning

  $ cl app:provisioning

  $ cl prov:apps
```

_See code: [src/commands/applications/provisioning.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/src/commands/applications/provisioning.ts)_

### `commercelayer applications:scope SCOPE`

Switch scope of current application.

```sh-session
USAGE
  $ commercelayer applications:scope SCOPE [-a <value>]

ARGUMENTS
  SCOPE  the application scope

FLAGS
  -a, --alias=<value>  the alias you want to associate to the application

DESCRIPTION
  switch scope of current application

ALIASES
  $ commercelayer app:scope

EXAMPLES
  $ commercelayer applications:scope market:1234

  $ cl app:scope market:1234
```

_See code: [src/commands/applications/scope.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/src/commands/applications/scope.ts)_

### `commercelayer applications:switch`

Switch applications.

```sh-session
USAGE
  $ commercelayer applications:switch [-k integration|sales_channel|user] [--live | -m test|live] [-a <value> | --id
    <value>] [-A <value> | -o <value>]

FLAGS
  -A, --api=<value>           specific API application
  -a, --alias=<value>         the alias associated to the application
  -k, --kind=<option>         application kind
                              <options: integration|sales_channel|user>
  -m, --mode=<option>         execution mode
                              <options: test|live>
  -o, --organization=<value>  organization slug
      --id=<value>            application id
      --live                  live execution mode

DESCRIPTION
  switch applications

ALIASES
  $ commercelayer app:switch
```

_See code: [src/commands/applications/switch.ts](https://github.com/commercelayer/commercelayer-cli/blob/main/src/commands/applications/switch.ts)_
