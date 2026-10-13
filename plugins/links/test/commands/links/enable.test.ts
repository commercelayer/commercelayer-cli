import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, link, single, useMockedApi } from '../../helpers'

describe('links:enable', () => {
  useMockedApi()

  it('enables the link', async () => {
    api()
      .patch('/api/links/lnK1', (body) => body.data.attributes._enable === true)
      .reply(200, single(link('lnK1')))
    const ctx = await runCommand(['links:enable', 'lnK1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('enabled link with id lnK1')
  })
})
