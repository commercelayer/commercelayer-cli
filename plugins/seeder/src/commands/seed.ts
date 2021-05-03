import { Command, flags } from '@oclif/command'
import { baseURL } from '../common'
import seeder from '@commercelayer/commercelayer-seeder'
import chalk from 'chalk'

import updateNotifier from 'update-notifier'
import path from 'path'

const pkg = require('../../package.json')


export default class Seed extends Command {

  static description = 'execute Commerce Layer seeder'

  static examples = [
    '$ cl-seeder seed -o <organizationSlug> -i <clientId> -s <clientSecret> --accessToken=<accessToken> -u <seedUrl>',
    '$ cl seed -m all -u <seedUrl> -b multi_market',
  ]

  static flags = {
    // help: flags.help({ char: 'h' }),
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
    businessModel: flags.string({
      char: 'b',
      description: 'the kind of business model you want to import',
      options: ['multi_market', 'custom'],
      default: 'multi_market',
    }),
    maxItems: flags.string({
      char: 'm',
      description: 'the maximum number of SKUs that will be imported',
      default: 'all',
    }),
    resourcesUrl: flags.string({
      char: 'u',
      description: 'the resources URL or local path',
      default: 'https://data.commercelayer.app/seed',
    }),
    accessToken: flags.string({
      hidden: true,
      required: true,
      env: 'CL_CLI_ACCESS_TOKEN',
    }),
    infoLog: flags.boolean({ hidden: true }),
  }


  async init() {

    const notifier = updateNotifier({ pkg, updateCheckInterval: 1000 * 60 * 60 })

    if (notifier.update) {

      const pluginMode = path.resolve(__dirname).includes(`/@commercelayer/commercelayer-cli/node_modules/${pkg.name}/`)
      const command = pluginMode ? 'commercelayer plugins:update' : '{updateCommand}'

      notifier.notify({
        // isGlobal: true,
        message: `-= ${chalk.bgWhite.black.bold(` ${pkg.description} `)} =-\n\nNew version available: ${chalk.grey('{currentVersion}')} -> ${chalk.green('{latestVersion}')}\nRun ${chalk.cyanBright(command)} to update`,
      })

    }

    return super.init()

  }


  async run() {

    const { flags } = this.parse(Seed)

    const businessModel = flags.businessModel as ('multi_market' | 'custom')
    const maxItems = flags.maxItems
    const resourcesUrl = flags.resourcesUrl
    const accessToken = flags.accessToken || ''
    const endpoint = baseURL(flags.organization, flags.domain)
    const infoLog = flags.infoLog

    // this.log('args: ' + Object.keys(args).join(','))
    // this.log('flags: ' + Object.keys(flags).join(','))

    this.log('businessModel: ' + businessModel)
    this.log('maxItems: ' + maxItems)
    this.log('resourcesUrl: ' + resourcesUrl)
    this.log('endpoint: ' + endpoint)

    // this.log('access_token: ' + accessToken)


    try {

      await seeder({
        endpoint,
        businessModel,
        infoLog,
        maxItems: maxItems ? Number(maxItems) : undefined,
        accessToken,
      })

      this.log()
      this.log('🎉 The seed has been imported with success.')

      return true

    } catch (error) {
      this.log(`${chalk.bold.redBright('Error!')} - An error occurred during seed import: ${error.message}`)
      throw error
    }

  }

}
