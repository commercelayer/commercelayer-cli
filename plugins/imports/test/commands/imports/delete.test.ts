import { expect, test } from '@oclif/test'
import { AUTH, api, notFound, useMockedApi } from '../../helpers'

describe('imports:delete', () => {
  useMockedApi()

  test
    .do(() => {
      api().delete('/api/imports/iMp1').reply(204)
    })
    .stdout()
    .command(['imports:delete', 'iMp1', ...AUTH])
    .it('deletes the import', (ctx) => {
      expect(ctx.stdout).to.contain('deleted import with id iMp1')
    })

  test
    .do(() => {
      api().delete('/api/imports/nope').reply(404, notFound())
    })
    .command(['imports:delete', 'nope', ...AUTH])
    .catch(/nope|not found/i)
    .it('reports a missing import as a command error')
})
