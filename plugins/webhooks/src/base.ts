/* eslint-disable unicorn/prefer-module */
import { Command, Flags, CliUx } from '@oclif/core'
import commercelayer, { CommerceLayerClient, CommerceLayerStatic } from '@commercelayer/sdk'
import { clOutput, clUpdate, clColor } from '@commercelayer/cli-core'
import { CommandError, OutputFlags } from '@oclif/core/lib/interfaces'


const pkg = require('../package.json')


export default abstract class extends Command {

	static flags = {
		organization: Flags.string({
			char: 'o',
			description: 'the slug of your organization',
			required: true,
			env: 'CL_CLI_ORGANIZATION',
		}),
		domain: Flags.string({
			char: 'd',
			required: false,
			hidden: true,
			dependsOn: ['organization'],
			env: 'CL_CLI_DOMAIN',
		}),
		accessToken: Flags.string({
			hidden: true,
			required: true,
			env: 'CL_CLI_ACCESS_TOKEN',
		}),
	}


	static args = [
    { name: 'id', description: 'unique id of the webhook', required: true, hidden: false },
  ]


	// INIT (override)
	async init(): Promise<any> {
    clUpdate.checkUpdate(pkg)
		return super.init()
	}


	protected handleError(error: CommandError, flags?: OutputFlags<any>, id?: string): void {
		if (CommerceLayerStatic.isApiError(error)) {
			if (error.status === 401) {
				const err = error.first()
				this.error(clColor.bg.red(`${err.title}:  ${err.detail}`),
					{ suggestions: ['Execute login to get access to the organization\'s webhooks'] },
				)
      } else
      if (error.status === 404) {
        this.error(`Unable to find webhook${id ? ` with id ${clColor.msg.error(id)}` : ''}`)
			} else this.error(clOutput.formatError(error, flags))
		} else throw error
	}


	protected commercelayerInit(flags: OutputFlags<any>): CommerceLayerClient {

		const organization = flags.organization
		const domain = flags.domain
		const accessToken = flags.accessToken

		return commercelayer({
			organization,
			domain,
			accessToken,
		})

	}

}


export { Flags, CliUx }
