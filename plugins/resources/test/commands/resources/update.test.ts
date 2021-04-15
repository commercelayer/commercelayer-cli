import { expect, test } from '@oclif/test'
import cl from '@commercelayer/js-sdk'
import { baseURL } from '../../../src/common'
import UpdateCommand from '../../../src/commands/resources/update'
import DeleteCommand from '../../../src/commands/resources/delete'
import RetrieveCommand from '../../../src/commands/resources/retrieve'

describe('resources:update', () => {

  const email = 'update@cli-test.com'
  const ref = String(Math.floor(Math.random() * 10000)).padStart(5, '0')

  test
    .stdout()
    .command(['resources:create', 'customers', `-a email=${email}`, '-m meta_create=value_create'])
    .catch(/email - has already been taken/, { raiseIfNotThrown: false })
    .add('resId', async () => {
      cl.init({ endpoint: baseURL(process.env.CL_CLI_ORGANIZATION || 'brioni', undefined), accessToken: process.env.CL_CLI_ACCESS_TOKEN || '' })
      const res = await cl.Customer.where({ emailEq: email }).first()
      return res.id
    })
    .stdout()
    .do(ctx => UpdateCommand.run(['customers', ctx.resId, '-ju', '-m meta_update=value_update', `-a reference=${ref}`, '-r customer_group=customer_groups/EyQYahWlye']))
    .do(ctx => UpdateCommand.run(['customers', ctx.resId, '-ju', '-M meta_update2=valueUpdate2']))
    .do(ctx => RetrieveCommand.run(['customers', ctx.resId, '-jur', '-i customer_group']))
    .do(ctx => {
      expect(ctx.stdout).to.contain('Success!')
      expect(ctx.stdout).to.contain('"metadata":{"meta_update2":"valueUpdate2"}')
      expect(ctx.stdout).to.contain(`"reference":"${ref}"`)
      expect(ctx.stdout).to.contain('"included":[{"id":"EyQYahWlye","type":"customer_groups"')
    })
    .do(ctx => DeleteCommand.run(['customers', ctx.resId]))
    .it('runs resources:update')

  test
    .stdout()
    .command(['resources:update', 'customers', 'fake'])
    .catch(error => expect(error.message).to.contain('RECORDNOTFOUND'))
    .it('runs resources:update error')


})
