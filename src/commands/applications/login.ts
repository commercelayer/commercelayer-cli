import { Command, flags } from '@oclif/command'
import { getIntegrationToken } from '@commercelayer/js-auth'
import api from '@commercelayer/js-sdk'
import { baseURL, appKey } from '../../common'
import chalk from 'chalk'
import clicfg, { AppInfo, ConfigParams, AppAuth, createConfigDir, configFileExists, writeConfigFile, writeTokenFile } from '../../config'


export default class ApplicationsLogin extends Command {

  static description = 'perform CLI login to Commerce Layer'

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
      endpoint: baseURL(flags.organization, flags.domain),
    }

    try {

      const auth = await getIntegrationToken(config)

      const app = await getApplicationInfo(config, auth?.accessToken || '')

      if (app.type !== 'cli') this.error('Credential provided are not associated with a CLI application')

      createConfigDir(this.config)

      app.key = appKey(app.slug, flags.domain)

      const overwrite = configFileExists(this.config, app)
      writeConfigFile(this.config, app)

      writeTokenFile(this.config, app, auth?.data)

      clicfg.set(ConfigParams.currentApplication, { key: app.key, mode: app.mode })
      const current = clicfg.get(ConfigParams.currentApplication)
      this.log(`Current application: ${chalk.bold.yellow(current.key + '.' + current.mode)}`)

      this.log(chalk.green.bold('Login successful! ') + `${app.mode} configuration and access_token have been locally ${overwrite ? 'overwritten' : 'saved'} for application ${chalk.italic.bold(app.name)} of organization ${chalk.italic.bold(app.organization)}`)

    } catch (error) {
      this.log(chalk.red.bold('Login failed: ') + error.message)
    }

  }

}



const getApplicationInfo = async (auth: AppAuth, accessToken: string): Promise<AppInfo> => {

  api.init({ accessToken, endpoint: auth.endpoint })

  // Organization info
  const org = await api.Organization.all()
  // Application info
  const app = await api.Application.all()

  const mode = app.getMetaInfo().mode || 'test'

  const appInfo: AppInfo = Object.assign({
    organization: org.name || '',
    key: org.slug || '',
    slug: org.slug || '',
    mode: mode,
    type: 'cli', // app.kind || '',
    name: app.name || '',
  }, auth)

  return appInfo

}
