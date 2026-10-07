import { expect, test } from '@oclif/test'
import { AUTH, api, apiError, list, resource, useMockedApi } from '../../helpers'

describe('resources:list', () => {
  useMockedApi()

  test
    .do(() => {
      api().get('/api/customers').query(true).reply(200, list([resource('customers', 'cUs1', { email: 'jane@example.com' }), resource('customers', 'cUs2', { email: 'john@example.com' })]))
    })
    .stdout()
    .command(['resources:list', 'customers', ...AUTH])
    .it('lists the resources', (ctx) => {
      expect(ctx.stdout).to.contain('jane@example.com')
      expect(ctx.stdout).to.contain('cUs2')
    })

  test
    .do(() => {
      api()
        .get('/api/customers')
        .query(true)
        .reply(200, { ...list([resource('customers', 'cUs1', { email: 'jane@example.com' })]), meta: { record_count: 12_345, page_count: 1235, record_count_estimated: true } })
    })
    .stdout()
    .command(['resources:list', 'customers', ...AUTH])
    .it('marks the counts of the footer as estimated above 10,000 records', (ctx) => {
      expect(ctx.stdout).to.match(/Records: .*1.* of ≈12,345 \| Page: .*1.* of ≈1,235/)
    })

  test
    .do(() => {
      api()
        .get('/api/customers')
        .query((q) => q['filter[q][email_end]'] === 'example.com' && q.sort === '-created_at' && q['page[size]'] === '5' && q['page[number]'] === '2' && q['fields[customers]'] === 'email' && q.include === 'customer_group')
        .reply(200, list([resource('customers', 'cUs1', { email: 'jane@example.com' })]))
    })
    .stdout()
    .command(['resources:list', 'customers', ...AUTH, '-w', 'email_end=example.com', '-s', '-created_at', '-n', '5', '-p', '2', '-f', 'email', '-i', 'customer_group'])
    .it('passes filters, sort, paging, fields and includes to the API', (ctx) => {
      expect(ctx.stdout).to.contain('cUs1')
    })

  test
    .command(['resources:list', 'unicorns', ...AUTH])
    .catch(/Invalid resource unicorns/)
    .it('rejects an unknown resource')

  test
    .do(() => {
      api().get('/api/customers').query(true).reply(401, apiError(401, 'Invalid token'))
    })
    .command(['resources:list', 'customers', ...AUTH])
    .catch(/Invalid token/)
    .it('reports the API error')
})
