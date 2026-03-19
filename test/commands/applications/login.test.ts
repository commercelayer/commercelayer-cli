import { expect } from 'chai'
import { runCommand } from '@oclif/test'

describe('applications:login', () => {
  it('runs login', async () => {
    const { stdout, error } = await runCommand([
      'applications:login',
      '-o', process.env.CL_CLI_ORGANIZATION || 'cli-test-org',
      '-i', process.env.CL_CLI_CLIENT_ID || '',
      '-s', process.env.CL_CLI_CLIENT_SECRET || '',
      '-a', 'admin',
    ])

    // significa: se l'errore matcha il pattern, ignoralo; altrimenti lascia passare il test
    if (error && !/has already been used/.test(error.message)) {
      throw error
    }

    expect(stdout).to.satisfy((s: string) => s.includes('Successful') || s === '')
  })
})