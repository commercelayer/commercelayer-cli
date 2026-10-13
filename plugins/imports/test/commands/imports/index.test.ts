import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, importJob, list, single, useMockedApi } from '../../helpers'

describe('imports', () => {
  useMockedApi()

  it('lists the imports without an ID', async () => {
    api().get('/api/imports').query(true).reply(200, list([importJob('iMp1')]))
    const ctx = await runCommand(['imports', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('iMp1')
  })

  it('shows the details with an ID', async () => {
    api().get('/api/imports/iMp1').reply(200, single(importJob('iMp1')))
    const ctx = await runCommand(['imports', 'iMp1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('iMp1')
  })
})
