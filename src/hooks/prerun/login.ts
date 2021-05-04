import { Hook } from '@oclif/config'
import { parse } from '@oclif/parser'
import { flags as flagUtil } from '@oclif/command'
import { tokenFileExists, readTokenFile, AppKey, ConfigParams, configParam, readConfigFile, configFileExists, SUPER_USER_MODE } from '../../config'
import { execMode, appKey, extractDomain } from '../../common'
import { newAccessToken, isAccessTokenExpiring, revokeAccessToken } from '../../commands/applications/token'
import cliux from 'cli-ux'
import chalk from 'chalk'


const excludedTopics: string[] = ['applications', 'plugins', 'config']
const exludedCommands: string[] = ['resources:filters', 'resources:doc', 'resources', 'applications']


const isCommandExcluded = (cmd: string): boolean => {
  if (exludedCommands.includes(cmd)) return true
  const comPos = cmd.indexOf(':')
  return (comPos >= 0) && excludedTopics.includes(cmd.substring(0, comPos))
}


const hook: Hook<'prerun'> = async function (opts) {

  // Continue and check authentication only for command that:
  if (isCommandExcluded(opts.Command.id)) return                      // are not explicitly excluded from check
  if (!opts.Command.flags?.accessToken) return                        // require an accessToken as input flag
  if (opts.argv.some(arg => arg.startsWith('--accessToken'))) return  // will not receive the accessToken flag from command line


  const flagConfig = {
    organization: flagUtil.string({ char: 'o', hidden: true }),
    live: flagUtil.boolean({ hidden: true }),
    domain: flagUtil.string({ char: 'd', hidden: true }),
    accessToken: flagUtil.string({ hidden: true }),
  }

  const { flags } = parse(opts.argv, { strict: false, flags: flagConfig })

  const app: AppKey = {
    key: appKey(flags.organization || '', flags.domain),
    mode: execMode(flags.live),
  }

  let configData

  // No organization and domain passed on command line, looking for saved current application
  if (app.key === '') {

    const current = configParam(ConfigParams.currentApplication)
    if (current !== undefined) {

      Object.assign(app, current)
      configData = readConfigFile(this.config, app)

      if ((configData.type !== 'cli') && (process.env.CL_CLI_MODE !== SUPER_USER_MODE))
        this.error(`The current application (${chalk.redBright(configData.key)}) is not a CLI application\nPlease use a correct one or access the online dashboard of ${configData.organization} and create a new CLI application`)

      opts.argv.push('--organization=' + configData.slug)
      opts.argv.push('--domain=' + extractDomain(configData.baseUrl))

    }

  } else
    if (!configFileExists(this.config, app))
      this.error(`Unable to find ${chalk.italic.bold(app.mode)} configuration file for application ${chalk.italic.bold(app.key)}`)

  // No current application saved in configuration
  if (app.key === '') return


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

}

export default hook
