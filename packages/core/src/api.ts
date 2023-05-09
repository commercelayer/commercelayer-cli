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


const CACHABLE_RESOURCES = [
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


export const isCachable = (resource: string): boolean => {
	return (resource !== undefined) && CACHABLE_RESOURCES.includes(resource)
}
