import { Command, Flags, type Config } from '@oclif/core'
import commercelayer, { CommerceLayerStatic } from '@commercelayer/sdk'
import { clApplication, clApi, clToken, clColor } from '@commercelayer/cli-core'
import type { ApiMode, AppAuth, AppInfo } from '@commercelayer/cli-core'
import { ConfigParams, createConfigDir, writeConfigFile, writeTokenFile, configParam, currentApplication, filterApplications } from '../../config'
import { inspect } from 'util'
import { printCurrent } from './current'
import { CLIError } from '@oclif/core/lib/errors'
import type { AuthScope } from '@commercelayer/js-auth'



export default class ApplicationsLogin extends Command {

	static description = `execute login to a Commerce Layer application (application must be of kind 'integration' or 'sales_channel')`

	static aliases = ['app:login']

	static examples = [
		'$ commercelayer applications:login -o <organizationSlug> -i <clientId> -s <clientSecret> -a <applicationAlias>',
	]

	static flags = {
		organization: Flags.string({
			char: 'o',
			description: 'organization slug',
			required: true,
		}),
		domain: Flags.string({
			char: 'd',
			description: 'api domain',
			required: false,
			hidden: true,
			dependsOn: ['organization'],
		}),
		clientId: Flags.string({
			char: 'i',
			description: 'application client_id',
			required: true,
		}),
		clientSecret: Flags.string({
			char: 's',
			description: 'application client_secret',
			required: false,
			exclusive: ['email', 'password']
		}),
		scope: Flags.string({
			char: 'S',
			description: 'access token scope (market, stock location)',
			required: false,
			multiple: true,
		}),
		email: Flags.string({
			char: 'e',
			description: 'customer email',
			dependsOn: ['password'],
			exclusive: ['clientSecret']
		}),
		password: Flags.string({
			char: 'p',
			description: 'customer secret password',
			dependsOn: ['email'],
			exclusive: ['clientSecret']
		}),
		alias: Flags.string({
			char: 'a',
			description: 'the alias you want to associate to the application',
			multiple: false,
			required: true,
		}),
		debug: Flags.boolean({
			description: 'show more verbose error messages',
			hidden: true
		})
	}


	async catch(error: any): Promise<any> {
		this.error(error.message)
	}



	async run(): Promise<any> {

		const { flags } = await this.parse(ApplicationsLogin)

		if (!flags.clientSecret && !flags.scope)
			this.error(`You must provide one of the arguments ${clColor.cli.flag('clientSecret')} and ${clColor.cli.flag('scope')}`)

		const scope = checkScope(flags.scope)
		const alias = checkAlias(flags.alias, this.config, flags.organization)

		const config: AppAuth = {
			clientId: flags.clientId,
			clientSecret: flags.clientSecret,
			slug: flags.organization,
			domain: flags.domain,
			scope,
			email: flags.email,
			password: flags.password,
		}

		if (config.domain === configParam(ConfigParams.defaultDomain)) config.domain = undefined


		try {

			const token = await clToken.getAccessToken(config)

			const app = await getApplicationInfo(config, token?.accessToken || '')

			const typeCheck = configParam(ConfigParams.applicationTypeCheck)
			if (typeCheck) {
				if (!typeCheck.includes(app.kind)) this.error(`The credentials provided are associated to an application of type ${clColor.msg.error(app.kind)} while the only allowed types are: ${clColor.api.kind(typeCheck.join(','))}`,
					{ suggestions: [`Double check your credentials or access the online dashboard of ${clColor.api.organization(app.organization)} and create a new valid application `] }
				)
			}
			app.alias = alias

			createConfigDir(this.config)

			writeConfigFile(this.config, app)

			writeTokenFile(this.config, app, token?.data)

			currentApplication(app)
			const current = currentApplication()
			this.log(`\nCurrent application: ${printCurrent(current)}`)

			this.log(`\n${clColor.msg.success.bold('Login successful!')} Your configuration has been stored locally. You can now interact with ${clColor.api.organization(app.organization)} organization\n`)

		} catch (error: any) {
			this.log(clColor.msg.error.bold('Login failed!'))
			if (flags.debug) this.error(inspect(error, false, null, true))
			else
			if (CommerceLayerStatic.isApiError(error)) this.error(inspect(error.errors, false, null, true))
			else this.error(`Unable to connect to organization ${clColor.msg.error(config.slug)}: ${clColor.italic(error.message)}`)
		}

	}

}



const getApplicationInfo = async (auth: AppAuth, accessToken: string): Promise<AppInfo> => {

	const cl = commercelayer({
		organization: auth.slug,
		domain: auth.domain,
		accessToken,
	})

	const tokenInfo = clToken.decodeAccessToken(accessToken)

	// Organization info
	const org = await cl.organization.retrieve().catch(() => {
		throw new Error(`This application cannot access the ${clColor.italic('Organization')} resource`)
	})

	// Application info
	const app = await cl.application.retrieve().catch(() => {
		throw new Error(`This application cannot access the ${clColor.italic('Application')} resource`)
	})

	const mode: ApiMode = tokenInfo.test ? 'test' : 'live'

	const appInfo: AppInfo = Object.assign({
		organization: org.name || '',
		key: clApplication.appKey(),
		slug: org.slug || '',
		mode,
		kind: app.kind || '',
		name: app.name || '',
		baseUrl: clApi.baseURL(auth.slug, auth.domain),
		id: app.id,
		alias: '',
	}, auth)

	// if (Array.isArray(appInfo.scope) && (appInfo.scope.length === 0)) appInfo.scope = undefined


	return appInfo

}


const checkScope = (scopeFlags: string[] | undefined): AuthScope => {

	const scope: string[] = []

	if (scopeFlags) {
		for (const s of scopeFlags) {

			const colonIdx = s.indexOf(':')
			const scopePrefix = s.substring(0, colonIdx)

			if ((colonIdx < 1) || (colonIdx === s.length - 1)) throw new Error(`Invalid scope: ${clColor.msg.error(s)}`)
			if (scope.includes(s)) throw new Error(`Duplicate login scope: ${clColor.msg.error(s)}`)

			const scopeCheck = configParam(ConfigParams.scopeChek)
			if (scopeCheck && !scopeCheck.includes(scopePrefix))
				throw new CLIError(`Invalid scope prefix: ${clColor.msg.error(scopePrefix)}`)

			scope.push(s)

		}
	}

	const _scope = (scope.length === 1) ? scope[0] : scope

	return _scope

}


const checkAlias = (alias: string, config?: Config, organization?: string): string => {

	const match = alias.match(/^[a-z0-9_-]*$/)
	if ((match === null) || (match.length > 1)) throw new Error(`Invalid alias: ${clColor.msg.error(alias)}. Accepted characters are ${clColor.cli.value('[a-z0-9_-]')}`)

	const ml = 15
	const al = match[0]
	if (al.length > ml) throw new Error(`Application alias must have a max length of ${clColor.type.number(String(ml))} characters`)

	if (config) {
		const flags = { alias, organization }
		const apps = filterApplications(config, flags)
		if (apps.length > 0) throw new Error(`Alias ${clColor.msg.error(alias)} has already been used for organization ${clColor.api.organization(apps[0].organization)}`)
	}

	return al

}



export { getApplicationInfo, checkScope, checkAlias }
