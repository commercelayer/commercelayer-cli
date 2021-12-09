
const IMPORTS_RESOURCE_TYPES: Array<string> = [
	'orders',
	'coupons',
	'skus',
  'sku_lists',
  'sku_list_items',
	'prices',
	'stock_items',
	'gift_cards',
	'customers',
	'customer_subscriptions',
	'tax_categories',
]


const IMPORTS_STATUSES: Array<string> = [
	'in_progress',
	'pending',
	'completed',
	'interrupted',
]


export default {
	imports_max_size: 2000,
	imports_statuses: IMPORTS_STATUSES,
	imports_types: IMPORTS_RESOURCE_TYPES,
	requests_max_num_burst: 50,
	requests_max_secs_burst: 10,
	requests_max_num_avg: 600,
	requests_max_secs_avg: 5 * 60,	// 5 min
	page_max_size: 25,
	page_default_size: 10,
}
