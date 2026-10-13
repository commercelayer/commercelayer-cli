import { join } from 'node:path'
import { describeLive, liveAuth, liveDelete, liveFirst } from '@commercelayer/cli-test-utils'
import { runCommand } from '@oclif/test'
import { expect } from 'chai'

/** A business model of one customer group, referenced cli-it-seeder-group */
const MODEL = ['-u', join(__dirname, 'model'), '-b', 'custom', '-n', 'cli_it']
const REFERENCE = 'cli-it-seeder-group'

const seeded = () => liveFirst('customer_groups', { 'filter[q][reference_eq]': REFERENCE })

describeLive('seeder: seed and clean', () => {
  after(async () => liveDelete('customer_groups', await seeded()))

  it('seeds the business model', async function () {
    this.timeout(120_000)
    const ctx = await runCommand(['seeder:seed', ...(await liveAuth()), ...MODEL])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Data seeding completed')
    expect(await seeded()).to.be.a('string')
  })

  it('seeds again, updating the existing resource', async function () {
    this.timeout(120_000)
    const first = await seeded()
    const ctx = await runCommand(['seeder:seed', ...(await liveAuth()), ...MODEL])
    if (ctx.error) throw ctx.error
    expect(await seeded()).to.equal(first)
  })

  it('cleans the business model', async function () {
    this.timeout(120_000)
    const ctx = await runCommand(['seeder:clean', ...(await liveAuth()), ...MODEL])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Data cleaning completed')
    expect(await seeded()).to.equal(undefined)
  })
})
