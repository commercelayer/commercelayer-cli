import { Args, Flags, Command, ux as cliux } from '@oclif/core'
import { type PluginRelease, getAvailablePlugins, getPluginInfo } from './available'
import { clColor } from '@commercelayer/cli-core'

export default class PluginsLatest extends Command {

  static description = 'show latest version of available plugins'

  static examples = [
    '$ commercelayer plugins:latest',
    '$ cl plugins:latest resources'
  ]

  static flags = {
    beta: Flags.boolean({
      char: 'b',
      description: 'retrieve latest version from beta channel'
    })
  }

  static args = {
    plugin: Args.string({ description: 'the name of the plugin', required: false })
  }

  public async run(): Promise<string> {

    const { args, flags } = await this.parse(PluginsLatest)

    const beta = flags.beta || false

    const pluginInfo = getPluginInfo(args.plugin)
    if (!pluginInfo && args.plugin) this.error(`Plugin not available: ${clColor.msg.error(args.plugin)}`)

    const availablePlugins: PluginRelease[] = getAvailablePlugins().filter(p => p.enabled && !p.hidden)
    const plugins: PluginRelease[] = pluginInfo ? [pluginInfo] : availablePlugins


    if (plugins.length === 0) {
      this.log('\nNo available plugins\n')
      this.exit()
    }

    this.log()

    cliux.action.start(`Fetching plugins${beta? ' [beta]' : ''}`)
    const output: string[] = []
    for (const plugin of plugins) {

      const pluginEntry = plugin.plugin

      const channel = beta? 'beta' : 'latest'
      const latest = await fetch(`https://registry.npmjs.org/${pluginEntry}/${channel}`)
        .then(async response => response.json())
        .catch(() => {
          this.error('Unable to fetch latest plugins, please retry later')
        })

      const version = latest.version

      output.push(`${pluginEntry}: ${clColor.dim(version)}`)

    }
    cliux.action.stop()

    const formattedOutput = output.sort().join('\n')

    this.log()
    this.log(formattedOutput)
    this.log()

    return formattedOutput

  }

}