// Generated from the OpenAPI schema (gen.config.ts): the types the API accepts
import { CLEANUP_RESOURCE_TYPES, EXPORT_RESOURCE_TYPES, IMPORT_RESOURCE_TYPES, LINK_RESOURCE_TYPES, TAG_RESOURCE_TYPES } from './resource-types'

const JOB_STATUSES: readonly string[] = [
	'in_progress',
	'pending',
	'completed',
	'interrupted'
] as const


type ApiConfig = {
	default_domain: string
	/** Core API version used when none is given ('' would make the requests unversioned, /api/…) */
	default_api_version: string
	default_app_domain: string
	default_stg_domain: string
	token_expiration_mins: number
	token_encoding_algorithm: string
	token_owner_types: string[]
	requests_max_num_burst: number
	requests_max_num_burst_cacheable: number
	requests_max_num_burst_test: number
	requests_max_num_burst_test_cacheable: number
	requests_max_secs_burst: number
	requests_max_num_avg: number
	requests_max_num_avg_cacheable: number
	requests_max_num_avg_test: number
	requests_max_num_avg_test_cacheable: number
	requests_max_secs_avg: number
	requests_max_num_oauth: number
	requests_max_secs_oauth: number
	page_max_size: number
	page_default_size: number
}

type ApplicationConfig = {
	kinds: readonly string[]
	login_scopes: readonly string[]
}

type ImportsConfig = {
	max_size: number
	statuses: readonly string[]
	types: readonly string[]
	max_queue_length: number
	attachment_expiration: number
}

type ExportsConfig = {
	max_size: number
	statuses: readonly string[]
	types: readonly string[]
	max_queue_length: number
	attachment_expiration: number
}

type CleanupsConfig = {
	max_size: number
	statuses: readonly string[]
	types: readonly string[]
	max_queue_length: number
}

type WebhooksConfig = {
	retry_number: number
}

type CliConfig = {
	applications: readonly string[]
}

type DocConfig = {
	core: string
	core_api_reference: string
	core_how_tos: string
	core_raste_limits: string
	core_filtering_data: string
	metrics: string
	metrics_api_reference: string
	provisioning: string
	provisioning_api_reference: string
	imports_resources: string
	exports_resources: string
	cleanups_resources: string
	webhooks_events: string
	tags_resources: string
	links_resources: string
}

type TagsConfig = {
	max_resource_tags: number
	taggable_resources: readonly string[]
	tag_name_max_length: number
	tag_name_pattern: RegExp
}

type ProvisioningConfig = {
	default_subdomain: string
	scope: string
	applications: readonly string[]
}

type MetricsConfig = {
	default_path: string
	scope: string
	applications: readonly string[]
}

type LinksConfig = {
	default_domain: string,
	linkable_resources: readonly string[]
}

type Config = {
	api: ApiConfig
	application: ApplicationConfig
	imports: ImportsConfig
	exports: ExportsConfig
	cleanups: CleanupsConfig
	webhooks: WebhooksConfig
	cli: CliConfig
	doc: DocConfig
	tags: TagsConfig
	provisioning: ProvisioningConfig
	metrics: MetricsConfig
	links: LinksConfig
}


const RATE_LIMIT = {
	// Authentication
	erl_oauth_limit_live: 30,
	// Cacheable
	erl_average_limit_cachable_live: 1000,
	erl_average_limit_cachable_test: 500,
	erl_burst_limit_cachable_live: 250,
	erl_burst_limit_cachable_test: 125,
	// Uncacheable
	erl_average_limit_uncachable_live: 200,
	erl_average_limit_uncachable_test: 100,
	erl_burst_limit_uncachable_live: 50,
	erl_burst_limit_uncachable_test: 25
} as const

const config: Config = {
	api: {	// CORE
		default_domain: 'commercelayer.io',
		default_api_version: '2026-05',
		default_app_domain: 'commercelayer.app',
		default_stg_domain: 'commercelayer.co',
		token_expiration_mins: 60 * 4,	// 4 hours (14400 secs)
		token_encoding_algorithm: 'HS512',
		token_owner_types: ['Customer', 'User'] as const,
		requests_max_num_burst: RATE_LIMIT.erl_burst_limit_uncachable_live,					// 50
		requests_max_num_burst_cacheable: RATE_LIMIT.erl_burst_limit_cachable_live,			// 250
		requests_max_num_burst_test: RATE_LIMIT.erl_burst_limit_uncachable_test,			// 25
		requests_max_num_burst_test_cacheable: RATE_LIMIT.erl_burst_limit_cachable_test,	// 125
		requests_max_num_avg: RATE_LIMIT.erl_average_limit_uncachable_live,					// 200
		requests_max_num_avg_cacheable: RATE_LIMIT.erl_average_limit_cachable_live ,		// 1000
		requests_max_num_avg_test: RATE_LIMIT.erl_average_limit_uncachable_test,			// 100
		requests_max_num_avg_test_cacheable: RATE_LIMIT.erl_average_limit_cachable_test,	// 500
		requests_max_num_oauth: RATE_LIMIT.erl_oauth_limit_live,							// 30
		requests_max_secs_burst: 10,
		requests_max_secs_oauth: 60,
		requests_max_secs_avg: 60,
		page_max_size: 25,
		page_default_size: 10
	},
	application: {
		kinds: [
			'dashboard',
			'user',
			'metrics',
			'contentful',
			'bundles',
			'customers',
			'datocms',
			'exports',
			'external',
			'gift_cards',
			'imports',
			'integration',
			'inventory',
			'orders',
			'price_lists',
			'promotions',
			'resources',
			'returns',
			'sales_channel',
			'sanity',
			'shipments',
			'skus',
			'sku_lists',
			'stock_transfers',
			'subscriptions',
			'tags',
			'webapp',
			'webhooks',
			'zapier'
		],
		login_scopes: ['market', 'stock_location', 'store']
	},
	imports: {
		max_size: 10_000,
		statuses: JOB_STATUSES,
		types: IMPORT_RESOURCE_TYPES,
		max_queue_length: 10,
		attachment_expiration: 5
	},
	exports: {
		max_size: 5_000,	// 10_000, --> https://github.com/commercelayer/support/issues/777
		statuses: JOB_STATUSES,
		types: EXPORT_RESOURCE_TYPES,
		max_queue_length: 10,
		attachment_expiration: 5
	},
	cleanups: {
		max_size: 10_000,
		statuses: JOB_STATUSES,
		types: CLEANUP_RESOURCE_TYPES,
		max_queue_length: 10
	},
	webhooks: {
		retry_number: 5
	},
	cli: {	// Including Provisioning
		applications: ['integration', 'sales_channel', 'user']
	},
	doc: {
		core: 'https://docs.commercelayer.io/core/',
		core_api_reference: 'https://docs.commercelayer.io/developers/v/api-reference',
		core_how_tos: 'https://docs.commercelayer.io/core/v/how-tos/',
		core_raste_limits: 'https://docs.commercelayer.io/core/rate-limits',
		core_filtering_data: 'https://docs.commercelayer.io/core/filtering-data#list-of-predicates',
		metrics: 'https://docs.commercelayer.io/metrics/',
		metrics_api_reference: 'https://docs.commercelayer.io/metrics/v/api-reference-m/',
		provisioning: 'https://docs.commercelayer.io/provisioning/',
		provisioning_api_reference: 'https://docs.commercelayer.io/provisioning/v/api-reference-p/',
		imports_resources: 'https://docs.commercelayer.io/api/importing-resources#supported-resources',
		exports_resources: 'https://docs.commercelayer.io/core/exporting-resources#supported-resources',
		cleanups_resources: 'https://docs.commercelayer.io/core/cleaning-resources#supported-resources',
		webhooks_events: 'https://docs.commercelayer.io/api/real-time-webhooks#supported-events',
		tags_resources: 'https://docs.commercelayer.io/core/v/api-reference/tags#taggable-resources',
		links_resources: 'https://docs.commercelayer.io/core/v/api-reference/links'
	},
	tags: {
		max_resource_tags: 10,
		taggable_resources: TAG_RESOURCE_TYPES,
		tag_name_max_length: 25,
		tag_name_pattern: /^[0-9A-Za-z_-]{1,25}$/
	},
	provisioning: {
		default_subdomain: 'provisioning',
		scope: 'provisioning-api',
		applications: ['user']
	},
	metrics: {
		default_path: 'metrics',
		scope: 'metrics-api',
		applications: ['integration', 'webapp']
	},
	links: {
		default_domain: 'c11r.link',
		linkable_resources: LINK_RESOURCE_TYPES
	}
} as const


export default config
