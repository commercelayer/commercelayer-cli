@commercelayer/cli-plugin-resources
===================================

Commerce Layer CLI Resources plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli-plugin-resources.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-resources)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli-plugin-resources.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-resources)
[![License](https://img.shields.io/npm/l/@commercelayer/cli-plugin-resources.svg)](https://github.com/commercelayer/cli-plugin-resources/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @commercelayer/cli-plugin-resources
$ cl-resources COMMAND
running command...
$ cl-resources (-v|--version|version)
@commercelayer/cli-plugin-resources/0.9.7 darwin-x64 node-v15.13.0
$ cl-resources --help [COMMAND]
USAGE
  $ cl-resources COMMAND
...
```
<!-- usagestop -->
# Commands
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

## `cl-resources resources`

list all the available Commerce Layer API resources

```
USAGE
  $ cl-resources resources

EXAMPLES
  $ cl-resources resources
  $ cl-res resources
  $ commercelayer resources
  $ cl resources
```

_See code: [src/commands/resources.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/v0.9.7/src/commands/resources.ts)_

## `cl-resources resources:create RESOURCE`

create a new resource

```
USAGE
  $ cl-resources resources:create RESOURCE

ARGUMENTS
  RESOURCE  the resource type

OPTIONS
  -D, --data=data                  the data file to use as request body
  -a, --attribute=attribute        define a resource attribute
  -m, --metadata=metadata          define a metadata attribute or a set of metadata attributes
  -o, --organization=organization  (required) the slug of your organization
  -r, --relationship=relationship  define a relationship with another resource

ALIASES
  $ cl-resources create
  $ cl-resources rc
  $ cl-resources res:create

EXAMPLES
  $ commercelayer resources:create customers -a email=user@test.com
  $ clayer res:create customers -a email="user@test-com" -r customer_group=customer_groups/<customerGroupId>
  $ cl create customers -a email=user@test.com -m meta_key="meta value"
  $ cl rc customers -D /path/to/data/file/data.json
```

_See code: [src/commands/resources/create.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/v0.9.7/src/commands/resources/create.ts)_

## `cl-resources resources:delete RESOURCE [ID]`

delete an existing resource

```
USAGE
  $ cl-resources resources:delete RESOURCE [ID]

ARGUMENTS
  RESOURCE  the resource type
  ID        id of the resource to retrieve

OPTIONS
  -o, --organization=organization  (required) the slug of your organization

ALIASES
  $ cl-resources delete
  $ cl-resources rd
  $ cl-resources res:delete

EXAMPLES
  $ commercelayer resources:delete customers/<customerId>
  $ cl delete customers <customerId>
```

_See code: [src/commands/resources/delete.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/v0.9.7/src/commands/resources/delete.ts)_

## `cl-resources resources:doc RESOURCE`

show the online documentation of the resource in the browser

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

_See code: [src/commands/resources/doc.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/v0.9.7/src/commands/resources/doc.ts)_

## `cl-resources resources:filters`

show a list of all available filter predicates

```
USAGE
  $ cl-resources resources:filters

ALIASES
  $ cl-resources res:filters

EXAMPLES
  $ commercelayer resources:filters
  $ cl res:filters
```

_See code: [src/commands/resources/filters.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/v0.9.7/src/commands/resources/filters.ts)_

## `cl-resources resources:get RESOURCE [ID]`

retrieve a resource or list a set of resources

```
USAGE
  $ cl-resources resources:get RESOURCE [ID]

ARGUMENTS
  RESOURCE  the resource type
  ID        id of the resource to retrieve

OPTIONS
  -X, --save-path=save-path        save command output to file and create missing path directories
  -f, --fields=fields              comma separeted list of fields in the format [resource]=field1,field2...
  -i, --include=include            comma separated resources to include
  -n, --pageSize=pageSize          number of elements per page
  -o, --organization=organization  (required) the slug of your organization
  -p, --page=page                  page number
  -r, --raw                        print out the raw API response
  -s, --sort=sort                  defines results ordering
  -w, --where=where                comma separated list of query filters
  -x, --save=save                  save command output to file

ALIASES
  $ cl-resources get
  $ cl-resources res:get

EXAMPLES
  $ commercelayer resources:get customers
  $ commercelayer res:get customers
  $ clayer res:get customers/<customerId>
  $ cl get customers <customerId>
```

_See code: [src/commands/resources/get.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/v0.9.7/src/commands/resources/get.ts)_

## `cl-resources resources:list RESOURCE`

fetch a collection of resources

```
USAGE
  $ cl-resources resources:list RESOURCE

ARGUMENTS
  RESOURCE  the resource type

OPTIONS
  -X, --save-path=save-path        save command output to file and create missing path directories
  -f, --fields=fields              comma separeted list of fields in the format [resource]=field1,field2...
  -i, --include=include            comma separated resources to include
  -n, --pageSize=pageSize          number of elements per page
  -o, --organization=organization  (required) the slug of your organization
  -p, --page=page                  page number
  -r, --raw                        print out the raw API response
  -s, --sort=sort                  defines results ordering
  -w, --where=where                comma separated list of query filters
  -x, --save=save                  save command output to file

ALIASES
  $ cl-resources list
  $ cl-resources rl
  $ cl-resources res:list

EXAMPLES
  $ commercelayer resources:list customers -f id,email -i customer_group -s updated_at
  $ cl res:list -i customer_group -f customer_groups/name -w customer_group_name_eq="GROUP NAME"
  $ cl list -p 5 -n 10 -s -created_at --raw
```

_See code: [src/commands/resources/list.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/v0.9.7/src/commands/resources/list.ts)_

## `cl-resources resources:retrieve RESOURCE [ID]`

fetch a single resource

```
USAGE
  $ cl-resources resources:retrieve RESOURCE [ID]

ARGUMENTS
  RESOURCE  the resource type
  ID        id of the resource to retrieve

OPTIONS
  -X, --save-path=save-path        save command output to file and create missing path directories
  -f, --fields=fields              comma separeted list of fields in the format [resource]=field1,field2...
  -i, --include=include            comma separated resources to include
  -o, --organization=organization  (required) the slug of your organization
  -r, --raw                        print out the raw API response
  -x, --save=save                  save command output to file

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

_See code: [src/commands/resources/retrieve.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/v0.9.7/src/commands/resources/retrieve.ts)_

## `cl-resources resources:update RESOURCE [ID]`

update an exiasting resource

```
USAGE
  $ cl-resources resources:update RESOURCE [ID]

ARGUMENTS
  RESOURCE  the resource type
  ID        id of the resource to retrieve

OPTIONS
  -D, --data=data                          the data file to use as request body

  -M, --metadata-replace=metadata-replace  define a metadata attribute and replace every item already presente in the
                                           remote resource

  -a, --attribute=attribute                define a resource attribute

  -m, --metadata=metadata                  define a metadata attribute and merge it with the metadata already present in
                                           the remote resource

  -o, --organization=organization          (required) the slug of your organization

  -r, --relationship=relationship          define a relationship with another resource

ALIASES
  $ cl-resources update
  $ cl-resources ru
  $ cl-resources res:update

EXAMPLES
  $ commercelayer resources:update customers/<customerId> -a reference=referenceId
  $ commercelater res:update customers <customerId> -a reference_origin="Ref Origin"
  $ cl update customers/<customerId> -m meta_key="meta value"
  $ cl ru customers <customerId> -M mete_keu="metadata overwrite
  $ clayer update customers <customerId> -D /path/to/data/file/data.json
```

_See code: [src/commands/resources/update.ts](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/v0.9.7/src/commands/resources/update.ts)_
<!-- commandsstop -->
