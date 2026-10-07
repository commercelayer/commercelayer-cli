import { expect, test } from '@oclif/test'
import { AUTH, api, exportJob, list, useMockedApi } from '../../helpers'

describe('exports:group', () => {
  useMockedApi()

  test
    .do(() => {
      api()
        .get('/api/exports')
        .query((q) => q['filter[q][reference_start]'] === 'group1-' && q.sort === 'reference,-completed_at')
        .reply(200, list([exportJob('eXp1'), exportJob('eXp2', { reference: 'group1-0002' })]))
    })
    .stdout()
    .command(['exports:group', 'group1', ...AUTH])
    .it('lists the exports of a group', (ctx) => {
      expect(ctx.stdout).to.contain('eXp1')
      expect(ctx.stdout).to.contain('eXp2')
    })
})
