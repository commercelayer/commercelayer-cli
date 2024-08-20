
import type { Trigger } from '../common'


export const triggers: Record<string, Trigger> = {
  forward: {
      action: 'forward',
      trigger: '_forward',
      description: 'Send this attribute if you want to forward a stuck transaction to succeeded and update associated order states accordingly.',
    },
	capture: {
      action: 'capture',
      trigger: '_capture',
      description: 'Send this attribute if you want to create a capture for this authorization.',
    },
	capture_amount_cents: {
      action: 'capture_amount_cents',
      trigger: '_capture_amount_cents',
      description: 'Send this attribute as a value in cents if you want to overwrite the amount to be captured.',
    },
	void: {
      action: 'void',
      trigger: '_void',
      description: 'Send this attribute if you want to create a void for this authorization.',
    },
}


export type ActionType =
  'forward' |
	'capture' |
	'capture_amount_cents' |
	'void'
