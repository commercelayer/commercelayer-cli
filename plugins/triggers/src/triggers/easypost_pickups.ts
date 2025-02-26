
import type { Trigger } from '../common'


export const triggers: Record<string, Trigger> = {
  purchase: {
      action: 'purchase',
      trigger: '_purchase',
      description: 'Send this attribute if you want to purchase this pick up with the selected rate.',
    },
}


export type ActionType =
  'purchase'
