import { Hook } from '@oclif/config'
import { parse } from '@oclif/parser'
import { flags as flagUtil } from '@oclif/command'
import { tokenFileExists, readTokenFile, AppKey, ConfigParams, configParam, readConfigFile, configFileExists } from '../../config'
import { appKeyValid } from '../../common'
import { newAccessToken, isAccessTokenExpiring, revokeAccessToken } from '../../commands/applications/token'
import cliux from 'cli-ux'
import chalk from 'chalk'


const excludedTopics: string[] = ['applications', 'config', 'plugins', 'util']
const exludedCommands: string[] = [
	'plugins',
	'imports:types',
	'resources',
	'resources:doc',
	'resources:filters',
	'seeder:check',
	'webhooks:topics',
]


const isCommandExcluded = (cmd: string): boolean => {
	if (exludedCommands.includes(cmd)) return true
	const comPos = cmd.indexOf(':')
	return (comPos >= 0) && excludedTopics.includes(cmd.substring(0, comPos))
}


// eslint-disable-next-line complexity
const hook: Hook<'prerun'> = async function (opts) {

	// Only for test purpouses to avoid an error of undefined object
	if (!opts.Command || !opts.argv) return

	// Continue and check authentication only for command that:
	if (isCommandExcluded(opts.Command.id)) return                      // are not explicitly excluded from check
	// if (!opts.Command.flags?.accessToken) return                        // require an accessToken as input flag
	// if (opts.argv.some(arg => arg.startsWith('--accessToken'))) return  // will not receive the accessToken flag from command line


	const flagConfig = {
		// organization: flagUtil.string({ char: 'o', hidden: true }),
		appkey: flagUtil.string({ hidden: true }),
		// live: flagUtil.boolean({ hidden: true/* , dependsOn: ['organization'] */ }),
		// domain: flagUtil.string({ char: 'd', hidden: true, dependsOn: ['organization'] }),
		accessToken: flagUtil.string({ hidden: true }),
	}

	const { flags } = parse(opts.argv, { strict: false, flags: flagConfig })

	const app: AppKey = {
		key: flags.appkey || '',
		mode: 'test', // execMode(flags.live),
	}

	let configData

	// No appkey passed io command line, looking for saved current application
	if (!appKeyValid(app)) {
		const current = configParam(ConfigParams.currentApplication)
		if (current !== undefined) Object.assign(app, current)
		if (!appKeyValid(app)) return
	}
	
	// Check if config file exists and load application data
	if (!configFileExists(this.config, app)) this.error('Unable to find configuration file for application')
	else configData = readConfigFile(this.config, app)

	if (!configData) return

	// If config file exists check application type
	const typeCheck = configParam(ConfigParams.applicationTypeCheck)
	if (typeCheck) {
		if (!typeCheck.includes(configData.kind))
			this.error(`The application (${chalk.redBright(configData.key)}) has an invalid type: ${chalk.red.italic(configData.kind)}, while the only accepted type are ${chalk.green.italic(typeCheck.join(','))}\nPlease use a correct one or access the online dashboard of ${configData.organization} and create a new valid application`)
	}


	const _flags = opts.Command.flags || {}

	// Add to command line args application info read from config file
	if (_flags.organization && configData.slug) opts.argv.push('--organization=' + configData.slug)
	if (_flags.domain && configData.domain) opts.argv.push('--domain=' + configData.domain)

	/** !!!! Temporarily used by token plugin !!!! **/
	// If command requires clientId and clientSecret (or scope) add them to the command line arguments
	if (_flags.clientId && configData.clientId) opts.argv.push('--clientId=' + configData.clientId)
	if (_flags.clientSecret && configData.clientSecret) opts.argv.push('--clientSecret=' + configData.clientSecret)
	if (_flags.scope && configData.scope) {
		if (Array.isArray(configData.scope)) opts.argv.push(...configData.scope.map(s => '--scope=' + s))
		else opts.argv.push('--scope=' + configData.scope)
	}
	if (_flags.email && configData.email) opts.argv.push('--email=' + configData.email)
	if (_flags.password && configData.password) opts.argv.push('--password=' + configData.password)
	/** !!!! ********** ********** !!!! **/

	// If present remove --live flag option
	// if (opts.argv.includes('--live')) opts.argv.splice(opts.argv.indexOf('--live'), 1)

	// If present remove application key flag option (needed only to load application info)
	if (opts.argv.includes('--appkey')) opts.argv.splice(opts.argv.indexOf('--appkey'), 2)



	// If accessToken flag has not ben passed in command line
	if (!flags.accessToken) {

		// Check if command requires accessToken
		if (!_flags.accessToken) return                        // require an accessToken as input flag
		if (opts.argv.some(arg => arg.startsWith('--accessToken'))) return  // will not receive the accessToken flag from command line

		let tokenData = null
		let refresh = false

		if (tokenFileExists(opts.config, app)) {
			tokenData = readTokenFile(opts.config, app)
			if (isAccessTokenExpiring(tokenData)) {
				cliux.action.start('Refreshing access token ...')
				refresh = true
				// If not overridden by saved current application, load configuration data
				if (!configData) configData = readConfigFile(this.config, app)
				await revokeAccessToken(configData, tokenData.access_token)
				tokenData = null
			}
		}

		if (tokenData === null) {
			const token = await newAccessToken(this.config, app, true)
			tokenData = token?.data
			if (refresh) cliux.action.stop()
		}

		opts.argv.push('--accessToken=' + tokenData.access_token)

	}

}

export default hook
