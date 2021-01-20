import fs from 'fs'
import Table from 'cli-table3'
import { join } from 'path'

type ApplicationsList = (path: string) => void

type Application = {
	organizationSlug: string,
	endpoint: string,
	scope: string
}

const applicationsList: ApplicationsList = (path) => {
  const directories = fs.readdirSync(path)
  const apps = directories
    .filter((dir) => dir !== 'default')
	.map((dir) => { /*console.log(`- ${dir}`);*/
			const cfg = fs.readFileSync(join(path, dir, 'config.json'), { encoding: 'utf8' })
			return JSON.parse(cfg.toString())
		})
	appTable(apps)
}


const appTable = (apps: Array<Application>) => {
	
	const table = new Table({ 
		head: [ 'Application', 'Base URL', 'Scope' ]
		//, colWidths: [30]
	})
	apps.forEach(app => { table.push([ app.organizationSlug, app.endpoint, app.scope ]) })

	console.log(table.toString())

}


export default applicationsList
