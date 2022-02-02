import { clColor } from '@commercelayer/cli-core'
import { Hook } from '@oclif/core'
import { getPluginInfo } from '../../commands/plugins/available'



const hook: Hook<'prerun'> = async function (opts) {

  // Only for test purpouses to avoid an error of undefined object
  if (!opts.Command || !opts.argv) return

  // Only plugins commands are affected by this hook
  if (!opts.Command.id.startsWith('plugins')) return
  if (opts.argv.length === 0) return

  if (['plugins:install', 'plugins:uninstall'].includes(opts.Command.id)) {

    let index = -1
    let plugin

    const found = opts.argv.some(a => {

      index++
      if (a.startsWith('-')) return false

      const p = getPluginInfo(a)
      if (p === undefined) this.error(`Unknown Commerce Layer CLI plugin: ${clColor.msg.error(a)}: execute command '${clColor.italic(`${this.config.bin} plugins:available`)}' to get a list of all available plugins`)
      else plugin = p.plugin as string

      return true

    })


    // Check tag flag
    if (found && plugin) {

      const tgIndex = opts.argv.indexOf('--tag')

      if (tgIndex > -1) {
        opts.argv[index] = plugin + '@' + opts.argv[tgIndex + 1]
        opts.argv.splice(tgIndex, 2)
      } else opts.argv[index] = plugin

    }

  }

}


export default hook
