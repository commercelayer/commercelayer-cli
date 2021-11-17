
import type { Trigger } from '../common'


export const triggers: { [key: string ]: Trigger } = {
  authorize: {
      action: 'authorize',
      trigger: '_authorize',
      description: 'Send this attribute if you want to authorize the payment.',
    },
	details: {
      action: 'details',
      trigger: '_details',
      description: 'Send this attribute if you want to send additional details the payment request.',
    },
}


export type ActionType =
  'authorize' |
	'details'
