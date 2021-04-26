import { Hook } from '@oclif/config'
import { parse } from '@oclif/parser'
import { flags as flagUtil } from '@oclif/command'
import { tokenFileExists, readTokenFile, AppKey, ConfigParams, configParam, readConfigFile } from '../../config'
import { execMode, appKey } from '../../common'
import { newAccessToken, isAccessTokenExpiring, revokeAccessToken } from '../../commands/applications/token'
import cliux from 'cli-ux'


const excludedTopics: string[] = ['applications', 'plugins']
const exludedCommands: string[] = ['resources:filters', 'resources:doc', 'resources:available']


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

  if (app.key === '') {
    const current = configParam(ConfigParams.currentApplication)
    if (current !== undefined) {
      Object.assign(app, current)
      opts.argv.push('--organization=' + current.key)
    }
  }

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
        await revokeAccessToken(readConfigFile(this.config, app), tokenData.access_token)
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
