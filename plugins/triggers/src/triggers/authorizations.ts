
import type { Trigger } from '../common'


export const triggers: { [key: string ]: Trigger } = {
  capture: {
      action: 'capture',
      trigger: '_capture',
      description: 'Send this attribute if you want to create a capture for this authorization.',
    },
	capture_amount_cents: {
      action: 'capture_amount_cents',
      trigger: '_capture_amount_cents',
      description: 'The associated capture amount, in cents.',
    },
	void: {
      action: 'void',
      trigger: '_void',
      description: 'Send this attribute if you want to create a void for this authorization.',
    },
}


export type ActionType =
  'capture' |
	'capture_amount_cents' |
	'void'
