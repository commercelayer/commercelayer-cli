# Commerce Layer CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli.svg)](https://npmjs.org/package/@commercelayer/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli.svg)](https://npmjs.org/package/@commercelayer/cli)
[![License](https://img.shields.io/npm/l/@commercelayer/commercelayer-cli.svg)](https://github.com/commercelayer/commercelayer-cli/blob/master/package.json)
[![CodeQL](https://github.com/commercelayer/commercelayer-cli/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/commercelayer/commercelayer-cli/actions/workflows/codeql-analysis.yml)

The official Commerce Layer CLI which helps you to manage your Commerce Layer applications right from the terminal.

![Commerce Layer CLI demo](assets/home.gif)

## What is Commerce Layer?

[Commerce Layer](https://commercelayer.io) is a multi-market commerce API and order management system that lets you add global shopping capabilities to any website, mobile app, chatbot, wearable, voice, or IoT device, with ease. Compose your stack with the best-of-breed tools you already mastered and love. Make any experience shoppable, anywhere, through a blazing-fast, enterprise-grade, and secure API.

## Table of contents

<!-- toc -->

* [Installation](#installation)
* [Usage](#usage)
* [Commands](#commands)
* [Plugins](#plugins)
* [Contributors Guide](#contributors-guide)
* [Need help?](#need-help)
* [License](#license)
<!-- tocstop -->

## Installation

Run the command below to install the CLI using your favorite package manager:

```bash
npm install -g @commercelayer/cli
```

```bash
yarn global add @commercelayer/cli
```

_More installation options, coming soon..._

## Usage

Installing the CLI provides access to the `commercelayer`, `clayer`, and `cl` command.

<!-- usage-DISABLED -->
```sh-session
$ (commercelayer | clayer | cl) COMMAND

$ commercelayer (-v | version | --version) to check the version of the CLI you have installed.

$ commercelayer help [COMMAND]
or
$ commercelayer [COMMAND] (--help | -h) for detailed information about CLI commands.
```
<!-- usagestop-DISABLED -->

Kindly check out this [quick step-by-step example](https://gist.github.com/silviorelli/93424c7e0483780dc5c51fe7a3d215c1) which will show you how to place an order using this CLI.

## Commands

The Commerce Layer CLI supports the following commands:

<!-- commands -->

* [`commercelayer applications`](docs/applications.md) - Manage login to CLI applications.
* [`commercelayer autocomplete`](docs/autocomplete.md) - Display autocomplete installation instructions.
* [`commercelayer cli`](docs/cli.md) - Core CLI commands.
* [`commercelayer help`](docs/help.md) - Display help for commercelayer.
* [`commercelayer plugins`](docs/plugins.md) - Manage CLI plugins.

<!-- commandsstop -->

## Plugins

The Commerce Layer CLI currently supports the following plugins:

* [`resources`](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/main/README.md) - Execute CRUD operations on API resources.
* [`seeder`](https://github.com/commercelayer/commercelayer-cli-plugin-seeder/blob/main/README.md) - Execute Commerce Layer seeder.
* [`imports`](https://github.com/commercelayer/commercelayer-cli-plugin-imports/blob/main/README.md) - Import resources in Commerce Layer.
* [`webhooks`](https://github.com/commercelayer/commercelayer-cli-plugin-webhooks/blob/main/README.md) - Manage webhooks in Commerce Layer.
* [`orders`](https://github.com/commercelayer/commercelayer-cli-plugin-orders/blob/main/README.md) - Execute actions on orders in Commerce Layer.
* [`checkout`](https://github.com/commercelayer/commercelayer-cli-plugin-checkout/blob/main/README.md) - Generate checkout URLs.
* [`triggers`](https://github.com/commercelayer/commercelayer-cli-plugin-triggers/blob/main/README.md) - Execute actions on resources in Commerce Layer.
* [`token`](https://github.com/commercelayer/commercelayer-cli-plugin-token/blob/main/README.md) - Manage Commerce Layer access tokens.
* [`microstore`](https://github.com/commercelayer/commercelayer-cli-plugin-microstore/blob/main/README.md) - Generate Microstore URLs.
* [`exports`](https://github.com/commercelayer/commercelayer-cli-plugin-exports/blob/main/README.md) - Export resources from Commerce Layer.

You can run the command below to get a list of all available CLI plugins:

```sh-session
commercelayer plugins:available
```

You can run the command below to update all available CLI plugins:

```sh-session
commercelayer plugins:update
```

## Contributors Guide

1. Fork [this repository](https://github.com/commercelayer/commercelayer-cli) (learn how to do this [here](https://help.github.com/articles/fork-a-repo)).

2. Clone the forked repository like so:

    ```bash
    git clone https://github.com/<your username>/commercelayer-cli.git && cd commercelayer-cli
    ```

3. Make your changes and create a pull request ([learn how to do this](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request)).

4. Someone will attend to your pull request and provide some feedback.

## Need help?

1. Join [Commerce Layer's Slack community](https://slack.commercelayer.app).

2. Create an [issue](https://github.com/commercelayer/commercelayer-cli/issues) in this repository.

3. Ping us [on Twitter](https://twitter.com/commercelayer).

## License

This repository is published under the [MIT](LICENSE) license.
