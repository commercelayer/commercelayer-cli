import { Command } from '@oclif/command'
import chalk from 'chalk'
import cliux from 'cli-ux'

export default class PluginsAvailable extends Command {

  static description = 'shows all available Commerce Layer plugins'

  // static aliases = ['plugins:list']

  static flags = {}

  static args = []


  async run() {

    this.log(chalk.blueBright('\n-= Available Commerce Layer CLI plugins =-'))

    // const plugins = AvailablePlugins.map(p => `- ${chalk.yellow(p.name)} : ${p.description} [${p.plugin}]`)
    // this.log(plugins.join('\n'))

    const availablePlugins = AvailablePlugins.filter(p => !p.hidden)

    this.log()

    if (availablePlugins && (availablePlugins.length > 0)) {
      cliux.table(availablePlugins,
        {
          key: { header: 'PLUGIN (KEY)', minWidth: 20, get: row =>  chalk.yellow(row.name) },
          description: { header: 'DESCRIPTION' },
        },
        {
          printLine: this.log,
      })
    } else this.log(chalk.italic('At the moiment there are no available plugins'))
    this.log()

  }

}


const AvailablePlugins = [
  { name: 'seeder',     plugin: '@commercelayer/cli-plugin-seeder',     description: 'Organization data seeder'   },
  { name: 'resources',  plugin: '@commercelayer/cli-plugin-resources',  description: 'CRUD resources commands'    },
  { name: 'importer',   plugin: '@commercelayer/cli-plugin-importer',   description: 'Organization data importer', hidden: true },
  { name: 'exporter',   plugin: '@commercelayer/cli-plugin-exporter',   description: 'Organization data exporter', hidden: true },
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
