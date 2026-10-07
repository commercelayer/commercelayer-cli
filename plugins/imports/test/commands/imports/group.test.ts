import { expect, test } from '@oclif/test'
import { AUTH, api, importJob, list, useMockedApi } from '../../helpers'

describe('imports:group', () => {
  useMockedApi()

  test
    .do(() => {
      api()
        .get('/api/imports')
        .query((q) => q['filter[q][reference_start]'] === 'group1-' && q.sort === 'reference,-completed_at')
        .reply(200, list([importJob('iMp1'), importJob('iMp2', { reference: 'group1-0002' })]))
    })
    .stdout()
    .command(['imports:group', 'group1', ...AUTH])
    .it('lists the imports of a group', (ctx) => {
      expect(ctx.stdout).to.contain('iMp1')
      expect(ctx.stdout).to.contain('iMp2')
    })
})
