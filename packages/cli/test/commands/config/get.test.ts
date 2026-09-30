import { expect, test } from '@oclif/test'

describe('config:get', () => {
  test
    .stdout()
    .command(['config:get', 'currentApplication'])
    .it('runs config:get', ctx => {
      expect(ctx.stdout).to.contain('currentApplication =')
    })
})
