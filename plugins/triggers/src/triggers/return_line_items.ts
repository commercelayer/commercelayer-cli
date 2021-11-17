
import type { Trigger } from '../common'


export const triggers: { [key: string ]: Trigger } = {
  restock: {
      action: 'restock',
      trigger: '_restock',
      description: 'Send this attribute if you want to restock the line item.',
    },
}


export type ActionType =
  'restock'
