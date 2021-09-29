import { Command, flags } from '@oclif/command'
import chalk from 'chalk'
import cliux from 'cli-ux'

export default class PluginsAvailable extends Command {

  static description = 'show all available Commerce Layer CLI plugins'

  static examples = [
    '$ commercelayer plugins:available',
  ]

  static flags = {
    hidden: flags.boolean({
      char: 'H',
      description: 'show also enabled but hidden plugins',
      hidden: true,
    }),
  }

  static args = []


  async run() {

    const { flags } = this.parse(PluginsAvailable)

    this.log(chalk.blueBright('\n-= Commerce Layer CLI available plugins =-\n'))

    const availablePlugins = AvailablePlugins.filter(p => ((!p.hidden || flags.hidden) && p.enabled))

    if (availablePlugins && (availablePlugins.length > 0)) {
      cliux.table(availablePlugins,
        {
          key: { header: 'PLUGIN (KEY)', minWidth: 20, get: row => (row.hidden ? chalk.dim : chalk).blueBright(row.name) },
          description: { header: 'DESCRIPTION', get: row => (row.hidden ? chalk.dim(row.description) : row.description) },
        },
        {
          printLine: this.log,
      })
    } else this.log(chalk.italic('No available plugins'))
    this.log()

  }

}


const AvailablePlugins = [
  { name: 'imports',    plugin: '@commercelayer/cli-plugin-imports',    description: 'Organization imports manager',      enabled: true   },
  { name: 'resources',  plugin: '@commercelayer/cli-plugin-resources',  description: 'CRUD operations on API resources',  enabled: true   },
  { name: 'seeder',     plugin: '@commercelayer/cli-plugin-seeder',     description: 'Organization data seeder',          enabled: true   },
  { name: 'webhooks',   plugin: '@commercelayer/cli-plugin-webhooks',   description: 'Organization webhooks analyzer',    enabled: true,  hidden: true  },
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
