
import type { Trigger } from '../common'


export const triggers: Record<string, Trigger> = {
  refresh_token: {
      action: 'refresh_token',
      trigger: '_refresh_token',
      description: 'Send this attribute if you want to manually refresh the access token.',
    },
}


export type ActionType =
  'refresh_token'
