import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { clColor, clOutput } from '@commercelayer/cli-core'
import type { Hook, Interfaces } from '@oclif/core'
import { Errors } from '@oclif/core'
import inquirer from 'inquirer'
import { getAvailablePlugins, getInstalledPlugins, getPluginInfo, isPluginInstalled, type PluginRelease } from '../../commands/plugins/available'

const { CLIError } = Errors
type Config = Interfaces.Config



const hook: Hook<'prerun'> = async function (opts) {

  // Only for test purpouses to avoid an error of undefined object
  if (!opts.Command || !opts.argv) return

  // Only plugins commands are affected by this hook
  if (!opts.Command.id.startsWith('plugins')) return

  // Plugins installed by an older CLI, or with --latest, follow npm's latest: keep them on their major
  if (opts.Command.id === 'plugins:update') pinInstalledPlugins(this.config)


  if (['plugins:install', 'plugins:uninstall'].includes(opts.Command.id)) {

    const command = opts.Command.id.replace('plugins:', '')

    // Check tag flag
    const tgIndex = opts.argv.indexOf('--tag')
    let tag: any
    if (tgIndex > -1) {
      tag = opts.argv[tgIndex + 1]
      opts.argv.splice(tgIndex, 2)
    }

    // --latest: the latest version on npm (--tag latest), the explicit move to a new major
    const ltIndex = opts.argv.indexOf('--latest')
    if (ltIndex > -1) {
      if (tgIndex > -1) this.error(`${clColor.cli.flag('--latest')} and ${clColor.cli.flag('--tag')} cannot be used together`)
      if (command !== 'install') this.error(`${clColor.cli.flag('--latest')} is a flag of plugins:install only`)
      tag = 'latest'
      opts.argv.splice(ltIndex, 1)
    }
    const tagged = (tag !== undefined)

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
    let pluginInfo: PluginRelease | undefined
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
      else {
        plugin = p.plugin
        pluginInfo = p
      }

      return true

    })


    if (found && testBuild) this.log(`\nInstalling a test build of ${clColor.cli.plugin(testBuild)}, not released on npm: ${clColor.italic(plugin)}\n`)
    else
    if (found && plugin) {

      let errMsg: string = ''
      // With --latest or --tag an installed plugin is installed again: the explicit move to another version (e.g. its next major)
      if ((command === 'install') && !tagged && isPluginInstalled(plugin, this.config)) errMsg = 'Commerce Layer CLI plugin already installed'
      else
      if ((command === 'uninstall') && !isPluginInstalled(plugin, this.config)) errMsg = 'Commerce Layer CLI plugin not installed'

      if (errMsg) {
        this.log(`\n${errMsg}: ${clColor.cli.plugin(pluginArg)}\n`)
        if (command === 'install') this.log(`To install its latest version, a new major included, run '${clColor.italic(`${this.config.bin} plugins:install ${pluginArg} --latest`)}'\n`)
        throw new CLIError('HOOK_EXIT')
      } else this.log('')


      // Set version: the major of the plugin table unless the user asks for another (--latest, --tag)
      if (tagged) plugin = `${plugin}@${tag}`
      else if ((command === 'install') && pluginInfo) plugin = `${plugin}@${pluginInfo.version}`

      // Overwrite plugin short name whith its full name
      opts.argv[index] = plugin

    } else this.error('No Commerce Layer CLI plugin to ' + command)

  }

}


type PluginsManifest = { oclif?: { plugins?: Array<{ name: string; tag?: string; type?: string }> } }

/**
 * Pins the plugins of the plugin table that follow npm's latest (installed by
 * an older CLI, or with --latest) to the major they have, so that
 * plugins:update never moves them to a new major. Without a known installed
 * version, to the range of the plugin table. Returns whether anything changed.
 */
const pinPlugins = (manifest: PluginsManifest, plugins: PluginRelease[], installed: Map<string, string>): boolean => {
  let changed = false
  for (const entry of manifest.oclif?.plugins ?? []) {
    const info = plugins.find(p => p.plugin === entry.name)
    if (info && (entry.type === 'user') && ((entry.tag === undefined) || (entry.tag === 'latest'))) {
      const major = installed.get(entry.name)?.split('.')[0]
      entry.tag = major ? `^${major}` : info.version
      changed = true
    }
  }
  return changed
}

/** pinPlugins on the user plugins of the CLI (package.json of its data folder, as oclif keeps it) */
const pinInstalledPlugins = (config: Config): void => {
  const file = join(config.dataDir, 'package.json')
  const installed = new Map(config.getPluginsList().map(p => [p.name, p.version]))
  try {
    const manifest = JSON.parse(readFileSync(file, 'utf8')) as PluginsManifest
    if (pinPlugins(manifest, getAvailablePlugins(), installed)) writeFileSync(file, `${JSON.stringify(manifest, null, 2)}\n`)
  } catch {
    // No user plugins yet
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
export { pinPlugins, testBuildPlugin }
