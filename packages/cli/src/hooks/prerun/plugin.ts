import { clColor, clOutput } from '@commercelayer/cli-core'
import type { Hook, Interfaces } from '@oclif/core'
import { Errors } from '@oclif/core'
import inquirer from 'inquirer'
import { getAvailablePlugins, getInstalledPlugins, getPluginInfo, isPluginInstalled } from '../../commands/plugins/available'

const { CLIError } = Errors
type Config = Interfaces.Config



const hook: Hook<'prerun'> = async function (opts) {

  // Only for test purpouses to avoid an error of undefined object
  if (!opts.Command || !opts.argv) return

  // Only plugins commands are affected by this hook
  if (!opts.Command.id.startsWith('plugins')) return


  if (['plugins:install', 'plugins:uninstall'].includes(opts.Command.id)) {

    const command = opts.Command.id.replace('plugins:', '')

    // Check tag flag
    const tgIndex = opts.argv.indexOf('--tag')
    let tag: any
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
    let testBuild: string | undefined

    const found = opts.argv.some(a => {

      index++
      if (a.startsWith('-')) return false // ignore flags
      if (opts.argv[index - 1] === '--tag') return false  // ignore --tag value

      pluginArg = a
      // A test build, not released on npm: installed as it is
      if (command === 'install') {
        testBuild = testBuildPlugin(a)
        if (testBuild) {
          plugin = a
          return true
        }
      }
      const p = getPluginInfo(pluginArg)
      if (p === undefined) this.error(`Unknown Commerce Layer CLI plugin: ${clColor.msg.error(a)}. Run '${clColor.italic(`${this.config.bin} plugins:available`)}' to get a list of all available plugins`)
      else plugin = p.plugin

      return true

    })


    if (found && testBuild) this.log(`\nInstalling a test build of ${clColor.cli.plugin(testBuild)}, not released on npm: ${clColor.italic(plugin)}\n`)
    else
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


/**
 * The plugin a test build installs, when the argument is one: a pkg.pr.new
 * preview URL (preview.yml) or a local tarball (file:…/commercelayer-cli-plugin-<name>-<version>.tgz,
 * from `pnpm release:try` or `pnpm pack`) of a known Commerce Layer CLI plugin
 */
const testBuildPlugin = (arg: string): string | undefined => {
  const preview = /^https:\/\/pkg\.pr\.new\/(?:[\w.-]+\/){0,2}(@commercelayer\/cli-plugin-[a-z-]+)@[\w.-]+$/.exec(arg)?.[1]
  const tarball = /^file:(?:.*[\\/])?commercelayer-cli-plugin-([a-z-]+?)-\d+\.\d+\.\d+[\w.-]*\.tgz$/.exec(arg)?.[1]
  const name = preview ?? (tarball ? `@commercelayer/cli-plugin-${tarball}` : undefined)
  return name && getPluginInfo(name) ? name : undefined
}


const promptPlugin = async (config: Config, command: string): Promise<string> => {

  const installed = getInstalledPlugins(config)
  const plugins = (command === 'install') ? getAvailablePlugins().filter(p => !installed.includes(p) && !p.hidden) : installed

  if (plugins.length === 0) return ''

  const plgMaxLength = clOutput.maxLength(plugins, 'name') + 4

  plugins.sort((a, b) => a.name.localeCompare(b.name))

  const answers = await inquirer.prompt([{
    type: 'select',
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
export { testBuildPlugin }
