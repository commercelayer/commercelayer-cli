import { expect, test } from '@oclif/test'

describe('external_tax_calculators:reset_circuit', () => {
  test
    .timeout(38000)
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })
})
