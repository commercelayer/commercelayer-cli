import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, apiError, link, single, useMockedApi } from '../../helpers'

describe('links:open', () => {
  useMockedApi()

  it('says when the link does not exist', async () => {
    api().get('/api/links/nope').reply(404, apiError(404, 'Record not found'))
    const ctx = await runCommand(['links:open', 'nope', ...AUTH])
    expect(ctx.error?.oclif?.exit ?? 0).to.equal(0)
    expect(ctx.stdout).to.contain('Link nope not found')
  })

  it('fails when the link has no URL', async () => {
    api().get('/api/links/lnK1').reply(200, single(link('lnK1', { url: null })))
    const ctx = await runCommand(['links:open', 'lnK1', ...AUTH])
    expect(ctx.error?.message).to.match(/Link's URL is empty/)
  })
})
