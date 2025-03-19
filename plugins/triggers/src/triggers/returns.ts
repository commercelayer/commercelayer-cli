
import type { Trigger } from '../common'


export const triggers: Record<string, Trigger> = {
  request: {
      action: 'request',
      trigger: '_request',
      description: 'Send this attribute if you want to activate this return.',
    },
	approve: {
      action: 'approve',
      trigger: '_approve',
      description: 'Send this attribute if you want to mark this return as approved.',
    },
	cancel: {
      action: 'cancel',
      trigger: '_cancel',
      description: 'Send this attribute if you want to mark this return as cancelled.',
    },
	ship: {
      action: 'ship',
      trigger: '_ship',
      description: 'Send this attribute if you want to mark this return as shipped.',
    },
	reject: {
      action: 'reject',
      trigger: '_reject',
      description: 'Send this attribute if you want to mark this return as rejected.',
    },
	receive: {
      action: 'receive',
      trigger: '_receive',
      description: 'Send this attribute if you want to mark this return as received.',
    },
	restock: {
      action: 'restock',
      trigger: '_restock',
      description: 'Send this attribute if you want to restock all of the return line items.',
    },
	archive: {
      action: 'archive',
      trigger: '_archive',
      description: 'Send this attribute if you want to archive the return.',
    },
	unarchive: {
      action: 'unarchive',
      trigger: '_unarchive',
      description: 'Send this attribute if you want to unarchive the return.',
    },
	refund: {
      action: 'refund',
      trigger: '_refund',
      description: 'Send this attribute if you want to create a refund for this return.',
    },
	refund_amount_cents: {
      action: 'refund_amount_cents',
      trigger: '_refund_amount_cents',
      description: 'Send this attribute as a value in cents to specify the amount to be refunded.',
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
  'request' |
	'approve' |
	'cancel' |
	'ship' |
	'reject' |
	'receive' |
	'restock' |
	'archive' |
	'unarchive' |
	'refund' |
	'refund_amount_cents' |
	'add_tags' |
	'remove_tags'
