
import type { Trigger } from '../common'


export const triggers: Record<string, Trigger> = {
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
	balance: {
      action: 'balance',
      trigger: '_balance',
      description: 'Send this attribute if you want retrieve the balance remaining on a shopper\'s gift card.',
    },
}


export type ActionType =
  'authorize' |
	'details' |
	'balance'
