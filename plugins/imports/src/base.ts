import { Command, Flags, CliUx } from '@oclif/core'
import { clOutput, clUpdate, clColor } from '@commercelayer/cli-core'
import commercelayer, { CommerceLayerClient, CommerceLayerStatic } from '@commercelayer/sdk'



const pkg = require('../package.json')


export default abstract class extends Command {

  static enableJsonFlag = false

  static flags = {
    organization: Flags.string({
      char: 'o',
      description: 'the slug of your organization',
      required: true,
      env: 'CL_CLI_ORGANIZATION',
    }),
    domain: Flags.string({
      char: 'd',
      required: false,
      hidden: true,
      dependsOn: ['organization'],
      env: 'CL_CLI_DOMAIN',
    }),
    accessToken: Flags.string({
      hidden: true,
      required: true,
      env: 'CL_CLI_ACCESS_TOKEN',
    }),
  }


  static args = [
    { name: 'fake-arg', description: 'fake argument', required: false, hidden: true },
  ]


  // INIT (override)
  async init() {
    // Check for plugin updates only if in visible mode
    if (!this.argv.includes('--blind') && !this.argv.includes('--silent')) clUpdate.checkUpdate(pkg)
    return super.init()
  }


  async catch(error: any) {
    if (error.message && error.message.match(/quit/)) this.exit()
    else return super.catch(error)
  }


  protected handleError(error: any, flags?: any): void {
    if (CommerceLayerStatic.isApiError(error)) {
      if (error.status === 401) {
        const err = error.first()
        this.error(clColor.msg.error(`${err.title}:  ${err.detail}`),
          { suggestions: ['Execute login to get access to the organization\'s imports'] }
        )
      } else this.error(clOutput.formatOutput(error, flags))
    } else throw error
  }


  protected specialFolder(filePath: string): string {
    // Special directory (home / desktop)
    const root = filePath.toLowerCase().split('/')[0]
    if (['desktop', 'home'].includes(root)) {
      let filePrefix = this.config.home
      if (root === 'desktop') filePrefix += '/Desktop'
      filePath = filePath.replace(root, filePrefix)
    }
    return filePath
  }


  protected importStatus(status?: string): string {
    if (!status) return ''
    switch (status.toLowerCase()) {
      case 'completed': return clColor.msg.success(status)
      case 'interrupted': return clColor.msg.error(status)
      case 'pending':
      case 'in_progress':
      default: return status
    }
  }


  protected commercelayerInit(flags: any): CommerceLayerClient {

    const organization = flags.organization
    const domain = flags.domain
    const accessToken = flags.accessToken

    return commercelayer({
      organization,
      domain,
      accessToken,
    })

  }

}


export { Flags, CliUx }
