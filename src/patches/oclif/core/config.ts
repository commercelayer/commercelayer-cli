import { CLIError } from '@oclif/core/lib/errors'
import { Command, LoadOptions, Config as IConfig } from '@oclif/core/lib/interfaces'
import { Debug } from '@oclif/core/lib/config/util'
import { Config } from '@oclif/core'
import { fileURLToPath } from 'url'

// eslint-disable-next-line new-cap
const debug = Debug()


function isConfig(o: any): o is IConfig {
  return o && Boolean(o._base)
}


export class PatchedConfig extends Config {

  static async load(opts: LoadOptions = (module.parent?.parent?.filename) || __dirname): Promise<IConfig> {
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


  // eslint-disable-next-line default-param-last
  async runCommand<T = unknown>(id: string, argv: string[] = [], cachedCommand?: Command.Plugin): Promise<T> {
    debug('runCommand %s %o', id, argv)
    const c = cachedCommand || this.findCommand(id)
    if (!c) {
      const matches = this.flexibleTaxonomy ? this.findMatches(id, argv) : []
      const hookResult = this.flexibleTaxonomy && matches.length > 0 ?
        await this.runHook('command_incomplete', { id, argv, matches }) :
        await this.runHook('command_not_found', { id, argv })

      if (hookResult.successes[0]) {
        const cmdResult = hookResult.successes[0].result
        return cmdResult as T
      }

      throw new CLIError(`command ${id} not found`)
    }

    const command = await c.load()
    const prerunHook = await this.runHook('prerun', { Command: command, argv })
    if (prerunHook.failures[0]) throw new CLIError(prerunHook.failures[0].error)
    const result = (await command.run(argv, this)) as T
    const postrunHook = await this.runHook('postrun', { Command: command, result, argv })
    if (postrunHook.failures[0]) throw new CLIError(postrunHook.failures[0].error)
    return result
  }

}
