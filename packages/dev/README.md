# @oclif/dev-cli

helpers for oclif CLIs

[![Version](https://img.shields.io/npm/v/@commercelayer/cli-dev.svg)](https://npmjs.org/package/@commercelayer/cli-dev)
[![Known Vulnerabilities](https://snyk.io/test/npm/@commercelayer/cli-dev/badge.svg)](https://snyk.io/test/npm/@commercelayer/cli-dev)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli-dev.svg)](https://npmjs.org/package/@commercelayer/cli-dev)
[![License](https://img.shields.io/npm/l/@commercelayer/cli-dev.svg)](https://github.com/commercelayer/cli-dev/blob/master/package.json)

<!-- toc -->

* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

## Usage
<!-- usage -->

```sh-session
      $ cl-cli-dev COMMAND

      $ cl-cli-dev (-v | version | --version) to check the version of the CLI you have installed.

      $ cl-cli-dev [COMMAND] (--help | -h) for detailed information about CLI commands.
```
<!-- usagestop -->
## Commands
<!-- commands -->

* [`cl-cli-dev readme`](#cl-cli-dev-readme)

### `cl-cli-dev readme`

Adds commands to README.md in current directory

```sh-session
USAGE
  $ cl-cli-dev readme --dir <value> [--multi] [--bin <value> --plugin]

FLAGS
  --bin=<value>  optional main cli command
  --dir=<value>  (required) [default: docs] output directory for multi docs
  --multi        create a different markdown page for each topic
  --plugin       create a plugin readme doc

DESCRIPTION
  adds commands to README.md in current directory

  The readme must have any of the following tags inside of it for it to be replaced or else it will do nothing:

  ## Usage

  <!-- usage -->

  ## Commands

  <!-- commands -->

  Customize the code URL prefix by setting oclif.repositoryPrefix in package.json.
```

_See code: [src/commands/readme.ts](https://github.com/commercelayer/commercelayer-cli-dev/blob/main/src/commands/readme.ts)_
<!-- commandsstop -->
