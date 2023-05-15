
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
	'unarchive'
