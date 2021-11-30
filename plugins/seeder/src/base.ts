import Command, { flags } from '@oclif/command'
import chalk from 'chalk'
import path from 'path'
import updateNotifier from 'update-notifier'


const pkg = require('../package.json')


export default abstract class extends Command {

  static flags = {
    organization: flags.string({
      char: 'o',
      description: 'the slug of your organization',
      required: true,
      env: 'CL_CLI_ORGANIZATION',
    }),
    domain: flags.string({
      char: 'd',
      required: false,
      hidden: true,
      dependsOn: ['organization'],
      env: 'CL_CLI_DOMAIN',
    }),
    accessToken: flags.string({
      hidden: true,
      required: true,
      env: 'CL_CLI_ACCESS_TOKEN',
    }),
  }


  static args = [
    { name: 'id', description: 'the unique id of the order', required: true },
  ]


  async init() {

    const notifier = updateNotifier({ pkg, updateCheckInterval: 1000 * 60 * 60 })

    if (notifier.update) {

      const pluginMode = path.resolve(__dirname).includes(`/@commercelayer/cli/node_modules/${pkg.name}/`)
      const command = pluginMode ? 'commercelayer plugins:update' : '{updateCommand}'

      notifier.notify({
        isGlobal: !pluginMode,
        message: `-= ${chalk.bgWhite.black.bold(` ${pkg.description} `)} =-\n\nNew version available: ${chalk.dim('{currentVersion}')} -> ${chalk.green('{latestVersion}')}\nRun ${chalk.cyanBright(command)} to update`,
      })

    }

    return super.init()

  }


  async catch(error: any) {
    if ((error.code === 'EEXIT') && (error.message === 'EEXIT: 0')) return
    return super.catch(error)
  }

}



export { flags }
