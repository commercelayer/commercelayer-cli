import Command, { Flags } from '../../base'
import { getAccessToken } from './login'
import chalk from 'chalk'
import { readConfigFile, writeTokenFile, configFileExists, readTokenFile, ConfigParams, configParam, currentApplication } from '../../config'
import { clOutput, clUtil, clApi, AppKey, AppAuth, clToken, clConfig } from '@commercelayer/cli-core'
import type { Config } from '@oclif/core/lib/interfaces/config'
import https from 'https'
import jwt from 'jsonwebtoken'
import type { AuthReturnType } from '@commercelayer/js-auth'



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
		...Command.flags,
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


	async run() {

		const { flags } = await this.parse(ApplicationsToken)

		const app = this.appFilterEnabled(flags) ? await this.findApplication(flags) : currentApplication()

		if (!app || !configFileExists(this.config, app))
			this.error(`Unable to find configuration file for application${app ? ` ${app.name}` : ''}`,
				{ suggestions: [`execute ${chalk.italic('applications:login')} command to initialize application and get the first access token`] }
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
				if (flags.save) this.log(`The new ${app.mode} access token has been locally saved for application ${chalk.italic.bold(app.name)}`)
				accessToken = token?.accessToken
				returnData = token?.data
			}

			if (accessToken) {
				this.log(`\nAccess token for application ${chalk.bold.yellowBright(app.name)} of organization ${chalk.bold.yellowBright(app.organization)}`)
				this.log(`\n${chalk.blueBright(accessToken)}\n`)
				if (flags.shared && expMinutes) {
					this.warn(chalk.italic(`this access token will expire in ${expMinutes} minutes`))
					this.log()
				}
			}

			if (flags.info) this.printAccessToken(accessToken)

			return returnData

		} catch (error: any) {
			this.log(chalk.bold.redBright('FAILURE! ') + error.message)
		}

	}


	private printAccessToken(accessToken: any): void {
		if (accessToken) {
			const info = decodeAccessToken(accessToken)
			this.log(chalk.blueBright('Token Info:'))
			this.log(clOutput.printObject(info))
			this.log()
		}
	}

}


const decodeAccessToken = (accessToken: any): any => {
	return clToken.decodeAccessToken(accessToken)
}



const newAccessToken = async (config: Config, app: AppKey, save: boolean = false): Promise<AuthReturnType> => {

	const cfg = readConfigFile(config, app)
	const token = await getAccessToken(cfg)

	// Check application type on each token refresh
	const info = decodeAccessToken(token?.accessToken)
	const typeCheck = configParam(ConfigParams.applicationTypeCheck)
	if (typeCheck) {
		if (!typeCheck.includes(info.application.kind))
			throw new Error(`The locally saved credentials are associated to an application of type ${chalk.red.italic(info.application.kind)} while the only allowed types are: ${chalk.green.italic(typeCheck.join(','))}`)
	}

	if (save) writeTokenFile(config, app, token?.data)

	return token

}


const revokeAccessToken = async (app: AppAuth, token: string) => {

	/*
	return axios
	  .post(`${app.baseUrl}/oauth/revoke`, {
		grant_type: 'client_credentials',
		client_id: app.clientId,
		client_secret: app.clientSecret,
		token,
	  })
	*/

	const data = JSON.stringify({
		grant_type: 'client_credentials',
		client_id: app.clientId,
		client_secret: app.clientSecret,
		username: app.email,
		password: app.password,
		scope: app.scope,
		token,
	})

	const options = {
		hostname: clApi.baseURL(app.slug, app.domain).replace('https://', '').replace('http://', ''),
		port: 443,
		path: '/oauth/revoke',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': data.length,
		},
	}

	const req = https.request(options/* , res => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', d => {
      process.stdout.write(d)
    })
  } */)

	/*
	req.on('error', error => {
	  console.error(error)
	})
	*/

	req.write(data)
	req.end()

	await clUtil.sleep(300)

}


const isAccessTokenExpiring = (tokenData: any): boolean => {

	const safetyInterval = 30 // secs

	const createdAt = Number(tokenData.created_at)
	const now = Math.floor(Date.now() / 1000)
	const time = now - createdAt

	return (time >= (7200 - safetyInterval))

}


const generateAccessToken = (config: Config, app: AppKey, sharedSecret: string, valMinutes?: number): any => {

	const savedToken = readTokenFile(config, app)
	const tokenData = decodeAccessToken(savedToken.access_token)

	let minutes = (valMinutes === undefined) ? defaultTokenExpiration : valMinutes
	if (minutes < 2) minutes = 2
	else minutes = Math.min(minutes, defaultTokenExpiration)

	const payload = {
		application: tokenData?.application,
		exp: Math.floor(Date.now() / 1000) + (minutes * 60),
		organization: tokenData?.organization,
		rand: Math.random(),
		test: tokenData?.test,
	}

	const accessToken = jwt.sign(payload, sharedSecret, { algorithm: 'HS512', noTimestamp: true })
	const info = jwt.verify(accessToken, sharedSecret, { algorithms: ['HS512'] })


	return {
		accessToken,
		info,
		expMinutes: minutes,
	}

}



export { newAccessToken, revokeAccessToken, isAccessTokenExpiring, decodeAccessToken }
