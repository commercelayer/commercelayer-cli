/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type Command, Config, Performance } from '@oclif/core'
import { Debug } from '@oclif/core/lib/config/util'
import { CLIError } from '@oclif/core/lib/errors'
import type { LoadOptions } from '@oclif/core/lib/interfaces'

import { fileURLToPath } from 'url'

// eslint-disable-next-line new-cap
const debug = Debug()


function isConfig(o: any): o is Config {
  return o && Boolean(o._base)
}


export class PatchedConfig extends Config {

  static async load(opts: LoadOptions = module.filename || __dirname): Promise<Config> {
    // Handle the case when a file URL string is passed in such as 'import.meta.url'; covert to file path.
    if (typeof opts === 'string' && opts.startsWith('file://')) {
      opts = fileURLToPath(opts)
    }

    if (typeof opts === 'string') opts = { root: opts }
    if (isConfig(opts)) return opts

    const config = new PatchedConfig(opts)
    await config.load()
    return config
  }


  public async runCommand<T = unknown>(id: string, argv: string[] = [], cachedCommand: Command.Loadable | null = null): Promise<T> {
    const marker = Performance.mark('@oclif/core', `config.runCommand#${id}`)
    debug('runCommand %s %o', id, argv)
    let c = cachedCommand ?? this.findCommand(id)
    if (!c) {
      const matches = this.flexibleTaxonomy ? this.findMatches(id, argv) : []
      const hookResult = this.flexibleTaxonomy && matches.length > 0 ?
        await this.runHook('command_incomplete', { id, argv, matches }) :
        await this.runHook('command_not_found', { id, argv })

      if (hookResult.successes[0]) return hookResult.successes[0].result as T
      if (hookResult.failures[0]) throw hookResult.failures[0].error
      throw new CLIError(`command ${id} not found`)
    }

    if (this.isJitPluginCommandPatched(c)) {
      const pluginName = c.pluginName!
      const pluginVersion = this.pjson.oclif.jitPlugins![pluginName]
      const jitResult = await this.runHook('jit_plugin_not_installed', {
        id,
        argv,
        command: c,
        pluginName,
        pluginVersion,
      })
      if (jitResult.failures[0]) throw jitResult.failures[0].error
      if (jitResult.successes[0]) {
        await this.loadPluginsAndCommands()
        c = this.findCommand(id) ?? c
      } else {
        // this means that no jit_plugin_not_installed hook exists, so we should run the default behavior
        const result = await this.runHook('command_not_found', { id, argv })
        if (result.successes[0]) return result.successes[0].result as T
        if (result.failures[0]) throw result.failures[0].error
        throw new CLIError(`command ${id} not found`)
      }
    }

    const command = await c.load()
    await this.runHook('prerun', { Command: command, argv })

    const result = (await command.run(argv, this)) as T
    await this.runHook('postrun', { Command: command, result, argv })

    marker?.addDetails({ command: id, plugin: c.pluginName! })
    marker?.stop()
    return result
  }


  private isJitPluginCommandPatched(c: Command.Loadable): boolean {
    return Object.keys(this.pjson.oclif.jitPlugins ?? {}).includes(c.pluginName ?? '') && !this.plugins.get(c?.pluginName || '')
  }

}