import type { AccessToken, CustomToken } from '@commercelayer/cli-core/lib/cjs/token'
import Command, { Flags } from '../../base'
import { readConfigFile, writeTokenFile, configFileExists, readTokenFile, ConfigParams, configParam, currentApplication } from '../../config'
import { clOutput, type AppKey, clToken, clConfig, clColor } from '@commercelayer/cli-core'
import type { Config } from '@oclif/core/lib/interfaces/config'



const defaultTokenExpiration = clConfig.api.token_expiration_mins



export default class ApplicationsToken extends Command {

	static description = 'get a new access token from Commerce Layer API'

	static aliases = ['app:token']

	static hidden = true

	static examples = [
		'$ commercelayer applications:token',
		'$ commercelayer app:token --info',
	]

	static flags = {
		save: Flags.boolean({
			char: 's',
			description: 'save access token',
		}),
		info: Flags.boolean({
			char: 'i',
			description: 'show access token info',
		}),
		shared: Flags.string({
			char: 'S',
			description: 'organization shared secret',
			hidden: true,
			exclusive: ['save'],
		}),
		minutes: Flags.integer({
			char: 'M',
			description: `minutes to token expiration [2, ${defaultTokenExpiration}]`,
			hidden: true,
			dependsOn: ['shared'],
		}),
	}


	async run(): Promise<any> {

		const { flags } = await this.parse(ApplicationsToken)

		const app = this.appFilterEnabled(flags) ? await this.findApplication(flags) : currentApplication()

		if (!app || !configFileExists(this.config, app))
			this.error(`Unable to find configuration file for application${app ? ` ${app.name}` : ''}`,
				{ suggestions: [`execute ${clColor.cli.command('applications:login')} command to initialize application and get the first access token`] }
			)

		try {

			let expMinutes
			let accessToken
			let returnData

			if (flags.shared) {
				const token = generateAccessToken(this.config, app, flags.shared, flags.minutes)
				accessToken = token.accessToken
				returnData = token.info
				expMinutes = token.expMinutes
			} else {
				const token = await newAccessToken(this.config, app, flags.save)
				if (flags.save) this.log(`The new ${app.mode} access token has been locally saved for application ${clColor.api.application(app.name)}`)
				accessToken = token?.accessToken
				returnData = token
			}

			if (accessToken) {
				this.log(`\nAccess token for application ${clColor.api.application(app.name)} of organization ${clColor.api.organization(app.organization)}`)
				this.log(`\n${clColor.api.token(accessToken)}\n`)
				if (flags.shared && expMinutes) {
					this.warn(clColor.italic(`this access token will expire in ${expMinutes} minutes`))
					this.log()
				}
			}

			if (flags.info) this.printAccessToken(accessToken)

			return returnData

		} catch (error: any) {
			this.log(clColor.msg.error.bold('FAILURE! ') + String(error.message))
		}

	}


	private printAccessToken(accessToken: any): void {
		if (accessToken) {
			const info = clToken.decodeAccessToken(accessToken)
			this.log(clColor.style.title('Token Info:'))
			this.log(clOutput.printObject(info))
			this.log()
		}
	}

}



const newAccessToken = async (config: Config, app: AppKey, save: boolean = false): Promise<AccessToken> => {

	const cfg = readConfigFile(config, app)
	const token = await clToken.getAccessToken(cfg)

	if (token) {

		// Check application type on each token refresh
		const info = clToken.decodeAccessToken(token.accessToken)
		const typeCheck = configParam(ConfigParams.applicationTypeCheck)
		if (typeCheck) {
			if (!typeCheck.includes(info.application.kind))
				throw new Error(`The locally saved credentials are associated to an application of type ${clColor.msg.error(info.application.kind)} while the only allowed types are: ${clColor.api.kind(typeCheck.join(','))}`)
		}

		if (save) writeTokenFile(config, app, token)

	}

	return token

}


const isAccessTokenExpiring = (tokenData: any): boolean => {

	const safetyInterval = 30 // secs

	const createdAt = Number(tokenData.created_at)
	const now = Math.floor(Date.now() / 1000)
	const time = now - createdAt

	return (time >= (7200 - safetyInterval))

}


const generateAccessToken = (config: Config, app: AppKey, sharedSecret: string, valMinutes?: number): CustomToken => {

	const savedToken = readTokenFile(config, app)
	const tokenData = clToken.decodeAccessToken(savedToken.accessToken)

	let minutes = (valMinutes === undefined) ? defaultTokenExpiration : valMinutes
	if (minutes < 2) minutes = 2
	else minutes = Math.min(minutes, defaultTokenExpiration)

	const payload = {
		application: tokenData?.application,
		// exp: Math.floor(Date.now() / 1000) + (minutes * 60),
		organization: tokenData?.organization,
		// rand: Math.random(),
		test: tokenData?.test,
	}

	return clToken.generateAccessToken(payload, sharedSecret, minutes)

}



export { newAccessToken, isAccessTokenExpiring }
