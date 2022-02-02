
import { clColor } from '@commercelayer/cli-core'
import { Hook } from '@oclif/core'
import updateNotifier from 'update-notifier'


const pkg = require('../../../package.json')



const hook: Hook<'init'> = async function (_opts) {

  const notifier = updateNotifier({ pkg, updateCheckInterval: (process.env.CL_CLI_UPDATE_NOTIFY ? 0 : 1000 * 60 * 60) })

  notifier.notify({
    isGlobal: true,
    message: `-= ${clColor.bg.white.black.bold(` ${pkg.description} `)} =-\n\nNew version available: ${clColor.dim('{currentVersion}')} -> ${clColor.green('{latestVersion}')}\nRun ${clColor.cyanBright('{updateCommand}')} to update`,
  })

  // console.log(notifier.update)

}


export default hook
