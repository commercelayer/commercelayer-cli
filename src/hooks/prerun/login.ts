import { Hook, Parser, Flags, CliUx as cliux } from '@oclif/core'
import { tokenFileExists, readTokenFile, ConfigParams, configParam, readConfigFile, configFileExists } from '../../config'
import { clApplication, AppKey, clToken, clColor } from '@commercelayer/cli-core'
import { newAccessToken, isAccessTokenExpiring } from '../../commands/applications/token'



const excludedTopics: string[] = ['applications', 'config', 'plugins', 'util', 'autocomplete', 'token']
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
	'version',
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
		appkey: Flags.string({ hidden: true }),
		// live: flagUtil.boolean({ hidden: true/* , dependsOn: ['organization'] */ }),
		// domain: flagUtil.string({ char: 'd', hidden: true, dependsOn: ['organization'] }),
		accessToken: Flags.string({ hidden: true }),
	}

	const { flags } = await Parser.parse(opts.argv, { strict: false, flags: flagConfig })

	const app: AppKey = {
		key: flags.appkey || '',
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

	// If config file exists check application type
	const typeCheck = configParam(ConfigParams.applicationTypeCheck)
	if (typeCheck) {
		if (!typeCheck.includes(configData.kind))
			this.error(`The application (${clColor.api.application(configData.key)}) has an invalid type: ${clColor.msg.error(configData.kind)}, while the only accepted type are ${clColor.api.kind(typeCheck.join(','))}\nPlease use a correct one or access the online dashboard of ${configData.organization} and create a new valid application`)
	}


	const _flags = opts.Command.flags || {}

	// Add to command line args application info read from config file
	if (_flags.organization && configData.slug) opts.argv.unshift('--organization=' + configData.slug)
	if (_flags.domain && configData.domain) opts.argv.unshift('--domain=' + configData.domain)

	// If command requires clientId and clientSecret (or scope) add them to the command line arguments
	if (_flags.clientId && configData.clientId) opts.argv.unshift('--clientId=' + configData.clientId)
	if (_flags.clientSecret && configData.clientSecret) opts.argv.unshift('--clientSecret=' + configData.clientSecret)

	const scope = clApplication.arrayScope(configData.scope)
	if (_flags.scope && (scope.length > 0)) opts.argv.unshift(scope.map(s => `--scope=${s}`).join(' '))

	// If present remove --live flag option
	// if (opts.argv.includes('--live')) opts.argv.splice(opts.argv.indexOf('--live'), 1)

	// If present remove application key flag option (needed only to load application info)
	if (opts.argv.includes('--appkey')) opts.argv.splice(opts.argv.indexOf('--appkey'), 2)



	// If accessToken flag has not ben passed in command line
	if (!flags.accessToken) {

		// Check if command requires accessToken
		if (!_flags.accessToken) return                        // require an accessToken as input flag
		if (opts.argv.some(arg => arg.startsWith('--accessToken'))) return  // will receive the accessToken flag from command line

		let tokenData = null
		let refresh = false

		if (tokenFileExists(opts.config, app)) {
			tokenData = readTokenFile(opts.config, app)
			if (isAccessTokenExpiring(tokenData)) {
				cliux.ux.action.start('Refreshing access token ...')
				refresh = true
				// If not overridden by saved current application, load configuration data
				if (!configData) configData = readConfigFile(this.config, app)
				await clToken.revokeAccessToken(configData, tokenData.access_token)
				tokenData = null
			}
		}

		if (tokenData === null) {
			const token = await newAccessToken(this.config, app, true).catch(() => {
				if (refresh) cliux.ux.action.stop(clColor.msg.error('Error'))
			})
			if (token) tokenData = token?.data
			if (refresh) cliux.ux.action.stop()
		}

		if (!tokenData?.access_token) this.error('Unable to refresh application access token')

		opts.argv.push('--accessToken=' + String(tokenData.access_token))

	}

}

export default hook
