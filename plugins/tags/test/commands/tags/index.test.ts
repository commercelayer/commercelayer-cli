import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, list, single, tag, useMockedApi } from '../../helpers'

describe('tags', () => {
  useMockedApi()

  it('lists the tags without an ID', async () => {
    api().get('/api/tags').query(true).reply(200, list([tag('aBcDeF', 'vip')]))
    const ctx = await runCommand(['tags', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Total displayed tags: 1')
  })

  it('shows the details with an ID', async () => {
    api().get('/api/tags/aBcDeF').reply(200, single(tag('aBcDeF', 'vip')))
    const ctx = await runCommand(['tags', 'aBcDeF', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('created_at')
  })
})
