import { Command } from '@oclif/command'
import { CommerceLayerStatic } from '@commercelayer/sdk'
import chalk from 'chalk'
import { ConfigParams, AppAuth, createConfigDir, writeConfigFile, writeTokenFile, configParam } from '../../config'
import { inspect } from 'util'
import ApplicationsLogin, { checkAlias, checkScope, getAccessToken, getApplicationInfo } from './login'



export default class ApplicationsAdd extends Command {

  static description = 'add a new Commerce Layer application to CLI config'

  static aliases = ['app:add']

  static examples = [
    '$ commercelayer applications:add -o <organizationSlug> -i <clientId> -s <clientSecret> -a <applicationAlias>',
  ]

  static flags = {
    ...ApplicationsLogin.flags,
  }


  async catch(error: any) {
		this.error(error.message)
	}



  async run() {

    const { flags } = this.parse(ApplicationsAdd)

    if (!flags.clientSecret && !flags.scope)
      this.error(`You must provide one of the arguments ${chalk.italic('clientSecret')} and ${chalk.italic('scope')}`)

    const scope = checkScope(flags.scope)
    const alias = checkAlias(flags.alias, this.config, flags.organization)

    const config: AppAuth = {
      clientId: flags.clientId,
      clientSecret: flags.clientSecret,
      slug: flags.organization,
      domain: flags.domain,
      scope,
      email: flags.email,
      password: flags.password,
    }


    try {

      const token = await getAccessToken(config)

      const app = await getApplicationInfo(config, token?.accessToken || '')

      const typeCheck = configParam(ConfigParams.applicationTypeCheck)
      if (typeCheck) {
        if (!typeCheck.includes(app.kind)) this.error(`The credentials provided are associated to an application of type ${chalk.red.italic(app.kind)} while the only allowed types are: ${chalk.green.italic(typeCheck.join(','))}`,
          { suggestions: [`Double check your credentials or access the online dashboard of ${chalk.bold(app.organization)} and create a new valid application `] }
        )
      }
      app.alias = alias

      createConfigDir(this.config)

      writeConfigFile(this.config, app)

      writeTokenFile(this.config, app, token?.data)

      this.log(`\n${chalk.bold.greenBright('Login successful!')} The new application has been successfully added to the CLI\n`)

    } catch (error: any) {
      this.log(chalk.bold.redBright('Login failed!'))
      if (CommerceLayerStatic.isApiError(error)) this.error(inspect(error.errors, false, null, true))
      else this.error(error)
    }

  }

}
