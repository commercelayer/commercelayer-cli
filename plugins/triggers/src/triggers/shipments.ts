
import type { Trigger } from '../common'


export const triggers: Record<string, Trigger> = {
  upcoming: {
      action: 'upcoming',
      trigger: '_upcoming',
      description: 'Send this attribute if you want to mark this shipment as upcoming.',
    },
	on_hold: {
      action: 'on_hold',
      trigger: '_on_hold',
      description: 'Send this attribute if you want to put this shipment on hold.',
    },
	picking: {
      action: 'picking',
      trigger: '_picking',
      description: 'Send this attribute if you want to start picking this shipment.',
    },
	packing: {
      action: 'packing',
      trigger: '_packing',
      description: 'Send this attribute if you want to start packing this shipment.',
    },
	ready_to_ship: {
      action: 'ready_to_ship',
      trigger: '_ready_to_ship',
      description: 'Send this attribute if you want to mark this shipment as ready to ship.',
    },
	ship: {
      action: 'ship',
      trigger: '_ship',
      description: 'Send this attribute if you want to mark this shipment as shipped.',
    },
	deliver: {
      action: 'deliver',
      trigger: '_deliver',
      description: 'Send this attribute if you want to mark this shipment as delivered.',
    },
	reserve_stock: {
      action: 'reserve_stock',
      trigger: '_reserve_stock',
      description: 'Send this attribute if you want to automatically reserve the stock for each of the associated stock line item. Can be done only when fulfillment is in progress.',
    },
	release_stock: {
      action: 'release_stock',
      trigger: '_release_stock',
      description: 'Send this attribute if you want to automatically destroy the stock reservations for each of the associated stock line item. Can be done only when fulfillment is in progress.',
    },
	decrement_stock: {
      action: 'decrement_stock',
      trigger: '_decrement_stock',
      description: 'Send this attribute if you want to automatically decrement and release the stock for each of the associated stock line item. Can be done only when fulfillment is in progress.',
    },
	get_rates: {
      action: 'get_rates',
      trigger: '_get_rates',
      description: 'Send this attribute if you want get the shipping rates from the associated carrier accounts.',
    },
	purchase: {
      action: 'purchase',
      trigger: '_purchase',
      description: 'Send this attribute if you want to purchase this shipment with the selected rate.',
    },
}


export type ActionType =
  'upcoming' |
	'on_hold' |
	'picking' |
	'packing' |
	'ready_to_ship' |
	'ship' |
	'deliver' |
	'reserve_stock' |
	'release_stock' |
	'decrement_stock' |
	'get_rates' |
	'purchase'
