import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { token } from '../../helpers'

describe('token:decode', () => {
  it('prints the token info and its expiration', async () => {
    const ctx = await runCommand(['token:decode', token()])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Access token info')
    expect(ctx.stdout).to.contain('test-org')
    expect(ctx.stdout).to.contain('integration')
    expect(ctx.stdout).to.contain('This access token will expire at')
    expect(ctx.stdout).not.to.contain('Token expired!')
  })

  it('warns about an expired token', async () => {
    const ctx = await runCommand(['token:decode', token({ exp: 1000000000 })])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Token expired!')
  })

  it('prints the full token, header included', async () => {
    const ctx = await runCommand(['token:info', token(), '-f'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('HS512')
    expect(ctx.stdout).to.contain('kid1')
  })
})
