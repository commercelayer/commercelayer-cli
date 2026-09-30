import { expect, test } from '@oclif/test'
import { AUTH, api, eventCallback, list, useMockedApi } from '../../helpers'

describe('webhooks:event', () => {
  useMockedApi()

  test
    .do(() => {
      api()
        .get('/api/event_callbacks')
        .query((q) => q['filter[q][id_eq]'] === 'eVt1')
        .reply(200, list([eventCallback('eVt1')]))
    })
    .stdout()
    .command(['webhooks:event', 'eVt1', ...AUTH, '-p'])
    .it('shows the event and its payload', (ctx) => {
      expect(ctx.stdout).to.contain('eVt1')
      expect(ctx.stdout).to.contain('EVENT CALLBACK PAYLOAD')
      expect(ctx.stdout).to.contain('oRd1')
    })

  test
    .do(() => {
      api().get('/api/event_callbacks').query(true).reply(200, list([]))
    })
    .stdout()
    .command(['webhooks:event', 'nope', ...AUTH])
    .it('says when the event does not exist', (ctx) => {
      expect(ctx.stdout).to.contain('Event with id nope not found')
    })
})
