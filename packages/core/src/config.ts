const JOB_STATUSES: string[] = [
	'in_progress',
	'pending',
	'completed',
	'interrupted',
]

const IMPORT_RESOURCE_TYPES: string[] = [
	'addresses',
	'bundles',
	'coupons',
	'customer_subscriptions',
	'customers',
	'gift_cards',
	'line_items',
	'orders',
	'price_tiers',
	'prices',
	'shipping_categories',
	'sku_lists',
	'sku_list_items',
	'sku_options',
	'skus',
	'stock_items',
	'tax_categories',
]


const EXPORT_RESOURCE_TYPES: string[] = [
	'addresses',
	'bundles',
	'coupons',
	'customer_subscriptions',
	'customers',
	'gift_cards',
	'line_items',
	'orders',
	'payment_methods',
	'price_tiers',
	'prices',
	'shipments',
	'shipping_categories',
	'shipping_methods',
	'sku_lists',
	'sku_list_items',
	'sku_options',
	'skus',
	'stock_items',
	'tax_categories',
	'transactions',
	'authorizations',
	'captures',
	'voids',
	'refunds'
]


type ApiConfig = {
  default_domain: string;
  default_app_domain: string;
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

type ExportsConfig = {
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
  exports: ExportsConfig;
  webhooks: WebhooksConfig;
  cli: CliConfig;
}


const config: Config = {
	api: {
		default_domain: 'commercelayer.io',
		default_app_domain: 'commercelayer.app',
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
		statuses: JOB_STATUSES,
		types: IMPORT_RESOURCE_TYPES,
		max_queue_length: 10,
	},
	exports: {
		max_size: 10000,
		statuses: JOB_STATUSES,
		types: EXPORT_RESOURCE_TYPES,
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
