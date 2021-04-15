import { expect, test } from '@oclif/test'
import fs from 'fs'


const testFileName = '/Users/pierlu/Desktop/test.txt'

describe('resources:list', () => {

  test
    .env({ CL_CLI_ORGANIZATION: 'brioni' })
    .stdout()
    .command(['resources:list', 'customers', '-p=1', '-n=1', '-w status_eq=prospect', '-i customer_group', '-w customer_group_name_eq=YNAP', '-s=-updated_at', '-r'])
    .it('runs resources:list', ctx => {
      expect(ctx.stdout).to.contain("status: 'prospect'").and.not.contain("status: 'acquired'")
    })

  test
    .stdout()
    .command(['resources:list', 'customers', '--fields=fake'])
    .catch(error => expect(error.message).to.contain('Invalid field'))
    .it('runs resources:list error')

  test
    .stdout()
    .command(['resources:list', 'customers', `-X ${testFileName}`])
    .command(['resources:list', 'customers', `-x ${testFileName}`])
    .it('runs resources:list save output', ctx => {
      expect(ctx.stdout).to.contain('Command output saved to file').and.contain(testFileName)
    })

  test
    .stdout()
    .command(['resources:list', 'customers', '-w email_eq=fake'])
    .it('runs resources:list no records', ctx => {
      expect(ctx.stdout).to.contain('No records found')
    })

  after(() => {
    if (fs.existsSync(testFileName)) fs.unlinkSync(testFileName)
  })

})

