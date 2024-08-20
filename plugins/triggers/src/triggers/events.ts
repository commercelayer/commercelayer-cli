
import type { Trigger } from '../common'


export const triggers: Record<string, Trigger> = {
  trigger: {
      action: 'trigger',
      trigger: '_trigger',
      description: 'Send this attribute if you want to force webhooks execution for this event.',
    },
}


export type ActionType =
  'trigger'
