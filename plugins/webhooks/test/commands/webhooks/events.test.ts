import { expect, test } from '@oclif/test'
import { AUTH, api, eventCallback, list, useMockedApi } from '../../helpers'

describe('webhooks:events', () => {
  useMockedApi()

  test
    .do(() => {
      api()
        .get('/api/event_callbacks')
        .query((q) => q['filter[q][webhook_id_eq]'] === 'wHk1' && q.sort === '-created_at')
        .reply(200, list([eventCallback('eVt1'), eventCallback('eVt2', { response_code: '500' })]))
    })
    .stdout()
    .command(['webhooks:events', 'wHk1', ...AUTH])
    .it('lists the event callbacks of the webhook', (ctx) => {
      expect(ctx.stdout).to.contain('eVt1')
      expect(ctx.stdout).to.contain('eVt2')
    })

  test
    .do(() => {
      api().get('/api/event_callbacks').query(true).reply(200, list([]))
    })
    .stdout()
    .command(['webhooks:events', 'wHk1', ...AUTH])
    .it('says when there are no events', (ctx) => {
      expect(ctx.stdout).to.contain('No events found for webhook wHk1')
    })

  test
    .command(['webhooks:events', 'wHk1', ...AUTH, '-l', '0'])
    .catch(/Limit must be a positive integer/)
    .it('rejects a non-positive limit')
})
