import { Command } from '@oclif/core'
import { CommerceLayerStatic } from '@commercelayer/sdk'
import { ConfigParams, createConfigDir, writeConfigFile, writeTokenFile, configParam } from '../../config'
import { inspect } from 'util'
import ApplicationsLogin, { checkAlias, checkScope, getApplicationInfo } from './login'
import { type AppAuth, clColor, clToken } from '@commercelayer/cli-core'



export default class ApplicationsAdd extends Command {

  static description = 'add a new Commerce Layer application to CLI config'

  static aliases = ['app:add']

  static examples = [
    '$ commercelayer applications:add -o <organizationSlug> -i <clientId> -s <clientSecret> -a <applicationAlias>',
  ]

  static flags = {
    ...ApplicationsLogin.flags,
  }


  async catch(error: any): Promise<any> {
		this.error(error.message)
	}



  async run(): Promise<any> {

    const { flags } = await this.parse(ApplicationsAdd)

    if (!flags.clientSecret && !flags.scope)
      this.error(`You must provide one of the arguments ${clColor.cli.flag('clientSecret')} and ${clColor.cli.flag('scope')}`)

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

    if (config.domain === configParam(ConfigParams.defaultDomain)) config.domain = undefined


    try {

      const token = await clToken.getAccessToken(config)

      const app = await getApplicationInfo(config, token?.accessToken || '')

      const typeCheck = configParam(ConfigParams.applicationTypeCheck)
      if (typeCheck) {
        if (!typeCheck.includes(app.kind)) this.error(`The credentials provided are associated to an application of type ${clColor.msg.error(app.kind)} while the only allowed types are: ${clColor.api.kind(typeCheck.join(','))}`,
          { suggestions: [`Double check your credentials or access the online dashboard of ${clColor.api.organization(app.organization)} and create a new valid application `] }
        )
      }
      app.alias = alias

      createConfigDir(this.config)

      writeConfigFile(this.config, app)

      writeTokenFile(this.config, app, token?.data)

      this.log(`\n${clColor.msg.success.bold('Login successful!')} The new application has been successfully added to the CLI\n`)

    } catch (error: any) {
      this.log(clColor.msg.error.bold('Login failed!'))
      if (flags.debug) this.error(inspect(error, false, null, true))
      else
      if (CommerceLayerStatic.isApiError(error)) this.error(inspect(error.errors, false, null, true))
      else this.error(`Unable to connect to organization ${clColor.msg.error(config.slug)}: ${clColor.italic(error.message)}`)
    }

  }

}
