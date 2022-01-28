import { Command, Flags, Config } from '@oclif/core'
import { AuthReturnType, AuthScope, ClientCredentials, clientCredentials, getCustomerToken, User } from '@commercelayer/js-auth'
import commercelayer, { CommerceLayerStatic } from '@commercelayer/sdk'
import { ApiMode, AppAuth, AppInfo, clApplication, clApi } from '@commercelayer/cli-core'
import chalk from 'chalk'
import { ConfigParams, createConfigDir, writeConfigFile, writeTokenFile, configParam, currentApplication } from '../../config'
import { inspect } from 'util'
import { decodeAccessToken } from './token'
import { printCurrent } from './current'
import { filterApplications } from '../../base'


export default class ApplicationsLogin extends Command {

	static description = 'execute login to a Commerce Layer application'

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
		}),
		password: Flags.string({
			char: 'p',
			description: 'customer secret password',
			dependsOn: ['email'],
		}),
		alias: Flags.string({
			char: 'a',
			description: 'the alias you want to associate to the application',
			multiple: false,
			required: true,
		}),
	}


	async catch(error: any) {
		this.error(error.message)
	}



	async run() {

		const { flags } = await this.parse(ApplicationsLogin)

		if (!flags.clientSecret && !flags.scope)
			this.error(`You must provide one of the arguments ${chalk.italic('clientSecret')} and ${chalk.italic('scope')}`)

		const scope = checkScope(flags.scope)
		const alias = await checkAlias(flags.alias, this.config, flags.organization)

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

			const token = await getAccessToken(config)

			const app = await getApplicationInfo(config, token?.accessToken || '')

			const typeCheck = configParam(ConfigParams.applicationTypeCheck)
			if (typeCheck) {
				if (!typeCheck.includes(app.kind)) this.error(`The credentials provided are associated to an application of type ${chalk.red.italic(app.kind)} while the only allowed types are: ${chalk.green.italic(typeCheck.join(','))}`,
					{ suggestions: [`Double check your credentials or access the online dashboard of ${chalk.bold(app.organization)} and create a new valid application `] }
				)
			}
			app.alias = alias

			createConfigDir(this.config)

			writeConfigFile(this.config, app)

			writeTokenFile(this.config, app, token?.data)

			currentApplication(app)
			const current = currentApplication()
			this.log(`\nCurrent application: ${printCurrent(current)}`)

			this.log(`\n${chalk.bold.greenBright('Login successful!')} Your configuration has been stored locally. You can now interact with ${chalk.italic.bold(app.organization)} organization\n`)

		} catch (error: any) {
			this.log(chalk.bold.redBright('Login failed!'))
			if (CommerceLayerStatic.isApiError(error)) this.error(inspect(error.errors, false, null, true))
			else this.error(error)
		}

	}

}



const getAccessToken = async (auth: AppAuth): AuthReturnType => {

	const credentials: ClientCredentials = {
		clientId: auth.clientId,
		clientSecret: auth.clientSecret,
		endpoint: clApi.baseURL(auth.slug, auth.domain),
		scope: auth.scope || '',
	}

	if (auth.email && auth.password) {
		const user: User = {
			username: auth.email,
			password: auth.password,
		}
		return getCustomerToken(credentials, user)
	}

	return clientCredentials(credentials)

}


const getApplicationInfo = async (auth: AppAuth, accessToken: string): Promise<AppInfo> => {

	const cl = commercelayer({
		organization: auth.slug,
		domain: auth.domain,
		accessToken,
	})

	const tokenInfo = decodeAccessToken(accessToken)

	// Organization info
	const org = await cl.organization.retrieve().catch(() => {
		throw new Error(`This application cannot access the ${chalk.italic('Organization')} resource`)
	})

	// Application info
	const app = await cl.application.retrieve().catch(() => {
		throw new Error(`This application cannot access the ${chalk.italic('Application')} resource`)
	})

	const mode: ApiMode = tokenInfo.test ? 'test' : 'live'

	const appInfo: AppInfo = Object.assign({
		organization: org.name || '',
		key: clApplication.appKey(),
		slug: org.slug || '',
		mode: mode,
		kind: app.kind || '',
		name: app.name || '',
		baseUrl: clApi.baseURL(auth.slug, auth.domain),
		id: app.id,
		alias: '',
	}, auth)

	// if (Array.isArray(appInfo.scope) && (appInfo.scope.length === 0)) appInfo.scope = undefined


	return appInfo

}


const checkScope = (scopeFlags: string[]): AuthScope => {

	const scope: string[] = []

	if (scopeFlags) {
		for (const s of scopeFlags) {
			const colonIdx = s.indexOf(':')
			if ((colonIdx < 0) || (colonIdx === s.length - 1)) throw new Error(`Invalid scope: ${chalk.red(s)}`)
			else
				if (scope.includes(s)) throw new Error(`Duplicate login scope: ${chalk.red(s)}`)
				else scope.push(s)
		}
	}

	const _scope = (scope.length === 1) ? scope[0] : scope

	return _scope

}


const checkAlias = (alias: string, config?: Config, organization?: string): string => {

	const match = alias.match(/^[a-z0-9_-]*$/)
	if ((match === null) || (match.length > 1)) throw new Error(`Invalid alias: ${chalk.redBright(alias)}. Accepted characters are ${chalk.italic('[a-z0-9_-]')}`)

	const ml = 15
	const al = match[0]
	if (al.length > ml) throw new Error(`Application alias must have a max length of ${chalk.yellowBright(String(ml))} characters`)

	if (config) {
		const flags = { alias, organization }
		const apps = filterApplications(config, flags)
		if (apps.length > 0) throw new Error(`Alias ${chalk.redBright(alias)} has already been used for organization ${chalk.bold(apps[0].organization)}`)
	}

	return al

}



export { getAccessToken, getApplicationInfo, checkScope, checkAlias }
