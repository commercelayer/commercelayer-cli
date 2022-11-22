
import type { Trigger } from '../common'


export const triggers: { [key: string ]: Trigger } = {
  disable: {
      action: 'disable',
      trigger: '_disable',
      description: 'Send this attribute if you want to mark the market as disabled.',
    },
	enable: {
      action: 'enable',
      trigger: '_enable',
      description: 'Send this attribute if you want to mark the market as enabled.',
    },
}


export type ActionType =
  'disable' |
	'enable'
