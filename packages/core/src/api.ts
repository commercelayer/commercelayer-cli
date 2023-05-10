
import config from './config'

type ApiMode = 'test' | 'live'
export type { ApiMode }


/** Build base URL */
const baseURL = (slug: string, domain: string | undefined): string => {
	return `https://${slug.toLowerCase()}.${domain || config.api.default_domain}`
}


/** Extract domain name from URL */
const extractDomain = (baseUrl: string): string | undefined => {
	if (!baseUrl) return undefined
	return baseUrl.substring(baseUrl.indexOf('.') + 1)
}


/** Decode API execution mode */
const execMode = (liveFlag: string | boolean | undefined): ApiMode => {
	return ((liveFlag === true) || (liveFlag === 'live')) ? 'live' : 'test'
}


const humanizeResource = (type: string): string => {
	return type.replace(/_/g, ' ')
}


export { baseURL, extractDomain, execMode, humanizeResource }


const CACHEABLE_RESOURCES = [
	'bundles',
	'imports',
	'markets',
	'prices',
	'price_lists',
	'promotions',
	'external_promotions',
	'fixed_amount_promotions',
	'fixed_price_promotions',
	'free_gift_promotions',
	'free_shipping_promotions',
	'percentage_discount_promotions',
	'skus',
	'sku_options',
	'stock_items',
	'stock_locations'
]


export const isResourceCacheable = (resource?: string): boolean => {
	return (resource !== undefined) && CACHEABLE_RESOURCES.includes(resource)
}

// Note: times in milliseconds
export type DelayOptions = {
	environment?: ApiMode;
	parallelRequests: number;
	totalRequests?: number;
	minimumDelay?: number;
	securityDelay?: number;
	resourceType?: string;
}


export const requestRateLimitDelay = (options: DelayOptions = {
	environment: 'test',
	parallelRequests: 1,
	minimumDelay: 0,
	securityDelay: 0
}): number => {

	let requestsMaxNumBurst = config.api.requests_max_num_burst
	let requestsMaxNumAvg = config.api.requests_max_num_avg

	// Test env allows half numbner of requests than live
	if (options.environment !== 'live') {
		requestsMaxNumBurst = Math.floor(requestsMaxNumBurst / config.api.requests_max_num_env_ratio)
		requestsMaxNumAvg = Math.floor(requestsMaxNumAvg / config.api.requests_max_num_env_ratio)
	}

	// If the resource is cacheable the number of requests can be five times that of the standard resources
	if (isResourceCacheable(options.resourceType)) {
		requestsMaxNumBurst = requestsMaxNumBurst * config.api.requests_max_num_cache_ratio
		requestsMaxNumAvg = requestsMaxNumAvg * config.api.requests_max_num_cache_ratio
	}

	const unitDelayBurst = config.api.requests_max_secs_burst / requestsMaxNumBurst
	const unitDelayAvg = config.api.requests_max_secs_avg / requestsMaxNumAvg

	const delayBurst = options.parallelRequests * unitDelayBurst
	const delayAvg = options.parallelRequests * unitDelayAvg

	// If the total number of requests is known the delay can be optimized
	const totalRequests = options.totalRequests
	let delay = 0
	if (totalRequests) {
		if (totalRequests > requestsMaxNumBurst) {
			if (totalRequests > requestsMaxNumAvg) delay = delayAvg
			else delay = delayBurst
		}
	} else delay = Math.max(delayBurst, delayAvg)

	// Msec delay
	delay = delay * 1000

	if (options.minimumDelay) delay = Math.max(options.minimumDelay, delay)
	if (options.securityDelay) delay += options.securityDelay

	delay = Math.ceil(delay)

	return delay

}
