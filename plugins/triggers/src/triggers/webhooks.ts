
import type { Trigger } from '../common'


export const triggers: Record<string, Trigger> = {
  reset_circuit: {
      action: 'reset_circuit',
      trigger: '_reset_circuit',
      description: 'Send this attribute if you want to reset the circuit breaker associated to this webhook to \'closed\' state and zero failures count.',
    },
	disable: {
      action: 'disable',
      trigger: '_disable',
      description: 'Send this attribute if you want to mark the webhook as disabled.',
    },
	enable: {
      action: 'enable',
      trigger: '_enable',
      description: 'Send this attribute if you want to mark the webhook as enabled.',
    },
}


export type ActionType =
  'reset_circuit' |
	'disable' |
	'enable'
