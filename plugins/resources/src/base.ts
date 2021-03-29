import Command, { flags } from '@oclif/command'
import { findResource, Resource } from './commands/resources/available'
import chalk from 'chalk'

export default abstract class extends Command {

	static flags = {
		help: flags.help({ char: 'h' }),
		organization: flags.string({
			char: 'o',
			description: 'the slug of your organization',
			required: true,
			env: 'CL_CLI_ORGANIZATION',
		}),
		domain: flags.string({
			char: 'd',
			required: false,
			hidden: true,
			dependsOn: ['organization'],
			env: 'CL_CLI_DOMAIN',
		}),
		accessToken: flags.string({
			hidden: true,
			required: true,
			env: 'CL_CLI_ACCESS_TOKEN',
		}),
		json: flags.boolean({
			char: 'j',
			description: 'convert output in standard JSON format',
		}),
	}


	checkResource(res: string): Resource | undefined {
		const resource = findResource(res)
		if (resource === undefined) this.error(`Invalid resource ${chalk.red(res)}`,
			{ suggestions: [`Execute command ${chalk.italic('\'resources\'')} to get a list of all available CLI resources`] }
		)
		return resource
	}


	includeValuesArray(flag: string[]): string[] {
		const values: string[] = []
		if (flag) {
			const flagValues = flag.map(f => f.split(',').map(t => t.trim()))
			flagValues.forEach(a => values.push(...a))
			if (values.some(f => f.split('.').length > 3)) this.error('Can be only included resources within the 3rd level of depth')
		}
		return values
	}


	fieldsValuesMap(flag: string[]): Map<string, string[]> {

		const fields = new Map<string, string[]>()

		if (flag && (flag.length > 0)) {
			flag.forEach(f => {
				if (f.indexOf('/') > -1) {

					const kv = f.split('/')

					if (kv.length > 2) this.error('Can be defined only one resource for each \'fields\' flag',
						{ suggestions: [`Split the value ${chalk.italic(f)} into two 'fields' flags`] }
					)

					const res = kv[0].replace('[', '').replace(']', '')
					this.checkResource(res)
					if (res.split('.').length > 3) this.error('Can be defined only resources within the 3rd level',
						{ suggestions: [`Reduce total depth of the requested resource ${chalk.italic(res)}`] }
					)

					const values = kv[1].split(',').map(v => v.trim())
					if (values[0].trim() === '') this.error(`No fields defined for resource ${chalk.italic(res)}`)

					if (fields.get(res) === undefined) fields.set(res, [])
					fields.get(res)?.push(...values)

				} else {
					if (fields.get('__self') === undefined) fields.set('__self', [])
					fields.get('__self')?.push(...f.split(',').map(v => v.trim()))
				}
			})
		}

		return fields

	}


	mapToSdkParam(map: Map<string, string[]>): any[] {

		const param: any[] = map.get('__self') as any[]
		let subfields: any = null

		map.forEach((val, key) => {
			if (key !== '__self') {
				if (subfields === null) subfields = {}
				const kt = key.split('.')
				let s = subfields
				for (let i = 0; i < kt.length; i++) {
					const k = kt[i]
					if (i === (kt.length - 1)) {
						if (s[k] === undefined) s[k] = val
						else s[k] = [...val, s[k]]
					} else
						if (s[k] === undefined) s = s[k] = {}
						else
							if (Array.isArray(s[k])) {
								const o = s[k].find((x: any) => (typeof x === 'object'))
								if (o === undefined) s[k].push(s = {})
								else s = o
							} else s = s[k]
				}
			}
		})

		if (subfields !== null) param.push(subfields)

		return param

	}

}

export { flags }
