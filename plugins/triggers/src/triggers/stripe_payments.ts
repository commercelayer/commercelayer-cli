
import type { Trigger } from '../common'


export const triggers: { [key: string ]: Trigger } = {
  refresh: {
      action: 'refresh',
      trigger: '_refresh',
      description: 'Send this attribute if you want to refresh the payment status, can be used as webhooks fallback logic.',
    },
}


export type ActionType =
  'refresh'
