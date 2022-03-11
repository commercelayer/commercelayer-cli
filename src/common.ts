import { AppInfo, clColor, clOutput } from '@commercelayer/cli-core'
import inquirer from 'inquirer'


const printScope = (scope: string | string[] | undefined): string => {
	if (scope) {
		if (Array.isArray(scope)) {
			if (scope.length === 0) return ''
			return scope[0] + ((scope.length > 1) ? ` ${clColor.italic.dim('+' + (scope.length - 1))}` : '')
		}
		return scope
	}
	return ''
}


const promptApplication = async (apps: AppInfo[]) => {

	const appMaxLength = clOutput.maxLength(apps, 'name') + 2
	const details = ['organization', 'kind', 'mode', 'alias']

	const answers = await inquirer.prompt([{
		type: 'list',
		name: 'application',
		message: 'Select an application to switch to:',
		choices: apps.map(a => {
			return { name: `${a.name.padEnd(appMaxLength, ' ')} [ ${details.map(d => {
				return String(a[d as keyof AppInfo]).padEnd(clOutput.maxLength(apps, d))
			}).join(' | ')} ]${(a.scope && a.scope.length > 0) ? ` (${printScope(a.scope)})` : ''}`, value: a }
		}),
		loop: false,
		pageSize: 10,
	}])

	return answers.application

}



export { printScope, promptApplication }
