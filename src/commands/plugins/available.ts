import { Command, Flags, CliUx as cliux } from '@oclif/core'
import { clColor, clUtil } from '@commercelayer/cli-core'
import { Config } from '@oclif/core/lib/interfaces'


export default class PluginsAvailable extends Command {

  static description = 'show all available Commerce Layer CLI plugins'

  static examples = [
    '$ commercelayer plugins:available',
  ]

  static flags = {
    hidden: Flags.boolean({
      char: 'H',
      description: 'show also enabled but hidden plugins',
      hidden: true,
    }),
  }

  static args = []


  async run() {

    const { flags } = await this.parse(PluginsAvailable)

    this.log(clColor.style.title('\n-= Commerce Layer CLI available plugins =-\n'))

    const availablePlugins = AvailablePlugins.filter(p => ((!p.hidden || flags.hidden) && p.enabled))

    if (availablePlugins && (availablePlugins.length > 0)) {
      cliux.Table.table(availablePlugins, {
          key: { header: 'PLUGIN (KEY)', minWidth: 20, get: row => (row.hidden ? clColor.dim : clColor).blueBright(row.name) },
          description: { header: 'DESCRIPTION', get: row => (row.hidden ? clColor.dim(row.description) : row.description) },
        }, {
          printLine: clUtil.log,
      })
    } else this.log(clColor.italic('No available plugins'))

    this.log()

  }

}


type PluginRelease = {
  name: string;
  plugin: string;
  description: string;
  enabled: boolean;
  hidden?: boolean;
}

const AvailablePlugins: PluginRelease[] = [
  { name: 'resources',    plugin: '@commercelayer/cli-plugin-resources',  description: 'CRUD operations on API resources',    enabled: true },
  { name: 'seeder',       plugin: '@commercelayer/cli-plugin-seeder',     description: 'Organization data seeder',            enabled: true },
  { name: 'imports',      plugin: '@commercelayer/cli-plugin-imports',    description: 'Organization imports manager',        enabled: true },
  { name: 'webhooks',     plugin: '@commercelayer/cli-plugin-webhooks',   description: 'Organization webhooks analyzer',      enabled: true },
  { name: 'orders',       plugin: '@commercelayer/cli-plugin-orders',     description: 'Organization orders management',      enabled: true },
  { name: 'checkout',     plugin: '@commercelayer/cli-plugin-checkout',   description: 'Checkout URLs generation',            enabled: true },
  { name: 'triggers',     plugin: '@commercelayer/cli-plugin-triggers',   description: 'Execute actions on resources',        enabled: true },
  { name: 'token',        plugin: '@commercelayer/cli-plugin-token',      description: 'Manage Commerce Layer access tokens', enabled: true },
  { name: 'microstore',   plugin: '@commercelayer/cli-plugin-microstore', description: 'Microstore URLs generation',          enabled: true },
]


const getPluginInfo = (pluginName: string): any => {

  let plugin

  if (pluginName) {
    AvailablePlugins.filter(p => p.enabled).some(p => {
      if ((pluginName === p.name) || (pluginName === p.plugin) || (`@commercelayer/${pluginName}` === p.plugin)) {
        plugin = p
        return true
      }
      return false
    })
  }

  return plugin

}


const getAvailablePlugins = (): PluginRelease[] => {
  return AvailablePlugins
}


const getInstalledPlugins = (config: Config): PluginRelease[] => {
  const installed = config.plugins.filter(p => p.name.startsWith('@commercelayer/cli-plugin-')).map(p => p.name)
  return AvailablePlugins.filter(p => installed.find(i => i === p.plugin) !== undefined)
}


export { getPluginInfo, getAvailablePlugins, PluginRelease, getInstalledPlugins }
