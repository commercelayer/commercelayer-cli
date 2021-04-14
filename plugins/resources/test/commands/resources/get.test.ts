import {expect, test} from '@oclif/test'

describe('resources:get resource', () => {
  test
  .stdout()
  .command(['resources:get', 'customers', 'kZqohwBRDQ', '--fields=id,email', '--include=customer_group'])
  .it('runs resources:get', ctx => {
    expect(ctx.stdout).to.contain("id: 'kZqohwBRDQ'")
  })
})

describe('resources:get resource list', () => {

  test
  .stdout()
  .command(['resources:get', 'customers', '-p=1', '-n=1', '-w status_eq=prospect', '-f email,status', '-i customer_group', '-w customer_group_name_eq=YNAP', '-f=customer_groups/name'])
  .it('runs resources:get', ctx => {
    expect(ctx.stdout).to.contain("status: 'prospect'").and.not.contain("status: 'acquired'")
  })

  test
  .stdout()
  .command(['resources:get', 'customers', 'kZqohwBRDQ', '--domain=commercelayer.io'])
  .it('runs resources:get with domain', ctx => {
    expect(ctx.stdout).to.contain("id: 'kZqohwBRDQ'")
  })

})
