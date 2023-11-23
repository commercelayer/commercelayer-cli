import { clColor, clCommand, clToken } from '@commercelayer/cli-core'
import type { Hook } from '@oclif/core'



const applicationsCheck = {
	resources: 		['integration', 'sales_channel'],
	seeder: 		['integration'],
	imports: 		['integration'],
	webhooks: 		['integration'],
	orders: 		['integration', 'sales_channel'],
	checkout: 		['sales_channel'],
	triggers: 		['integration', 'sales_chasnnel'],
	token: 			['integration'],
	microstore: 	['sales_channel'],
	exports:		['integrtation'],
	cleanups: 		['integration'],
	tags: 			['integration', 'sales_channel'],
	provisioning: 	['user']
}



const hook: Hook<'prerun'> = async function (opts) {

  // Only for test purpouses to avoid an error of undefined object
  if (!opts.Command || !opts.argv) return

  const accessToken = clCommand.findLongStringFlag(opts.argv, 'accessToken')

  if (accessToken) {

	const tokenInfo = clToken.decodeAccessToken(accessToken.value)

	const appKind = tokenInfo.application.kind
	const plugin = opts.Command.id.split(':')[0]
	const enabledApps = applicationsCheck[plugin as keyof typeof applicationsCheck]

	if (!enabledApps.includes(appKind))
		this.error(`Wrong application kind: ${clColor.msg.error(appKind)}. Only these kinds of applications are enabled to use the ${clColor.cli.plugin(plugin)} plugin: ${enabledApps.map(a => clColor.yellowBright(a)).join(', ')}`)

  }

}



export default hook
