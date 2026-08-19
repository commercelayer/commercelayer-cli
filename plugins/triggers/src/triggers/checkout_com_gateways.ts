
import type { Trigger } from '../common'


export const triggers: Record<string, Trigger> = {
  disable: {
      action: 'disable',
      trigger: '_disable',
      description: 'Send this attribute if you want to mark this resource as disabled.',
    },
	enable: {
      action: 'enable',
      trigger: '_enable',
      description: 'Send this attribute if you want to mark this resource as enabled.',
    },
	check: {
      action: 'check',
      trigger: '_check',
      description: 'Send this attribute if you want to check the credentials against the payment gateway\'s APIs.',
    },
	update_webhooks: {
      action: 'update_webhooks',
      trigger: '_update_webhooks',
      description: 'Send this attribute if you want to sync the gateway webhook endpoint with the Checkout.com workflow.',
    },
}


export type ActionType =
  'disable' |
	'enable' |
	'check' |
	'update_webhooks'
