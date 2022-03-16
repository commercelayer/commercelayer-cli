import { expect, test } from '@oclif/test'

describe('resources:filters', () => {
  test
    .timeout(5000)
    .stdout()
    .command(['resources:filters'])
    .it('runs resources:filters', ctx => {
      expect(ctx.stdout).to.contain('-= Commerce Layer API available resource filters =-').and.contain('*_eq')
    })
})
