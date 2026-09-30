import { expect, test } from '@oclif/test'
import { AUTH, api, exportJob, list, single, useMockedApi } from '../../helpers'

describe('exports', () => {
  useMockedApi()

  test
    .do(() => {
      api().get('/api/exports').query(true).reply(200, list([exportJob('eXp1')]))
    })
    .stdout()
    .command(['exports', ...AUTH])
    .it('lists the exports without an ID', (ctx) => {
      expect(ctx.stdout).to.contain('eXp1')
    })

  test
    .do(() => {
      api().get('/api/exports/eXp1').reply(200, single(exportJob('eXp1')))
    })
    .stdout()
    .command(['exports', 'eXp1', ...AUTH])
    .it('shows the details with an ID', (ctx) => {
      expect(ctx.stdout).to.contain('code_start')
    })
})
