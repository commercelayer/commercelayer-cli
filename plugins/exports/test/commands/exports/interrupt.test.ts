import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, exportJob, single, useMockedApi } from '../../helpers'

describe('exports:interrupt', () => {
  useMockedApi()

  it('interrupts a running export', async () => {
    api()
      .get('/api/exports/eXp1')
      .reply(200, single(exportJob('eXp1', { status: 'in_progress' })))
      .patch('/api/exports/eXp1', (body) => body.data.attributes._interrupt === true)
      .reply(200, single(exportJob('eXp1', { status: 'interrupted' })))
    const ctx = await runCommand(['exports:interrupt', 'eXp1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Export eXp1 has been successfully interrupted')
  })

  it('leaves a completed export alone', async () => {
    api().get('/api/exports/eXp1').reply(200, single(exportJob('eXp1')))
    const ctx = await runCommand(['exports:interrupt', 'eXp1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Export eXp1 is already completed')
  })
})
