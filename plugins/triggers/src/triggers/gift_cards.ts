
import type { Trigger } from '../common'


export const triggers: Record<string, Trigger> = {
  purchase: {
      action: 'purchase',
      trigger: '_purchase',
      description: 'Send this attribute if you want to confirm a draft gift card. The gift card becomes \'inactive\', waiting to be activated.',
    },
	activate: {
      action: 'activate',
      trigger: '_activate',
      description: 'Send this attribute if you want to activate a gift card.',
    },
	deactivate: {
      action: 'deactivate',
      trigger: '_deactivate',
      description: 'Send this attribute if you want to deactivate a gift card.',
    },
	balance_change_cents: {
      action: 'balance_change_cents',
      trigger: '_balance_change_cents',
      description: 'The balance change, in cents. Send a negative value to reduces the card balance by the specified amount. Send a positive value to recharge the gift card (if rechargeable).',
    },
	add_tags: {
      action: 'add_tags',
      trigger: '_add_tags',
      description: 'Comma separated list of tags to be added. Duplicates, invalid and non existing ones are discarded. Cannot be passed by sales channels.',
    },
	remove_tags: {
      action: 'remove_tags',
      trigger: '_remove_tags',
      description: 'Comma separated list of tags to be removed. Duplicates, invalid and non existing ones are discarded. Cannot be passed by sales channels.',
    },
}


export type ActionType =
  'purchase' |
	'activate' |
	'deactivate' |
	'balance_change_cents' |
	'add_tags' |
	'remove_tags'
