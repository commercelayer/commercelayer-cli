import { expect, test } from '@oclif/test'
import { token } from '../../helpers'

describe('token:decode', () => {
  test
    .stdout()
    .command(['token:decode', token()])
    .it('prints the token info and its expiration', (ctx) => {
      expect(ctx.stdout).to.contain('Access token info')
      expect(ctx.stdout).to.contain('test-org')
      expect(ctx.stdout).to.contain('integration')
      expect(ctx.stdout).to.contain('This access token will expire at')
      expect(ctx.stdout).not.to.contain('Token expired!')
    })

  test
    .stdout()
    .command(['token:decode', token({ exp: 1000000000 })])
    .it('warns about an expired token', (ctx) => {
      expect(ctx.stdout).to.contain('Token expired!')
    })

  test
    .stdout()
    .command(['token:info', token(), '-f'])
    .it('prints the full token, header included', (ctx) => {
      expect(ctx.stdout).to.contain('HS512')
      expect(ctx.stdout).to.contain('kid1')
    })
})
