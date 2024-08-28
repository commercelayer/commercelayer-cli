import { clColor, clCommand } from '@commercelayer/cli-core'
import Command, { Flags, Args } from '../../base'
import { revokeAccessToken } from '../../token'
import type { ArgOutput, FlagOutput, Input } from '@oclif/core/lib/interfaces/parser'
import * as cliux from '@commercelayer/cli-ux'



export default class TokenRevoke extends Command {

  static description = 'revoke a Commerce Layer access token'

  static examples = [
    '$ commercelayer token:revoke -o <organizationSlug> <accessToken> -i <clientId>',
    '$ cl token:revoke -o <organizationSlug> <accessToken> -i <clientId> -s <clientSecret>',
  ]

  static flags = {
    organization: Flags.string({
      char: 'o',
      description: 'the slug of your organization',
      required: false,
      env: 'CL_CLI_ORGANIZATION',
    }),
    domain: Flags.string({
      char: 'd',
      required: false,
      hidden: true,
      env: 'CL_CLI_DOMAIN',
    }),
    clientId: Flags.string({
      name: 'clientId',
      char: 'i',
      description: 'application client_id',
      required: true,
    }),
    clientSecret: Flags.string({
      char: 's',
      description: 'application client_secret',
      required: false,
      dependsOn: ['clientId'],
    }),
    scope: Flags.string({
      char: 'S',
      description: 'access token scope',
      required: false,
      multiple: true,
      dependsOn: ['clientId'],
    })
  }

  static args = {
    token: Args.string({ name: 'token', description: 'access token to revoke', required: true })
  }



  async parse(c: any): Promise<any> {
		clCommand.fixDashedFlagValue(this.argv, c.flags?.clientId)
		const parsed = await super.parse(c as Input<FlagOutput, FlagOutput, ArgOutput>)
		clCommand.fixDashedFlagValue(this.argv, c.flags?.clientId, 'i', parsed)
		return parsed
	}


  async run(): Promise<any> {

    const { args, flags } = await this.parse(TokenRevoke)

    if (!flags.clientSecret && !flags.scope)
      this.error(`You must provide one of the arguments ${clColor.cli.flag('clientSecret')} and ${clColor.cli.flag('scope')}`)

    const accessToken: string = args.token
    const scope = this.checkScope(flags.scope as string[])
    const slug = flags.provisioning? undefined : flags.organization


    this.log()
    cliux.action.start(`Revoking access token`)
    await revokeAccessToken({
      domain: flags.domain,
      slug,
      clientId: flags.clientId,
      clientSecret: flags.clientSecret,
      scope,
    }, accessToken)
      .then(() => {
        cliux.action.stop(`done ${clColor.msg.success('\u2714')}`)
        this.log('\nThe access token has been successfully revoked\n')
      })
      .catch((error) => {
        cliux.action.stop()
        this.error(error.message as string)
      })

  }

}
