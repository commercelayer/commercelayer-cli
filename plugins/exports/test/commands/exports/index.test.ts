import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, exportJob, list, single, useMockedApi } from '../../helpers'

describe('exports', () => {
  useMockedApi()

  it('lists the exports without an ID', async () => {
    api().get('/api/exports').query(true).reply(200, list([exportJob('eXp1')]))
    const ctx = await runCommand(['exports', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('eXp1')
  })

  it('shows the details with an ID', async () => {
    api().get('/api/exports/eXp1').reply(200, single(exportJob('eXp1')))
    const ctx = await runCommand(['exports', 'eXp1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('code_start')
  })
})
