
import type { Trigger } from '../common'


export const triggers: Record<string, Trigger> = {
  details: {
      action: 'details',
      trigger: '_details',
      description: 'Send this attribute if you want to send additional details the payment request.',
    },
}


export type ActionType =
  'details'
