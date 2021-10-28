import { Command, flags } from '@oclif/command'
import { clientCredentials, getCustomerToken } from '@commercelayer/js-auth'
import commercelayer, { CommerceLayerStatic } from '@commercelayer/sdk'
import { baseURL, appKey, ApiMode } from '../../common'
import chalk from 'chalk'
import clicfg, { AppInfo, ConfigParams, AppAuth, createConfigDir, configFileExists, writeConfigFile, writeTokenFile, configParam } from '../../config'
import { inspect } from 'util'
import { decodeAccessToken } from './token'
import { Credentials } from '@commercelayer/js-auth/dist/clientCredentials'
import { AuthScope } from '@commercelayer/js-auth/dist/typings'
import { User } from '@commercelayer/js-auth/dist/salesChannel'


export default class ApplicationsLogin extends Command {

	static description = 'execute login to a CLI Commerce Layer application'

	static aliases = ['app:login', 'app:add', 'applications:add']

	static examples = [
		'$ commercelayer applications:login -o <organizationSlug> -i <clientId> -s <clientSecret>',
	]

	static flags = {
		// help: flags.help({ char: 'h' }),
		organization: flags.string({
			char: 'o',
			description: 'organization slug',
			required: true,
		}),
		clientId: flags.string({
			char: 'i',
			description: 'organization client_id',
			required: true,
		}),
		clientSecret: flags.string({
			char: 's',
			description: 'organization client_secret',
			required: false,
		}),
		domain: flags.string({
			char: 'd',
			description: 'api domain',
			required: false,
			hidden: true,
			dependsOn: ['organization'],
		}),
		scope: flags.string({
			char: 'S',
			description: 'access token scope (market, stock location)',
			required: false,
			multiple: true,
		}),
		email: flags.string({
			char: 'e',
			description: 'customer email',
			dependsOn: ['password'],
		}),
		password: flags.string({
			char: 'p',
			description: 'secret password',
			dependsOn: ['email'],
		}),
	}

	async run() {

		const { flags } = this.parse(ApplicationsLogin)

		if (!flags.clientSecret && !flags.scope)
			this.error(`You must provide one of the arguments ${chalk.italic('clientSecret')} and ${chalk.italic('scope')}`)

		const scope = checkScope(flags.scope)

		const config: AppAuth = {
			clientId: flags.clientId,
			clientSecret: flags.clientSecret,
			slug: flags.organization,
			domain: flags.domain,
			scope,
			email: flags.email,
			password: flags.password,
		}


		try {

			const token = await getAccessToken(config)

			const app = await getApplicationInfo(config, token?.accessToken || '')
			const typeCheck = configParam(ConfigParams.applicationTypeCheck)
			if (typeCheck) {
				if (!typeCheck.includes(app.type)) this.error(`The credentials provided are associated to an application of type ${chalk.red.italic(app.type)} while the only allowed types are: ${chalk.green.italic(typeCheck.join(','))}`,
					{ suggestions: [`Double check your credentials or access the online dashboard of ${chalk.bold(app.organization)} and create a new valid application `] }
				)
			}
			app.key = appKey(app.slug, flags.domain)

			createConfigDir(this.config)

			const overwrite = configFileExists(this.config, app)
			writeConfigFile(this.config, app)

			writeTokenFile(this.config, app, token?.data)

			clicfg.set(ConfigParams.currentApplication, { key: app.key, mode: app.mode })
			const current = configParam(ConfigParams.currentApplication)
			this.log(`\nCurrent application: ${chalk.bold.yellowBright(current.key + '.' + current.mode)}`)

			// this.log(`\n${chalk.bold.greenBright('Login successful!')} ${chalk.bold(app.mode)} configuration and access token have been locally ${overwrite ? 'overwritten' : 'saved'} for application ${chalk.italic.bold(app.name)} of organization ${chalk.italic.bold(app.organization)}\n`)
			this.log(`\n${chalk.bold.greenBright('Login successful!')} Your configuration has been stored locally${overwrite ? ' (overwriting the existing one)' : ''}. You can now interact with ${chalk.italic.bold(app.organization)} organization\n`)

		} catch (error: any) {
			this.log(chalk.bold.redBright('Login failed!'))
			if (CommerceLayerStatic.isApiError(error)) this.error(inspect(error.errors, false, null, true))
			else this.error(error)
		}

	}

}



export const getAccessToken = async (auth: AppAuth): Promise<any> => {

	const credentials: Credentials = {
		clientId: auth.clientId,
		clientSecret: auth.clientSecret,
		endpoint: baseURL(auth.slug, auth.domain),
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
		key: appKey(org.slug || '', auth.domain),
		slug: org.slug || '',
		mode: mode,
		type: app.kind || '',
		name: app.name || '',
		baseUrl: baseURL(auth.slug, auth.domain),
	}, auth)

	// if (Array.isArray(appInfo.scope) && (appInfo.scope.length === 0)) appInfo.scope = undefined


	return appInfo

}


const checkScope = (scopes: string[]): AuthScope => {

	const scope: string[] = []

	if (scopes) {
		for (const s of scopes) {
			const colonIdx = s.indexOf(':')
			if ((colonIdx < 0) || (s.substr(colonIdx).trim() === '')) throw new Error(`Invalid scope: ${chalk.red(s)}`)
			else
				if (scope.includes(s)) throw new Error(`Duplicate login scope: ${chalk.red(s)}`)
				else scope.push(s)
		}
	}

	return (scope.length === 1) ? scope[0] : scope

}
