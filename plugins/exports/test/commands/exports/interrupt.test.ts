import { expect, test } from '@oclif/test'
import { AUTH, api, exportJob, single, useMockedApi } from '../../helpers'

describe('exports:interrupt', () => {
  useMockedApi()

  test
    .do(() => {
      api()
        .get('/api/exports/eXp1')
        .reply(200, single(exportJob('eXp1', { status: 'in_progress' })))
        .patch('/api/exports/eXp1', (body) => body.data.attributes._interrupt === true)
        .reply(200, single(exportJob('eXp1', { status: 'interrupted' })))
    })
    .stdout()
    .command(['exports:interrupt', 'eXp1', ...AUTH])
    .it('interrupts a running export', (ctx) => {
      expect(ctx.stdout).to.contain('Export eXp1 has been successfully interrupted')
    })

  test
    .do(() => {
      api().get('/api/exports/eXp1').reply(200, single(exportJob('eXp1')))
    })
    .stdout()
    .command(['exports:interrupt', 'eXp1', ...AUTH])
    .it('leaves a completed export alone', (ctx) => {
      expect(ctx.stdout).to.contain('Export eXp1 is already completed')
    })
})
