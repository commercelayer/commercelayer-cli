
import type { Trigger } from '../common'


export const triggers: Record<string, Trigger> = {
  activate: {
      action: 'activate',
      trigger: '_activate',
      description: 'Send this attribute if you want to mark this subscription as active.',
    },
	deactivate: {
      action: 'deactivate',
      trigger: '_deactivate',
      description: 'Send this attribute if you want to mark this subscription as inactive.',
    },
	cancel: {
      action: 'cancel',
      trigger: '_cancel',
      description: 'Send this attribute if you want to mark this subscription as cancelled.',
    },
	convert: {
      action: 'convert',
      trigger: '_convert',
      description: 'Send this attribute if you want to convert a manual subscription to an automatic one. A subscription model is required before conversion.',
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
  'activate' |
	'deactivate' |
	'cancel' |
	'convert' |
	'add_tags' |
	'remove_tags'
