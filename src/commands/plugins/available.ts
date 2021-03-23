import { Command } from '@oclif/command'
import chalk from 'chalk'

export default class PluginsAvailable extends Command {
  static description = 'describe the command here'

  static flags = {}

  static args = []


  async run() {

    // const {args, flags} = this.parse(PluginsAvailable)

    this.log('List of all available Commerce Layer CLI plugins:')

    const plugins = AvailablePlugins.map(p => `- ${chalk.yellow(p.name)} : ${p.description} [${p.plugin}]`)
    this.log(plugins.join('\n'))

  }

}


const AvailablePlugins = [
  { name: 'seeder', plugin: '@commercelayer/cli-plugin-seeder', description: 'organization data seeder' },
] as const


const getPluginInfo = (pluginName: string): any => {

  let plugin

  AvailablePlugins.some(p => {
    if ((pluginName === p.name) || (pluginName === p.plugin) || (`@commercelayer/${pluginName}` === p.plugin)) {
      plugin = p
      return true
    }
    return false
  })

  return plugin

}

export { getPluginInfo }
