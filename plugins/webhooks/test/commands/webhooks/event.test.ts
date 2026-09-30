import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, eventCallback, list, useMockedApi } from '../../helpers'

describe('webhooks:event', () => {
  useMockedApi()

  it('shows the event and its payload', async () => {
    api()
      .get('/api/event_callbacks')
      .query((q) => q['filter[q][id_eq]'] === 'eVt1')
      .reply(200, list([eventCallback('eVt1')]))
    const ctx = await runCommand(['webhooks:event', 'eVt1', ...AUTH, '-p'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('eVt1')
    expect(ctx.stdout).to.contain('EVENT CALLBACK PAYLOAD')
    expect(ctx.stdout).to.contain('oRd1')
  })

  it('says when the event does not exist', async () => {
    api().get('/api/event_callbacks').query(true).reply(200, list([]))
    const ctx = await runCommand(['webhooks:event', 'nope', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Event with id nope not found')
  })
})
