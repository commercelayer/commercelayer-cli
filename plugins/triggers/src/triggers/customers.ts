
import type { Trigger } from '../common'


export const triggers: Record<string, Trigger> = {
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
	request_anonymization: {
      action: 'request_anonymization',
      trigger: '_request_anonymization',
      description: 'Send this attribute if you want to trigger anonymization. Cannot be passed by sales channels.',
    },
	cancel_anonymization: {
      action: 'cancel_anonymization',
      trigger: '_cancel_anonymization',
      description: 'Send this attribute if you want to trigger a cancellation of anonymization. Cannot be passed by sales channels.',
    },
}


export type ActionType =
  'add_tags' |
	'remove_tags' |
	'request_anonymization' |
	'cancel_anonymization'
