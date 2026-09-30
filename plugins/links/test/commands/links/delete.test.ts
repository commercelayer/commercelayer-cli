import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, apiError, useMockedApi } from '../../helpers'

describe('links:delete', () => {
  useMockedApi()

  it('deletes the link', async () => {
    api().delete('/api/links/lnK1').reply(204)
    const ctx = await runCommand(['links:delete', 'lnK1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('deleted link with id lnK1')
  })

  it('says when the link does not exist', async () => {
    api().delete('/api/links/nope').reply(404, apiError(404, 'Record not found'))
    const ctx = await runCommand(['links:delete', 'nope', ...AUTH])
    expect(ctx.error?.oclif?.exit ?? 0).to.equal(0)
    expect(ctx.stdout).to.contain('Link nope not found')
    expect(ctx.stdout).not.to.contain('Successfully')
  })

  it('reports a failed deletion instead of claiming success', async () => {
    api().delete('/api/links/lnK1').reply(500, apiError(500, 'Internal server error'))
    const ctx = await runCommand(['links:delete', 'lnK1', ...AUTH])
    expect(ctx.error?.message).to.match(/Internal server error/)
    expect(ctx.stdout).not.to.contain('Successfully')
  })
})
