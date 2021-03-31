import {expect, test} from '@oclif/test'

describe('resources:retrieve', () => {

  test
  .stdout()
  .command(['resources:retrieve', 'customers/10', '--organization', 'brioni', '--accessToken', 'x'])
  .it('runs resources:retrieve', ctx => {
    expect(ctx.stdout).to.contain('data')
  })

  test
  .stdout()
  .command(['resources:retrieve', '--name', 'jeff'])
  .it('runs resources:retrieve --name jeff', ctx => {
    expect(ctx.stdout).to.contain('Error: Missing 1 required arg')
  })

})
