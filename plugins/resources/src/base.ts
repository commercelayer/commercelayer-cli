import Command, { flags } from '@oclif/command'
import { findResource, Resource } from './util/resources'
import { filterAvailable } from './commands/resources/filters'
import { formatOutput, exportOutput } from './output'
import { exportCsv } from './csv'
import chalk from 'chalk'
import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import { fixType } from './common'
import { CommerceLayerStatic, QueryParams } from '@commercelayer/sdk'

import updateNotifier from 'update-notifier'
import { availableLanguages, buildCommand, getLanguageArg, languageInfo, promptLanguage, RequestData } from './lang'
import { decodeAccessToken } from './token'



const pkg = require('../package.json')


type KeyVal = { [key: string]: string | number | boolean | undefined | null }

type KeyValString = { [key: string]: string }

type KeyValArray = { [key: string]: string[] }

type KeyValRel = { [key: string]: { readonly id: string; readonly type: string } }

type KeyValObj = { [key: string]: any }

type KeyValSort = { [key: string]: 'asc' | 'desc' }


export default abstract class extends Command {

	static flags = {
		// help: flags.help({ char: 'h' }),
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
		include: flags.string({
			char: 'i',
			multiple: true,
			description: 'comma separated resources to include',
		}),
		fields: flags.string({
			char: 'f',
			multiple: true,
			description: 'comma separeted list of fields in the format [resource]=field1,field2...',
		}),
		json: flags.boolean({
			char: 'j',
			description: 'convert output in standard JSON format',
			// hidden: true,
		}),
		unformatted: flags.boolean({
			char: 'u',
			description: 'print unformatted JSON output',
			dependsOn: ['json'],
			// hidden: true,
		}),
		raw: flags.boolean({
			char: 'R',
			description: 'print out the raw API response',
			hidden: false,
		}),
		doc: flags.boolean({
			char: 'D',
			description: 'shows the CLI command in a specific language',
		}),
		lang: flags.string({
			char: 'l',
			description: 'show the CLI command in the specified language syntax',
			exclusive: availableLanguages,
			options: availableLanguages,
			dependsOn: ['doc'],
		}),
		curl: flags.boolean({
			description: `show the equivalent ${languageInfo.curl.label} of the CLI command`,
			exclusive: ['lang', ...availableLanguages.filter(l => l !== 'curl')],
			parse: () => 'curl',
			hidden: !availableLanguages.includes('curl'),
			dependsOn: ['doc'],
		}),
		node: flags.boolean({
			description: `show the equivalent ${languageInfo.node.label} of the CLI command`,
			exclusive: ['lang', ...availableLanguages.filter(l => l !== 'node')],
			parse: () => 'node',
			hidden: !availableLanguages.includes('node'),
			dependsOn: ['doc'],
		}),
	}


	static args = [
		{ name: 'resource', description: 'the resource type', required: true },
	]


	// INIT (override)
	async init() {

		const notifier = updateNotifier({ pkg, updateCheckInterval: 1000 * 60 * 60 })

		if (notifier.update) {

			const pluginMode = path.resolve(__dirname).includes(`/@commercelayer/cli/node_modules/${pkg.name}/`)
			const command = pluginMode ? 'commercelayer plugins:update' : '{updateCommand}'

			notifier.notify({
				isGlobal: !pluginMode,
				message: `-= ${chalk.bgWhite.black.bold(` ${pkg.description} `)} =-\n\nNew version available: ${chalk.dim('{currentVersion}')} -> ${chalk.green('{latestVersion}')}\nRun ${chalk.cyanBright(command)} to update`,
			})

		}

		return super.init()

	}


	// CATCH (override)
	async catch(error: any) {
		if (error.message && error.message.match(/Missing 1 required arg:\nresource/))
			this.error(`Missing argument ${chalk.redBright('resource')}`,
				{ suggestions: [`Execute command ${chalk.italic('resources')} to get a list of all available CLI resources`] }
			)
		// else throw error				// overwrite command catch method
		else return super.catch(error)	// extend command catch method
	}



	// -- CUSTOM METHODS -- //


	checkResource(res: string, { required = true, singular = false } = {}): Resource {
		if (!res && required) this.error('Resource type not defined')
		const resource = findResource(res, { singular })
		if (resource === undefined) this.error(`Invalid resource ${chalk.redBright(res)}`,
			{ suggestions: [`Execute command ${chalk.italic('resources')} to get a list of all available CLI resources`] }
		)
		return resource
	}


	checkResourceId(resource: string, resourceId: string, required = true): any {

		let res = resource
		let id = resourceId

		const si = res.indexOf('/')
		if (si >= 0) {
			const rt = res.split('/')
			if (id && rt[1]) this.error(`Double definition of resource id: [${res}, ${id}]`,
				{ suggestions: [`Define resource id as command argument (${chalk.italic(id)}) or as part of the resource itself (${chalk.italic(res)}) but not both`] }
			)
			else id = rt[1]
			res = rt[0]
		}

		const res_ = findResource(res, { singular: true })
		const singleton = res_ && res_.singleton

		if (id) {
			if (singleton) this.error(`Singleton resource ${chalk.italic(res)} does not require id`)
		} else if (required && !singleton) this.error('Resource id not defined')

		return {
			res,
			id,
			singleton,
		}

	}


	includeFlag(flag: string[], relationships?: KeyValRel): string[] {

		const values: string[] = []

		if (flag) {
			const flagValues = flag.map(f => f.split(',').map(t => t.trim()))
			flagValues.forEach(a => values.push(...a))
			if (values.some(f => f.split('.').length > 3)) this.error('Can be only included resources within the 3rd level of depth')
		}

		if (relationships) {
			Object.keys(relationships).forEach(r => {
				if (!values.includes(r)) values.push(r)
			})
		}

		return values

	}


	objectFlag(flag: string[]): KeyValObj {

		const objects: KeyValObj = {}

		if (flag && (flag.length > 0)) {
			flag.forEach(f => {

				const kv = f.split('/')

				if (kv.length > 2) this.error('Can be defined only one object for each object flag',
					{ suggestions: [`Split the value ${chalk.italic(f)} into two object flags`] }
				)
				else
					if (kv.length === 1) this.error(`No fields defined for object ${chalk.italic(kv[0])}`)

				const name = kv[0]
				if (name === '') this.error(`No name defined in flag object ${f}`)
				if (kv[1].trim() === '') this.error(`No fields defined for object ${chalk.italic(kv[0])}`)

				const fields = kv[1].split(/(?<!\\),/g).map(v => v.trim())
				if (fields[0].trim() === '') this.error(`No fields defined for object field ${chalk.italic(name)}`)

				const obj: KeyValObj = {}

				fields.forEach(f => {

					const eqi = f.indexOf('=')
					if (eqi < 0) this.error(`No value defined for object field ${chalk.italic(f)} of object ${chalk.italic(name)}`)

					const n = f.substring(0, eqi)
					const v = f.substring(eqi + 1)

					obj[n] = fixType(v)

				})

				if (objects[name] === undefined) objects[name] = {}
				objects[name] = { ...objects[name], ...obj }

			})
		}

		return objects

	}


	fieldsFlag(flag: string[], type: string): KeyValArray {

		const fields: KeyValArray = {}

		if (flag && (flag.length > 0)) {
			flag.forEach(f => {

				let res = type
				let val = f

				if (f.indexOf('/') > -1) {

					const kv = f.split('/')

					if (kv.length > 2) this.error('Can be defined only one resource for each fields flag',
						{ suggestions: [`Split the value ${chalk.italic(f)} into two fields flags`] }
					)

					res = kv[0].replace('[', '').replace(']', '')
					this.checkResource(res)

					val = kv[1]

				}

				const values = val.split(',').map(v => v.trim())
				if (values[0].trim() === '') this.error(`No fields defined for resource ${chalk.italic(res)}`)

				if (fields[res] === undefined) fields[res] = []
				fields[res].push(...values)

			})
		}

		return fields

	}


	whereFlag(flag: string[]): KeyValString {

		const wheres: KeyValString = {}

		if (flag && (flag.length > 0)) {
			flag.forEach(f => {

				let sepChar = '/'
				let si = f.indexOf(sepChar)
				if (si < 0) {
					sepChar = '='
					si = f.indexOf(sepChar)
					if (si < 0) this.error(`Filter flag must be in the form ${chalk.italic('predicate/value')} or ${chalk.italic('predicate=value')}`)
				}

				const wt = f.split(sepChar)
				const w = wt[0]
				if (!filterAvailable(w)) this.error(`Invalid query filter: ${chalk.redBright(w)}`, {
					suggestions: [`Execute command ${chalk.italic('resources:filters')} to get a full list of all available filter predicates`],
					ref: 'https://docs.commercelayer.io/api/filtering-data#list-of-predicates',
				})

				const v = wt[1]

				wheres[w] = v

			})
		}

		return wheres

	}


	sortFlag(flag: string[]): KeyValSort {

		const sort: KeyValSort = {}

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
					if (!['asc', 'desc'].includes(sd)) this.error(`Invalid sort flag: ${chalk.redBright(f)}`,
						{ suggestions: [`Sort direction can assume only the values ${chalk.italic('asc')} or ${chalk.italic('desc')}`] }
					)

					sort[of] = sd as 'asc' | 'desc'

				})
			} else {
				flag.forEach(fl => {
					fl.split(',').forEach(f => {
						const desc = f.startsWith('-')
						const of = desc ? f.slice(1) : f
						const sd = desc ? 'desc' : 'asc'
						sort[of] = sd
					})
				})
			}
		}

		return sort

	}


	_keyvalFlag(flag: string[], type = 'attribute'): KeyValString {

		const param: KeyValString = {}

		if (flag && (flag.length > 0)) {
			flag.forEach(f => {

				const eqi = f.indexOf('=')
				if (eqi < 1) this.error(`Invalid ${type.toLowerCase()} ${chalk.redBright(f)}`, {
					suggestions: [`${_.capitalize(type)} flags must be defined using the format ${chalk.italic('name=value')}`],
				})

				const name = f.substr(0, eqi)
				const value = f.substr(eqi + 1)

				if (param[name]) this.warn(`${_.capitalize(type)} ${chalk.yellow(name)} has already been defined`)

				param[name] = value

			})
		}

		return param

	}


	attributeFlag(flag: string[]): KeyValObj {
		const attr = this._keyvalFlag(flag, 'attribute')
		const attributes: KeyValObj = {}
		Object.entries(attr).forEach(([k, v]) => {
			attributes[k] = (v === 'null') ? null : v
		})
		return attributes
	}


	metadataFlag(flag: string[], { fixTypes = false } = {}): KeyVal {
		const md = this._keyvalFlag(flag, 'metadata')
		const metadata: KeyVal = {}
		Object.keys(md).forEach(k => {
			metadata[k] = fixTypes ? fixType(md[k]) : md[k]
		})
		return metadata
	}


	relationshipFlag(flag: string[]): KeyValRel {

		const relationships: KeyValRel = {}

		if (flag && (flag.length > 0)) {
			flag.forEach(f => {

				let rel: string
				let name: string
				let id: string
				let type: string

				const rt = f.split('=')
				if (rt.length === 2) {
					if ((name = rt[0]) === '') this.error('Relationship attribute name is empty')
					if ((rel = rt[1]) === '') this.error('Relationship value is empty')
				} else this.error(`Invalid relationship flag: ${chalk.redBright(f)}`,
					{ suggestions: [`Define the relationship using the format ${chalk.italic('attribute_name=resource_type/resource_id')}`] }
				)

				const vt = rel.split('/')
				if (vt.length === 2) {
					if ((type = vt[0]) === '') this.error('Relationship type is empty')
					if ((id = vt[1]) === '') this.error('Relationship resource id is empty')
				} else {
					id = vt[0]
					const res = findResource(name, { singular: true })
					if (res) type = res.api
					else this.error('Relationship type is empty')
				}

				// const res = this.checkResource(type)

				if (relationships[name]) this.warn(`Relationship ${chalk.yellow(name)} has already been defined`)

				relationships[name] = { id, type }

			})
		}

		return relationships

	}


	protected checkOperation(sdk: any, name: string): boolean {
		if (!sdk[name]) this.error(`Operation not supported for resource ${chalk.italic(sdk.type())}: ${chalk.redBright(name)}`)
		return true
	}


	printOutput(output: any, flags: any | undefined) {
		if (output) this.log(formatOutput(output, flags))
	}


	printError(error: any, flags?: any): void {

		let err = error

		if (CommerceLayerStatic.isApiError(err)) {
			err = err.errors
		} else
			if (error.response) {
				if (error.response.status === 401) this.error(chalk.bgRed(`${error.response.statusText} [${error.response.status}]`),
					{ suggestions: ['Execute login to get access to the selected resource'] }
				)
				else
					if (error.response.status === 500) this.error(`We're sorry, but something went wrong (${error.response.status})`)
					else
						if (error.response.status === 429) this.error(`You have done too many requests in the last 5 minutes (${error.response.status})`)
						else err = error.response.data.errors
			} else
				if (error.message) err = error.message


		this.error(formatOutput(err, flags))

	}


	saveOutput(output: any, flags: any) {

		try {

			let filePath = flags.save || flags['save-path']
			if (!filePath) this.warn('Undefined output save path')

			// Special directory (home / desktop)
			const root = filePath.toLowerCase().split('/')[0]
			if (['desktop', 'home'].includes(root)) {
				let filePrefix = this.config.home
				if (root === 'desktop') filePrefix += '/Desktop'
				filePath = filePath.replace(root, filePrefix)
			}
			const fileDir = path.dirname(filePath)
			if (flags['save-path'] && !fs.existsSync(fileDir)) fs.mkdirSync(fileDir, { recursive: true })


			const fileExport = flags.csv ? exportCsv : exportOutput
			fileExport(output, flags, filePath)
				.then(() => {
					if (fs.existsSync(filePath)) this.log(`\nCommand output saved to file ${chalk.italic(filePath)}\n`)
				})
				.catch(() => this.error(`Unable to save command output to file ${filePath}`,
					{ suggestions: ['Please check you have the right file system permissions'] }
				))

		} catch (error: any) {
			if (error.code === 'ENOENT') this.warn(`Path not found ${chalk.redBright(error.path)}: execute command with flag ${chalk.italic.bold('-X')} to force path creation`)
			else throw error
		} finally {
			this.log()
		}

	}


	protected async showLiveDocumentation(request: RequestData, params?: QueryParams, flags?: any): Promise<string> {
		const lang = getLanguageArg(flags) || await promptLanguage()
		const cmd = buildCommand(lang, request, params, flags)
		this.printCommand(lang, cmd)
		return cmd
	}


	protected printCommand(lang: string, command: string) {

		const header = languageInfo[lang as keyof typeof languageInfo].label
		// const footer = header.replace(/./g, '-')

		this.log()
		this.log(`${chalk.underline.cyan(header)}`)
		// this.log(chalk.cyan(`------------------------------{ ${header} }------------------------------`))
		this.log()
		this.log(command)
		// this.log()
		// this.log(chalk.cyan(`---------------------------------${footer}---------------------------------`))
		this.log()

	}


  protected checkApplication(accessToken: string, kinds: string[]): boolean {

    const info = decodeAccessToken(accessToken)

    if (info === null) this.error('Invalid access token provided')
    else
    if (!kinds.includes(info.application.kind))
      this.error(`Invalid application kind: ${chalk.redBright(info.application.kind)}. Application kind must be one of the following: ${chalk.cyanBright(kinds.join(', '))}`)

    return true

  }

}


export { flags }
