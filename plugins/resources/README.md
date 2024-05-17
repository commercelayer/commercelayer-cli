# @commercelayer/cli-plugin-resources

Commerce Layer CLI Resources plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli-plugin-resources.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-resources)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli-plugin-resources.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-resources)
[![License](https://img.shields.io/npm/l/@commercelayer/cli-plugin-resources.svg)](https://github.com/commercelayer/cli-plugin-resources/blob/master/package.json)
[![CodeQL](https://github.com/commercelayer/commercelayer-cli-plugin-resources/actions/workflows/codeql.yml/badge.svg)](https://github.com/commercelayer/commercelayer-cli-plugin-resources/actions/workflows/codeql.yml)

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
To install as a Commerce Layer CLI plugin run the following command:

```sh-session
$ commercelayer plugins:install resources
```

## Commands
<!-- commands -->

* [`commercelayer resources`](#commercelayer-resources)
* [`commercelayer resources:all RESOURCE`](#commercelayer-resourcesall-resource)
* [`commercelayer resources:args`](#commercelayer-resourcesargs)
* [`commercelayer resources:count RESOURCE`](#commercelayer-resourcescount-resource)
* [`commercelayer resources:create RESOURCE`](#commercelayer-resourcescreate-resource)
* [`commercelayer resources:delete RESOURCE [ID]`](#commercelayer-resourcesdelete-resource-id)
* [`commercelayer resources:doc RESOURCE`](#commercelayer-resourcesdoc-resource)
* [`commercelayer resources:fetch PATH [ID]`](#commercelayer-resourcesfetch-path-id)
* [`commercelayer resources:filters`](#commercelayer-resourcesfilters)
* [`commercelayer resources:get RESOURCE [ID]`](#commercelayer-resourcesget-resource-id)
* [`commercelayer resources:list RESOURCE`](#commercelayer-resourceslist-resource)
* [`commercelayer resources:retrieve RESOURCE [ID]`](#commercelayer-resourcesretrieve-resource-id)
* [`commercelayer resources:schema`](#commercelayer-resourcesschema)
* [`commercelayer resources:update RESOURCE [ID]`](#commercelayer-resourcesupdate-resource-id)

### `commercelayer resources`

List all the available Commerce Layer API resources.

```sh-session
USAGE
  $ commercelayer resources [-h]

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  list all the available Commerce Layer API resources

EXAMPLES
  $ cl-resources resources

  $ cl-res resources

  $ commercelayer resources

  $ cl resources
```

_See code: [src/commands/resources/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/main/src/commands/resources/index.ts)_

### `commercelayer resources:all RESOURCE`

Fetch all resources.

```sh-session
USAGE
  $ commercelayer resources:all RESOURCE [-i <value>] [-u -j] [-l curl|node [--doc | -R]] [--curl ] [--node ]
    [--save-args <value>] [--load-args <value>] [-w <value>] [-s <value>] [-x <value> | -X <value>] [-D ,|;|||TAB [-C -f
    <value>]] [-H <value> ] [-b] [-e <value> | ]

ARGUMENTS
  RESOURCE  the resource type

FLAGS
  -C, --csv                 export fields in csv format
  -D, --delimiter=<option>  the delimiter character to use in the CSV output file (one of ',', ';', '|', TAB)
                            <options: ,|;|||TAB>
  -H, --header=<value>...   rename column headers defining a comma-separated list of values field:"renamed title"
  -R, --raw                 print out the raw API response
  -X, --save-path=<value>   save command output to file and create missing path directories
  -b, --blind               execute in blind mode without prompt and progress bar
  -e, --extract=<value>...  extract subfields from object attributes
  -f, --fields=<value>...   comma separeted list of fields in the format [resourceType/]field1,field2,field3
  -i, --include=<value>...  comma separated resources to include
  -j, --json                convert output in standard JSON format
  -s, --sort=<value>...     defines results ordering
  -u, --unformatted         print unformatted JSON output
  -w, --where=<value>...    comma separated list of query filters
  -x, --save=<value>        save command output to file
      --load-args=<value>   load previously saved command arguments
      --save-args=<value>   save command data to file for future use

DOCUMENTATION FLAGS
  -l, --lang=<option>  show the CLI command in the specified language syntax
                       <options: curl|node>
      --curl           show the equivalent cURL command of the CLI command
      --doc            show the CLI command in a specific language
      --node           show the equivalent Node SDK source code of the CLI command

DESCRIPTION
  fetch all resources

ALIASES
  $ commercelayer all
  $ commercelayer ra
  $ commercelayer res:all

EXAMPLES
  $ commercelayer resources:all customers -f id,email,customer_group -i customer_group -s updated_at

  $ cl res:all customers -i customer_group -f customer_group -f customer_groups/name -w customer_group_name_eq="GROUP NAME"

  $ cl all customers -s -created_at --json
```

_See code: [src/commands/resources/all.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/main/src/commands/resources/all.ts)_

### `commercelayer resources:args`

Show all the saved command arguments.

```sh-session
USAGE
  $ commercelayer resources:args [-D [-a <value> -o list|retrieve|create|update -r <value>]]

FLAGS
  -D, --delete              delete saved arguments associated to the alias
  -a, --alias=<value>       the alias associated to saved command arguments
  -o, --operation=<option>  the resource operation
                            <options: list|retrieve|create|update>
  -r, --resource=<value>    the resource type

DESCRIPTION
  show all the saved command arguments

ALIASES
  $ commercelayer res:args
```

_See code: [src/commands/resources/args.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/main/src/commands/resources/args.ts)_

### `commercelayer resources:count RESOURCE`

Count the number of existent resources.

```sh-session
USAGE
  $ commercelayer resources:count RESOURCE [-w <value>]

ARGUMENTS
  RESOURCE  the resource type

FLAGS
  -w, --where=<value>...  comma separated list of query filters

DESCRIPTION
  count the number of existent resources

ALIASES
  $ commercelayer count
  $ commercelayer res:count
  $ commercelayer rs:count

EXAMPLES
  $ commercelayer resources:count customers

  cl count customers -w customer_group_name_eq=<customer-group-name>
```

_See code: [src/commands/resources/count.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/main/src/commands/resources/count.ts)_

### `commercelayer resources:create RESOURCE`

Create a new resource.

```sh-session
USAGE
  $ commercelayer resources:create RESOURCE [-i <value>] [-f <value>] [-u -j] [-l curl|node [--doc | -R]] [--curl ]
    [--node ] [-H ] [-Y ] [-O <value>] [-D <value> | -a <value> | -r <value> | -m <value> |  | --load-args <value> |
    --save-args <value>] [-t <value>]

ARGUMENTS
  RESOURCE  the resource type

FLAGS
  -D, --data=<value>             the data file to use as request body
  -H, --headers                  show response headers
  -O, --object=<value>...        define a resource object attribute
  -R, --raw                      print out the raw API response
  -Y, --headers-only             show only response headers
  -a, --attribute=<value>...     define a resource attribute
  -f, --fields=<value>...        comma separeted list of fields in the format [resourceType/]field1,field2,field3
  -i, --include=<value>...       comma separated resources to include
  -j, --json                     convert output in standard JSON format
  -m, --metadata=<value>...      define a metadata attribute or a set of metadata attributes
  -r, --relationship=<value>...  define a relationship with another resource
  -t, --tags=<value>...          list of tags associated with the resource
  -u, --unformatted              print unformatted JSON output
      --load-args=<value>        load previously saved command arguments
      --save-args=<value>        save command data to file for future use

DOCUMENTATION FLAGS
  -l, --lang=<option>  show the CLI command in the specified language syntax
                       <options: curl|node>
      --curl           show the equivalent cURL command of the CLI command
      --doc            show the CLI command in a specific language
      --node           show the equivalent Node SDK source code of the CLI command

DESCRIPTION
  create a new resource

ALIASES
  $ commercelayer create
  $ commercelayer rc
  $ commercelayer res:create
  $ commercelayer post

EXAMPLES
  $ commercelayer resources:create customers -a email=user@test.com

  $ clayer res:create customers -a email="user@test-com" -r customer_group=customer_groups/<customerGroupId>

  $ cl create customers -a email=user@test.com -m meta_key="meta value"

  $ cl rc customers -D /path/to/data/file/data.json
```

_See code: [src/commands/resources/create.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/main/src/commands/resources/create.ts)_

### `commercelayer resources:delete RESOURCE [ID]`

Delete an existing resource.

```sh-session
USAGE
  $ commercelayer resources:delete RESOURCE [ID] [-i <value>] [-f <value>] [-u -j] [-l curl|node [--doc | -R]] [--curl
    ] [--node ] [--save-args <value>] [--load-args <value>] [-H ] [-Y ]

ARGUMENTS
  RESOURCE  the resource type
  ID        id of the resource to delete

FLAGS
  -H, --headers             show response headers
  -R, --raw                 print out the raw API response
  -Y, --headers-only        show only response headers
  -f, --fields=<value>...   comma separeted list of fields in the format [resourceType/]field1,field2,field3
  -i, --include=<value>...  comma separated resources to include
  -j, --json                convert output in standard JSON format
  -u, --unformatted         print unformatted JSON output
      --load-args=<value>   load previously saved command arguments
      --save-args=<value>   save command data to file for future use

DOCUMENTATION FLAGS
  -l, --lang=<option>  show the CLI command in the specified language syntax
                       <options: curl|node>
      --curl           show the equivalent cURL command of the CLI command
      --doc            show the CLI command in a specific language
      --node           show the equivalent Node SDK source code of the CLI command

DESCRIPTION
  delete an existing resource

ALIASES
  $ commercelayer delete
  $ commercelayer rd
  $ commercelayer res:delete

EXAMPLES
  $ commercelayer resources:delete customers/<customerId>

  $ cl delete customers <customerId>
```

_See code: [src/commands/resources/delete.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/main/src/commands/resources/delete.ts)_

### `commercelayer resources:doc RESOURCE`

Open the default browser and show the online documentation for the resource.

```sh-session
USAGE
  $ commercelayer resources:doc RESOURCE [-p object|create|retrieve|list|update|delete]

ARGUMENTS
  RESOURCE  the resource for which you want to access the online documentation

FLAGS
  -p, --page=<option>  the doc page you want to access
                       <options: object|create|retrieve|list|update|delete>

DESCRIPTION
  open the default browser and show the online documentation for the resource

ALIASES
  $ commercelayer res:doc
  $ commercelayer doc

EXAMPLES
  $ commercelayer resources:doc customers

  $ cl res:doc customers

  $ cl doc customers -p create
```

_See code: [src/commands/resources/doc.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/main/src/commands/resources/doc.ts)_

### `commercelayer resources:fetch PATH [ID]`

Retrieve a resource or list a set of resources.

```sh-session
USAGE
  $ commercelayer resources:fetch PATH... [ID...] [-i <value>] [-f <value>] [-u -j] [-l curl|node [--doc | -R]]
    [--curl ] [--node ] [--save-args <value>] [--load-args <value>] [-H ] [-Y ] [-x <value> | -X <value>] [-e <value> |
    ] [-w <value>] [-p <value>] [-n <value>] [-s <value>]

ARGUMENTS
  PATH...  path (or URL) of the resource(s) to fetch
  ID...    resource id

FLAGS
  -H, --headers             show response headers
  -R, --raw                 print out the raw API response
  -X, --save-path=<value>   save command output to file and create missing path directories
  -Y, --headers-only        show only response headers
  -e, --extract=<value>...  extract subfields from object attributes
  -f, --fields=<value>...   comma separeted list of fields in the format [resourceType/]field1,field2,field3
  -i, --include=<value>...  comma separated resources to include
  -j, --json                convert output in standard JSON format
  -n, --pageSize=<value>    number of elements per page
  -p, --page=<value>        page number
  -s, --sort=<value>...     defines results ordering
  -u, --unformatted         print unformatted JSON output
  -w, --where=<value>...    comma separated list of query filters
  -x, --save=<value>        save command output to file
      --load-args=<value>   load previously saved command arguments
      --save-args=<value>   save command data to file for future use

DOCUMENTATION FLAGS
  -l, --lang=<option>  show the CLI command in the specified language syntax
                       <options: curl|node>
      --curl           show the equivalent cURL command of the CLI command
      --doc            show the CLI command in a specific language
      --node           show the equivalent Node SDK source code of the CLI command

DESCRIPTION
  retrieve a resource or list a set of resources

ALIASES
  $ commercelayer fetch
  $ commercelayer res:fetch
  $ commercelayer rf

EXAMPLES
  $ commercelayer resources:fetch customers

  $ commercelayer res:fetch customers

  $ clayer res:fetch customers/<customerId>

  $ cl fetch customers/<customerId>/<customerRelationship>

  $ cl fetch customers/{customerId}/orders aBcdEkYWx
```

_See code: [src/commands/resources/fetch.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/main/src/commands/resources/fetch.ts)_

### `commercelayer resources:filters`

Show a list of all available filter predicates.

```sh-session
USAGE
  $ commercelayer resources:filters

DESCRIPTION
  show a list of all available filter predicates

ALIASES
  $ commercelayer res:filters

EXAMPLES
  $ commercelayer resources:filters

  $ cl res:filters
```

_See code: [src/commands/resources/filters.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/main/src/commands/resources/filters.ts)_

### `commercelayer resources:get RESOURCE [ID]`

Retrieve a resource or list a set of resources.

```sh-session
USAGE
  $ commercelayer resources:get RESOURCE... [ID...] [-i <value>] [-f <value>] [-u -j] [-l curl|node [--doc | -R]]
    [--curl ] [--node ] [--save-args <value>] [--load-args <value>] [-H ] [-Y ] [-w <value>] [-p <value>] [-n <value>]
    [-s <value>] [-x <value> | -X <value>] [-e <value> | ]

ARGUMENTS
  RESOURCE...  the resource type
  ID...        id of the resource to retrieve

FLAGS
  -H, --headers             show response headers
  -R, --raw                 print out the raw API response
  -X, --save-path=<value>   save command output to file and create missing path directories
  -Y, --headers-only        show only response headers
  -e, --extract=<value>...  extract subfields from object attributes
  -f, --fields=<value>...   comma separeted list of fields in the format [resourceType/]field1,field2,field3
  -i, --include=<value>...  comma separated resources to include
  -j, --json                convert output in standard JSON format
  -n, --pageSize=<value>    number of elements per page
  -p, --page=<value>        page number
  -s, --sort=<value>...     defines results ordering
  -u, --unformatted         print unformatted JSON output
  -w, --where=<value>...    comma separated list of query filters
  -x, --save=<value>        save command output to file
      --load-args=<value>   load previously saved command arguments
      --save-args=<value>   save command data to file for future use

DOCUMENTATION FLAGS
  -l, --lang=<option>  show the CLI command in the specified language syntax
                       <options: curl|node>
      --curl           show the equivalent cURL command of the CLI command
      --doc            show the CLI command in a specific language
      --node           show the equivalent Node SDK source code of the CLI command

DESCRIPTION
  retrieve a resource or list a set of resources

ALIASES
  $ commercelayer get
  $ commercelayer res:get
  $ commercelayer rg

EXAMPLES
  $ commercelayer resources:get customers

  $ commercelayer res:get customers

  $ clayer res:get customers/<customerId>

  $ cl get customers <customerId>
```

_See code: [src/commands/resources/get.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/main/src/commands/resources/get.ts)_

### `commercelayer resources:list RESOURCE`

Fetch a collection of resources.

```sh-session
USAGE
  $ commercelayer resources:list RESOURCE [-i <value>] [-f <value>] [-u -j] [-l curl|node [--doc | -R]] [--curl ]
    [--node ] [--save-args <value>] [--load-args <value>] [-H ] [-Y ] [-w <value>] [-p <value>] [-n <value>] [-s
    <value>] [-x <value> | -X <value>] [-e <value> | ]

ARGUMENTS
  RESOURCE  the resource type

FLAGS
  -H, --headers             show response headers
  -R, --raw                 print out the raw API response
  -X, --save-path=<value>   save command output to file and create missing path directories
  -Y, --headers-only        show only response headers
  -e, --extract=<value>...  extract subfields from object attributes
  -f, --fields=<value>...   comma separeted list of fields in the format [resourceType/]field1,field2,field3
  -i, --include=<value>...  comma separated resources to include
  -j, --json                convert output in standard JSON format
  -n, --pageSize=<value>    number of elements per page
  -p, --page=<value>        page number
  -s, --sort=<value>...     defines results ordering
  -u, --unformatted         print unformatted JSON output
  -w, --where=<value>...    comma separated list of query filters
  -x, --save=<value>        save command output to file
      --load-args=<value>   load previously saved command arguments
      --save-args=<value>   save command data to file for future use

DOCUMENTATION FLAGS
  -l, --lang=<option>  show the CLI command in the specified language syntax
                       <options: curl|node>
      --curl           show the equivalent cURL command of the CLI command
      --doc            show the CLI command in a specific language
      --node           show the equivalent Node SDK source code of the CLI command

DESCRIPTION
  fetch a collection of resources

ALIASES
  $ commercelayer list
  $ commercelayer rl
  $ commercelayer res:list

EXAMPLES
  $ commercelayer resources:list customers -f id,email,customer_group -i customer_group -s updated_at

  $ cl res:list customers -i customer_group -f customer_group -f customer_groups/name -w customer_group_name_eq="GROUP NAME"

  $ cl list customers -p 5 -n 10 -s -created_at --raw
```

_See code: [src/commands/resources/list.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/main/src/commands/resources/list.ts)_

### `commercelayer resources:retrieve RESOURCE [ID]`

Fetch a single resource.

```sh-session
USAGE
  $ commercelayer resources:retrieve RESOURCE [ID] [-i <value>] [-f <value>] [-u -j] [-l curl|node [--doc | -R]] [--curl
    ] [--node ] [--save-args <value>] [--load-args <value>] [-H ] [-Y ] [-x <value> | -X <value>] [-e <value> | ]

ARGUMENTS
  RESOURCE  the resource type
  ID        id of the resource to retrieve

FLAGS
  -H, --headers             show response headers
  -R, --raw                 print out the raw API response
  -X, --save-path=<value>   save command output to file and create missing path directories
  -Y, --headers-only        show only response headers
  -e, --extract=<value>...  extract subfields from object attributes
  -f, --fields=<value>...   comma separeted list of fields in the format [resourceType/]field1,field2,field3
  -i, --include=<value>...  comma separated resources to include
  -j, --json                convert output in standard JSON format
  -u, --unformatted         print unformatted JSON output
  -x, --save=<value>        save command output to file
      --load-args=<value>   load previously saved command arguments
      --save-args=<value>   save command data to file for future use

DOCUMENTATION FLAGS
  -l, --lang=<option>  show the CLI command in the specified language syntax
                       <options: curl|node>
      --curl           show the equivalent cURL command of the CLI command
      --doc            show the CLI command in a specific language
      --node           show the equivalent Node SDK source code of the CLI command

DESCRIPTION
  fetch a single resource

ALIASES
  $ commercelayer retrieve
  $ commercelayer rr
  $ commercelayer res:retrieve

EXAMPLES
  $ commercelayer resources:retrieve customers/<customerId>

  $ commercelayer retrieve customers <customerId>

  $ cl res:retrieve customers <customerId>

  $ clayer rr customers/<customerId>
```

_See code: [src/commands/resources/retrieve.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/main/src/commands/resources/retrieve.ts)_

### `commercelayer resources:schema`

Show the current CommerceLayer OpenAPI schema version used by the plugin.

```sh-session
USAGE
  $ commercelayer resources:schema

DESCRIPTION
  show the current CommerceLayer OpenAPI schema version used by the plugin

ALIASES
  $ commercelayer schema
  $ commercelayer res:schema
  $ commercelayer rs

EXAMPLES
  $ commercelayer schema

  cl res:schema
```

_See code: [src/commands/resources/schema.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/main/src/commands/resources/schema.ts)_

### `commercelayer resources:update RESOURCE [ID]`

Update an existing resource.

```sh-session
USAGE
  $ commercelayer resources:update RESOURCE [ID] [-i <value>] [-f <value>] [-u -j] [-l curl|node [--doc | -R]] [--curl
    ] [--node ] [-H ] [-Y ] [-O <value>] [-D <value> | -a <value> | -r <value> | [-m <value> | -M <value>] |  |  |
    --load-args <value> | --save-args <value>] [-t <value>]

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
  -f, --fields=<value>...            comma separeted list of fields in the format [resourceType/]field1,field2,field3
  -i, --include=<value>...           comma separated resources to include
  -j, --json                         convert output in standard JSON format
  -m, --metadata=<value>...          define a metadata attribute and merge it with the metadata already present in the
                                     remote resource
  -r, --relationship=<value>...      define a relationship with another resource
  -t, --tags=<value>...              list of tags associated with the resource
  -u, --unformatted                  print unformatted JSON output
      --load-args=<value>            load previously saved command arguments
      --save-args=<value>            save command data to file for future use

DOCUMENTATION FLAGS
  -l, --lang=<option>  show the CLI command in the specified language syntax
                       <options: curl|node>
      --curl           show the equivalent cURL command of the CLI command
      --doc            show the CLI command in a specific language
      --node           show the equivalent Node SDK source code of the CLI command

DESCRIPTION
  update an existing resource

ALIASES
  $ commercelayer update
  $ commercelayer ru
  $ commercelayer res:update
  $ commercelayer patch

EXAMPLES
  $ commercelayer resources:update customers/<customerId> -a reference=referenceId

  $ commercelayer res:update customers <customerId> -a reference_origin="Ref Origin"

  $ cl update customers/<customerId> -m meta_key="meta value"

  $ cl ru customers <customerId> -M meta_key="metadata overwrite

  $ clayer update customers <customerId> -D /path/to/data/file/data.json

  $ cl update order <orderId> -r billing_address=addresses/<addressId>

  $ cl update customer <customerId> -r customer_group=<customerGroupId>
```

_See code: [src/commands/resources/update.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/main/src/commands/resources/update.ts)_
<!-- commandsstop -->
