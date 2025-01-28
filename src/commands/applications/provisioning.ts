
import ApplicationsIndex from '.'
import { isPluginInstalled } from '../plugins/available'



export default class ApplicationsProvisioning extends ApplicationsIndex {

  static description = 'show all Provisioning applications'

  static aliases = ['app:prov', 'app:provisioning', 'prov:apps', 'prov:applications']

	static examples = [
		'$ commercelayer applications:provisioning',
		'$ cl app:provisioning',
    '$ cl prov:apps'
	]

 

  public async run(): Promise<void> {
    
    if (isPluginInstalled('provisioning', this.config)) {
      if (!this.argv.includes('--api') && !this.argv.includes('-A')) this.argv.push('--api=provisioning')
      return ApplicationsIndex.run(this.argv, this.config)
    } else this.error('Provisioning plugin not installed')

  }

}
