import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, link, single, useMockedApi } from '../../helpers'

describe('links:disable', () => {
  useMockedApi()

  it('disables the link', async () => {
    api()
      .patch('/api/links/lnK1', (body) => body.data.attributes._disable === true)
      .reply(200, single(link('lnK1', { active: false, status: 'disabled' })))
    const ctx = await runCommand(['links:disable', 'lnK1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('disabled link with id lnK1')
  })
})
