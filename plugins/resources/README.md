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

```sh-session
$ cl-resources COMMAND

$ cl-resources (-v | version | --version) to check the version of the CLI you have installed.

$ cl-resources [COMMAND] (--help | -h) for detailed information about CLI commands.
```
<!-- usagestop -->
To install as a Commerce Layer CLI plugin run the following command:
```sh-session
$ commercelayer plugins:install resources
```
## Commands
<!-- commands -->

* [`cl-resources resources`](#cl-resources-resources)
* [`cl-resources resources:create RESOURCE`](#cl-resources-resourcescreate-resource)
* [`cl-resources resources:delete RESOURCE [ID]`](#cl-resources-resourcesdelete-resource-id)
* [`cl-resources resources:doc RESOURCE`](#cl-resources-resourcesdoc-resource)
* [`cl-resources resources:filters`](#cl-resources-resourcesfilters)
* [`cl-resources resources:get RESOURCE [ID]`](#cl-resources-resourcesget-resource-id)
* [`cl-resources resources:list RESOURCE`](#cl-resources-resourceslist-resource)
* [`cl-resources resources:retrieve RESOURCE [ID]`](#cl-resources-resourcesretrieve-resource-id)
* [`cl-resources resources:update RESOURCE [ID]`](#cl-resources-resourcesupdate-resource-id)

### `cl-resources resources`

List all the available Commerce Layer API resources.

```
USAGE
  $ cl-resources resources

OPTIONS
  -h, --help  show CLI help

EXAMPLES
  $ cl-resources resources
  $ cl-res resources
  $ commercelayer resources
  $ cl resources
```

_See code: [src/commands/resources/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/v2.3.2/src/commands/resources/index.ts)_

### `cl-resources resources:create RESOURCE`

Create a new resource.

```
USAGE
  $ cl-resources resources:create RESOURCE

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
  --node                           show the equivalent Node SDK source code of the CLI command

ALIASES
  $ cl-resources create
  $ cl-resources rc
  $ cl-resources res:create
  $ cl-resources post

EXAMPLES
  $ commercelayer resources:create customers -a email=user@test.com
  $ clayer res:create customers -a email="user@test-com" -r customer_group=customer_groups/<customerGroupId>
  $ cl create customers -a email=user@test.com -m meta_key="meta value"
  $ cl rc customers -D /path/to/data/file/data.json
```

_See code: [src/commands/resources/create.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/v2.3.2/src/commands/resources/create.ts)_

### `cl-resources resources:delete RESOURCE [ID]`

Delete an existing resource.

```
USAGE
  $ cl-resources resources:delete RESOURCE [ID]

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
  --node                           show the equivalent Node SDK source code of the CLI command

ALIASES
  $ cl-resources delete
  $ cl-resources rd
  $ cl-resources res:delete

EXAMPLES
  $ commercelayer resources:delete customers/<customerId>
  $ cl delete customers <customerId>
```

_See code: [src/commands/resources/delete.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/v2.3.2/src/commands/resources/delete.ts)_

### `cl-resources resources:doc RESOURCE`

Show the online documentation of the resource in the browser.

```
USAGE
  $ cl-resources resources:doc RESOURCE

ARGUMENTS
  RESOURCE  the resource for wich you want to access the online documentation

ALIASES
  $ cl-resources res:doc
  $ cl-resources rdoc

EXAMPLES
  $ commercelayer rdoc customers
  $ cl res:doc cusatomers
```

_See code: [src/commands/resources/doc.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/v2.3.2/src/commands/resources/doc.ts)_

### `cl-resources resources:filters`

Show a list of all available filter predicates.

```
USAGE
  $ cl-resources resources:filters

ALIASES
  $ cl-resources res:filters

EXAMPLES
  $ commercelayer resources:filters
  $ cl res:filters
```

_See code: [src/commands/resources/filters.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/v2.3.2/src/commands/resources/filters.ts)_

### `cl-resources resources:get RESOURCE [ID]`

Retrieve a resource or list a set of resources.

```
USAGE
  $ cl-resources resources:get RESOURCE [ID]

ARGUMENTS
  RESOURCE  the resource type
  ID        id of the resource to retrieve

OPTIONS
  -D, --doc                        shows the CLI command in a specific language
  -R, --raw                        print out the raw API response
  -X, --save-path=save-path        save command output to file and create missing path directories
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
  --node                           show the equivalent Node SDK source code of the CLI command

ALIASES
  $ cl-resources get
  $ cl-resources res:get

EXAMPLES
  $ commercelayer resources:get customers
  $ commercelayer res:get customers
  $ clayer res:get customers/<customerId>
  $ cl get customers <customerId>
```

_See code: [src/commands/resources/get.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/v2.3.2/src/commands/resources/get.ts)_

### `cl-resources resources:list RESOURCE`

Fetch a collection of resources.

```
USAGE
  $ cl-resources resources:list RESOURCE

ARGUMENTS
  RESOURCE  the resource type

OPTIONS
  -D, --doc                        shows the CLI command in a specific language
  -R, --raw                        print out the raw API response
  -X, --save-path=save-path        save command output to file and create missing path directories
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
  --node                           show the equivalent Node SDK source code of the CLI command

ALIASES
  $ cl-resources list
  $ cl-resources rl
  $ cl-resources res:list

EXAMPLES
  $ commercelayer resources:list customers -f id,email -i customer_group -s updated_at
  $ cl res:list -i customer_group -f customer_groups/name -w customer_group_name_eq="GROUP NAME"
  $ cl list -p 5 -n 10 -s -created_at --raw
```

_See code: [src/commands/resources/list.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/v2.3.2/src/commands/resources/list.ts)_

### `cl-resources resources:retrieve RESOURCE [ID]`

Fetch a single resource.

```
USAGE
  $ cl-resources resources:retrieve RESOURCE [ID]

ARGUMENTS
  RESOURCE  the resource type
  ID        id of the resource to retrieve

OPTIONS
  -D, --doc                        shows the CLI command in a specific language
  -R, --raw                        print out the raw API response
  -X, --save-path=save-path        save command output to file and create missing path directories
  -f, --fields=fields              comma separeted list of fields in the format [resource]=field1,field2...
  -i, --include=include            comma separated resources to include
  -j, --json                       convert output in standard JSON format
  -l, --lang=curl|node             show the CLI command in the specified language syntax
  -o, --organization=organization  (required) the slug of your organization
  -u, --unformatted                print unformatted JSON output
  -x, --save=save                  save command output to file
  --curl                           show the equivalent cURL command of the CLI command
  --node                           show the equivalent Node SDK source code of the CLI command

ALIASES
  $ cl-resources retrieve
  $ cl-resources rr
  $ cl-resources res:retrieve

EXAMPLES
  $ commercelayer resources:retrieve customers/<customerId>
  $ commercelayer retrieve customers <customerId>
  $ cl res:retrieve customers <customerId>
  $ clayer rr customers/<customerId>
```

_See code: [src/commands/resources/retrieve.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/v2.3.2/src/commands/resources/retrieve.ts)_

### `cl-resources resources:update RESOURCE [ID]`

Update an existing resource.

```
USAGE
  $ cl-resources resources:update RESOURCE [ID]

ARGUMENTS
  RESOURCE  the resource type
  ID        id of the resource to retrieve

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

  --node                                   show the equivalent Node SDK source code of the CLI command

ALIASES
  $ cl-resources update
  $ cl-resources ru
  $ cl-resources res:update
  $ cl-resources patch

EXAMPLES
  $ commercelayer resources:update customers/<customerId> -a reference=referenceId
  $ commercelayer res:update customers <customerId> -a reference_origin="Ref Origin"
  $ cl update customers/<customerId> -m meta_key="meta value"
  $ cl ru customers <customerId> -M mete_keu="metadata overwrite
  $ clayer update customers <customerId> -D /path/to/data/file/data.json
```

_See code: [src/commands/resources/update.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/v2.3.2/src/commands/resources/update.ts)_
<!-- commandsstop -->
