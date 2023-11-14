import type { Config } from "@oclif/core/lib/interfaces"


const userAgent = (config: Config): string => {
	return `${config.name.replace(/@commercelayer\/cli-plugin/, 'CLI')}/${config.version}`
}


export { userAgent }
