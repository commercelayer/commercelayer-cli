
import { clColor } from '@commercelayer/cli-core'
import type { Hook } from '@oclif/core'
import updateNotifier from 'update-notifier-cjs'


const pkg = require('../../../package.json')


const UPDATE_COMMAND = 'cli:update'


const hook: Hook<'init'> = async function (opts) {

  // Do not check for updates if in invisible mode or running the update command
  if (opts.argv.includes('--blind') || opts.argv.includes('--silent')) return
  if ([UPDATE_COMMAND].includes(opts.id || '')) return

  const notifier = updateNotifier({ pkg, updateCheckInterval: (process.env.CL_CLI_UPDATE_NOTIFY ? 0 : 1000 * 60 * 60) })

  const updateCommand = /* '{updateCommand}' */ 'commercelayer ' + UPDATE_COMMAND

  notifier.notify({
    isGlobal: true,
    message: `-= ${clColor.bg.white.black.bold(` ${pkg.description} `)} =-\n\nNew version available: ${clColor.dim('{currentVersion}')} -> ${clColor.green('{latestVersion}')}\nRun ${clColor.cyanBright(updateCommand)} to update`,
  })

  // console.log(notifier.update)

}


export default hook
