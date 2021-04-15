import { expect, test } from '@oclif/test'
import fs from 'fs'


const testFileName = '/Users/pierlu/Desktop/test.txt'

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

  test
    .stdout()
    .command(['resources:retrieve', 'customers', 'kZqohwBRDQ', `-X ${testFileName}`])
    .command(['resources:retrieve', 'customers', 'kZqohwBRDQ', `-x ${testFileName}`])
    .it('runs resources:retrieve save output', ctx => {
      expect(ctx.stdout).to.contain('Command output saved to file').and.contain(testFileName)
    })

  after(() => {
    if (fs.existsSync(testFileName)) fs.unlinkSync(testFileName)
  })

})
