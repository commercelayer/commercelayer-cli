import { expect, test } from '@oclif/test'
import { AUTH, api, mockTagByName, tag, useMockedApi } from '../../helpers'

describe('tags:delete', () => {
  useMockedApi()

  test
    .do(() => {
      mockTagByName(api(), 'vip', tag('aBcDeF', 'vip')).delete('/api/tags/aBcDeF').reply(204)
    })
    .stdout()
    .command(['tags:delete', ...AUTH, '-n', 'vip'])
    .it('deletes a tag found by name', (ctx) => {
      expect(ctx.stdout).to.contain('Deleted tag vip with id aBcDeF')
      expect(ctx.stdout).to.contain('deleted tag: vip')
    })

  test
    .do(() => {
      mockTagByName(api(), 'ghost')
    })
    .stdout()
    .command(['tags:delete', ...AUTH, '-n', 'ghost'])
    .it('skips a tag that does not exist', (ctx) => {
      expect(ctx.stdout).to.contain('Unable to find tag with this ID or name: ghost')
      expect(ctx.stdout).not.to.contain('Successfully')
    })
})
