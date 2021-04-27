import {expect, test} from '@oclif/test'

describe('resources', () => {
  test
  .stdout()
  .command(['resources'])
  .it('runs resources', ctx => {
    expect(ctx.stdout).to.contain('-= Commerce Layer API available resources =-').and.contain('addresses')
  })
})
