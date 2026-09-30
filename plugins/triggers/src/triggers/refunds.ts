
import type { Trigger } from '../common'


export const triggers: Record<string, Trigger> = {
  forward: {
      action: 'forward',
      trigger: '_forward',
      description: 'Send this attribute if you want to forward a stuck transaction to succeeded and update associated order states accordingly.',
    },
}


export type ActionType =
  'forward'
