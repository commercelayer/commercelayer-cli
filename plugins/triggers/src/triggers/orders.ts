
import type { Trigger } from '../common'


export const triggers: Record<string, Trigger> = {
  archive: {
      action: 'archive',
      trigger: '_archive',
      description: 'Send this attribute if you want to archive the order.',
    },
	unarchive: {
      action: 'unarchive',
      trigger: '_unarchive',
      description: 'Send this attribute if you want to unarchive the order.',
    },
	pending: {
      action: 'pending',
      trigger: '_pending',
      description: 'Send this attribute if you want to move a draft or placing order to pending.',
    },
	place: {
      action: 'place',
      trigger: '_place',
      description: 'Send this attribute if you want to place the order.',
    },
	cancel: {
      action: 'cancel',
      trigger: '_cancel',
      description: 'Send this attribute if you want to cancel a placed order. The order\'s authorization will be automatically voided.',
    },
	approve: {
      action: 'approve',
      trigger: '_approve',
      description: 'Send this attribute if you want to approve a placed order.',
    },
	approve_and_capture: {
      action: 'approve_and_capture',
      trigger: '_approve_and_capture',
      description: 'Send this attribute if you want to approve and capture a placed order.',
    },
	authorize: {
      action: 'authorize',
      trigger: '_authorize',
      description: 'Send this attribute if you want to authorize the order\'s payment source.',
    },
	authorization_amount_cents: {
      action: 'authorization_amount_cents',
      trigger: '_authorization_amount_cents',
      description: 'Send this attribute as a value in cents if you want to overwrite the amount to be authorized.',
    },
	capture: {
      action: 'capture',
      trigger: '_capture',
      description: 'Send this attribute if you want to capture an authorized order.',
    },
	refund: {
      action: 'refund',
      trigger: '_refund',
      description: 'Send this attribute if you want to refund a captured order.',
    },
	fulfill: {
      action: 'fulfill',
      trigger: '_fulfill',
      description: 'Send this attribute if you want to mark as fulfilled a shipped/delivered order.',
    },
	update_taxes: {
      action: 'update_taxes',
      trigger: '_update_taxes',
      description: 'Send this attribute if you want to force tax calculation for this order (a tax calculator must be associated to the order\'s market).',
    },
	nullify_payment_source: {
      action: 'nullify_payment_source',
      trigger: '_nullify_payment_source',
      description: 'Send this attribute if you want to nullify the payment source for this order.',
    },
	billing_address_clone_id: {
      action: 'billing_address_clone_id',
      trigger: '_billing_address_clone_id',
      description: 'The id of the address that you want to clone to create the order\'s billing address.',
    },
	shipping_address_clone_id: {
      action: 'shipping_address_clone_id',
      trigger: '_shipping_address_clone_id',
      description: 'The id of the address that you want to clone to create the order\'s shipping address.',
    },
	customer_payment_source_id: {
      action: 'customer_payment_source_id',
      trigger: '_customer_payment_source_id',
      description: 'The id of the customer payment source (i.e. credit card) that you want to use as the order\'s payment source.',
    },
	shipping_address_same_as_billing: {
      action: 'shipping_address_same_as_billing',
      trigger: '_shipping_address_same_as_billing',
      description: 'Send this attribute if you want the shipping address to be cloned from the order\'s billing address.',
    },
	billing_address_same_as_shipping: {
      action: 'billing_address_same_as_shipping',
      trigger: '_billing_address_same_as_shipping',
      description: 'Send this attribute if you want the billing address to be cloned from the order\'s shipping address.',
    },
	commit_invoice: {
      action: 'commit_invoice',
      trigger: '_commit_invoice',
      description: 'Send this attribute if you want commit the sales tax invoice to the associated tax calculator (currently supported by Avalara).',
    },
	refund_invoice: {
      action: 'refund_invoice',
      trigger: '_refund_invoice',
      description: 'Send this attribute if you want refund the sales tax invoice to the associated tax calculator (currently supported by Avalara).',
    },
	save_payment_source_to_customer_wallet: {
      action: 'save_payment_source_to_customer_wallet',
      trigger: '_save_payment_source_to_customer_wallet',
      description: 'Send this attribute if you want the order\'s payment source to be saved in the customer\'s wallet as a customer payment source.',
    },
	save_shipping_address_to_customer_address_book: {
      action: 'save_shipping_address_to_customer_address_book',
      trigger: '_save_shipping_address_to_customer_address_book',
      description: 'Send this attribute if you want the order\'s shipping address to be saved in the customer\'s address book as a customer address.',
    },
	save_billing_address_to_customer_address_book: {
      action: 'save_billing_address_to_customer_address_book',
      trigger: '_save_billing_address_to_customer_address_book',
      description: 'Send this attribute if you want the order\'s billing address to be saved in the customer\'s address book as a customer address.',
    },
	refresh: {
      action: 'refresh',
      trigger: '_refresh',
      description: 'Send this attribute if you want to manually refresh the order.',
    },
	validate: {
      action: 'validate',
      trigger: '_validate',
      description: 'Send this attribute if you want to trigger the external validation for the order.',
    },
	create_subscriptions: {
      action: 'create_subscriptions',
      trigger: '_create_subscriptions',
      description: 'Send this attribute upon/after placing the order if you want to create order subscriptions from the line items that have a frequency.',
    },
	start_editing: {
      action: 'start_editing',
      trigger: '_start_editing',
      description: 'Send this attribute if you want to edit the order after it is placed. Remember you cannot exceed the original total amount.',
    },
	stop_editing: {
      action: 'stop_editing',
      trigger: '_stop_editing',
      description: 'Send this attribute to stop the editing for the order and return back to placed status.',
    },
	reset_circuit: {
      action: 'reset_circuit',
      trigger: '_reset_circuit',
      description: 'Send this attribute if you want to reset the circuit breaker associated to this resource to \'closed\' state and zero failures count.',
    },
}


export type ActionType =
  'archive' |
	'unarchive' |
	'pending' |
	'place' |
	'cancel' |
	'approve' |
	'approve_and_capture' |
	'authorize' |
	'authorization_amount_cents' |
	'capture' |
	'refund' |
	'fulfill' |
	'update_taxes' |
	'nullify_payment_source' |
	'billing_address_clone_id' |
	'shipping_address_clone_id' |
	'customer_payment_source_id' |
	'shipping_address_same_as_billing' |
	'billing_address_same_as_shipping' |
	'commit_invoice' |
	'refund_invoice' |
	'save_payment_source_to_customer_wallet' |
	'save_shipping_address_to_customer_address_book' |
	'save_billing_address_to_customer_address_book' |
	'refresh' |
	'validate' |
	'create_subscriptions' |
	'start_editing' |
	'stop_editing' |
	'reset_circuit'
