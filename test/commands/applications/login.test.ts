import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describe('applications:login', () => {
  it('runs login', async () => {
    const { stdout, error } = await runCommand([
      'applications:login',
      '-o', process.env.CL_CLI_ORGANIZATION || 'cli-test-org',
      '-i', process.env.CL_CLI_CLIENT_ID || '',
      '-s', process.env.CL_CLI_CLIENT_SECRET || '',
      '-a', 'admin',
    ])

    if (error && !/has already been used/.test(error.message)) {
      throw error
    }

    expect(stdout).to.be.a('string')
  })
})