
import type { Trigger } from '../common'


export const triggers: { [key: string ]: Trigger } = {
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
}


export type ActionType =
  'activate' |
	'deactivate' |
	'cancel'
