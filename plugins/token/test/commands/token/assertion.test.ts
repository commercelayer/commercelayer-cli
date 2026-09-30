import { expect, test } from '@oclif/test'

const payloadOf = (stdout: string) => {
  const jwt = stdout
    .split('\n')
    .map((l) => l.trim())
    .find((l) => /^[\w-]+\.[\w-]+\.[\w-]*$/.test(l)) as string
  return JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url').toString())
}

describe('token:assertion', () => {
  test
    .stdout()
    .command(['token:assertion', '-c', '-o', 'cust1'])
    .it('creates an assertion for a customer', (ctx) => {
      expect(ctx.stdout).to.contain('-= Assertion =-')
      const payload = payloadOf(ctx.stdout)
      expect(JSON.stringify(payload)).to.contain('"Customer"')
      expect(JSON.stringify(payload)).to.contain('cust1')
    })

  test
    .stdout()
    .command(['token:assertion', '-t', 'User', '-o', 'usr1', '-C', 'department=sales', '-C', 'level=3'])
    .it('creates an assertion for a user with custom claims', (ctx) => {
      const payload = JSON.stringify(payloadOf(ctx.stdout))
      expect(payload).to.contain('"User"')
      expect(payload).to.contain('usr1')
      expect(payload).to.contain('sales')
    })

  test
    .command(['token:assertion', '-c', '-o', 'cust1', '-C', 'novalue'])
    .catch(/Invalid custom claim attribute novalue/)
    .it('rejects a custom claim without a value')

  test
    .command(['token:assertion', '-o', 'cust1'])
    .catch(/type|customer|user/)
    .it('requires the owner type')
})
