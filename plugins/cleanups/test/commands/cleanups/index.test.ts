import { expect, test } from '@oclif/test'
import { AUTH, api, cleanup, list, single, useMockedApi } from '../../helpers'

describe('cleanups', () => {
  useMockedApi()

  test
    .do(() => {
      api().get('/api/cleanups').query(true).reply(200, list([cleanup('cLn1')]))
    })
    .stdout()
    .command(['cleanups', ...AUTH])
    .it('lists the cleanups without an ID', (ctx) => {
      expect(ctx.stdout).to.contain('cLn1')
    })

  test
    .do(() => {
      api().get('/api/cleanups/cLn1').reply(200, single(cleanup('cLn1')))
    })
    .stdout()
    .command(['cleanups', 'cLn1', ...AUTH])
    .it('shows the details with an ID', (ctx) => {
      expect(ctx.stdout).to.contain('code_start')
    })
})
