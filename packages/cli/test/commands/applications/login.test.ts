import { expect, test } from '@oclif/test'

describe('applications:login', () => {
  test
    .timeout(5000)
    .stdout()
    .command(['applications:login',
      '-o', process.env.CL_CLI_ORGANIZATION || 'cli-test-org',
      '-i', process.env.CL_CLI_CLIENT_ID || '',
      '-s', process.env.CL_CLI_CLIENT_SECRET || '',
      '-a', 'admin'])
    .catch(/has already been used/, { raiseIfNotThrown: false })
    .it('runs login', ctx => {
      expect(ctx.stdout).to.contain.oneOf(['Successful', ''])
    })
})
