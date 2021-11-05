import { Hook } from '@oclif/config'
import { parse } from '@oclif/parser'
import { flags as flagUtil } from '@oclif/command'
import { tokenFileExists, readTokenFile, AppKey, ConfigParams, configParam, readConfigFile, configFileExists } from '../../config'
import { execMode, appKey, appKeyValid } from '../../common'
import { newAccessToken, isAccessTokenExpiring, revokeAccessToken } from '../../commands/applications/token'
import cliux from 'cli-ux'
import chalk from 'chalk'


const excludedTopics: string[] = ['applications', 'plugins', 'config', 'util']
const exludedCommands: string[] = ['resources:filters', 'resources:doc', 'resources', 'applications']


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
	if (!opts.Command.flags?.accessToken) return                        // require an accessToken as input flag
	if (opts.argv.some(arg => arg.startsWith('--accessToken'))) return  // will not receive the accessToken flag from command line


	const flagConfig = {
		organization: flagUtil.string({ char: 'o', hidden: true }),
		live: flagUtil.boolean({ hidden: true/* , dependsOn: ['organization'] */ }),
		domain: flagUtil.string({ char: 'd', hidden: true, dependsOn: ['organization'] }),
		accessToken: flagUtil.string({ hidden: true }),
		id: flagUtil.string({ char: 'k', hidden: true, dependsOn: ['organization'] }),
	}

	const { flags } = parse(opts.argv, { strict: false, flags: flagConfig })

	const app: AppKey = {
		key: appKey(flags.organization || '', flags.domain),
		mode: execMode(flags.live),
		id: flags.id || '',
	}

	let configData

	// No organization and domain passed on command line, looking for saved current application
	if (!appKeyValid(app)) {

		const current = configParam(ConfigParams.currentApplication)
		if (current !== undefined) {

			Object.assign(app, current)
			configData = readConfigFile(this.config, app)

			const typeCheck = configParam(ConfigParams.applicationTypeCheck)
			if (typeCheck) {
				if (!typeCheck.includes(configData.kind))
					this.error(`The current application (${chalk.redBright(configData.key)}) has an invalid type: ${chalk.red.italic(configData.kind)}, while the only accepted type are ${chalk.green.italic(typeCheck.join(','))}\nPlease use a correct one or access the online dashboard of ${configData.organization} and create a new valid application`)
			}

			opts.argv.push('--organization=' + configData.slug)
			if (configData.domain) opts.argv.push('--domain=' + configData.domain)

		}

	} else if (!configFileExists(this.config, app)) this.error(`Unable to find ${chalk.italic.bold(app.mode)} configuration file for application ${chalk.italic.bold(app.key)}`)

	// No current application saved in configuration
	if (!appKeyValid(app)) return


	// if accessToken flag has not ben passed in command line
	if (!flags.accessToken) {

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

	// If command requires clientId and clientSecret add them to the command line arguments
	if (opts.Command.flags?.clientId && configData?.clientId) opts.argv.push('--clientId=' + configData?.clientId)
	if (opts.Command.flags?.clientSecret && configData?.clientSecret) opts.argv.push('--clientSecret=' + configData?.clientSecret)

	// If present remove --live flag option
	if (opts.argv.includes('--live')) opts.argv.splice(opts.argv.indexOf('--live'), 1)

	// If present remove application id flag option
	if (opts.argv.includes('--id')) opts.argv.splice(opts.argv.indexOf('--id'), 2)

}

export default hook
