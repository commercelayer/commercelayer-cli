import { Command, Flags, type Config } from '@oclif/core'
import commercelayer, { type Application, CommerceLayerStatic, type Organization } from '@commercelayer/sdk'
import clprovisioning from '@commercelayer/provisioning-sdk'
import { clApplication, clApi, clToken, clColor, clCommand, clConfig } from '@commercelayer/cli-core'
import type { ApiMode, AppAuth, AppInfo, AuthScope } from '@commercelayer/cli-core'
import { ConfigParams, appsDirCreate, writeConfigFile, writeTokenFile, configParam, currentApplication, filterApplications } from '../../config'
import { inspect } from 'node:util'
import { printCurrent } from './current'
import { CLIError } from '@oclif/core/lib/errors'
import type { ArgOutput, FlagOutput, Input } from '@oclif/core/lib/interfaces/parser'



export default class ApplicationsLogin extends Command {

	static description = `execute login to a Commerce Layer application (application must be of kind 'integration' or 'sales_channel')`

	static aliases = ['app:login', 'login']

	static examples = [
		'$ commercelayer applications:login -o <organizationSlug> -i <clientId> -s <clientSecret> -a <applicationAlias>',
		'$ cl app:login -i <clientId> -s <clientSecret> -a <applicationAlias>'
	]

	static flags = {
		organization: Flags.string({
			char: 'o',
			description: 'organization slug',
			required: false
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
			dependsOn: ['clientId']
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
		})
	}


	async catch(error: any): Promise<any> {
		this.error(error.message as string)
	}


	async parse(c: any): Promise<any> {
		clCommand.fixDashedFlagValue(this.argv, c.flags.clientId)
		const parsed = await super.parse(c as Input<FlagOutput, FlagOutput, ArgOutput>)
		clCommand.fixDashedFlagValue(this.argv, c.flags.clientId, 'i', parsed)
		return parsed
	}

  
  
	async run(): Promise<any> {

		const { flags } = await this.parse(ApplicationsLogin)

		if (!flags.clientSecret && !flags.scope)
			this.error(`You must provide one of the arguments ${clColor.cli.flag('clientSecret')} and ${clColor.cli.flag('scope')}`)


		const scope = checkScope(flags.scope as string[])
		const alias = checkAlias(flags.alias as string, this.config, flags.organization as string)

		const config: AppAuth = {
			clientId: flags.clientId,
			clientSecret: flags.clientSecret,
			slug: flags.organization,
			domain: flags.domain,
			scope,
			email: flags.email,
			password: flags.password
		}

		if (config.domain === configParam(ConfigParams.defaultDomain)) config.domain = undefined


		try {

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

			appsDirCreate(this.config)

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

	function error(type: string): never {
		throw new Error(`This application cannot access the ${clColor.italic(clApi.humanizeResource(type))} resource`)
	}

	const tokenInfo = clToken.decodeAccessToken(accessToken)
	auth.scope = clApplication.arrayScope(tokenInfo.scope)
	// Remove metrics-api scope if exists
	if (auth.scope.includes(clConfig.provisioning.scope)) auth.scope = clConfig.provisioning.scope

	const provisioning = clApplication.isProvisioningApp(auth)
	const api = auth.api || (provisioning? 'provisioning' : 'core')

	let org: Partial<Organization>, app: Partial<Application>, user
	if (provisioning) {
		const clp = clprovisioning({ domain: auth.domain, accessToken })
		// User info
		const usr = await clp.user.retrieve().catch(() => { error(clp.user.type()) })
		if (usr) user = { name: `${usr.first_name}${(usr.first_name && usr.last_name)? ' ' : ''}${usr.last_name}`, email: usr.email }
		org = { slug: 'provisioning', name: user?.name || 'Provisioning API' }
		app = { name: 'Provisioning App' }
	} else { // core
		const cl = commercelayer({ organization: auth.slug || '', domain: auth.domain, accessToken })
		// Organization info
		org = await cl.organization.retrieve().catch(() => { error(cl.organization.type()) })
		// Application info
		app = await cl.application.retrieve().catch(() => { error(cl.application.type()) })
	}

	const mode: ApiMode = tokenInfo.test ? 'test' : 'live'

	const appInfo: AppInfo = { ...auth, 
		organization: org.name ?? undefined,
		key: clApplication.appKey(),
		slug: org.slug ?? undefined,
		mode,
		kind: tokenInfo.application.kind,
		name: app.name || '',
		baseUrl: clApi.baseURL(api, auth.slug, auth.domain),
		id: tokenInfo.application.id,
		alias: '',
		api,
		user: user?.name
	}

	// if (Array.isArray(appInfo.scope) && (appInfo.scope.length === 0)) appInfo.scope = undefined

	return appInfo

}


const checkScope = (scopeFlags: string[] | undefined): AuthScope => {

	const scope: string[] = []

	if (scopeFlags) {
		for (const s of scopeFlags) {

			if (['provisioning-api', 'metrics-api'].includes(s) && (scopeFlags.length > 1)) throw new Error(`Scope ${clColor.msg.error(s)} cannot be used together with other scopes`)

			const colonIdx = s.indexOf(':')
			const scopePrefix = s.substring(0, colonIdx)

			if ((colonIdx < 1) || (colonIdx === s.length - 1)) throw new Error(`Invalid scope: ${clColor.msg.error(s)}`)
			if (scope.includes(s)) throw new Error(`Duplicate login scope: ${clColor.msg.error(s)}`)

			const scopeCheck = configParam(ConfigParams.scopeCheck)
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
		if (apps.length > 0) throw new Error(`Alias ${clColor.msg.error(alias)} has already been used${organization ? ` for organization ${clColor.api.organization(apps[0].organization)}` : ''}`)
	}

	return al

}



export { getApplicationInfo, checkScope, checkAlias }
