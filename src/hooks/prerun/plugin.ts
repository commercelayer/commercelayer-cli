import {Hook} from '@oclif/config'
import { getPluginInfo } from '../../commands/plugins/available'
import chalk from 'chalk'

const hook: Hook<'prerun'> = async function (opts) {

  if (!opts.Command.id.startsWith('plugins')) return
  if (opts.argv.length === 0) return

  if (opts.Command.id === 'plugins:install') {

    let index = -1
    let plugin

    const found = opts.argv.some(a => {

      index++
      if (a.startsWith('-')) return false

      const p = getPluginInfo(a)
      if (p === undefined) this.error(`Unknown Commerce Layer CLI plugin: ${chalk.yellow(a)}`)
      else plugin = p.plugin as string

      return true

    })

    if (found && plugin) opts.argv[index] = plugin

  }

}


export default hook
