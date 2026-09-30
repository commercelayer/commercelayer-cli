import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, mockTagByName, single, tag, useMockedApi } from '../../helpers'

describe('tags:update', () => {
  useMockedApi()

  it('renames a tag found by ID', async () => {
    api()
      .get('/api/tags/aBcDeF')
      .reply(200, single(tag('aBcDeF', 'vip')))
      .patch('/api/tags/aBcDeF', (body) => body.data.id === 'aBcDeF' && body.data.attributes.name === 'gold')
      .reply(200, single(tag('aBcDeF', 'gold')))
    const ctx = await runCommand(['tags:update', 'aBcDeF', ...AUTH, '-n', 'gold'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('updated name of tag with ID aBcDeF: vip --> gold')
  })

  it('renames a tag found by name', async () => {
    mockTagByName(api(), 'vip', tag('aBcDeF', 'vip'))
      .patch('/api/tags/aBcDeF')
      .reply(200, single(tag('aBcDeF', 'gold')))
    const ctx = await runCommand(['tags:update', 'vip', ...AUTH, '-n', 'gold'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('vip --> gold')
  })

  it('rejects an invalid new name', async () => {
    const ctx = await runCommand(['tags:update', 'vip', ...AUTH, '-n', '"not a valid name!"'])
    expect(ctx.error?.message).to.match(/Invalid tag name/)
  })
})
