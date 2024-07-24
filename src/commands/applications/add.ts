import { Command } from '@oclif/core'
import { CommerceLayerStatic } from '@commercelayer/sdk'
import { ConfigParams, appsDirCreate, writeConfigFile, writeTokenFile, configParam } from '../../config'
import { inspect } from 'util'
import ApplicationsLogin, { checkAlias, checkScope, getApplicationInfo } from './login'
import { type AppAuth, clColor, clToken, clApplication, clCommand } from '@commercelayer/cli-core'
import type { ArgOutput, FlagOutput, Input } from '@oclif/core/lib/interfaces/parser'



export default class ApplicationsAdd extends Command {

  static description = `add a new Commerce Layer application to CLI config (application must be of kind 'integration' or 'sales_channel')`

  static aliases = ['app:add']

  static examples = [
    '$ commercelayer applications:add -o <organizationSlug> -i <clientId> -s <clientSecret> -a <applicationAlias>',
    '$ cl app:add -i <clientId> -s <clientSecret> -a <applicationAlias>'
  ]

  static flags = {
    ...ApplicationsLogin.flags,
  }


  async catch(error: any): Promise<any> {
    this.error(error.message as string)
  }


  async parse(c: any): Promise<any> {
		clCommand.fixDashedFlagValue(this.argv, c.flags.clientId)
		const parsed = await super.parse(c as Input<FlagOutput, FlagOutput, ArgOutput>)
		clCommand.fixDashedFlagValue(this.argv, c.flags.clientId, 'i', parsed)
		return parsed
	}



  async run(): Promise<any> {

    const { flags } = await this.parse(ApplicationsAdd)

    if (!flags.clientSecret && !flags.scope)
      this.error(`You must provide one of the arguments ${clColor.cli.flag('clientSecret')} and ${clColor.cli.flag('scope')}`)

    const scope = checkScope(flags.scope as string[])
    const alias = checkAlias(flags.alias as string, this.config, flags.organization as string)

    const config: AppAuth = {
      clientId: flags.clientId,
      clientSecret: flags.clientSecret,
      slug: flags.organization,
      domain: flags.domain,
      scope,
      email: flags.email,
      password: flags.password
    }

    if (config.domain === configParam(ConfigParams.defaultDomain)) config.domain = undefined


    try {

      const token = await clToken.getAccessToken(config)
      if (!token?.accessToken) this.error('Unable to get access token')

      const app = await getApplicationInfo(config, token?.accessToken || '')

      const typeCheck = configParam(ConfigParams.applicationTypeCheck)
      if (typeCheck) {
        if (!typeCheck.includes(app.kind)) this.error(`The credentials provided are associated to an application of type ${clColor.msg.error(app.kind)} while the only allowed types are: ${clColor.api.kind(typeCheck.join(','))}`
        // , { suggestions: [`Double check your credentials or access the online dashboard of ${clColor.api.organization(app.organization)} and create a new valid application `] }
        )
      }
      app.alias = alias

      appsDirCreate(this.config)

      writeConfigFile(this.config, app)

      writeTokenFile(this.config, app, token)

      this.log(`\n${clColor.msg.success.bold('Login successful!')} The new application has been successfully added to the CLI\n`)

    } catch (error: any) {
      this.log(clColor.msg.error.bold('Login failed!'))
      if (flags.debug) this.error(inspect(error, false, null, true))
      else
        if (CommerceLayerStatic.isApiError(error)) this.error(inspect(error.errors, false, null, true))
        else {
          const connectMsg = clApplication.isProvisioningApp(config)? clColor.msg.error('Provisioning API') : `organization ${clColor.msg.error(config.slug)}`
          this.error(`Unable to connect to ${connectMsg}: ${clColor.italic(error.message)}`)
        }
    }

  }

}
