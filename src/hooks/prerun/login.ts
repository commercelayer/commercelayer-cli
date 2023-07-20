import { type Hook, ux as cliux } from '@oclif/core'
import { tokenFileExists, readTokenFile, ConfigParams, configParam, readConfigFile, configFileExists } from '../../config'
import { clApplication, type AppKey, clToken, clColor, clCommand } from '@commercelayer/cli-core'
import { newAccessToken, isAccessTokenExpiring } from '../../commands/applications/token'



const excludedTopics: string[] = ['applications', 'config', 'plugins', 'util', 'autocomplete', 'token', 'cli']
const exludedCommands: string[] = [
	'plugins',
	'imports:types',
	'exports:types',
	'resources',
	'resources:doc',
	'resources:filters',
	'seeder:check',
	'webhooks:topics',
	'autocomplete',
	'applications',
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

	// Check excluded topics and commands
	if (isCommandExcluded(opts.Command.id)) return
	
	const keyFlag = clCommand.findLongStringFlag(opts.argv, 'appkey')

	const app: AppKey = {
		key: keyFlag?.value || '',
		mode: 'test', // execMode(flags.live),
	}

	let configData

	// No appkey passed io command line, looking for saved current application
	if (!clApplication.appKeyValid(app)) {
		const current = configParam(ConfigParams.currentApplication)
		if (current !== undefined) Object.assign(app, current)
		if (!clApplication.appKeyValid(app)) return
	}

	// Check if config file exists and load application data
	if (configFileExists(this.config, app)) configData = readConfigFile(this.config, app)
	else this.error('Unable to find configuration file for application')

	if (!configData) return

	// If present remove application key flag option (needed only to load application info)
	if (keyFlag) opts.argv.splice(keyFlag.index, keyFlag.single? 1 : 2)

	// If config file exists check application type
	const typeCheck = configParam(ConfigParams.applicationTypeCheck)
	if (typeCheck) {
		if (!typeCheck.includes(configData.kind))
			this.error(`The application (${clColor.api.application(configData.key)}) has an invalid type: ${clColor.msg.error(configData.kind)}, while the only accepted type are ${clColor.api.kind(typeCheck.join(','))}\nPlease use a correct one or access the online dashboard of ${configData.organization} and create a new valid application`)
	}


	// Check command flags
	const _flags = opts.Command.flags || {}

	const ffIdx = Math.max(0, opts.argv.findIndex(arg => arg.startsWith('-')))

	// Add to command line args application info read from config file
	if (_flags.organization && configData.slug) opts.argv.splice(ffIdx, 0, '--organization=' + configData.slug)
	if (_flags.domain && configData.domain) opts.argv.splice(ffIdx, 0, '--domain=' + configData.domain)

	// If command requires clientId and clientSecret (or scope) add them to the command line arguments
	if (_flags.clientId && configData.clientId) opts.argv.splice(ffIdx, 0, '--clientId=' + configData.clientId)
	if (_flags.clientSecret && configData.clientSecret) opts.argv.splice(ffIdx, 0, '--clientSecret=' + configData.clientSecret)

	const scope = clApplication.arrayScope(configData.scope)
	if (_flags.scope && (scope.length > 0)) opts.argv.splice(ffIdx, 0, scope.map(s => `--scope=${s}`).join(' '))


	const atFlag = clCommand.findLongStringFlag(opts.argv, 'accessToken')

	if (!atFlag && _flags.accessToken) { // accessToken not passed in comman line but required by the command

		let tokenData = null
		let refresh = false

		if (tokenFileExists(opts.config, app)) {
			tokenData = readTokenFile(opts.config, app)
			if (isAccessTokenExpiring(tokenData)) {
				cliux.action.start('Refreshing access token ...')
				refresh = true
				// If not overridden by saved current application, load configuration data
				if (!configData) configData = readConfigFile(this.config, app)
				await clToken.revokeAccessToken(configData, tokenData.accessToken)
				tokenData = null
			}
		}

		if (tokenData === null) {
			const token = await newAccessToken(this.config, app, true).catch(() => {
				if (refresh) cliux.action.stop(clColor.msg.error('Error'))
			})
			if (token) tokenData = token
			if (refresh) cliux.action.stop()
		}

		if (!tokenData?.accessToken) this.error('Unable to refresh application access token')

		opts.argv.push('--accessToken=' + String(tokenData.accessToken))

	}

}

export default hook
