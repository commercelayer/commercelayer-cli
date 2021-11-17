
import type { Trigger } from '../common'


export const triggers: { [key: string ]: Trigger } = {
  upcoming: {
      action: 'upcoming',
      trigger: '_upcoming',
      description: 'Send this attribute if you want to mark this stock transfer as upcoming.',
    },
	picking: {
      action: 'picking',
      trigger: '_picking',
      description: 'Send this attribute if you want to start picking this stock transfer.',
    },
	in_transit: {
      action: 'in_transit',
      trigger: '_in_transit',
      description: 'Send this attribute if you want to mark this stock transfer as in transit.',
    },
	complete: {
      action: 'complete',
      trigger: '_complete',
      description: 'Send this attribute if you want to complete this stock transfer.',
    },
	cancel: {
      action: 'cancel',
      trigger: '_cancel',
      description: 'Send this attribute if you want to cancel this stock transfer.',
    },
}


export type ActionType =
  'upcoming' |
	'picking' |
	'in_transit' |
	'complete' |
	'cancel'
