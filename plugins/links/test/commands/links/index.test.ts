import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, link, list, single, useMockedApi } from '../../helpers'

describe('links', () => {
  useMockedApi()

  it('lists the links without an ID', async () => {
    api().get('/api/links').query(true).reply(200, list([link('lnK1')]))
    const ctx = await runCommand(['links', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('lnK1')
  })

  it('shows the details with an ID', async () => {
    api().get('/api/links/lnK1').query(true).reply(200, single(link('lnK1')))
    const ctx = await runCommand(['links', 'lnK1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Summer link')
  })
})
