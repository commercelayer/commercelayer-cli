
import type { Trigger } from '../common'


export const triggers: Record<string, Trigger> = {
  reset_password_token: {
      action: 'reset_password_token',
      trigger: '_reset_password_token',
      description: 'Send the \'reset_password_token\' that you got on create when updating the customer password.',
    },
}


export type ActionType =
  'reset_password_token'
