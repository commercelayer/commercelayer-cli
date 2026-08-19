
import type { Trigger } from '../common'


export const triggers: Record<string, Trigger> = {
  reset_circuit: {
      action: 'reset_circuit',
      trigger: '_reset_circuit',
      description: 'Send this attribute if you want to reset the circuit breaker associated to this resource to \'closed\' state and zero failures count. Cannot be passed by sales channels.',
    },
	regenerate_shared_secret: {
      action: 'regenerate_shared_secret',
      trigger: '_regenerate_shared_secret',
      description: 'Send this attribute if you want to regenerate the shared secret.',
    },
}


export type ActionType =
  'reset_circuit' |
	'regenerate_shared_secret'
