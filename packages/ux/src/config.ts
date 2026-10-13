import { ux as oclifUx } from '@oclif/core'
import type { ActionBase } from './action/base'

export type Levels = 'debug' | 'error' | 'fatal' | 'info' | 'trace' | 'warn'

export interface ConfigMessage {
  prop: string
  type: 'config'
  value: any
}

const g: any = global
const globals = g.ux || (g.ux = {})

export class Config {
  /**
   * oclif's own action (spinner): oclif stops it when a command fails, which
   * restores stdout / stderr. A separate cli-ux spinner kept them buffered
   * after an error, and the error message was never printed.
   */
  action: ActionBase = oclifUx.action as unknown as ActionBase

  errorsHandled = false

  outputLevel: Levels = 'info'

  showStackTrace = true

  get context(): any {
    return globals.context || {}
  }

  set context(v: unknown) {
    globals.context = v
  }

  get debug(): boolean {
    return globals.debug || process.env.DEBUG === '*'
  }

  set debug(v: boolean) {
    globals.debug = v
  }
}

function oclifCoreVersion(): string | undefined {
  try {
    return require('@oclif/core/package.json').version
  } catch {
    return undefined
  }
}

function fetch(): any {
  // One config per oclif major (formerly read from oclif's internal cache)
  const major = oclifCoreVersion()?.split('.')[0] || 'unknown'
  if (globals[major]) return globals[major]
  globals[major] = new Config()
  return globals[major]
}


export const config: Config = fetch()
export default config
