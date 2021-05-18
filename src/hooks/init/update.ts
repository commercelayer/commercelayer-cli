
import { Hook } from '@oclif/config'
import updateNotifier from 'update-notifier'
import chalk from 'chalk'

const pkg = require('../../../package.json')



const hook: Hook<'init'> = async function (_opts) {

  const notifier = updateNotifier({ pkg, updateCheckInterval: (process.env.CL_CLI_UPDATE_NOTIFY ? 0 : 1000 * 60 * 60) })

  notifier.notify({
    isGlobal: true,
    message: `-= ${chalk.bgWhite.black.bold(` ${pkg.description} `)} =-\n\nNew version available: ${chalk.dim('{currentVersion}')} -> ${chalk.green('{latestVersion}')}\nRun ${chalk.cyanBright('{updateCommand}')} to update`,
  })

  // console.log(notifier.update)

}

export default hook
