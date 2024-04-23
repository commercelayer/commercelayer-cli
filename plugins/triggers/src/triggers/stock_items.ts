
import type { Trigger } from '../common'


export const triggers: Record<string, Trigger> = {
  validate: {
      action: 'validate',
      trigger: '_validate',
      description: 'Send this attribute if you want to validate the stock item quantity against the existing reserved stock one, returns an error in case the former is smaller.',
    },
}


export type ActionType =
  'validate'
