import Command, { flags } from '../../base'
import commercelayer, { CommerceLayerClient, QueryParamsList } from '@commercelayer/sdk'
import chalk from 'chalk'
import cliux from 'cli-ux'
import { addRequestReader, buildCommand, getLanguage, isRequestInterrupted } from '../../lang'

export default class ResourcesList extends Command {

	static description = 'fetch a collection of resources'

	static aliases = ['list', 'rl', 'res:list']

	static examples = [
		'$ commercelayer resources:list customers -f id,email -i customer_group -s updated_at',
		'$ cl res:list -i customer_group -f customer_groups/name -w customer_group_name_eq="GROUP NAME"',
		'$ cl list -p 5 -n 10 -s -created_at --raw',
	]

	static flags = {
		...Command.flags,
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
		where: flags.string({
			char: 'w',
			multiple: true,
			description: 'comma separated list of query filters',
		}),
		page: flags.integer({
			char: 'p',
			description: 'page number',
		}),
		pageSize: flags.integer({
			char: 'n',
			description: 'number of elements per page',
		}),
		sort: flags.string({
			char: 's',
			description: 'defines results ordering',
			multiple: true,
		}),
		save: flags.string({
			char: 'x',
			description: 'save command output to file',
			multiple: false,
			exclusive: ['save-path'],
		}),
		'save-path': flags.string({
			char: 'X',
			description: 'save command output to file and create missing path directories',
			multiple: false,
			exclusive: ['save'],
		}),
	}

	static args = [
		...Command.args,
	]

	async run() {

		const { args, flags } = this.parse(ResourcesList)

		const resource = this.checkResource(args.resource)

		// const baseUrl = baseURL(flags.organization, flags.domain)
		const organization = flags.organization
		const domain = flags.domain
		const accessToken = flags.accessToken

		const lang = getLanguage(flags)


		// Include flags
		const include: string[] = this.includeFlag(flags.include)
		// Fields flags
		const fields = this.fieldsFlag(flags.fields, resource.api)
		// Where flags
		const wheres = this.whereFlag(flags.where)
		// Sort flags
		const sort = this.sortFlag(flags.sort)

		const page = flags.page
		const perPage = flags.pageSize


		const cl = commercelayer({ organization, domain, accessToken })

		const rawReader = flags.raw ? cl.addRawResponseReader() : undefined
		const reqReader = lang ? addRequestReader(cl) : undefined

		try {

			const resSdk: any = cl[resource.api as keyof CommerceLayerClient]
			this.checkOperation(resSdk, 'list')
			const params: QueryParamsList = {}

			if (include && (include.length > 0)) params.include = include
			if (fields && (Object.keys(fields).length > 0)) params.fields = fields
			if (wheres && (Object.keys(wheres).length > 0)) params.filters = wheres
			if (sort && (Object.keys(sort).length > 0)) params.sort = sort
			if (perPage && (perPage > 0)) params.pageSize = perPage
			if (page && (page > 0)) params.pageNumber = page

			if (!flags.doc) cliux.action.start(`Fetching ${resource.api.replace(/_/g, ' ')}`)
			const res = await resSdk.list(params)
			cliux.action.stop()

			const out = (flags.raw && rawReader) ? rawReader.rawResponse : [...res]
			const meta = res.meta

			if (res && (res.length > 0)) {
				this.printOutput(out, flags)
				this.log(`\nRecords: ${chalk.blueBright(res.length)} of ${meta.recordCount} | Page: ${chalk.blueBright(String(flags.page || 1))} of ${meta.pageCount}\n`)
				if (flags.save || flags['save-path']) this.saveOutput(out, flags)
			} else this.log(chalk.italic('\nNo records found\n'))


			return out

		} catch (error) {
			if (isRequestInterrupted(error)) {
				if (lang && reqReader) {
					this.printCommand(lang, buildCommand(lang, reqReader.request))
					cl.removeInterceptor('request', reqReader.id)
				}
			} else this.printError(error)
		}

	}

}
