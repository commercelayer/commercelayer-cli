
import type { Trigger } from '../common'


export const triggers: Record<string, Trigger> = {
  interrupt: {
      action: 'interrupt',
      trigger: '_interrupt',
      description: 'Send this attribute if you want to mark status as \'interrupted\'.',
    },
}


export type ActionType =
  'interrupt'
