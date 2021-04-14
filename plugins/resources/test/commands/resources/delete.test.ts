import { expect, test } from '@oclif/test'
import cl from '@commercelayer/js-sdk'
import { baseURL } from '../../../src/common'
import DeleteCommand from '../../../src/commands/resources/delete'



describe('resources:delete', () => {

  test
    .stdout()
    .add('customerId', async () => {
      cl.init({ endpoint: baseURL(process.env.CL_CLI_ORGANIZATION || 'brioni', undefined), accessToken: process.env.CL_CLI_ACCESS_TOKEN || '' })
      const res = await cl.Customer.where({ emailEnd: '@cli-test.com' }).first()
      return res.id
    })
    .do(ctx => DeleteCommand.run(['customers', ctx.customerId]))
    .it('runs resources:delete', ctx => {
      expect(ctx.stdout).to.contain('Success!')
    })

  test
    .stdout()
    .command(['resources:delete', 'customers', 'fake'])
    .catch(error => expect(error.message).to.contain('RECORDNOTFOUND'))
    .it('runs resources:delete error')

})
