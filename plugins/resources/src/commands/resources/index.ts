import { Command, flags } from '@oclif/command'
import chalk from 'chalk'
import cliux from 'cli-ux'


export default class ResourcesIndex extends Command {

	static description = 'list all the available Commerce Layer API resources'

	static examples = [
		'$ cl-resources resources',
		'$ cl-res resources',
		'$ commercelayer resources',
		'$ cl resources',
	]

	static flags = {
		help: flags.help({ char: 'h' }),
	}

	static args = []

	async run() {

		this.parse(ResourcesIndex)

		this.log(chalk.blueBright('\n-= Commerce Layer API available resources =-\n'))

		const resourceArray = resourceList('api').map(r => {
			return { name: r, url: `https://docs.commercelayer.io/api/resources/${r}` }
		})

		cliux.table(resourceArray,
			{
				key: { header: 'NAME', minWidth: 35, get: row => chalk.blueBright(row.name) },
				description: { header: 'ONLINE DOCUMENTATION URL\n', get: row => row.url },
			},
			{
				printLine: this.log,
			})
		this.log()

	}


	async catch(error: any) {
		if ((error.code === 'EEXIT') && (error.message === 'EEXIT: 0')) return
		return super.catch(error)
	}


}


const resources: Resource[] = [
	{ name: 'address', api: 'addresses', sdk: 'Address' },
	{ name: 'adjustment', api: 'adjustments', sdk: 'Adjustment' },
	{ name: 'adyen_gateway', api: 'adyen_gateways', sdk: 'AdyenGateway' },
	{ name: 'adyen_payment', api: 'adyen_payments', sdk: 'AdyenPayment' },
	{ name: 'application', api: 'applications', sdk: 'Application' },
	{ name: 'attachable', api: 'attachables', sdk: 'Attachable' },
	{ name: 'attachment', api: 'attachments', sdk: 'Attachment' },
	{ name: 'authorization', api: 'authorizations', sdk: 'Authorization' },
	{ name: 'avalara_account', api: 'avalara_accounts', sdk: 'AvalaraAccount' },
	{ name: 'billing_info_validation_rule', api: 'billing_info_validation_rules', sdk: 'BillingInfoValidationRule' },
	{ name: 'braintree_gateway', api: 'braintree_gateways', sdk: 'BraintreeGateway' },
	{ name: 'braintree_payment', api: 'braintree_payments', sdk: 'BraintreePayment' },
	{ name: 'capture', api: 'captures', sdk: 'Capture' },
	{ name: 'carrier_account', api: 'carrier_accounts', sdk: 'CarrierAccount' },
	{ name: 'coupon', api: 'coupons', sdk: 'Coupon' },
	{ name: 'coupon_codes_promotion_rule', api: 'coupon_codes_promotion_rules', sdk: 'CouponCodesPromotionRule' },
	{ name: 'customer', api: 'customers', sdk: 'Customer' },
	{ name: 'customer_address', api: 'customer_addresses', sdk: 'CustomerAddress' },
	{ name: 'customer_group', api: 'customer_groups', sdk: 'CustomerGroup' },
	{ name: 'customer_password_reset', api: 'customer_password_resets', sdk: 'CustomerPasswordReset' },
	{ name: 'customer_payment_source', api: 'customer_payment_sources', sdk: 'CustomerPaymentSource' },
	{ name: 'customer_subscription', api: 'customer_subscriptions', sdk: 'CustomerSubscription' },
	{ name: 'delivery_lead_time', api: 'delivery_lead_times', sdk: 'DeliveryLeadTime' },
	{ name: 'external_gateway', api: 'external_gateways', sdk: 'ExternalGateway' },
	{ name: 'external_payment', api: 'external_payments', sdk: 'ExternalPayment' },
	{ name: 'external_promotion', api: 'external_promotions', sdk: 'ExternalPromotion' },
	{ name: 'external_tax_calculator', api: 'external_tax_calculators', sdk: 'ExternalTaxCalculator' },
	{ name: 'fixed_amount_promotion', api: 'fixed_amount_promotions', sdk: 'FixedAmountPromotion' },
	{ name: 'free_shipping_promotion', api: 'free_shipping_promotions', sdk: 'FreeShippingPromotion' },
	{ name: 'geocoder', api: 'geocoders', sdk: 'Geocoder' },
	{ name: 'gift_card', api: 'gift_cards', sdk: 'GiftCard' },
	{ name: 'gift_card_recipient', api: 'gift_card_recipients', sdk: 'GiftCardRecipient' },
	{ name: 'import', api: 'imports', sdk: 'Import' },
	{ name: 'in_stock_subscription', api: 'in_stock_subscriptions', sdk: 'InStockSubscription' },
	{ name: 'inventory_model', api: 'inventory_models', sdk: 'InventoryModel' },
	{ name: 'inventory_return_location', api: 'inventory_return_locations', sdk: 'InventoryReturnLocation' },
	{ name: 'inventory_stock_location', api: 'inventory_stock_locations', sdk: 'InventoryStockLocation' },
	{ name: 'item', api: 'items', sdk: 'Item' },
	{ name: 'line_item', api: 'line_items', sdk: 'LineItem' },
	{ name: 'line_item_option', api: 'line_item_options', sdk: 'LineItemOption' },
	{ name: 'manual_gateway', api: 'manual_gateways', sdk: 'ManualGateway' },
	{ name: 'manual_tax_calculator', api: 'manual_tax_calculators', sdk: 'ManualTaxCalculator' },
	{ name: 'market', api: 'markets', sdk: 'Market' },
	{ name: 'merchant', api: 'merchants', sdk: 'Merchant' },
	{ name: 'order', api: 'orders', sdk: 'Order' },
	{ name: 'order_amount_promotion_rule', api: 'order_amount_promotion_rules', sdk: 'OrderAmountPromotionRule' },
	{ name: 'organization', api: 'organization', sdk: 'Organization', singleton: true },
	{ name: 'package', api: 'packages', sdk: 'Package' },
	{ name: 'parcel', api: 'parcels', sdk: 'Parcel' },
	{ name: 'parcel_line_item', api: 'parcel_line_items', sdk: 'ParcelLineItem' },
	{ name: 'payment_gateway', api: 'payment_gateways', sdk: 'PaymentGateway' },
	{ name: 'payment_method', api: 'payment_methods', sdk: 'PaymentMethod' },
	{ name: 'payment_source', api: 'payment_sources', sdk: 'PaymentSource' },
	{ name: 'paypal_gateway', api: 'paypal_gateways', sdk: 'PaypalGateway' },
	{ name: 'paypal_payment', api: 'paypal_payments', sdk: 'PaypalPayment' },
	{ name: 'percentage_discount_promotion', api: 'percentage_discount_promotions', sdk: 'PercentageDiscountPromotion' },
	{ name: 'price', api: 'prices', sdk: 'Price' },
	{ name: 'price_list', api: 'price_lists', sdk: 'PriceList' },
	{ name: 'promotion', api: 'promotions', sdk: 'Promotion' },
	{ name: 'promotion_rule', api: 'promotion_rules', sdk: 'PromotionRule' },
	{ name: 'refund', api: 'refunds', sdk: 'Refund' },
	{ name: 'return', api: 'returns', sdk: 'Return' },
	{ name: 'return_line_item', api: 'return_line_items', sdk: 'ReturnLineItem' },
	{ name: 'shipment', api: 'shipments', sdk: 'Shipment' },
	{ name: 'shipment_line_item', api: 'shipment_line_items', sdk: 'ShipmentLineItem' },
	{ name: 'shipping_category', api: 'shipping_categories', sdk: 'ShippingCategory' },
	{ name: 'shipping_method', api: 'shipping_methods', sdk: 'ShippingMethod' },
	{ name: 'shipping_zone', api: 'shipping_zones', sdk: 'ShippingZone' },
	{ name: 'sku', api: 'skus', sdk: 'Sku' },
	{ name: 'sku_list', api: 'sku_lists', sdk: 'SkuList' },
	{ name: 'sku_list_item', api: 'sku_list_items', sdk: 'SkuListItem' },
	{ name: 'sku_list_promotion_rule', api: 'sku_list_promotion_rules', sdk: 'SkuListPromotionRule' },
	{ name: 'sku_option', api: 'sku_options', sdk: 'SkuOption' },
	{ name: 'stock_item', api: 'stock_items', sdk: 'StockItem' },
	{ name: 'stock_location', api: 'stock_locations', sdk: 'StockLocation' },
	{ name: 'stock_transfer', api: 'stock_transfers', sdk: 'StockTransfer' },
	{ name: 'stripe_gateway', api: 'stripe_gateways', sdk: 'StripeGateway' },
	{ name: 'stripe_payment', api: 'stripe_payments', sdk: 'StripePayment' },
	{ name: 'tax_calculator', api: 'tax_calculators', sdk: 'TaxCalculator' },
	{ name: 'tax_category', api: 'tax_categories', sdk: 'TaxCategory' },
	{ name: 'tax_rule', api: 'tax_rules', sdk: 'TaxRule' },
	{ name: 'taxjar_account', api: 'taxjar_accounts', sdk: 'TaxjarAccount' },
	{ name: 'transaction', api: 'transactions', sdk: 'Transaction' },
	{ name: 'void', api: 'voids', sdk: 'Void' },
	{ name: 'webhook', api: 'webhooks', sdk: 'Webhook' },
	{ name: 'wire_transfer', api: 'wire_transfers', sdk: 'WireTransfer' },
]


interface Resource {
	name: string;
	api: string;
	sdk: string;
	singleton?: boolean;
}


const findResource = (res: string, { singular = false } = {}): (Resource | undefined) => {

	// if (res === undefined) return undefined

	const lowRes = res.toLowerCase()

	return resources.find(r => {
		return (lowRes === r.api) || (singular && (lowRes === r.name))
	})

}


const resourceList = (field: 'name' | 'api' | 'sdk'): string[] => {
	return resources.map(r => r[field])
}


export { findResource, Resource }
