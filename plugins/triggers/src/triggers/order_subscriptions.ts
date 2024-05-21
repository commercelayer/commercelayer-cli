
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
}


export type ActionType =
  'activate' |
	'deactivate' |
	'cancel' |
	'convert'
