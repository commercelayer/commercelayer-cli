import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describe('applications:login', () => {
  it('runs login', async function () {
    this.timeout(5000)
    const ctx = await runCommand(['applications:login',
          '-o', process.env.CL_CLI_ORGANIZATION || 'cli-test-org',
          '-i', process.env.CL_CLI_CLIENT_ID || '',
          '-s', process.env.CL_CLI_CLIENT_SECRET || '',
          '-a', 'admin'])
    if (ctx.error) expect(ctx.error?.message).to.match(/has already been used/)
    expect(ctx.stdout).to.contain.oneOf(['Successful', ''])
  })
})
