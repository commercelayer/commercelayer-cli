
import type { Trigger } from '../common'


export const triggers: { [key: string ]: Trigger } = {
  details: {
      action: 'details',
      trigger: '_details',
      description: 'Send this attribute if you want to send additional details the payment request.',
    },
}


export type ActionType =
  'details'
