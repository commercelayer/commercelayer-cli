
import type { Trigger } from '../common'


export const triggers: { [key: string ]: Trigger } = {
  details: {
      action: 'details',
      trigger: '_details',
      description: 'Send this attribute if you want to send additional details the payment request (i.e. upon 3DS check).',
    },
	refresh: {
      action: 'refresh',
      trigger: '_refresh',
      description: 'Send this attribute if you want to refresh all the pending transactions, can be used as webhooks fallback logic.',
    },
}


export type ActionType =
  'details' |
	'refresh'
