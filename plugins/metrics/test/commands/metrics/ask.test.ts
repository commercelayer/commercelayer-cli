import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { token } from '../../helpers'

// The chat itself is interactive (readline + streamed answers): only the
// checks done before it starts are tested here.
describe('metrics:ask', () => {
  it('rejects other application kinds', async () => {
    const { error } = await runCommand(['metrics:ask', 'how many orders?', '-o', 'test-org', '-a', token('sales_channel')])
    expect(error?.message).to.contain('Invalid application kind: sales_channel')
  })

  it('rejects an access token of another organization', async () => {
    const { error } = await runCommand(['metrics:ask', 'how many orders?', '-o', 'test-org', '-a', token('integration', 'other-org')])
    expect(error?.message).to.contain('belongs to a wrong organization')
  })
})
