
import type { Method } from 'axios'
import config from './config'

type ApiMode = 'test' | 'live'
type ApiType = 'core' | 'provisioning' | 'metrics'
export type { ApiMode, ApiType }


/** Build base URL */
const baseURL = (slug?: string, domain?: string, provisioning?: boolean): string => {
	const subdomain = provisioning? 'provisioning' : (slug || '')
	return `https://${subdomain.toLowerCase()}.${domain || config.api.default_domain}`
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


export const isResourceCacheable = (resource?: string, method?: Method): boolean => {
	return CACHEABLE_RESOURCES.includes(resource || '') && ((method || 'get').toLowerCase() === 'get')
}

// Note: times in milliseconds
export type DelayOptions = {
	environment?: ApiMode;
	parallelRequests?: number;
	totalRequests?: number;
	minimumDelay?: number;
	securityDelay?: number;
	resourceType?: string;
	method?: Method
}


export const liveEnvironment = (env: ApiMode): boolean => {
	return (env === 'live')
}


export const requestRateLimitDelay = (options?: DelayOptions): number => {

	const env = options?.environment || 'test'
	const parallelRequests = options?.parallelRequests || 1
	const resourceCacheable = isResourceCacheable(options?.resourceType, options?.method)

	let requestsMaxNumBurst = resourceCacheable ? config.api.requests_max_num_burst_cacheable : config.api.requests_max_num_burst
	let requestsMaxNumAvg = resourceCacheable? config.api.requests_max_num_avg_cacheable : config.api.requests_max_num_avg

	// Test env allows half number of requests than live
	if (env !== 'live') {
		requestsMaxNumBurst = resourceCacheable? config.api.requests_max_num_burst_test_cacheable : config.api.requests_max_num_burst_test
		requestsMaxNumAvg = resourceCacheable? config.api.requests_max_num_avg_test_cacheable : config.api.requests_max_num_avg_test
	}

	const unitDelayBurst = config.api.requests_max_secs_burst / requestsMaxNumBurst
	const unitDelayAvg = config.api.requests_max_secs_avg / requestsMaxNumAvg

	const delayBurst = parallelRequests * unitDelayBurst
	const delayAvg = parallelRequests * unitDelayAvg

	// If the total number of requests is known the delay can be optimized
	const totalRequests = options?.totalRequests
	let delay = 0
	if (totalRequests) {
		if (totalRequests > requestsMaxNumBurst) {
			if (totalRequests > requestsMaxNumAvg) delay = delayAvg
			else delay = delayBurst
		}
	} else delay = Math.max(delayBurst, delayAvg)

	// Msec delay
	delay = delay * 1000

	if (options?.minimumDelay) delay = Math.max(options.minimumDelay, delay)
	if (options?.securityDelay) delay += options.securityDelay

	delay = Math.ceil(delay)

	return delay

}
