@commercelayer/cli-plugin-resources
===================================

Commerce Layer CLI Resources plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli-plugin-resources.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-resources)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli-plugin-resources.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-resources)
[![License](https://img.shields.io/npm/l/@commercelayer/cli-plugin-resources.svg)](https://github.com/commercelayer/cli-plugin-resources/blob/master/package.json)

<!-- toc -->

* [ Usage](#-usage)
* [ Commands](#-commands)
<!-- tocstop -->
## Usage
<!-- usage -->


<!-- usagestop -->
To install as a Commerce Layer CLI plugin run the following command:
```sh-session
$ commercelayer plugins:install resources
```
## Commands
<!-- commands -->

* [`commercelayer resources`](#commercelayer-resources)
* [`commercelayer resources:args`](#commercelayer-resourcesargs)
* [`commercelayer resources:create RESOURCE`](#commercelayer-resourcescreate-resource)
* [`commercelayer resources:delete RESOURCE [ID]`](#commercelayer-resourcesdelete-resource-id)
* [`commercelayer resources:doc RESOURCE`](#commercelayer-resourcesdoc-resource)
* [`commercelayer resources:filters`](#commercelayer-resourcesfilters)
* [`commercelayer resources:get RESOURCE [ID]`](#commercelayer-resourcesget-resource-id)
* [`commercelayer resources:list RESOURCE`](#commercelayer-resourceslist-resource)
* [`commercelayer resources:retrieve RESOURCE [ID]`](#commercelayer-resourcesretrieve-resource-id)
* [`commercelayer resources:update RESOURCE [ID]`](#commercelayer-resourcesupdate-resource-id)

### `commercelayer resources`

List all the available Commerce Layer API resources.

```
USAGE
  $ commercelayer resources

OPTIONS
  -h, --help  show CLI help

EXAMPLES
  $ cl-resources resources
  $ cl-res resources
  $ commercelayer resources
  $ cl resources
```

_See code: [src/commands/resources/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/main/src/commands/resources/index.ts)_

### `commercelayer resources:args`

Show all the saved command arguments.

```
USAGE
  $ commercelayer resources:args

OPTIONS
  -D, --delete                                 delete saved arguments associated to the alias
  -a, --alias=alias                            the alias associated to saved command arguments
  -o, --operation=list|retrieve|create|update  the resource operation
  -r, --resource=resource                      the resource type

ALIASES
  $ commercelayer res:args
```

_See code: [src/commands/resources/args.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/main/src/commands/resources/args.ts)_

### `commercelayer resources:create RESOURCE`

Create a new resource.

```
USAGE
  $ commercelayer resources:create RESOURCE

ARGUMENTS
  RESOURCE  the resource type

OPTIONS
  -D, --data=data                  the data file to use as request body
  -D, --doc                        shows the CLI command in a specific language
  -O, --object=object              define a resource object attribute
  -R, --raw                        print out the raw API response
  -a, --attribute=attribute        define a resource attribute
  -f, --fields=fields              comma separeted list of fields in the format [resource]=field1,field2...
  -i, --include=include            comma separated resources to include
  -j, --json                       convert output in standard JSON format
  -l, --lang=curl|node             show the CLI command in the specified language syntax
  -m, --metadata=metadata          define a metadata attribute or a set of metadata attributes
  -o, --organization=organization  (required) the slug of your organization
  -r, --relationship=relationship  define a relationship with another resource
  -u, --unformatted                print unformatted JSON output
  --curl                           show the equivalent cURL command of the CLI command
  --load-args=load-args            load previously saved command arguments
  --node                           show the equivalent Node SDK source code of the CLI command
  --save-args=save-args            save command data to file for future use

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

```
USAGE
  $ commercelayer resources:delete RESOURCE [ID]

ARGUMENTS
  RESOURCE  the resource type
  ID        id of the resource to retrieve

OPTIONS
  -D, --doc                        shows the CLI command in a specific language
  -R, --raw                        print out the raw API response
  -f, --fields=fields              comma separeted list of fields in the format [resource]=field1,field2...
  -i, --include=include            comma separated resources to include
  -j, --json                       convert output in standard JSON format
  -l, --lang=curl|node             show the CLI command in the specified language syntax
  -o, --organization=organization  (required) the slug of your organization
  -u, --unformatted                print unformatted JSON output
  --curl                           show the equivalent cURL command of the CLI command
  --load-args=load-args            load previously saved command arguments
  --node                           show the equivalent Node SDK source code of the CLI command
  --save-args=save-args            save command data to file for future use

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

```
USAGE
  $ commercelayer resources:doc RESOURCE

ARGUMENTS
  RESOURCE  the resource for which you want to access the online documentation

ALIASES
  $ commercelayer res:doc

EXAMPLES
  $ commercelayer rdoc customers
  $ cl res:doc cusatomers
```

_See code: [src/commands/resources/doc.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/main/src/commands/resources/doc.ts)_

### `commercelayer resources:filters`

Show a list of all available filter predicates.

```
USAGE
  $ commercelayer resources:filters

ALIASES
  $ commercelayer res:filters

EXAMPLES
  $ commercelayer resources:filters
  $ cl res:filters
```

_See code: [src/commands/resources/filters.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/main/src/commands/resources/filters.ts)_

### `commercelayer resources:get RESOURCE [ID]`

Retrieve a resource or list a set of resources.

```
USAGE
  $ commercelayer resources:get RESOURCE [ID]

ARGUMENTS
  RESOURCE  the resource type
  ID        id of the resource to retrieve

OPTIONS
  -D, --doc                        shows the CLI command in a specific language
  -R, --raw                        print out the raw API response
  -X, --save-path=save-path        save command output to file and create missing path directories
  -e, --extract=extract            extract subfields from object attributes
  -f, --fields=fields              comma separeted list of fields in the format [resource]=field1,field2...
  -i, --include=include            comma separated resources to include
  -j, --json                       convert output in standard JSON format
  -l, --lang=curl|node             show the CLI command in the specified language syntax
  -n, --pageSize=pageSize          number of elements per page
  -o, --organization=organization  (required) the slug of your organization
  -p, --page=page                  page number
  -s, --sort=sort                  defines results ordering
  -u, --unformatted                print unformatted JSON output
  -w, --where=where                comma separated list of query filters
  -x, --save=save                  save command output to file
  --curl                           show the equivalent cURL command of the CLI command
  --load-args=load-args            load previously saved command arguments
  --node                           show the equivalent Node SDK source code of the CLI command
  --save-args=save-args            save command data to file for future use

ALIASES
  $ commercelayer get
  $ commercelayer res:get

EXAMPLES
  $ commercelayer resources:get customers
  $ commercelayer res:get customers
  $ clayer res:get customers/<customerId>
  $ cl get customers <customerId>
```

_See code: [src/commands/resources/get.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/main/src/commands/resources/get.ts)_

### `commercelayer resources:list RESOURCE`

Fetch a collection of resources.

```
USAGE
  $ commercelayer resources:list RESOURCE

ARGUMENTS
  RESOURCE  the resource type

OPTIONS
  -D, --doc                        shows the CLI command in a specific language
  -R, --raw                        print out the raw API response
  -X, --save-path=save-path        save command output to file and create missing path directories
  -e, --extract=extract            extract subfields from object attributes
  -f, --fields=fields              comma separeted list of fields in the format [resource]=field1,field2...
  -i, --include=include            comma separated resources to include
  -j, --json                       convert output in standard JSON format
  -l, --lang=curl|node             show the CLI command in the specified language syntax
  -n, --pageSize=pageSize          number of elements per page
  -o, --organization=organization  (required) the slug of your organization
  -p, --page=page                  page number
  -s, --sort=sort                  defines results ordering
  -u, --unformatted                print unformatted JSON output
  -w, --where=where                comma separated list of query filters
  -x, --save=save                  save command output to file
  --curl                           show the equivalent cURL command of the CLI command
  --load-args=load-args            load previously saved command arguments
  --node                           show the equivalent Node SDK source code of the CLI command
  --save-args=save-args            save command data to file for future use

ALIASES
  $ commercelayer list
  $ commercelayer rl
  $ commercelayer res:list

EXAMPLES
  $ commercelayer resources:list customers -f id,email -i customer_group -s updated_at
  $ cl res:list -i customer_group -f customer_groups/name -w customer_group_name_eq="GROUP NAME"
  $ cl list -p 5 -n 10 -s -created_at --raw
```

_See code: [src/commands/resources/list.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/main/src/commands/resources/list.ts)_

### `commercelayer resources:retrieve RESOURCE [ID]`

Fetch a single resource.

```
USAGE
  $ commercelayer resources:retrieve RESOURCE [ID]

ARGUMENTS
  RESOURCE  the resource type
  ID        id of the resource to retrieve

OPTIONS
  -D, --doc                        shows the CLI command in a specific language
  -R, --raw                        print out the raw API response
  -X, --save-path=save-path        save command output to file and create missing path directories
  -e, --extract=extract            extract subfields from object attributes
  -f, --fields=fields              comma separeted list of fields in the format [resource]=field1,field2...
  -i, --include=include            comma separated resources to include
  -j, --json                       convert output in standard JSON format
  -l, --lang=curl|node             show the CLI command in the specified language syntax
  -o, --organization=organization  (required) the slug of your organization
  -u, --unformatted                print unformatted JSON output
  -x, --save=save                  save command output to file
  --curl                           show the equivalent cURL command of the CLI command
  --load-args=load-args            load previously saved command arguments
  --node                           show the equivalent Node SDK source code of the CLI command
  --save-args=save-args            save command data to file for future use

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

### `commercelayer resources:update RESOURCE [ID]`

Update an existing resource.

```
USAGE
  $ commercelayer resources:update RESOURCE [ID]

ARGUMENTS
  RESOURCE  the resource type
  ID        id of the resource to update

OPTIONS
  -D, --data=data                          the data file to use as request body
  -D, --doc                                shows the CLI command in a specific language

  -M, --metadata-replace=metadata-replace  define a metadata attribute and replace every item already presente in the
                                           remote resource

  -O, --object=object                      define a resource object attribute

  -R, --raw                                print out the raw API response

  -a, --attribute=attribute                define a resource attribute

  -f, --fields=fields                      comma separeted list of fields in the format [resource]=field1,field2...

  -i, --include=include                    comma separated resources to include

  -j, --json                               convert output in standard JSON format

  -l, --lang=curl|node                     show the CLI command in the specified language syntax

  -m, --metadata=metadata                  define a metadata attribute and merge it with the metadata already present in
                                           the remote resource

  -o, --organization=organization          (required) the slug of your organization

  -r, --relationship=relationship          define a relationship with another resource

  -u, --unformatted                        print unformatted JSON output

  --curl                                   show the equivalent cURL command of the CLI command

  --load-args=load-args                    load previously saved command arguments

  --node                                   show the equivalent Node SDK source code of the CLI command

  --save-args=save-args                    save command data to file for future use

ALIASES
  $ commercelayer update
  $ commercelayer ru
  $ commercelayer res:update
  $ commercelayer patch

EXAMPLES
  $ commercelayer resources:update customers/<customerId> -a reference=referenceId
  $ commercelayer res:update customers <customerId> -a reference_origin="Ref Origin"
  $ cl update customers/<customerId> -m meta_key="meta value"
  $ cl ru customers <customerId> -M mete_keu="metadata overwrite
  $ clayer update customers <customerId> -D /path/to/data/file/data.json
```

_See code: [src/commands/resources/update.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/main/src/commands/resources/update.ts)_
<!-- commandsstop -->
