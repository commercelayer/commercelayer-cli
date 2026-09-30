import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, eventCallback, list, useMockedApi } from '../../helpers'

describe('webhooks:payload', () => {
  useMockedApi()

  it('prints the payload as JSON', async () => {
    api().get('/api/event_callbacks').query(true).reply(200, list([eventCallback('eVt1')]))
    const ctx = await runCommand(['webhooks:payload', 'eVt1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(JSON.parse(ctx.stdout)).to.deep.equal({ data: { id: 'oRd1', type: 'orders' } })
  })
})
