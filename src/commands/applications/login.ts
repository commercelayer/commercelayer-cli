import { Command, flags } from '@oclif/command'
import { getIntegrationToken } from '@commercelayer/js-auth'
import api from '@commercelayer/js-sdk'
import { baseURL, appKey, extractDomain } from '../../common'
import chalk from 'chalk'
import clicfg, { AppInfo, ConfigParams, AppAuth, createConfigDir, configFileExists, writeConfigFile, writeTokenFile, SUPER_USER_MODE} from '../../config'
import { inspect } from 'util'


export default class ApplicationsLogin extends Command {

  static description = 'execute login to a CLI Commerce Layer application'

  static aliases = ['app:login', 'app:add', 'applications:add']

  static examples = [
    '$ commercelayer applications:login -o <organizationSlug> -i <clientId> -s <clientSecret>',
  ]

  static flags = {
    // help: flags.help({ char: 'h' }),
    organization: flags.string({
      char: 'o',
      description: 'organization slug',
      required: true,
    }),
    clientId: flags.string({
      char: 'i',
      description: 'organization client_id',
      required: true,
    }),
    clientSecret: flags.string({
      char: 's',
      description: 'organization client_secret',
      required: true,
    }),
    domain: flags.string({
      char: 'd',
      description: 'api domain',
      required: false,
      hidden: true,
      dependsOn: ['organization'],
    }),
  }

  async run() {

    const { flags } = this.parse(ApplicationsLogin)

    const config: AppAuth = {
      clientId: flags.clientId,
      clientSecret: flags.clientSecret,
      baseUrl: baseURL(flags.organization, flags.domain),
    }

    try {

      const auth = await getAccessToken(config)

      const app = await getApplicationInfo(config, auth?.accessToken || '')
      if ((app.type !== 'cli') && (process.env.CL_CLI_MODE !== SUPER_USER_MODE)) this.error('The credentials provided are not associated with a CLI application',
        { suggestions: [`Double check your credentials or access the online dashboard of ${app.organization} and create a new CLI application`] }
      )
      app.key = appKey(app.slug, flags.domain)

      createConfigDir(this.config)

      const overwrite = configFileExists(this.config, app)
      writeConfigFile(this.config, app)

      writeTokenFile(this.config, app, auth?.data)

      clicfg.set(ConfigParams.currentApplication, { key: app.key, mode: app.mode })
      const current = clicfg.get(ConfigParams.currentApplication)
      this.log(`\nCurrent application: ${chalk.bold.yellow(current.key + '.' + current.mode)}`)

      this.log(`\n${chalk.bold.greenBright('Login successful!')} ${chalk.bold(app.mode)} configuration and access token have been locally ${overwrite ? 'overwritten' : 'saved'} for application ${chalk.italic.bold(app.name)} of organization ${chalk.italic.bold(app.organization)}\n`)

    } catch (error) {
      this.log(chalk.bold.redBright('Login failed!'))
      if (error.suggestions) throw error
      else
      if (error.message) this.error(error.message)
      else this.error(inspect(error.toArray(), false, null, true))
    }

  }

}


const getAccessToken = async (auth: AppAuth): Promise<any> => {
  return getIntegrationToken({
    clientId: auth.clientId,
    clientSecret: auth.clientSecret,
    endpoint: auth.baseUrl,
  })
}


const getApplicationInfo = async (auth: AppAuth, accessToken: string): Promise<AppInfo> => {

  api.init({ accessToken, endpoint: auth.baseUrl })

  // Organization info
  const org = await api.Organization.all()
  // Application info
  const app = await api.Application.all()

  const mode = app.getMetaInfo().mode || 'test'

  const appInfo: AppInfo = Object.assign({
    organization: org.name || '',
    key: appKey(org.slug || '', extractDomain(auth.baseUrl)),
    slug: org.slug || '',
    mode: mode,
    type: app.kind || '',
    name: app.name || '',
  }, auth)

  return appInfo

}
