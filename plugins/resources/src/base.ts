import Command, { flags } from '@oclif/command'
import { findResource, Resource } from './commands/resources/available'
import { filterAvailable } from './commands/resources/filters'
import chalk from 'chalk'
import { inspect } from 'util'

export default abstract class extends Command {

	static flags = {
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
		unformatted: flags.boolean({
			char: 'u',
			description: 'print unformatted JSON output',
			dependsOn: ['json'],
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

					if (kv.length > 2) this.error('Can be defined only one resource for each fields flag',
						{ suggestions: [`Split the value ${chalk.italic(f)} into two fields flags`] }
					)

					const res = kv[0].replace('[', '').replace(']', '')
					this.checkResource(res)
					/*
					if (res.split('.').length > 3) this.error('Can be defined only resources within the 3rd level',
						{ suggestions: [`Reduce total depth of the requested resource ${chalk.italic(res)}`] }
					)
					*/

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


	mapToSdkParam(map: Map<string, any>): any[] {

		const param: any[] = map.get('__self') as any[] || []
		let subfields: any = null

		map.forEach((val, key) => {
			if (key !== '__self') {
				if (subfields === null) subfields = {}
				if (subfields[key] === undefined) subfields[key] = val
				else subfields[key] = [...val, subfields[key]]
			}
		})

		if (subfields !== null) param.push(subfields)

		return param

	}


	mapToSdkParamExtended(map: Map<string, string[]>): any[] {

		const param: any[] = map.get('__self') as any[] || []
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


	whereValuesMap(flag: string[]): Map<string, string> {

		const wheres = new Map<string, string>()

		if (flag && (flag.length > 0)) {
			flag.forEach(f => {

				/*
				const po = f.indexOf('(') + 1
				const pc = f.indexOf(')') + 1
				if ((po < 2) || (pc < f.length) || (po > pc)) this.error(`Filter flag must be in the form ${chalk.italic('predicate(value)')}`)
				*/

				const si = f.indexOf('/')
				if (si < 0) this.error(`Filter flag must be in the form ${chalk.italic('predicate/value')}`)

				// const wt = f.split('(')
				const wt = f.split('/')
				const w = wt[0]
				if (!filterAvailable(w)) this.error(`Invalid query filter: ${chalk.red(w)}`,
					{
						suggestions: [`Execute command ${chalk.italic('resources:filters')} to get a full list of all available filter predicates`],
						ref: 'https://docs.commercelayer.io/api/filtering-data#list-of-predicates',
					}
				)

				// const v = wt[1].substring(0, (wt[1].length - 1))
				const v = wt[1]

				wheres.set(w, v)

			})
		}

		return wheres

	}


	orderingValuesMap(flag: string[]): Map<string, string> {

		const orderings = new Map<string, string>()

		if (flag && (flag.length > 0)) {

			if (flag.some(f => {
				const ft = f.split(',')
				return (ft.includes('asc') || ft.includes('desc'))
			})) {
				flag.forEach(f => {

					const ot = f.split(',')
					if (ot.length > 2) this.error('Can be defined only one field for each sort flag',
						{ suggestions: [`Split the value ${chalk.italic(f)} into two or more sort flags`] }
					)

					const of = ot[0]
					if (of.startsWith('-')) this.error('You cannot mix two ordering syntaxes',
					{ suggestions: [`Choose between the style ${chalk.italic('<field>,<order>')} and the style ${chalk.italic('[-]<field>')}`] }
					)
					const sd = ot[1] || 'asc'
					if (!['asc', 'desc'].includes(sd)) this.error(`Invalid sort flag: ${chalk.red(f)}`,
						{ suggestions: [`Sort direction can assume only the values ${chalk.italic('asc')} or ${chalk.italic('desc')}`] }
					)

					orderings.set(of, sd)

				})
			} else {
				flag.forEach(fl => {
					fl.split(',').forEach(f => {
						const desc = f.startsWith('-')
						const of = desc ? f.slice(1) : f
						const sd = desc ? 'desc' : 'asc'
						orderings.set(of, sd)
					})
				})
			}
		}

		return orderings

	}


	printOutput(output: any, flags: any) {
		if (output) this.log(flags.json ? JSON.stringify(output, null, (flags.unformatted ? undefined : 4)) : inspect(output, false, null, true))
	}

	printError(error: any) {
		let err = null
		if (error.response) {
			if (error.response.status === 401) this.error(chalk.bgRed(`${error.response.statusText} [${error.response.status}]`),
				{ suggestions: ['Execute login to get access to the selected resource'] }
			)
			else err = error.response.data.errors
		} else err = error.toArray()
		if (err) this.error(inspect(err, false, null, true))
	}

}

export { flags }
