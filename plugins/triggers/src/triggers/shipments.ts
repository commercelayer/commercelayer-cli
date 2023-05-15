
import type { Trigger } from '../common'


export const triggers: Record<string, Trigger> = {
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
  'on_hold' |
	'picking' |
	'packing' |
	'ready_to_ship' |
	'ship' |
	'get_rates' |
	'purchase'
