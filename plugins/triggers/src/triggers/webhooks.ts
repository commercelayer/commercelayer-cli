
import type { Trigger } from '../common'


export const triggers: Record<string, Trigger> = {
  reset_circuit: {
      action: 'reset_circuit',
      trigger: '_reset_circuit',
      description: 'Send this attribute if you want to reset the circuit breaker associated to this webhook to \'closed\' state and zero failures count.',
    },
}


export type ActionType =
  'reset_circuit'
