import { type AppInfo, clColor } from '@commercelayer/cli-core'
import { Command, Flags, Args } from '@oclif/core'
import { currentApplication, filterApplications, readConfigFile } from '../../config'
import ApplicationsLogin, { checkScope } from './login'
import { promptApplication } from '../../common'
import { printCurrent } from './current'


export default class ApplicationsScope extends Command {

  static description = 'switch scope of current application'

  static aliases = ['app:scope']

  static examples = [
    '$ commercelayer <%= command.id %> market:1234',
    '$ cl app:scope market:1234',
  ]

  static flags = {
    alias: Flags.string({
      char: 'a',
      description: 'the alias you want to associate to the application',
      multiple: false,
      required: false,
    }),
  }

  static args = {
    scope: Args.string({ name: 'scope', required: true, description: 'the application scope' }),
  }


  public async run(): Promise<AppInfo> {

    const { args, flags } = await this.parse(ApplicationsScope)

    const scope = checkScope([args.scope]) as string
    const alias = flags.alias || scope.replace(':', '_')

    const current = currentApplication()
    if (!current) this.error('No current application: execute login to an application before switching scope')
    if (current.kind !== 'sales_channel') this.error(`You can only switch scope of ${clColor.api.kind('sales_channel')} applications`)

    const apps = filterApplications(this.config, {
      organization: current.slug,
      domain: current.domain,
      kind: current.kind,
      mode: current.mode,
    }).filter(a => {
      if (!a.scope) return true
      if (Array.isArray(a.scope)) return (a.scope.length === 1) && a.scope.includes(scope)
      return (a.scope === scope)
    })


    // Always use current organization (for core apps) and (optional) domain
    const argv: string[] = []
    if (current.slug) argv.push('-o', current.slug)
    if (current.domain) argv.push('-d', current.domain)

    let appInfo: AppInfo

    if (apps.length > 0) {   // Application Switch

      // ApplicationsSwitch command cannot filter by scope so it's necessary do "manually" show the list of applications
      const app: AppInfo = (apps.length === 1) ? apps[0] : await promptApplication(apps)
      const cApp = currentApplication(app)
      this.log(`\nCurrent application: ${printCurrent(cApp)}\n`)

      appInfo = app

    } else {   // Application Login

      const app = readConfigFile(this.config, current)

      argv.push('-i', app.clientId)
      argv.push('-S', scope)
      argv.push('-a', alias)

      appInfo = await ApplicationsLogin.run(argv, this.config)

    }


    return appInfo

  }

}
