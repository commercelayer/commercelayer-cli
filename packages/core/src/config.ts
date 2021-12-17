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


type ApiConfig = {
  default_domain: string;
  default_token_expiration_mins: number;
  token_encoding_algorithm: string;
  requests_max_num_burst: number;
  requests_max_secs_burst: number;
  requests_max_num_avg: number;
  requests_max_secs_avg: number;
  page_max_size: number;
  page_default_size: number;
}

type ImportsConfig = {
    max_size: number;
		statuses: string[];
		types: string[];
}

type Config = {
  api: ApiConfig;
  imports: ImportsConfig;
}


const config: Config = {
	api: {
		default_domain: 'commercelayer.io',
		default_token_expiration_mins: 60 * 2,
		token_encoding_algorithm: 'HS512',
		requests_max_num_burst: 50,
		requests_max_secs_burst: 10,
		requests_max_num_avg: 600,
		requests_max_secs_avg: 5 * 60,	// 5 min
		page_max_size: 25,
		page_default_size: 10,
	},
	imports: {
    max_size: 2000,
		statuses: IMPORTS_STATUSES,
		types: IMPORTS_RESOURCE_TYPES,
	}
} as const


export default config
