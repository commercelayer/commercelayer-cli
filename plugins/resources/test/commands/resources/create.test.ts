import {expect, test} from '@oclif/test'

const email = String(Date.now()) + '@cli-test.com'

describe('resources:create', () => {

  test
  .stdout()
  .command(['resources:create', 'customers', `-a email=${email}`, '-r customer_group=customer_groups/EyQYahWlye', '-m meta1=value1'])
  .it('runs resources:create', ctx => {
    expect(ctx.stdout).to.contain('Success!')
  })

  test
  .stdout()
  .command(['resources:create', 'customers', `-a email=${email}`])
  .it('runs resources:create without relationships', ctx => {
    expect(ctx.stdout).to.contain('Success!')
  })

  test
  .stdout()
  .command(['resources:create', 'customers', '-a email=fake'])
  .catch(error => expect(error.message).to.contain('email - is invalid'))
  .it('runs resources:create error')

})
