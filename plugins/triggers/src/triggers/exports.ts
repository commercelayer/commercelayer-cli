
import type { Trigger } from '../common'


export const triggers: Record<string, Trigger> = {
  start: {
      action: 'start',
      trigger: '_start',
      description: 'Send this attribute if you want to restart an \'interrupted\' export.',
    },
	interrupt: {
      action: 'interrupt',
      trigger: '_interrupt',
      description: 'Send this attribute if you want to mark status as \'interrupted\'.',
    },
}


export type ActionType =
  'start' |
	'interrupt'
