import { join } from 'node:path'
import { expect, test } from '@oclif/test'

describe('cli-dev:readme', () => {
  test
    // In the workspace @oclif/test would resolve the monorepo root, not this package
    .loadConfig({ root: join(__dirname, '../..') })
    .timeout(5000)
    .stdout()
    .command(['noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })

})
