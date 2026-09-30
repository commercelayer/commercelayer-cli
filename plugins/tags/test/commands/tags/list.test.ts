import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, list, tag, useMockedApi } from '../../helpers'

describe('tags:list', () => {
  useMockedApi()

  it('lists the tags, newest first', async () => {
    api()
      .get('/api/tags')
      .query((q) => q.sort === '-created_at' && q['page[number]'] === '1')
      .reply(200, list([tag('aBcDeF', 'vip'), tag('gHiJkL', 'wholesale')]))
    const ctx = await runCommand(['tags:list', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('vip')
    expect(ctx.stdout).to.contain('wholesale')
    expect(ctx.stdout).to.contain('aBcDeF')
    expect(ctx.stdout).to.contain('Total displayed tags: 2')
  })

  it('says when there are no tags', async () => {
    api().get('/api/tags').query(true).reply(200, list([]))
    const ctx = await runCommand(['tags:list', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('No tags found')
  })

  it('uses the limit as page size', async () => {
    api()
      .get('/api/tags')
      .query((q) => q['page[size]'] === '5')
      .reply(200, list([tag('aBcDeF', 'vip')]))
    const ctx = await runCommand(['tags:list', ...AUTH, '-l', '5'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('vip')
  })

  it('rejects a non-positive limit', async () => {
    const ctx = await runCommand(['tags:list', ...AUTH, '-l', '0'])
    expect(ctx.error?.message).to.match(/Limit must be a positive integer/)
  })

  it('reports an invalid access token', async () => {
    api()
      .get('/api/tags')
      .query(true)
      .reply(401, { errors: [{ title: 'Invalid token', detail: 'The access token you provided is invalid.', code: 'INVALID_TOKEN', status: '401' }] })
    const ctx = await runCommand(['tags:list', ...AUTH])
    expect(ctx.error?.message).to.match(/Invalid token/)
  })
})
