
import type { Trigger } from '../common'


export const triggers: Record<string, Trigger> = {
  reserve_stock: {
      action: 'reserve_stock',
      trigger: '_reserve_stock',
      description: 'Send this attribute if you want to automatically reserve the stock for this stock line item. Can be done only when fulfillment is in progress.',
    },
	release_stock: {
      action: 'release_stock',
      trigger: '_release_stock',
      description: 'Send this attribute if you want to automatically destroy the stock reservation for this stock line item. Can be done only when fulfillment is in progress.',
    },
	decrement_stock: {
      action: 'decrement_stock',
      trigger: '_decrement_stock',
      description: 'Send this attribute if you want to automatically decrement and release the stock this stock line item. Can be done only when fulfillment is in progress.',
    },
}


export type ActionType =
  'reserve_stock' |
	'release_stock' |
	'decrement_stock'
