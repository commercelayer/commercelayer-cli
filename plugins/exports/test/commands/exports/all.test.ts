import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH } from '../../helpers'

describe('exports:all', () => {
  it('is deprecated in favour of exports:create', async () => {
    const ctx = await runCommand(['exports:all', ...AUTH, '-t', 'skus', '-x', 'out'])
    expect(ctx.error?.message).to.match(/This command is deprecated, please use the updated version of the command exports:create/)
  })
})
