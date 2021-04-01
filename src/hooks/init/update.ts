
import { Hook } from '@oclif/config'
import updateNotifier from 'update-notifier'
import chalk from 'chalk'

const pkg = require('../../../package.json')



const hook: Hook<'init'> = async function (_opts) {

  const notifier = updateNotifier({ pkg, updateCheckInterval: 1000 * 60 * 60 })

  notifier.notify({
    // isGlobal: true,
    message: `-= ${chalk.bgWhite.black.bold(` ${pkg.description} `)} =-\n
    New version available: ${chalk.grey('{currentVersion}')} -> ${chalk.green('{latestVersion}')}
    Run ${chalk.cyanBright('{updateCommand}')} to update`,
  })

  // console.log(notifier.update)

}

export default hook
