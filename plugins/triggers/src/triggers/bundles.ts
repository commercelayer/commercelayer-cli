
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
}


export type ActionType =
  'compute_price_amount' |
	'compute_compare_at_amount'
