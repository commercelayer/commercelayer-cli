import { expect, test } from '@oclif/test'
import { AUTH, api, eventCallback, list, useMockedApi } from '../../helpers'

describe('webhooks:payload', () => {
  useMockedApi()

  test
    .do(() => {
      api().get('/api/event_callbacks').query(true).reply(200, list([eventCallback('eVt1')]))
    })
    .stdout()
    .command(['webhooks:payload', 'eVt1', ...AUTH])
    .it('prints the payload as JSON', (ctx) => {
      expect(JSON.parse(ctx.stdout)).to.deep.equal({ data: { id: 'oRd1', type: 'orders' } })
    })
})
