import { Command, flags } from '@oclif/command'
import { getIntegrationToken } from '@commercelayer/js-auth'
import chalk from 'chalk'
import { AppKey, AppAuth, readConfigFile, writeTokenFile, configFileExists, currentApplication, readTokenFile } from '../../config'
import { execMode, appKey, sleep, print } from '../../common'
import { IConfig } from '@oclif/config'
import { AuthReturnType } from '@commercelayer/js-auth/dist/typings'
import https from 'https'
import jwt from 'jsonwebtoken'



export default class ApplicationsToken extends Command {

  static description = 'get a new access token from Commerce Layer API'

  static aliases = ['app:token']

  static examples = [
    '$ commercelayer applications:token',
    '$ commercelayer app:token -o <organizationSlug> --live --save',
  ]

  static flags = {
    // help: flags.help({ char: 'h' }),
    organization: flags.string({
      char: 'o',
      description: 'organization slug',
      required: false,
      // default: currentOrganization(),
    }),
    live: flags.boolean({
      description: 'live execution mode',
      dependsOn: ['organization'],
      // default: currentModeLive(),
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
      description: 'save access token',
    }),
    info: flags.boolean({
      char: 'i',
      description: 'show token info',
    }),
    shared: flags.string({
      char: 'S',
      description: 'organization shared secret',
      hidden: true,
      exclusive: ['save'],
    }),
    minutes: flags.integer({
      char: 'M',
      description: 'minutes to token expiration',
      hidden: true,
      dependsOn: ['shared'],
    }),
  }

  async run() {

    const { flags } = this.parse(ApplicationsToken)

    let organization = flags.organization
    let mode = execMode(flags.live)

    if (!organization) {
      const current = currentApplication()
      organization = current?.key || ''
      mode = current?.mode || 'test'
    }

    const app: AppKey = {
      key: appKey(organization, flags.domain),
      mode,
    }


    if (!configFileExists(this.config, app))
      this.error(`Unable to find ${chalk.italic.bold(app.mode)} configuration file for application ${chalk.italic.bold(app.key)}`,
        { suggestions: ['execute \'login\' command to initialize application and get the first access token'] }
      )


    try {

      let expMinutes
      let accessToken
      let returnData

      if (flags.shared) {
        const token = generateAccessToken(this.config, app, flags.shared, flags.minutes)
        accessToken = token.accessToken
        returnData = token.info
        expMinutes = token.expMinutes
      } else {
        const token = await newAccessToken(this.config, app, flags.save)
        if (flags.save) this.log(`The new ${app.mode} access token has been locally saved for application ${chalk.italic.bold(app.key)}`)
        accessToken = token?.accessToken
        returnData = token?.data
      }

      if (accessToken) {
        this.log(`\nAccess token for application ${chalk.bold.yellowBright(`${app.key}.${app.mode}`)}`)
        this.log(`\n${chalk.blueBright(accessToken)}\n`)
        if (flags.shared && expMinutes) {
          this.warn(chalk.italic(`this access token will expire in ${expMinutes} minutes`))
          this.log()
        }
      }

      if (flags.info) this.printAccessToken(accessToken)

      return returnData

    } catch (error) {
      this.log(chalk.bold.redBright('FAILURE! ') + error.message)
    }

  }


  printAccessToken(accessToken: any): void {
    if (accessToken) {
      const info = jwt.decode(accessToken)
      this.log(chalk.blueBright('Token Info:'))
      this.log(print(info))
      this.log()
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

  const safetyInterval = 30 // secs

  const createdAt = Number(tokenData.created_at)
  const now = Math.floor(Date.now() / 1000)
  const time = now - createdAt

  return (time >= (7200 - safetyInterval))

}


const generateAccessToken = (config: IConfig, app: AppKey, sharedSecret: string, valMinutes?: number): any => {

  const defaultExp = 60 * 2

  const token = readTokenFile(config, app)
  const tokenData = jwt.decode(token.access_token) as { [key: string]: any }

  let minutes = (valMinutes === undefined) ? defaultExp : valMinutes
  if (minutes < 2) minutes = 2
  else minutes = Math.min(minutes, defaultExp)

  const payload = {
    application: tokenData?.application,
    exp: Math.floor(Date.now() / 1000) + (minutes * 60),
    organization: tokenData?.organization,
    rand: Math.random(),
    test: tokenData?.test,
  }

  const accessToken = jwt.sign(payload, sharedSecret, { algorithm: 'HS512', noTimestamp: true })
  const info = jwt.verify(accessToken, sharedSecret, { algorithms: ['HS512'] })


  return {
    accessToken,
    info,
    expMinutes: minutes,
  }

}



export { newAccessToken, revokeAccessToken, isAccessTokenExpiring }
