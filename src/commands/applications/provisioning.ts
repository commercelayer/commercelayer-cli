
import ApplicationsIndex from '.'
import { isPluginInstalled } from '../plugins/available'

export default class ApplicationsProvisioning extends ApplicationsIndex {

  static description = 'show all Provisioning applications'

  static aliases = ['prov:list', 'app:provisioning', 'prov:apps', 'prov:applications']

	static examples = [
		'$ commercelayer applications:provisioning',
		'$ cl app:provisioning',
    '$ cl prov:apps',
	]

 

  public async run(): Promise<void> {
    
    if (isPluginInstalled('provisioning', this.config)) {
      if (!this.argv.includes('--provisioning') && !this.argv.includes('-P')) this.argv.push('--provisioning')
      return ApplicationsIndex.run(this.argv, this.config)
    } else this.error('Provisioning plugin not installed')

  }

}
