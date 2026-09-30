import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, mockTagByName, tag, useMockedApi } from '../../helpers'

describe('tags:delete', () => {
  useMockedApi()

  it('deletes a tag found by name', async () => {
    mockTagByName(api(), 'vip', tag('aBcDeF', 'vip')).delete('/api/tags/aBcDeF').reply(204)
    const ctx = await runCommand(['tags:delete', ...AUTH, '-n', 'vip'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Deleted tag vip with id aBcDeF')
    expect(ctx.stdout).to.contain('deleted tag: vip')
  })

  it('skips a tag that does not exist', async () => {
    mockTagByName(api(), 'ghost')
    const ctx = await runCommand(['tags:delete', ...AUTH, '-n', 'ghost'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Unable to find tag with this ID or name: ghost')
    expect(ctx.stdout).not.to.contain('Successfully')
  })
})
