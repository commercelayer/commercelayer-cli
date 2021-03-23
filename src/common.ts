
import _ from 'lodash'

const baseURL = (slug: string, domain: string | undefined): string => {
	return `https://${slug.toLowerCase()}.${domain ? domain : 'commercelayer.io'}`
}

const execMode = (liveFlag: string | boolean | undefined): string => {
	return liveFlag ? 'live' : 'test'
}

const appKey = (slug: string, domain: string | undefined): string => {
	return String(domain ? _.kebabCase(`${slug}.${domain}`) : slug).toLowerCase()
}

export { baseURL, execMode, appKey }
