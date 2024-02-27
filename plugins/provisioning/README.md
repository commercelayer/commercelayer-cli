# @commercelayer/cli-plugin-provisioning

Commerce Layer CLI Provisioning plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli-plugin-provisioning.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-provisioning)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli-plugin-provisioning.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-provisioning)
[![License](https://img.shields.io/npm/l/@commercelayer/cli-plugin-provisioning.svg)](https://github.com/@commercelayer/cli-plugin-provisioning/blob/master/package.json)

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

* [`commercelayer provisioning:create RESOURCE`](#commercelayer-provisioningcreate-resource)
* [`commercelayer provisioning:delete RESOURCE [ID]`](#commercelayer-provisioningdelete-resource-id)
* [`commercelayer provisioning:exec RESOURCE [ID] [ACTION]`](#commercelayer-provisioningexec-resource-id-action)
* [`commercelayer provisioning:fetch RESOURCE PATH [ID]`](#commercelayer-provisioningfetch-resource-path-id)
* [`commercelayer provisioning:get RESOURCE [ID]`](#commercelayer-provisioningget-resource-id)
* [`commercelayer provisioning:list RESOURCE`](#commercelayer-provisioninglist-resource)
* [`commercelayer provisioning:resources`](#commercelayer-provisioningresources)
* [`commercelayer provisioning:retrieve RESOURCE [ID]`](#commercelayer-provisioningretrieve-resource-id)
* [`commercelayer provisioning:update RESOURCE [ID]`](#commercelayer-provisioningupdate-resource-id)

### `commercelayer provisioning:create RESOURCE`

Create a new resource.

```sh-session
USAGE
  $ commercelayer provisioning:create RESOURCE [-i <value>] [-f <value>] [-u -j] [-H -R] [-Y ] [-O <value>] [-D <value> |
    -a <value> | -r <value> | -m <value> | ]

ARGUMENTS
  RESOURCE  the resource type

FLAGS
  -D, --data=<value>             the data file to use as request body
  -H, --headers                  show response headers
  -O, --object=<value>...        define a resource object attribute
  -R, --raw                      print out the raw API response
  -Y, --headers-only             show only response headers
  -a, --attribute=<value>...     define a resource attribute
  -f, --fields=<value>...        comma separeted list of fields in the format [resourceType/]field1,field2...
  -i, --include=<value>...       comma separated resources to include
  -j, --json                     convert output in standard JSON format
  -m, --metadata=<value>...      define a metadata attribute or a set of metadata attributes
  -r, --relationship=<value>...  define a relationship with another resource
  -u, --unformatted              print unformatted JSON output

DESCRIPTION
  create a new resource

ALIASES
  $ commercelayer prov:create
  $ commercelayer pc
  $ commercelayer pcreate

EXAMPLES
  $ commercelayer provisioning:create organizations -a name=MyOrg

  $ clayer prov:create subscriptions -r plan=plans/<planId>

  $ cl prov:create organization -a name=MyOrg -m meta_key="meta value"

  $ cl pc roles -D /path/to/data/file/data.json
```

_See code: [src/commands/provisioning/create.ts](https://github.com/commercelayer/commercelayer-cli-plugin-provisioning/blob/main/src/commands/provisioning/create.ts)_

### `commercelayer provisioning:delete RESOURCE [ID]`

Delete an existing resource.

```sh-session
USAGE
  $ commercelayer provisioning:delete RESOURCE [ID] [-i <value>] [-f <value>] [-u -j] [-H -R] [-Y ]

ARGUMENTS
  RESOURCE  the resource type
  ID        id of the resource to delete

FLAGS
  -H, --headers             show response headers
  -R, --raw                 print out the raw API response
  -Y, --headers-only        show only response headers
  -f, --fields=<value>...   comma separeted list of fields in the format [resourceType/]field1,field2...
  -i, --include=<value>...  comma separated resources to include
  -j, --json                convert output in standard JSON format
  -u, --unformatted         print unformatted JSON output

DESCRIPTION
  delete an existing resource

ALIASES
  $ commercelayer prov:delete
  $ commercelayer pd
  $ commercelayer pdelete
  $ commercelayer pdel

EXAMPLES
  $ commercelayer provisioning:delete api_credentials/<id>

  $ cl prov:delete api_credentials <id>
```

_See code: [src/commands/provisioning/delete.ts](https://github.com/commercelayer/commercelayer-cli-plugin-provisioning/blob/main/src/commands/provisioning/delete.ts)_

### `commercelayer provisioning:exec RESOURCE [ID] [ACTION]`

Execute an action on a resource.

```sh-session
USAGE
  $ commercelayer provisioning:exec RESOURCE [ID] [ACTION] [-a <value>]

ARGUMENTS
  RESOURCE  the resource type
  ID        id of the resource on which to execute the action
  ACTION    action to execute on resource

FLAGS
  -a, --attribute=<value>...  define a resource attribute

DESCRIPTION
  execute an action on a resource

ALIASES
  $ commercelayer prov:exec
  $ commercelayer pe
  $ commercelayer pexec

EXAMPLES
  $ commercelayer provisioning:exec organizations <organizationId> transfer_ownership

  $ cl prov:exec memberships <membershipId> resend
```

_See code: [src/commands/provisioning/exec.ts](https://github.com/commercelayer/commercelayer-cli-plugin-provisioning/blob/main/src/commands/provisioning/exec.ts)_

### `commercelayer provisioning:fetch RESOURCE PATH [ID]`

Retrieve a resource or list a set of resources.

```sh-session
USAGE
  $ commercelayer provisioning:fetch RESOURCE PATH [ID] [-i <value>] [-f <value>] [-u -j] [-H -R] [-Y ] [-e <value> | ]
    [-w <value>] [-p <value>] [-n <value>] [-s <value>]

ARGUMENTS
  RESOURCE  the resource type
  PATH      path (or URL) of the resource(s) to fetch
  ID        resource id

FLAGS
  -H, --headers             show response headers
  -R, --raw                 print out the raw API response
  -Y, --headers-only        show only response headers
  -e, --extract=<value>...  extract subfields from object attributes
  -f, --fields=<value>...   comma separeted list of fields in the format [resourceType/]field1,field2...
  -i, --include=<value>...  comma separated resources to include
  -j, --json                convert output in standard JSON format
  -n, --pageSize=<value>    number of elements per page
  -p, --page=<value>        page number
  -s, --sort=<value>...     defines results ordering
  -u, --unformatted         print unformatted JSON output
  -w, --where=<value>...    comma separated list of query filters

DESCRIPTION
  retrieve a resource or list a set of resources

ALIASES
  $ commercelayer prov:fetch
  $ commercelayer pf

EXAMPLES
  $ commercelayer provisioning:fetch roles

  $ commercelayer prov:fetch roles

  $ clayer prov:fetch roles/<roleId>

  $ cl prov:fetch roles/<roleId>/<roleRelationship>

  $ cl pf roles/{roleId}/permissions aBcdEkYWx
```

_See code: [src/commands/provisioning/fetch.ts](https://github.com/commercelayer/commercelayer-cli-plugin-provisioning/blob/main/src/commands/provisioning/fetch.ts)_

### `commercelayer provisioning:get RESOURCE [ID]`

Retrieve a resource or list a set of resources.

```sh-session
USAGE
  $ commercelayer provisioning:get RESOURCE [ID] [-i <value>] [-f <value>] [-u -j] [-H -R] [-Y ] [-w <value>] [-p
    <value>] [-n <value>] [-s <value>] [-e <value> | ]

ARGUMENTS
  RESOURCE  the resource type
  ID        id of the resource to retrieve

FLAGS
  -H, --headers             show response headers
  -R, --raw                 print out the raw API response
  -Y, --headers-only        show only response headers
  -e, --extract=<value>...  extract subfields from object attributes
  -f, --fields=<value>...   comma separeted list of fields in the format [resourceType/]field1,field2...
  -i, --include=<value>...  comma separated resources to include
  -j, --json                convert output in standard JSON format
  -n, --pageSize=<value>    number of elements per page
  -p, --page=<value>        page number
  -s, --sort=<value>...     defines results ordering
  -u, --unformatted         print unformatted JSON output
  -w, --where=<value>...    comma separated list of query filters

DESCRIPTION
  retrieve a resource or list a set of resources

ALIASES
  $ commercelayer prov:get
  $ commercelayer pg
  $ commercelayer pget

EXAMPLES
  $ commercelayer provisioning:get roles

  $ commercelayer prov:get roles

  $ clayer prov:get roles/<roleId>

  $ cl prov:get roles <roleId>
```

_See code: [src/commands/provisioning/get.ts](https://github.com/commercelayer/commercelayer-cli-plugin-provisioning/blob/main/src/commands/provisioning/get.ts)_

### `commercelayer provisioning:list RESOURCE`

Fetch a collection of resources.

```sh-session
USAGE
  $ commercelayer provisioning:list RESOURCE [-i <value>] [-f <value>] [-u -j] [-H -R] [-Y ] [-w <value>] [-p <value>]
    [-n <value>] [-s <value>] [-e <value> | ]

ARGUMENTS
  RESOURCE  the resource type

FLAGS
  -H, --headers             show response headers
  -R, --raw                 print out the raw API response
  -Y, --headers-only        show only response headers
  -e, --extract=<value>...  extract subfields from object attributes
  -f, --fields=<value>...   comma separeted list of fields in the format [resourceType/]field1,field2...
  -i, --include=<value>...  comma separated resources to include
  -j, --json                convert output in standard JSON format
  -n, --pageSize=<value>    number of elements per page
  -p, --page=<value>        page number
  -s, --sort=<value>...     defines results ordering
  -u, --unformatted         print unformatted JSON output
  -w, --where=<value>...    comma separated list of query filters

DESCRIPTION
  fetch a collection of resources

ALIASES
  $ commercelayer pl
  $ commercelayer prov:list
  $ commercelayer plist
  $ commercelayer pls

EXAMPLES
  $ commercelayer provisioning:list roles -f id,name -i organization -s updated_at

  $ cl prov:list roles -i organization -f name -f organizations/name -w organization_name_eq="ORG NAME"

  $ cl prov:list roles -p 5 -n 10 -s -created_at --raw
```

_See code: [src/commands/provisioning/list.ts](https://github.com/commercelayer/commercelayer-cli-plugin-provisioning/blob/main/src/commands/provisioning/list.ts)_

### `commercelayer provisioning:resources`

List all the available Provisioning API resources.

```sh-session
USAGE
  $ commercelayer provisioning:resources [-h]

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  list all the available Provisioning API resources

ALIASES
  $ commercelayer prov:resources
  $ commercelayer pres

EXAMPLES
  $ commercelayer provisioning:resources

  $ cl prov:resources
```

_See code: [src/commands/provisioning/resources.ts](https://github.com/commercelayer/commercelayer-cli-plugin-provisioning/blob/main/src/commands/provisioning/resources.ts)_

### `commercelayer provisioning:retrieve RESOURCE [ID]`

Fetch a single resource.

```sh-session
USAGE
  $ commercelayer provisioning:retrieve RESOURCE [ID] [-i <value>] [-f <value>] [-u -j] [-H -R] [-Y ] [-e <value> | ]

ARGUMENTS
  RESOURCE  the resource type
  ID        id of the resource to retrieve

FLAGS
  -H, --headers             show response headers
  -R, --raw                 print out the raw API response
  -Y, --headers-only        show only response headers
  -e, --extract=<value>...  extract subfields from object attributes
  -f, --fields=<value>...   comma separeted list of fields in the format [resourceType/]field1,field2...
  -i, --include=<value>...  comma separated resources to include
  -j, --json                convert output in standard JSON format
  -u, --unformatted         print unformatted JSON output

DESCRIPTION
  fetch a single resource

ALIASES
  $ commercelayer prov:retrieve
  $ commercelayer pr
  $ commercelayer pretrieve

EXAMPLES
  $ commercelayer provisioning:retrieve roles/<roleId>

  $ commercelayer prov:retrieve roles <roleId>

  $ cl prov:retrieve roles <roleId>

  $ clayer pr roles/<roleId>
```

_See code: [src/commands/provisioning/retrieve.ts](https://github.com/commercelayer/commercelayer-cli-plugin-provisioning/blob/main/src/commands/provisioning/retrieve.ts)_

### `commercelayer provisioning:update RESOURCE [ID]`

Update an existing resource.

```sh-session
USAGE
  $ commercelayer provisioning:update RESOURCE [ID] [-i <value>] [-f <value>] [-u -j] [-H -R] [-Y ] [-O <value>] [-D
    <value> | -a <value> | -r <value> | [-m <value> | -M <value>] |  | ]

ARGUMENTS
  RESOURCE  the resource type
  ID        id of the resource to update

FLAGS
  -D, --data=<value>                 the data file to use as request body
  -H, --headers                      show response headers
  -M, --metadata-replace=<value>...  define a metadata attribute and replace every item already present in the remote
                                     resource
  -O, --object=<value>...            define a resource object attribute
  -R, --raw                          print out the raw API response
  -Y, --headers-only                 show only response headers
  -a, --attribute=<value>...         define a resource attribute
  -f, --fields=<value>...            comma separeted list of fields in the format [resourceType/]field1,field2...
  -i, --include=<value>...           comma separated resources to include
  -j, --json                         convert output in standard JSON format
  -m, --metadata=<value>...          define a metadata attribute and merge it with the metadata already present in the
                                     remote resource
  -r, --relationship=<value>...      define a relationship with another resource
  -u, --unformatted                  print unformatted JSON output

DESCRIPTION
  update an existing resource

ALIASES
  $ commercelayer prov:update
  $ commercelayer pu
  $ commercelayer pupdate
  $ commercelayer pupd

EXAMPLES
  $ commercelayer provisioning:update roles/<roleId> -a reference=referenceId

  $ commercelayer prov:update roles <roleId> -a reference_origin="Ref Origin"

  $ cl prov:update roles/<roleId> -m meta_key="meta value"

  $ cl pu roles <roleId> -M meta_key="metadata overwrite

  $ clayer prov:update roles <roleId> -D /path/to/data/file/data.json
```

_See code: [src/commands/provisioning/update.ts](https://github.com/commercelayer/commercelayer-cli-plugin-provisioning/blob/main/src/commands/provisioning/update.ts)_
<!-- commandsstop -->
