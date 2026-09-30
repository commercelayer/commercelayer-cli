import { expect, test } from '@oclif/test'
import { AUTH, api, cleanup, list, useMockedApi } from '../../helpers'

describe('cleanups:group', () => {
  useMockedApi()

  test
    .do(() => {
      api()
        .get('/api/cleanups')
        .query((q) => q['filter[q][reference_start]'] === 'group1-' && q.sort === 'reference,-completed_at')
        .reply(200, list([cleanup('cLn1'), cleanup('cLn2', { reference: 'group1-0002' })]))
    })
    .stdout()
    .command(['cleanups:group', 'group1', ...AUTH])
    .it('lists the cleanups of a group', (ctx) => {
      expect(ctx.stdout).to.contain('cLn1')
      expect(ctx.stdout).to.contain('cLn2')
    })
})
