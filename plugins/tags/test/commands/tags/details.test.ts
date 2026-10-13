import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, mockTagByName, single, tag, useMockedApi } from '../../helpers'

describe('tags:details', () => {
  useMockedApi()

  it('shows the tag attributes', async () => {
    api().get('/api/tags/aBcDeF').reply(200, single(tag('aBcDeF', 'vip')))
    const ctx = await runCommand(['tags:details', 'aBcDeF', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('aBcDeF')
    expect(ctx.stdout).to.contain('vip')
    expect(ctx.stdout).to.contain('created_at')
    expect(ctx.stdout).not.to.contain('reference_origin')
  })

  it('says when the tag does not exist', async () => {
    mockTagByName(api(), 'ghost')
    const ctx = await runCommand(['tags:details', 'ghost', ...AUTH])
    expect(ctx.error?.oclif?.exit ?? 0).to.equal(0)
    expect(ctx.stdout).to.contain('Unable to find tag with this ID or name: ghost')
  })
})
