@oclif/dev-cli
===============

helpers for oclif CLIs

[![Version](https://img.shields.io/npm/v/@oclif/dev-cli.svg)](https://npmjs.org/package/@oclif/dev-cli)
[![CircleCI](https://circleci.com/gh/oclif/dev-cli/tree/master.svg?style=shield)](https://circleci.com/gh/oclif/dev-cli/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/oclif/dev-cli?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/dev-cli/branch/master)
[![Codecov](https://codecov.io/gh/oclif/dev-cli/branch/master/graph/badge.svg)](https://codecov.io/gh/oclif/dev-cli)
[![Known Vulnerabilities](https://snyk.io/test/npm/@oclif/dev-cli/badge.svg)](https://snyk.io/test/npm/@oclif/dev-cli)
[![Downloads/week](https://img.shields.io/npm/dw/@oclif/dev-cli.svg)](https://npmjs.org/package/@oclif/dev-cli)
[![License](https://img.shields.io/npm/l/@oclif/dev-cli.svg)](https://github.com/oclif/dev-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @commercelayer/cli-dev
$ cl-cli-dev COMMAND
running command...
$ cl-cli-dev (--version)
@commercelayer/cli-dev/0.1.1 darwin-x64 node-v16.13.2
$ cl-cli-dev --help [COMMAND]
USAGE
  $ cl-cli-dev COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`cl-cli-dev readme`](#cl-cli-dev-readme)

## `cl-cli-dev readme`

adds commands to README.md in current directory

```
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
