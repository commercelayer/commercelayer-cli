
import type { Trigger } from '../common'


export const triggers: Record<string, Trigger> = {
  refund: {
      action: 'refund',
      trigger: '_refund',
      description: 'Send this attribute if you want to create a refund for this capture.',
    },
	refund_amount_cents: {
      action: 'refund_amount_cents',
      trigger: '_refund_amount_cents',
      description: 'The associated refund amount, in cents.',
    },
}


export type ActionType =
  'refund' |
	'refund_amount_cents'
