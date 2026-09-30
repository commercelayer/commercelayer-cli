import { join } from 'node:path'
import { runCommand } from '@oclif/test'
import { expect } from 'chai'

describe('cli-dev:readme', () => {
  it('runs NoC', async function () {
    this.timeout(5000)
    const ctx = await runCommand(['noc'], { root: join(__dirname, '../..') })
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('-= NoC =-')
  })

})
