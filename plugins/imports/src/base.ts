import Command, { flags } from '@oclif/command'
import chalk from 'chalk'
import { clOutput, clUpdate } from '@commercelayer/cli-core'
import commercelayer, { CommerceLayerClient, CommerceLayerStatic } from '@commercelayer/sdk'



const pkg = require('../package.json')


export default abstract class extends Command {

	static flags = {
		organization: flags.string({
			char: 'o',
			description: 'the slug of your organization',
			required: true,
			env: 'CL_CLI_ORGANIZATION',
			// default: 'cli-test-org',
		}),
		domain: flags.string({
			char: 'd',
			required: false,
			hidden: true,
			dependsOn: ['organization'],
			env: 'CL_CLI_DOMAIN',
			// default: 'preprod.commercelayer.dev',
		}),
		accessToken: flags.string({
			hidden: true,
			required: true,
			env: 'CL_CLI_ACCESS_TOKEN',
		}),
	}


	static args = [
		{ name: 'fake-arg', description: 'fake argument', required: false, hidden: true },
	]


	// INIT (override)
	async init() {
    clUpdate.checkUpdate(pkg)
		return super.init()
	}


	async catch(error: any) {
		if (error.message && error.message.match(/quit/)) this.exit()
		else return super.catch(error)
	}


	protected handleError(error: any, flags?: any): void {
		if (CommerceLayerStatic.isApiError(error)) {
			if (error.status === 401) {
				const err = error.first()
				this.error(chalk.bgRed(`${err.title}:  ${err.detail}`),
					{ suggestions: ['Execute login to get access to the organization\'s imports'] }
				)
			} else this.error(clOutput.formatOutput(error, flags))
		} else throw error
	}


	protected specialFolder(filePath: string): string {
		// Special directory (home / desktop)
		const root = filePath.toLowerCase().split('/')[0]
		if (['desktop', 'home'].includes(root)) {
			let filePrefix = this.config.home
			if (root === 'desktop') filePrefix += '/Desktop'
			filePath = filePath.replace(root, filePrefix)
		}
		return filePath
	}


	protected importStatus(status?: string): string {
		if (!status) return ''
		switch (status.toLowerCase()) {
			case 'completed': return chalk.greenBright(status)
			case 'interrupted': return chalk.redBright(status)
			case 'pending':
			case 'in_progress':
			default: return status
		}
	}


	protected commercelayerInit(flags: any): CommerceLayerClient {

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


export { flags }
