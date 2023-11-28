import { Command, Flags, type Config } from '@oclif/core'
import commercelayer, { CommerceLayerStatic } from '@commercelayer/sdk'
import { clApplication, clApi, clToken, clColor, clConfig, clCommand } from '@commercelayer/cli-core'
import type { ApiMode,/* ApiType, */AppAuth, AppInfo, AuthScope } from '@commercelayer/cli-core'
import { ConfigParams, createConfigDir, writeConfigFile, writeTokenFile, configParam, currentApplication, filterApplications } from '../../config'
import { inspect } from 'util'
import { printCurrent } from './current'
import { CLIError } from '@oclif/core/lib/errors'



export default class ApplicationsLogin extends Command {

	static description = `execute login to a Commerce Layer application (application must be of kind 'integration' or 'sales_channel')`

	static aliases = ['app:login', 'login']

	static examples = [
		'$ commercelayer applications:login -o <organizationSlug> -i <clientId> -s <clientSecret> -a <applicationAlias>',
	]

	static flags = {
		organization: Flags.string({
			char: 'o',
			description: 'organization slug',
			required: false,
			exactlyOne: ['organization', 'provisioning']
		}),
		domain: Flags.string({
			char: 'd',
			description: 'api domain',
			required: false,
			hidden: true
		}),
		clientId: Flags.string({
			name: 'clientId',
			char: 'i',
			description: 'application client_id',
			required: true
		}),
		clientSecret: Flags.string({
			char: 's',
			description: 'application client_secret',
			required: false,
			dependsOn: ['clientId'],
			exclusive: ['email', 'password']
		}),
		scope: Flags.string({
			char: 'S',
			description: 'access token scope (market, stock location)',
			required: false,
			multiple: true,
			dependsOn: ['clientId'],
		}),
		email: Flags.string({
			char: 'e',
			description: 'customer email',
			dependsOn: ['password']
		}),
		password: Flags.string({
			char: 'p',
			description: 'customer secret password',
			dependsOn: ['email']
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
		}),
		provisioning: Flags.boolean({
			char: 'P',
			description: 'execute login to Provisioning API',
			required: false,
			exclusive: ['scope', 'organization', 'email', 'password', 'api'],
			dependsOn: ['clientId', 'clientSecret'],
			hidden: true
		})
		/*,
		api: Flags.string({
			char: 'A',
			description: 'the API you want to excute login for',
			required: false,
			options: ['core', 'provisioning'],
			exclusive: ['provisioning']
		})
		*/
	}


	async catch(error: any): Promise<any> {
		this.error(error.message)
	}


	async parse(c: any): Promise<any> {
		clCommand.fixDashedFlagValue(this.argv, c.flags.clientId)
		const parsed = await super.parse(c)
		clCommand.fixDashedFlagValue(this.argv, c.flags.clientId)
		return parsed
	}

  
  
	async run(): Promise<any> {

		const { flags } = await this.parse(ApplicationsLogin)

		if (!flags.clientSecret && !flags.scope)
			this.error(`You must provide one of the arguments ${clColor.cli.flag('clientSecret')} and ${clColor.cli.flag('scope')}`)



		const scope = checkScope(flags.scope, flags.provisioning)
		const alias = checkAlias(flags.alias, this.config, flags.organization)
		const api = /* (flags.api as ApiType) || */(flags.provisioning ? 'provisioning' : 'core')
		const slug = flags.organization || clConfig.provisioning.default_subdomain

		const config: AppAuth = {
			clientId: flags.clientId,
			clientSecret: flags.clientSecret,
			slug,
			domain: flags.domain,
			scope,
			email: flags.email,
			password: flags.password,
			api
		}

		if (config.domain === configParam(ConfigParams.defaultDomain)) config.domain = undefined


		try {
console.log(config)
			const token = await clToken.getAccessToken(config)
			if (!token?.accessToken) this.error('Unable to get access token')

			const app = await getApplicationInfo(config, token?.accessToken || '')

			const typeCheck = configParam(ConfigParams.applicationTypeCheck)
			if (typeCheck) {
				if (!typeCheck.includes(app.kind)) this.error(`The credentials provided are associated to an application of type ${clColor.msg.error(app.kind)} while the only allowed types are: ${clColor.api.kind(typeCheck.join(','))}`
					// , { suggestions: [`Double check your credentials or access the online dashboard of ${clColor.api.organization(app.organization)} and create a new valid application `] }
				)
			}
			app.alias = alias

			createConfigDir(this.config)

			writeConfigFile(this.config, app)

			writeTokenFile(this.config, app, token)

			currentApplication(app)
			const current = currentApplication()
			this.log(`\nCurrent application: ${printCurrent(current)}`)

			const interactMsg = clApplication.isProvisioningApp(app) ? `the ${clColor.api.application('Provisioning API')}` : `${clColor.api.organization(app.organization)} organization`
			this.log(`\n${clColor.msg.success.bold('Login successful!')} Your configuration has been stored locally. You can now interact with ${interactMsg}\n`)

		} catch (error: any) {
			this.log(clColor.msg.error.bold('Login failed!'))
			if (flags.debug) this.error(inspect(error, false, null, true))
			else
				if (CommerceLayerStatic.isApiError(error)) this.error(inspect(error.errors, false, null, true))
				else {
					const connectMsg = clApplication.isProvisioningApp(config) ? clColor.msg.error('Provisioning API') : `organization ${clColor.msg.error(config.slug)}`
					this.error(`Unable to connect to ${connectMsg}: ${clColor.italic(error.message)}`)
				}
		}

	}

}



const getApplicationInfo = async (auth: AppAuth, accessToken: string): Promise<AppInfo> => {

	const tokenInfo = clToken.decodeAccessToken(accessToken)

	const provisioning = clApplication.isProvisioningApp(auth)

	let org, app
	if (provisioning) {
		org = { name: 'Provisioning API', slug: 'provisioning' }
		app = { name: 'Provisioning App' }
	} else { // core
		const cl = commercelayer({ organization: auth.slug || '', domain: auth.domain, accessToken })
		// Organization info
		org = await cl.organization.retrieve().catch(() => {
			throw new Error(`This application cannot access the ${clColor.italic('Organization')} resource`)
		})
		// Application info
		app = await cl.application.retrieve().catch(() => {
			throw new Error(`This application cannot access the ${clColor.italic('Application')} resource`)
		})
	}

	const mode: ApiMode = tokenInfo.test ? 'test' : 'live'

	const appInfo: AppInfo = Object.assign(auth, {
		organization: org.name || '',
		key: clApplication.appKey(),
		slug: org.slug || '',
		mode,
		kind: tokenInfo.application.kind,
		name: app.name || '',
		baseUrl: clApi.baseURL(auth.slug, auth.domain, provisioning),
		id: tokenInfo.application.id,
		alias: '',
		scope: tokenInfo.scope
	})

	// if (Array.isArray(appInfo.scope) && (appInfo.scope.length === 0)) appInfo.scope = undefined


	return appInfo

}


const checkScope = (scopeFlags: string[] | undefined, provisioning?: boolean): AuthScope => {

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
	else if (provisioning) scope.push(clConfig.provisioning.scope)

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
		if (apps.length > 0) throw new Error(`Alias ${clColor.msg.error(alias)} has already been used for ${organization ? `organization ${clColor.api.organization(apps[0].organization)}` : clColor.api.application('Provisioning')}`)
	}

	return al

}



export { getApplicationInfo, checkScope, checkAlias }
