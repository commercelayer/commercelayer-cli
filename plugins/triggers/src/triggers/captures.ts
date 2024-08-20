
import type { Trigger } from '../common'


export const triggers: Record<string, Trigger> = {
  forward: {
      action: 'forward',
      trigger: '_forward',
      description: 'Send this attribute if you want to forward a stuck transaction to succeeded and update associated order states accordingly.',
    },
	refund: {
      action: 'refund',
      trigger: '_refund',
      description: 'Send this attribute if you want to create a refund for this capture.',
    },
	refund_amount_cents: {
      action: 'refund_amount_cents',
      trigger: '_refund_amount_cents',
      description: 'Send this attribute as a value in cents if you want to overwrite the amount to be refunded.',
    },
}


export type ActionType =
  'forward' |
	'refund' |
	'refund_amount_cents'
