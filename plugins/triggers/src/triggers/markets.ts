
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
	regenerate_shared_secret: {
      action: 'regenerate_shared_secret',
      trigger: '_regenerate_shared_secret',
      description: 'Send this attribute if you want to regenerate the shared secret.',
    },
}


export type ActionType =
  'disable' |
	'enable' |
	'regenerate_shared_secret'
