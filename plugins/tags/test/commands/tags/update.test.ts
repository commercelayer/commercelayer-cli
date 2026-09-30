import { expect, test } from '@oclif/test'
import { AUTH, api, mockTagByName, single, tag, useMockedApi } from '../../helpers'

describe('tags:update', () => {
  useMockedApi()

  test
    .do(() => {
      api()
        .get('/api/tags/aBcDeF')
        .reply(200, single(tag('aBcDeF', 'vip')))
        .patch('/api/tags/aBcDeF', (body) => body.data.id === 'aBcDeF' && body.data.attributes.name === 'gold')
        .reply(200, single(tag('aBcDeF', 'gold')))
    })
    .stdout()
    .command(['tags:update', 'aBcDeF', ...AUTH, '-n', 'gold'])
    .it('renames a tag found by ID', (ctx) => {
      expect(ctx.stdout).to.contain('updated name of tag with ID aBcDeF: vip --> gold')
    })

  test
    .do(() => {
      mockTagByName(api(), 'vip', tag('aBcDeF', 'vip'))
        .patch('/api/tags/aBcDeF')
        .reply(200, single(tag('aBcDeF', 'gold')))
    })
    .stdout()
    .command(['tags:update', 'vip', ...AUTH, '-n', 'gold'])
    .it('renames a tag found by name', (ctx) => {
      expect(ctx.stdout).to.contain('vip --> gold')
    })

  test
    .command(['tags:update', 'vip', ...AUTH, '-n', 'not a valid name!'])
    .catch(/Invalid tag name/)
    .it('rejects an invalid new name')
})
