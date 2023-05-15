
import type { Trigger } from '../common'


export const triggers: Record<string, Trigger> = {
  external_price: {
      action: 'external_price',
      trigger: '_external_price',
      description: 'When creating or updating a new line item, set this attribute to \'1\' if you want to inject the unit_amount_cents price from an external source.',
    },
}


export type ActionType =
  'external_price'
