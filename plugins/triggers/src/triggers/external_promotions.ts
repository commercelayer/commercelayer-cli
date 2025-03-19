
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
	add_tags: {
      action: 'add_tags',
      trigger: '_add_tags',
      description: 'Comma separated list of tags to be added. Duplicates, invalid and non existing ones are discarded. Cannot be passed by sales channels.',
    },
	remove_tags: {
      action: 'remove_tags',
      trigger: '_remove_tags',
      description: 'Comma separated list of tags to be removed. Duplicates, invalid and non existing ones are discarded. Cannot be passed by sales channels.',
    },
	reset_circuit: {
      action: 'reset_circuit',
      trigger: '_reset_circuit',
      description: 'Send this attribute if you want to reset the circuit breaker associated to this resource to \'closed\' state and zero failures count. Cannot be passed by sales channels.',
    },
}


export type ActionType =
  'disable' |
	'enable' |
	'add_tags' |
	'remove_tags' |
	'reset_circuit'
