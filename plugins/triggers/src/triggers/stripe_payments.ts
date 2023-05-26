
import type { Trigger } from '../common'


export const triggers: Record<string, Trigger> = {
  update: {
      action: 'update',
      trigger: '_update',
      description: 'Send this attribute if you want to update the created payment intent with fresh order data.',
    },
	refresh: {
      action: 'refresh',
      trigger: '_refresh',
      description: 'Send this attribute if you want to refresh the payment status, can be used as webhooks fallback logic.',
    },
}


export type ActionType =
  'update' |
	'refresh'
