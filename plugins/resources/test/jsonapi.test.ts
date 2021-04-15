import { expect, test } from '@oclif/test'

describe('resources:filters', () => {
  test
    .stdout({print: true})
    .command(['resources:list', 'orders', '-p1', '-n10', '-i=customer,customer.customer_group', '-f=customer_groups/id,name', '-f=customers/id,email,customer_group', '-w=customer_customer_group_name_eq=YNAP', '-f=id,number,customer'])
    .it('runs jsonapi denormalize output', ctx => {
      expect(ctx.stdout).to.contain('YNAP')
    })
})
