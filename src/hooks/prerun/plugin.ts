import { clColor, clOutput } from '@commercelayer/cli-core'
import { Hook } from '@oclif/core'
import { getAvailablePlugins, getInstalledPlugins, getPluginInfo } from '../../commands/plugins/available'
import inquirer from 'inquirer'
import { Config } from '@oclif/core/lib/interfaces'
import { CLIError } from '@oclif/core/lib/errors'



const hook: Hook<'prerun'> = async function (opts) {

  // Only for test purpouses to avoid an error of undefined object
  if (!opts.Command || !opts.argv) return

  // Only plugins commands are affected by this hook
  if (!opts.Command.id.startsWith('plugins')) return


  if (['plugins:install', 'plugins:uninstall'].includes(opts.Command.id)) {

    const command = opts.Command.id.replace('plugins:', '')

    if (opts.argv.length === 0) {
      const arg = await promptPlugin(this.config, command).catch(this.error)
      if (arg) opts.argv[0] = arg
      else {
        this.log(`\nAll Commerce Layer CLI plugins have already been ${command}ed\n`)
        throw new CLIError('HOOK_EXIT')
      }
    }

    let index = -1
    let plugin

    const found = opts.argv.some(a => {

      index++
      if (a.startsWith('-')) return false // ignore flags
      if (opts.argv[index - 1] === '--tag') return false  // ignore --tag value

      const p = getPluginInfo(a)
      if (p === undefined) this.error(`Unknown Commerce Layer CLI plugin: ${clColor.msg.error(a)}. Run '${clColor.italic(`${this.config.bin} plugins:available`)}' to get a list of all available plugins`)
      else plugin = p.plugin as string

      return true

    })


    if (found && plugin) {

       // Check tag flag
      const tgIndex = opts.argv.indexOf('--tag')
      if (tgIndex > -1) {
        plugin =`${plugin}@${opts.argv[tgIndex + 1]}`
        opts.argv.splice(tgIndex, 2)
      }

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
