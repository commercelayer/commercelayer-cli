import { runCommand } from '@oclif/test'
import { expect } from 'chai'

const payloadOf = (stdout: string) => {
  const jwt = stdout
    .split('\n')
    .map((l) => l.trim())
    .find((l) => /^[\w-]+\.[\w-]+\.[\w-]*$/.test(l)) as string
  return JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url').toString())
}

describe('token:assertion', () => {
  it('creates an assertion for a customer', async () => {
    const ctx = await runCommand(['token:assertion', '-c', '-o', 'cust1'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('-= Assertion =-')
    const payload = payloadOf(ctx.stdout)
    expect(JSON.stringify(payload)).to.contain('"Customer"')
    expect(JSON.stringify(payload)).to.contain('cust1')
  })

  it('creates an assertion for a user with custom claims', async () => {
    const ctx = await runCommand(['token:assertion', '-t', 'User', '-o', 'usr1', '-C', 'department=sales', '-C', 'level=3'])
    if (ctx.error) throw ctx.error
    const payload = JSON.stringify(payloadOf(ctx.stdout))
    expect(payload).to.contain('"User"')
    expect(payload).to.contain('usr1')
    expect(payload).to.contain('sales')
  })

  it('rejects a custom claim without a value', async () => {
    const ctx = await runCommand(['token:assertion', '-c', '-o', 'cust1', '-C', 'novalue'])
    expect(ctx.error?.message).to.match(/Invalid custom claim attribute novalue/)
  })

  it('requires the owner type', async () => {
    const ctx = await runCommand(['token:assertion', '-o', 'cust1'])
    expect(ctx.error?.message).to.match(/type|customer|user/)
  })
})
