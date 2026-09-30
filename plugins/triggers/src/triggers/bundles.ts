
import type { Trigger } from '../common'


export const triggers: Record<string, Trigger> = {
  compute_price_amount: {
      action: 'compute_price_amount',
      trigger: '_compute_price_amount',
      description: 'Send this attribute if you want to compute the price_amount_cents as the sum of the prices of the bundle SKUs for the market.',
    },
	compute_compare_at_amount: {
      action: 'compute_compare_at_amount',
      trigger: '_compute_compare_at_amount',
      description: 'Send this attribute if you want to compute the compare_at_amount_cents as the sum of the prices of the bundle SKUs for the market.',
    },
	add_tags: {
      action: 'add_tags',
      trigger: '_add_tags',
      description: 'Comma separated list of tags to be added. Duplicates, invalid and non existing ones are discarded. Cannot be passed by sales channels.',
    },
	remove_tags: {
      action: 'remove_tags',
      trigger: '_remove_tags',
      description: 'Comma separated list of tags to be removed. Duplicates, invalid and non existing ones are discarded. Cannot be passed by sales channels.',
    },
}


export type ActionType =
  'compute_price_amount' |
	'compute_compare_at_amount' |
	'add_tags' |
	'remove_tags'
