import { clColor, clOutput } from '@commercelayer/cli-core'
import type { Hook } from '@oclif/core'
import { getAvailablePlugins, getInstalledPlugins, getPluginInfo, isPluginInstalled } from '../../commands/plugins/available'
import inquirer from 'inquirer'
import type { Config } from '@oclif/core/lib/interfaces'
import { CLIError } from '@oclif/core/lib/errors'



const hook: Hook<'prerun'> = async function (opts) {

  // Only for test purpouses to avoid an error of undefined object
  if (!opts.Command || !opts.argv) return

  // Only plugins commands are affected by this hook
  if (!opts.Command.id.startsWith('plugins')) return


  if (['plugins:install', 'plugins:uninstall'].includes(opts.Command.id)) {

    const command = opts.Command.id.replace('plugins:', '')

    // Check tag flag
    const tgIndex = opts.argv.indexOf('--tag')
    let tag
    if (tgIndex > -1) {
      tag = opts.argv[tgIndex + 1]
      opts.argv.splice(tgIndex, 2)
    }

    if (opts.argv.length === 0) {
      const arg = await promptPlugin(this.config, command)
        .catch((error: Error) => { this.error(error) })
      if (arg) opts.argv[0] = arg
      else {
        this.log(`\nAll Commerce Layer CLI plugins have already been ${command}ed\n`)
        throw new CLIError('HOOK_EXIT')
      }
    }

    let index = -1
    let plugin: string = ''
    let pluginArg: string = ''

    const found = opts.argv.some(a => {

      index++
      if (a.startsWith('-')) return false // ignore flags
      if (opts.argv[index - 1] === '--tag') return false  // ignore --tag value

      pluginArg = a
      const p = getPluginInfo(pluginArg)
      if (p === undefined) this.error(`Unknown Commerce Layer CLI plugin: ${clColor.msg.error(a)}. Run '${clColor.italic(`${this.config.bin} plugins:available`)}' to get a list of all available plugins`)
      else plugin = p.plugin

      return true

    })


    if (found && plugin) {

      let errMsg: string = ''
      if ((command === 'install') && isPluginInstalled(plugin, this.config)) errMsg = 'Commerce Layer CLI plugin already installed'
      else
      if ((command === 'uninstall') && !isPluginInstalled(plugin, this.config)) errMsg = 'Commerce Layer CLI plugin not installed'

      if (errMsg) {
        this.log(`\n${errMsg}: ${clColor.cli.plugin(pluginArg)}\n`)
        throw new CLIError('HOOK_EXIT')
      } else this.log('')


      // Set version
      if (tgIndex > -1) plugin = `${plugin}@${tag}`

      // Overwrite plugin short name whith its full name
      opts.argv[index] = plugin

    } else this.error('No Commerce Layer CLI plugin to ' + command)

  }

}


const promptPlugin = async (config: Config, command: string): Promise<string> => {

  const installed = getInstalledPlugins(config)
  const plugins = (command === 'install') ? getAvailablePlugins().filter(p => !installed.includes(p) && !p.hidden) : installed

  if (plugins.length === 0) return ''

  const plgMaxLength = clOutput.maxLength(plugins, 'name') + 4

  plugins.sort((a, b) => a.name.localeCompare(b.name))

  const answers = await inquirer.prompt([{
    type: 'list',
    name: 'plugin',
    message: `Select a plugin to ${command}:`,
    choices: plugins.map(p => {
      return { name: `${p.name.padEnd(plgMaxLength, ' ')} ${clColor.italic(p.description)}`, value: p.plugin }
    }),
    loop: false,
    pageSize: 10,
  }])

  return answers.plugin as string

}


export default hook
