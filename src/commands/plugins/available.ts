import { Command } from '@oclif/command'
import chalk from 'chalk'
import cliux from 'cli-ux'

export default class PluginsAvailable extends Command {

  static description = 'show all available Commerce Layer CLI plugins'

  // static aliases = ['plugins:list']

  static examples = [
    '$ commercelayer plugins:available',
  ]

  static flags = {
    // help: flags.help({char: 'h'}),
  }

  static args = []


  async run() {

    this.log(chalk.blueBright('\n-= Available Commerce Layer CLI plugins =-\n'))

    const availablePlugins = AvailablePlugins.filter(p => (!p.hidden && p.enabled))

    if (availablePlugins && (availablePlugins.length > 0)) {
      cliux.table(availablePlugins,
        {
          key: { header: 'PLUGIN (KEY)', minWidth: 20, get: row =>  chalk.blueBright(row.name) },
          description: { header: 'DESCRIPTION\n' },
        },
        {
          printLine: this.log,
      })
    } else this.log(chalk.italic('No available plugins'))
    this.log()

  }

}


const AvailablePlugins = [
  { name: 'resources',  plugin: '@commercelayer/cli-plugin-resources',  description: 'CRUD operations on API resources',  enabled: true   },
  { name: 'seeder',     plugin: '@commercelayer/cli-plugin-seeder',     description: 'Organization data seeder',          enabled: true   },
  { name: 'importer',   plugin: '@commercelayer/cli-plugin-importer',   description: 'Organization data importer',        enabled: false  },
  { name: 'exporter',   plugin: '@commercelayer/cli-plugin-exporter',   description: 'Organization data exporter',        enabled: true, hidden: true },
  { name: 'cleaner',    plugin: '@commercelayer/cli-plugin-cleaner',    description: 'Organization data cleaner',         enabled: false  },
]


const getPluginInfo = (pluginName: string): any => {

  let plugin

  AvailablePlugins.filter(p => p.enabled).some(p => {
    if ((pluginName === p.name) || (pluginName === p.plugin) || (`@commercelayer/${pluginName}` === p.plugin)) {
      plugin = p
      return true
    }
    return false
  })

  return plugin

}

export { getPluginInfo }
