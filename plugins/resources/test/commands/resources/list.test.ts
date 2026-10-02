import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, apiError, list, resource, useMockedApi } from '../../helpers'

describe('resources:list', () => {
  useMockedApi()

  it('lists the resources', async () => {
    api().get('/api/customers').query(true).reply(200, list([resource('customers', 'cUs1', { email: 'jane@example.com' }), resource('customers', 'cUs2', { email: 'john@example.com' })]))
    const ctx = await runCommand(['resources:list', 'customers', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('jane@example.com')
    expect(ctx.stdout).to.contain('cUs2')
  })

  it('marks the counts of the footer as estimated above 10,000 records', async () => {
    api()
      .get('/api/customers')
      .query(true)
      .reply(200, { ...list([resource('customers', 'cUs1', { email: 'jane@example.com' })]), meta: { record_count: 12_345, page_count: 1235 } })
    const ctx = await runCommand(['resources:list', 'customers', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.match(/Records: .*1.* of ≈12,345 \| Page: .*1.* of ≈1,235/)
  })

  it('passes filters, sort, paging, fields and includes to the API', async () => {
    api()
      .get('/api/customers')
      .query((q) => q['filter[q][email_end]'] === 'example.com' && q.sort === '-created_at' && q['page[size]'] === '5' && q['page[number]'] === '2' && q['fields[customers]'] === 'email' && q.include === 'customer_group')
      .reply(200, list([resource('customers', 'cUs1', { email: 'jane@example.com' })]))
    const ctx = await runCommand(['resources:list', 'customers', ...AUTH, '-w', 'email_end=example.com', '-s', '-created_at', '-n', '5', '-p', '2', '-f', 'email', '-i', 'customer_group'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('cUs1')
  })

  it('rejects an unknown resource', async () => {
    const ctx = await runCommand(['resources:list', 'unicorns', ...AUTH])
    expect(ctx.error?.message).to.match(/Invalid resource unicorns/)
  })

  it('reports the API error', async () => {
    api().get('/api/customers').query(true).reply(401, apiError(401, 'Invalid token'))
    const ctx = await runCommand(['resources:list', 'customers', ...AUTH])
    expect(ctx.error?.message).to.match(/Invalid token/)
  })
})
