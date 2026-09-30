
import type { Trigger } from '../common'


export const triggers: Record<string, Trigger> = {
  trigger: {
      action: 'trigger',
      trigger: '_trigger',
      description: 'Send this attribute if you want to force webhooks execution for this event. Cannot be passed by sales channels.',
    },
}


export type ActionType =
  'trigger'
