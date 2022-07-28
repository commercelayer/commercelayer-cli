
const IMPORTS_RESOURCE_TYPES: Array<string> = [
	'bundles',
	'coupons',
	'customer_subscriptions',
	'customers',
	'gift_cards',
	'orders',
	'prices',
	'sku_lists',
	'sku_list_items',
	'sku_options',
	'skus',
	'stock_items',
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
  requests_max_num_oauth: number;
  requests_max_secs_oauth:number;
  page_max_size: number;
  page_default_size: number;
}

type ApplicationConfig = {
	kinds: readonly string[];
	login_scopes: readonly string[];
}

type ImportsConfig = {
    max_size: number;
	statuses: readonly string[];
	types: readonly string[];
	max_queue_length: number;
}

type WebhooksConfig = {
	retry_number: number;
}

type CliConfig = {
	applications: readonly string[];
}

type Config = {
  api: ApiConfig;
  application: ApplicationConfig;
  imports: ImportsConfig;
  webhooks: WebhooksConfig;
  cli: CliConfig;
}


const config: Config = {
	api: {
		default_domain: 'commercelayer.io',
		token_expiration_mins: 60 * 2,
		token_encoding_algorithm: 'HS512',
		requests_max_num_burst: 50,
		requests_max_secs_burst: 10,
		requests_max_num_avg: 150,
		requests_max_secs_avg: 60,	// 1 min
		requests_max_num_oauth: 15,
		requests_max_secs_oauth: 60,
		page_max_size: 25,
		page_default_size: 10,
	},
	application: {
		kinds: ['integration', 'sales_channel', 'webapp'],
		login_scopes: ['market', 'stock_location'],
	},
	imports: {
		max_size: 2000,
		statuses: IMPORTS_STATUSES,
		types: IMPORTS_RESOURCE_TYPES,
		max_queue_length: 10,
	},
	webhooks: {
		retry_number: 5,
	},
	cli: {
		applications: ['integration', 'sales_channel'],
	}
} as const


export default config
