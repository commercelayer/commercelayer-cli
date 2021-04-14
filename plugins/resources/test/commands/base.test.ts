import { test } from '@oclif/test'

describe('base command source coverage', () => {

  test
    .stdout()
    .command(['resources:retrieve', 'customers/ID', 'ID'])
    .catch(/Double definition of resource id/, { raiseIfNotThrown: false })
    .it('runs retrieve double id definition')

  test
    .stdout()
    .command(['resources:retrieve', 'customers/ID'])
    .catch(/RECORD_NOT_FOUND/, { raiseIfNotThrown: false })
    .it('runs retrieve slash id definition')


  test
    .stdout()
    .command(['resources:list', 'customers', '-p=1', '-n=1', '-s=updated_at,fake'])
    .catch(/fake is not a valid sort criteria/, { raiseIfNotThrown: false })
    .it('runs invalid sort criteria')

  test
    .stdout()
    .command(['resources:list', 'customers', '-p=1', '-n=1', '-s=updated_at,desc'])
    .it('runs valid sort criteria')

  test
    .stdout()
    .command(['resources:retrieve', 'customers', 'kZqohwBRDQ', '--fields=id,email', '--include=customer_group', '--accessToken=fake'])
    .catch(/Unauthorized/, { raiseIfNotThrown: false })
    .it('runs invalid accessToken')

  test
    .stdout()
    .command(['resources:retrieve', 'customers', 'kZqohwBRDQ', '-j'])
    .it('runs output json format')
/*
  test
    .stdout()
    .command(['resources:retrieve', 'customers', 'kZqohwBRDQ', '-u'])
    .catch(/--json= must also be provided when using --unformatted=/, { raiseIfNotThrown: false })
    .it('runs output unformatted')
*/
/*
  test
    .stdout()
    .command(['resources:retrieve', 'customers', 'kZqohwBRDQ', '-ju'])
    .catch(/--json= must also be provided when using --unformatted=/, { raiseIfNotThrown: false })
    .it('runs output json unformatted')
*/
    test
    .stdout()
    .command(['resources:retrieve', 'customers', 'kZqohwBRDQ', '--fields=customer_groups/name', '--fields=customer_group.fake1.fake2/fakeField', '--fields=id,email'])
    .catch(/Invalid resource/, { raiseIfNotThrown: false })
    .it('runs multiple resources in field flag')

})
