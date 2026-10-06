/**
 * The base command of the CLI plugins that call the Core API: the flags the
 * CLI fills in from the current application, the plugin update check, the
 * application kind check, the SDK client options and the common API errors.
 *
 * Plugins extend it with their own base command; whatever is specific to a
 * plugin stays there. It doesn't depend on the SDK: the plugin creates the
 * client from clientOptions().
 */
import { Command, Flags, type Interfaces } from '@oclif/core'
import * as clApi from './api'
import * as clColor from './color'
import { apiVersionFlag } from './command'
import * as clOutput from './output'
import * as clToken from './token'
import * as clUpdate from './update'
import * as clUtil from './util'


type CommandError = Interfaces.CommandError

/** What a plugin may change of the base flags */
export type BaseFlagOptions = {
	char?: Interfaces.AlphabetLowercase | Interfaces.AlphabetUppercase
	description?: string
	hidden?: boolean
	dependsOn?: string[]
}


/** The organization slug, filled in by the CLI from the current application (or CL_CLI_ORGANIZATION) */
export const organizationFlag = (options: BaseFlagOptions = {}) => Flags.string({
	char: 'o',
	description: 'the slug of your organization',
	required: true,
	env: 'CL_CLI_ORGANIZATION',
	hidden: true,
	...options,
})

/** The API domain, filled in by the CLI from the current application (or CL_CLI_DOMAIN) */
export const domainFlag = (options: BaseFlagOptions = {}) => Flags.string({
	char: 'd',
	required: false,
	hidden: true,
	dependsOn: ['organization'],
	env: 'CL_CLI_DOMAIN',
	...options,
})

/** The access token, filled in by the CLI from the current application (or CL_CLI_ACCESS_TOKEN) */
export const accessTokenFlag = (options: BaseFlagOptions = {}) => Flags.string({
	hidden: true,
	required: true,
	env: 'CL_CLI_ACCESS_TOKEN',
	...options,
})


/** The options of a Core API client (SDK), from the command flags: V is the SDK's ApiVersion */
export type ClientOptions<V extends string = string> = {
	apiVersion: V
	organization: string
	domain?: string
	accessToken: string
	userAgent: string
}

/** What handleApiError needs of an SDK ApiError */
export type ApiErrorLike = {
	status?: number
	errors?: unknown
	first: () => { title?: string; detail?: string } | undefined
}

export type ApiErrorOptions = {
	/** The resource type in the messages (e.g. 'tag'): the 404 message names it, the 401 suggestion uses its plural */
	resource?: string
	/** The ID of the resource the request was about, for the 404 message */
	id?: string
	/** How the ID is called in the 404 message (default: 'id') */
	idLabel?: string
	/** The command flags, for the output format of the other errors */
	flags?: any
}


const QUIET_FLAGS = ['--blind', '--silent', '--quiet']


export abstract class CLCommand extends Command {

	static baseFlags = {
		organization: organizationFlag(),
		domain: domainFlag(),
		accessToken: accessTokenFlag(),
		'api-version': apiVersionFlag(),
	}

	/** The application kinds the commands accept, checked on the access token before they run (all when undefined) */
	static applicationKinds?: readonly string[]


	async init(): Promise<any> {

		// Check for plugin updates, only in visible mode
		const pjson = this.ctor.plugin?.pjson
		if (pjson && !this.argv.some(a => QUIET_FLAGS.includes(a))) clUpdate.checkUpdate(pjson as unknown as clUpdate.Package)

		// Application kind check, on the access token the CLI passes
		const kinds = (this.ctor as typeof CLCommand).applicationKinds
		const atFlag = this.argv.find(a => a.startsWith('--accessToken='))
		if (kinds && atFlag) this.checkApplication(atFlag.substring(atFlag.indexOf('=') + 1), kinds)

		return await super.init()

	}


	async catch(error: CommandError): Promise<any> {
		// The user quit an interactive prompt
		if (error.message?.includes('quit')) this.exit()
		else return await super.catch(error)
	}


	/** Checks that the access token belongs to an application of one of the given kinds */
	protected checkApplication(accessToken: string, kinds: readonly string[]): boolean {

		let info: clToken.AccessTokenInfo
		try {
			info = clToken.decodeAccessToken(accessToken)
		} catch {
			this.error('Invalid access token provided')
		}

		if (!kinds.includes(info.application.kind))
			this.error(`Invalid application kind: ${clColor.msg.error(info.application.kind)}. Application kind must be one of the following: ${clColor.cyanBright(kinds.join(', '))}`)

		return true

	}


	/**
	 * The options of the Core API client: API version, organization, domain and
	 * access token from the flags, the CLI user agent. V is the SDK's ApiVersion
	 * (cli-core doesn't depend on the SDK): `commercelayer(this.clientOptions<ApiVersion>(flags))`.
	 * An undefined version (no default) makes the requests unversioned.
	 */
	protected clientOptions<V extends string = string>(flags: { organization?: string; domain?: string; accessToken?: string; 'api-version'?: string }): ClientOptions<V> {
		return {
			apiVersion: clApi.apiVersion(flags) as V,
			organization: flags.organization || '',
			domain: flags.domain,
			accessToken: flags.accessToken || '',
			userAgent: clUtil.userAgent(this.config),
		}
	}


	/**
	 * Stops with the message of a Core API error: an unauthorized request
	 * suggests to log in, a missing resource names it, any other error is
	 * printed as the API returned it.
	 */
	protected handleApiError(error: ApiErrorLike, { resource, id, idLabel = 'id', flags }: ApiErrorOptions = {}): never {
		if (error.status === 401) {
			const err = error.first()
			this.error(clColor.msg.error(`${err?.title}:  ${err?.detail}`), {
				suggestions: [`Execute login to get access to the organization's ${resource ? `${resource}s` : 'resources'}`],
			})
		}
		if ((error.status === 404) && resource) this.error(`Unable to find ${resource}${id ? ` with ${idLabel} ${clColor.msg.error(id)}` : ''}`)
		this.error(clOutput.formatError(error, flags))
	}

}
