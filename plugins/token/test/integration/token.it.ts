import { describeLive, LIVE_ORG } from '@commercelayer/cli-test-utils'
import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describeLive('token', () => {
  const credentials = ['-o', LIVE_ORG, '-i', process.env.CL_CLI_CLIENT_ID as string, '-s', process.env.CL_CLI_CLIENT_SECRET as string]

  it('gets an access token with the client credentials', async () => {
    const ctx = await runCommand(['token:get', ...credentials])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.match(/eyJ[\w-]+\.[\w-]+\.[\w-]+/)
  })

  it('gets an access token and its info', async () => {
    const ctx = await runCommand(['token:get', ...credentials, '--info'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain(LIVE_ORG)
  })
})
