# @commercelayer/cli-plugin-tags

Commerce Layer CLI Tags plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli-plugin-tags.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-tags)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli-plugin-tags.svg)](https://npmjs.org/package/@commercelayer/cli-plugin-tags)
[![License](https://img.shields.io/npm/l/@commercelayer/cli-plugin-tags.svg)](https://github.com/@commercelayer/cli-plugin-tags/blob/master/package.json)

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

* [`commercelayer tags [ID]`](#commercelayer-tags-id)
* [`commercelayer tags:add`](#commercelayer-tagsadd)
* [`commercelayer tags:create`](#commercelayer-tagscreate)
* [`commercelayer tags:delete`](#commercelayer-tagsdelete)
* [`commercelayer tags:details ID_NAME`](#commercelayer-tagsdetails-id_name)
* [`commercelayer tags:list`](#commercelayer-tagslist)
* [`commercelayer tags:remove`](#commercelayer-tagsremove)
* [`commercelayer tags:types`](#commercelayer-tagstypes)
* [`commercelayer tags:update ID_NAME`](#commercelayer-tagsupdate-id_name)
* [`commercelayer tags:which ID_NAME`](#commercelayer-tagswhich-id_name)

### `commercelayer tags [ID]`

List all the created tags or show details of a single tag.

```sh-session
USAGE
  $ commercelayer tags [ID] [-A | -l <value>]

ARGUMENTS
  ID  unique id of the tag to be retrieved

FLAGS
  -A, --all            show all tags instead of first 25 only
  -l, --limit=<value>  limit number of tags in output

DESCRIPTION
  list all the created tags or show details of a single tag
```

_See code: [src/commands/tags/index.ts](https://github.com/commercelayer/commercelayer-cli-plugin-tags/blob/main/src/commands/tags/index.ts)_

### `commercelayer tags:add`

Add one or more tags to a set of resources.

```sh-session
USAGE
  $ commercelayer tags:add -n <value> -t <value> -i <value> [-C <value>] [-v]

FLAGS
  -C, --create=<value>   create tags if don't exist
  -i, --id=<value>...    (required) the IDs of th eresources to tag
  -n, --name=<value>...  (required) the tag name
  -t, --type=<value>     (required) the type of the resource to tag
  -v, --verbose          show details of the tag process

DESCRIPTION
  add one or more tags to a set of resources

ALIASES
  $ commercelayer tag

EXAMPLES
  $ commercelayer tags:add -t <resource-type> -n <tag-names> -r <resources-id>

  $ cl tag -t customers -r aBcDeFghIL mnOPqRstUV -n groupA
```

_See code: [src/commands/tags/add.ts](https://github.com/commercelayer/commercelayer-cli-plugin-tags/blob/main/src/commands/tags/add.ts)_

### `commercelayer tags:create`

Create one or more new tags.

```sh-session
USAGE
  $ commercelayer tags:create -n <value>

FLAGS
  -n, --name=<value>...  (required) the tag name

DESCRIPTION
  create one or more new tags

EXAMPLES
  $ commercelayer tags:create -n <tag-names>

  $ cl tags:create -n flag1 flag2 flag3
```

_See code: [src/commands/tags/create.ts](https://github.com/commercelayer/commercelayer-cli-plugin-tags/blob/main/src/commands/tags/create.ts)_

### `commercelayer tags:delete`

Delete one or more existing tags.

```sh-session
USAGE
  $ commercelayer tags:delete -n <value>

FLAGS
  -n, --name=<value>...  (required) the tag name

DESCRIPTION
  delete one or more existing tags

EXAMPLES
  $ commercelayer tags:delete -n <tag-names>

  $ cl tags:delete -n flag1 flag2 flag3
```

_See code: [src/commands/tags/delete.ts](https://github.com/commercelayer/commercelayer-cli-plugin-tags/blob/main/src/commands/tags/delete.ts)_

### `commercelayer tags:details ID_NAME`

Show the details of an existing tag.

```sh-session
USAGE
  $ commercelayer tags:details ID_NAME

ARGUMENTS
  ID_NAME  unique id or name of the tag

DESCRIPTION
  show the details of an existing tag

EXAMPLES
  $ commercelayer tags:details <tag-id/tag-name>
```

_See code: [src/commands/tags/details.ts](https://github.com/commercelayer/commercelayer-cli-plugin-tags/blob/main/src/commands/tags/details.ts)_

### `commercelayer tags:list`

List all the created tags.

```sh-session
USAGE
  $ commercelayer tags:list [-A | -l <value>]

FLAGS
  -A, --all            show all tags instead of first 25 only
  -l, --limit=<value>  limit number of tags in output

DESCRIPTION
  list all the created tags

EXAMPLES
  $ commercelayer tags

  $ cl tags:list -A
```

_See code: [src/commands/tags/list.ts](https://github.com/commercelayer/commercelayer-cli-plugin-tags/blob/main/src/commands/tags/list.ts)_

### `commercelayer tags:remove`

Remove one or more tags to a set of resources.

```sh-session
USAGE
  $ commercelayer tags:remove -n <value> -t <value> -i <value> [-v]

FLAGS
  -i, --id=<value>...    (required) the IDs of th eresources to tag
  -n, --name=<value>...  (required) the tag name
  -t, --type=<value>     (required) the type of the resource to tag
  -v, --verbose          show details of the tag process

DESCRIPTION
  remove one or more tags to a set of resources

ALIASES
  $ commercelayer tag

EXAMPLES
  $ commercelayer tags:remove -t <resource-type> -n <tag-names> -r <resources-id>

  $ cl tags:rm -t customers -r aBcDeFghIL mnOPqRstUV -n groupA
```

_See code: [src/commands/tags/remove.ts](https://github.com/commercelayer/commercelayer-cli-plugin-tags/blob/main/src/commands/tags/remove.ts)_

### `commercelayer tags:types`

Show online documentation for supported resources.

```sh-session
USAGE
  $ commercelayer tags:types [-O]

FLAGS
  -O, --open  open online documentation page

DESCRIPTION
  show online documentation for supported resources

EXAMPLES
  $ commercelayer tags:types
```

_See code: [src/commands/tags/types.ts](https://github.com/commercelayer/commercelayer-cli-plugin-tags/blob/main/src/commands/tags/types.ts)_

### `commercelayer tags:update ID_NAME`

Update an existing tag.

```sh-session
USAGE
  $ commercelayer tags:update ID_NAME -n <value>

ARGUMENTS
  ID_NAME  unique id or name of the tag

FLAGS
  -n, --name=<value>  (required) the new tag name

DESCRIPTION
  update an existing tag

EXAMPLES
  $ commercelayer tags:update <tag-id> -n <tag-name>
```

_See code: [src/commands/tags/update.ts](https://github.com/commercelayer/commercelayer-cli-plugin-tags/blob/main/src/commands/tags/update.ts)_

### `commercelayer tags:which ID_NAME`

Show all the resources with this tag.

```sh-session
USAGE
  $ commercelayer tags:which ID_NAME -t <value> [-A | -l <value>]

ARGUMENTS
  ID_NAME  unique id or name of the tag

FLAGS
  -A, --all            show all resources instead of first 25 only
  -l, --limit=<value>  limit number of resources in output
  -t, --type=<value>   (required) the type of the tagged resources

DESCRIPTION
  show all the resources with this tag

EXAMPLES
  $ commercelayer tags:which <tag-id-or-name> -t <resource-type>

  $ cl tags:which groupA -t customers -A
```

_See code: [src/commands/tags/which.ts](https://github.com/commercelayer/commercelayer-cli-plugin-tags/blob/main/src/commands/tags/which.ts)_
<!-- commandsstop -->
