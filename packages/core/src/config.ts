const APPLICATION_KINDS = ['integration', 'sales_channel', 'webapp']

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
  token_expiration_mins: number;
  token_encoding_algorithm: string;
  requests_max_num_burst: number;
  requests_max_secs_burst: number;
  requests_max_num_avg: number;
  requests_max_secs_avg: number;
  page_max_size: number;
  page_default_size: number;
}

type ApplicationConfig = {
	kinds: string[];
}

type ImportsConfig = {
    max_size: number;
	statuses: string[];
	types: string[];
	max_queue_length: number;
}

type WebhooksConfig = {
	retry_number: number;
}

type Config = {
  api: ApiConfig;
  application: ApplicationConfig;
  imports: ImportsConfig;
  webhooks: WebhooksConfig;
}


const config: Config = {
	api: {
		default_domain: 'commercelayer.io',
		token_expiration_mins: 60 * 2,
		token_encoding_algorithm: 'HS512',
		requests_max_num_burst: 50,
		requests_max_secs_burst: 10,
		requests_max_num_avg: 600,
		requests_max_secs_avg: 5 * 60,	// 5 min
		page_max_size: 25,
		page_default_size: 10,
	},
	application: {
		kinds: APPLICATION_KINDS,
	},
	imports: {
		max_size: 2000,
		statuses: IMPORTS_STATUSES,
		types: IMPORTS_RESOURCE_TYPES,
		max_queue_length: 10,
	},
	webhooks: {
		retry_number: 5,
	}
} as const


export default config
