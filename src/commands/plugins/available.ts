import { Command } from '@oclif/command'
import chalk from 'chalk'
import cliux from 'cli-ux'

export default class PluginsAvailable extends Command {

  static description = 'shows all available Commerce Layer plugins'

  // static aliases = ['plugins:list']

  static flags = {}

  static args = []


  async run() {

    // const {args, flags} = this.parse(PluginsAvailable)

    this.log(chalk.blueBright('\nList of all available Commerce Layer CLI plugins:'))

    // const plugins = AvailablePlugins.map(p => `- ${chalk.yellow(p.name)} : ${p.description} [${p.plugin}]`)
    // this.log(plugins.join('\n'))

    this.log()
    cliux.table(AvailablePlugins,
      {
        key: { header: 'PLUGIN (KEY)', minWidth: 20, get: row =>  chalk.yellow(row.name) },
        description: { header: 'DESCRIPTION' },
      },
      {
        printLine: this.log,
    })
    this.log()

  }

}


const AvailablePlugins = [
  { name: 'seeder',     plugin: '@commercelayer/cli-plugin-seeder',     description: 'Organization data seeder' },
  { name: 'resources',  plugin: '@commercelayer/cli-plugin-resources',  description: 'CRUD resources commands'  },
]


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
