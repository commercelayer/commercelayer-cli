/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { format as utilFormat } from 'node:util'
import { Errors } from '@oclif/core'
import chalk from 'chalk'
import type { ActionBase } from './action/base'
import { config } from './config'
import { flush as _flush } from './flush'
import * as uxPrompt from './prompt'
import * as styled from './styled'
import uxWait from './wait'
import write from './write'

const hyperlinker = require('hyperlinker')


// biome-ignore lint/complexity/noStaticOnlyClass: left for compatibility with old linter
export class ux {
  public static config = config

  public static get action(): ActionBase {
    return config.action
  }

  public static annotation(text: string, annotation: string): void {
    const supports = require('supports-hyperlinks')
    if (supports.stdout) {
      // \u001b]8;;https://google.com\u0007sometext\u001b]8;;\u0007
      ux.log(`\u001B]1337;AddAnnotation=${text.length}|${annotation}\u0007${text}`)
    } else {
      ux.log(text)
    }
  }

  /**
   * "press anykey to continue"
   */
  public static get anykey(): typeof uxPrompt.anykey {
    return uxPrompt.anykey
  }

  public static get confirm(): typeof uxPrompt.confirm {
    return uxPrompt.confirm
  }

  public static debug(format: string, ...args: string[]): void {
    if (['debug', 'trace'].includes(ux.config.outputLevel)) {
      ux.info(utilFormat(format, ...args) + '\n')
    }
  }

  public static async done(): Promise<void> {
    config.action.stop()
  }

  public static async flush(ms = 10_000): Promise<void> {
    await _flush(ms)
  }

  public static info(format: string, ...args: string[]): void {
    write.stdout(utilFormat(format, ...args) + '\n')
  }

  public static log(format?: string, ...args: string[]): void {
    ux.info(format || '', ...args)
  }

  public static logToStderr(format?: string, ...args: string[]): void {
    write.stderr(utilFormat(format, ...args) + '\n')
  }

  public static get progress(): typeof styled.progress {
    return styled.progress
  }

  public static get prompt(): typeof uxPrompt.prompt {
    return uxPrompt.prompt
  }

  public static styledHeader(header: string): void {
    ux.info(chalk.dim('=== ') + chalk.bold(header) + '\n')
  }

  public static styledJSON(obj: unknown): void {
    const json = JSON.stringify(obj, null, 2)
    if (!chalk.level) {
      ux.info(json)
      return
    }

    const cardinal = require('cardinal')
    const theme = require('cardinal/themes/jq')
    ux.info(cardinal.highlight(json, { json: true, theme }))
  }

  public static styledObject(obj: any, keys?: string[]): void {
    ux.info(styled.styledObject(obj, keys))
  }

  public static get table(): typeof styled.Table.table {
    return styled.Table.table
  }

  public static trace(format: string, ...args: string[]): void {
    if (ux.config.outputLevel === 'trace') {
      ux.info(utilFormat(format, ...args) + '\n')
    }
  }

  public static get tree(): typeof styled.tree {
    return styled.tree
  }

  public static url(text: string, uri: string, params = {}): void {
    ux.log(ux.hyperlink(text, uri, params))
  }

  public static hyperlink(text: string, uri: string, params = {}): string {
    const supports = require('supports-hyperlinks')
    if (supports.stdout) {
      return hyperlinker(text, uri, params)
    } else {
      return uri
    }
  }

  public static get wait(): typeof uxWait {
    return uxWait
  }
}

const {
  action,
  annotation,
  anykey,
  confirm,
  debug,
  done,
  flush,
  hyperlink,
  info,
  log,
  logToStderr,
  progress,
  prompt,
  styledHeader,
  styledJSON,
  styledObject,
  table,
  trace,
  tree,
  url,
  wait,
} = ux

const { error, exit, warn } = Errors

export {
  action,
  annotation,
  anykey,
  confirm,
  debug,
  done,
  error,
  exit,
  flush,
  hyperlink,
  info,
  log,
  logToStderr,
  progress,
  prompt,
  styledHeader,
  styledJSON,
  styledObject,
  table,
  trace,
  tree,
  url,
  wait,
  warn
}

const uxProcessExitHandler = async (): Promise<void> => {
  try {
    await ux.done()
  } catch (error) {
    console.error(error)
    process.exitCode = 1
  }
}

// to avoid MaxListenersExceededWarning
// only attach named listener once
const uxListener = process.listeners('exit').find((fn) => fn.name === uxProcessExitHandler.name)
if (!uxListener) {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  process.once('exit', uxProcessExitHandler)
}

export { ActionBase } from './action/base'
export { Config, config } from './config'
export { ExitError } from './exit'
export type { IPromptOptions } from './prompt'
export { Table } from './styled'

export { colorize } from './theme'
export { default as write } from './write'
