
import type { Trigger } from '../common'


export const triggers: { [key: string ]: Trigger } = {
  compute_compare_at_amount: {
      action: 'compute_compare_at_amount',
      trigger: '_compute_compare_at_amount',
      description: 'Send this attribute if you want to compute the compare_at_amount_cents as the sum of the prices of the bundle SKUs for the market.',
    },
}


export type ActionType =
  'compute_compare_at_amount'
