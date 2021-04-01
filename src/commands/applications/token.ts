import { Command, flags } from '@oclif/command'
import { getIntegrationToken } from '@commercelayer/js-auth'
import chalk from 'chalk'
import { AppKey, AppAuth, readConfigFile, writeTokenFile, configFileExists, currentOrganization, currentModeLive } from '../../config'
import { execMode, appKey, sleep } from '../../common'
import { IConfig } from '@oclif/config'
import { AuthReturnType } from '@commercelayer/js-auth/dist/typings'
import https from 'https'



export default class ApplicationsToken extends Command {

  static description = 'get new access_token from Commerce Layer'

  static aliases = ['app:token']

  static flags = {
    // help: flags.help({ char: 'h' }),
    organization: flags.string({
      char: 'o',
      description: 'organization slug',
      required: true,
      default: currentOrganization(),
    }),
    live: flags.boolean({
      description: 'live execution mode',
      dependsOn: ['organization'],
      default: currentModeLive(),
    }),
    domain: flags.string({
      char: 'd',
      description: 'api domain',
      required: false,
      hidden: true,
      dependsOn: ['organization'],
    }),
    save: flags.boolean({
      char: 's',
      description: 'save access_token',
    }),
  }

  async run() {

    const { flags } = this.parse(ApplicationsToken)

    const app: AppKey = {
      key: appKey(flags.organization, flags.domain),
      mode: execMode(flags.live),
    }


    if (!configFileExists(this.config, app))
      this.error(`Unable to find ${chalk.italic.bold(app.mode)} configuration file for application ${chalk.italic.bold(app.key)}`,
        { suggestions: ['execute \'login\' command to initialize application and get the first access_token'] }
      )

    try {

      const token = await newAccessToken(this.config, app, flags.save)

      const accessToken = token?.accessToken
      if (accessToken) this.log(`\n${chalk.blueBright(accessToken)}\n`)

      if (flags.save) this.log(`The new ${app.mode} access_token has been locally saved for application ${chalk.italic.bold(app.key)}`)

      return token?.data

    } catch (error) {
      this.log(chalk.red.bold('FAILURE! ') + error.message)
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


const newAccessToken = async (config: IConfig, app: AppKey, save: boolean = false): Promise<AuthReturnType> => {

  const cfg = readConfigFile(config, app)
  const token = await getAccessToken(cfg)

  if (save) writeTokenFile(config, app, token?.data)

  return token

}


const revokeAccessToken = async (app: AppAuth, token: string) => {

  /*
  return axios
    .post(`${app.baseUrl}/oauth/revoke`, {
      grant_type: 'client_credentials',
      client_id: app.clientId,
      client_secret: app.clientSecret,
      token,
    })
  */

  const data = JSON.stringify({
    grant_type: 'client_credentials',
    client_id: app.clientId,
    client_secret: app.clientSecret,
    token,
  })

  const options = {
    hostname: app.baseUrl.replace('https://', '').replace('http://', ''),
    port: 443,
    path: '/oauth/revoke',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  }

  const req = https.request(options/* , res => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', d => {
      process.stdout.write(d)
    })
  } */)

  /*
  req.on('error', error => {
    console.error(error)
  })
  */

  req.write(data)
  req.end()

  await sleep(300)

}


const isAccessTokenExpiring = (tokenData: any): boolean => {

  const safetyInterval = 30

  const createdAt = Number(tokenData.created_at)
  const now = Math.floor(Date.now() / 1000)
  const time = now - createdAt

  return (time >= (7200 - safetyInterval))

}


export { newAccessToken, revokeAccessToken, isAccessTokenExpiring }
