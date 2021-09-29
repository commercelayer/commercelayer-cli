# Commerce Layer CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@commercelayer/cli.svg)](https://npmjs.org/package/@commercelayer/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@commercelayer/cli.svg)](https://npmjs.org/package/@commercelayer/cli)
[![License](https://img.shields.io/npm/l/@commercelayer/commercelayer-cli.svg)](https://github.com/commercelayer/commercelayer-cli/blob/master/package.json)

The official Commerce Layer CLI which helps you to manage your Commerce Layer applications right from the terminal.

![Commerce Layer CLI demo](assets/home.gif)

## What is Commerce Layer?

[Commerce Layer](https://commercelayer.io) is a headless commerce platform and order management system that lets you add global shopping capabilities to any website, mobile app, chatbot, or IoT device, with ease. Perfect fit for the best-of-breed CMSs, static site generators, and any other tools you already master and love, our blazing-fast and secure API will help you make your content shoppable on a global scale.

## Table of contents

<!-- toc -->

* [ Installation](#-installation)
* [ Usage](#-usage)
* [ Commands](#-commands)
* [ Plugins](#-plugins)
* [ Contributors Guide](#-contributors-guide)
* [ Need help?](#-need-help)
* [ License](#-license)
<!-- tocstop -->

## Installation

Run the command below to install the CLI using your favorite package manager:

```bash
npm install -g @commercelayer/cli
```

```
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
* [`commercelayer help`](docs/help.md) - Display help for commercelayer.
* [`commercelayer plugins`](docs/plugins.md) - Manage CLI plugins.
* [`commercelayer util`](docs/util.md) - Decode a Commerce Layer JWT.

<!-- commandsstop -->

## Plugins

The Commerce Layer CLI currently supports the following plugins:

* [`resources`](https://github.com/commercelayer/commercelayer-cli-plugin-resources/blob/main/README.md) - Execute CRUD operations on API resources.
* [`seeder`](https://github.com/commercelayer/commercelayer-cli-plugin-seeder/blob/main/README.md) - Execute Commerce Layer seeder.

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

1. Request an invite to join [Commerce Layer's Slack community](https://commercelayer.io/developers) (kindly scroll down to the bottom of the page).

2. Create an [issue](https://github.com/commercelayer/commercelayer-cli/issues) in this repository.

3. Ping us [on Twitter](https://twitter.com/commercelayer).

## License

This repository is published under the [MIT](LICENSE) license.
