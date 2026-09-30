
import type { Trigger } from '../common'


export const triggers: Record<string, Trigger> = {
  pending: {
      action: 'pending',
      trigger: '_pending',
      description: 'Send this attribute if you want to mark this stock reservation as pending.',
    },
}


export type ActionType =
  'pending'
