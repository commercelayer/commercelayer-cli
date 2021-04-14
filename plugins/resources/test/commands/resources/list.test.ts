import {expect, test} from '@oclif/test'

describe('resources:list', () => {

  test
  .env({CL_CLI_ORGANIZATION: 'brioni'})
  .stdout()
  .command(['resources:list', 'customers', '-p=1', '-n=1', '-w status_eq=prospect', '-i customer_group', '-w customer_group_name_eq=YNAP', '-s=-updated_at'])
  .it('runs resources:list', ctx => {
    expect(ctx.stdout).to.contain("status: 'prospect'").and.not.contain("status: 'acquired'")
  })

  test
  .stdout()
  .command(['resources:list', 'customers', '--fields=fake'])
  .catch(error => expect(error.message).to.contain('Invalid field'))
  .it('runs resources:list error')

})

