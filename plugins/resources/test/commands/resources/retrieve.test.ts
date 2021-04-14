import { expect, test } from '@oclif/test'

describe('resources:retrieve', () => {

  test
    .stdout()
    .command(['resources:retrieve', 'customers', 'kZqohwBRDQ', '--fields=id,email', '--include=customer_group'])
    .it('runs resources:retrieve', ctx => {
      expect(ctx.stdout).to.contain("id: 'kZqohwBRDQ'")
    })

  test
    .stdout()
    .command(['resources:retrieve', 'customers', 'kZqohwBRDQ', '--fields=fake'])
    .catch(error => expect(error.message).to.contain('Invalid field'))
    .it('runs resources:retrieve error')

})
