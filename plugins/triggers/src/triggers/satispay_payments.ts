
import type { Trigger } from '../common'


export const triggers: Record<string, Trigger> = {
  refresh: {
      action: 'refresh',
      trigger: '_refresh',
      description: 'Send this attribute if you want to refresh all the pending transactions, can be used as webhooks fallback logic.',
    },
}


export type ActionType =
  'refresh'
