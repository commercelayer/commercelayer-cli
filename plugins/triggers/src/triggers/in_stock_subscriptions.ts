
import type { Trigger } from '../common'


export const triggers: { [key: string ]: Trigger } = {
  activate: {
      action: 'activate',
      trigger: '_activate',
      description: 'Send this attribute if you want to activate an inactive subscription.',
    },
	deactivate: {
      action: 'deactivate',
      trigger: '_deactivate',
      description: 'Send this attribute if you want to dactivate an active subscription.',
    },
}


export type ActionType =
  'activate' |
	'deactivate'
