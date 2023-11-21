import { clColor } from '@commercelayer/cli-core'
import Command, { Flags, Args, cliux } from '../../base'
import { revokeAccessToken } from '../../token'



export default class TokenRevoke extends Command {

  static description = 'revoke a Commerce Layer access token'

  static examples = [
    '$ commercelayer token:revoke -o <organizationSlug> <accessToken> -i <clientId>',
    '$ cl token:revoke -o <organizationSlug> <accessToken> -i <clientId>',
  ]

  static flags = {
    organization: Flags.string({
      char: 'o',
      description: 'the slug of your organization',
      required: false,
      exactlyOne: ['organization', 'provisioning'],
      env: 'CL_CLI_ORGANIZATION',
    }),
    domain: Flags.string({
      char: 'd',
      required: false,
      hidden: true,
      env: 'CL_CLI_DOMAIN',
    }),
    clientId: Flags.string({
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
    }),
    provisioning: Flags.boolean({
      char: 'P',
      description: 'execute login to Provisioning API',
      required: false,
      exclusive: ['scope', 'organization', 'email', 'password', 'api'],
      dependsOn: ['clientId', 'clientSecret']
    })
  }

  static args = {
    token: Args.string({ name: 'token', description: 'access token to revoke', required: true })
  }


  async run(): Promise<any> {

    const { args, flags } = await this.parse(TokenRevoke)

    if (!flags.clientSecret && !flags.scope)
      this.error(`You must provide one of the arguments ${clColor.cli.flag('clientSecret')} and ${clColor.cli.flag('scope')}`)

    const accessToken = args.token
    const scope = this.checkScope(flags.scope, flags.provisioning)
    const slug = flags.provisioning? undefined : flags.organization
    const api = flags.provisioning? 'provisioning' : 'core'


    this.log()
    cliux.action.start(`Revoking ${api} access token`)
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
        this.error(error.message)
      })

  }

}
