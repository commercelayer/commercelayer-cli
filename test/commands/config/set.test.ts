import { runCommand } from '@oclif/test'

describe('config:set', () => {
  it('runs config:set', async () => {
    const { error } = await runCommand(['config:set', 'fake', 'value'])

    if (error && !/Invalid configuration param/.test(error.message)) {
      throw error
    }
  })
})