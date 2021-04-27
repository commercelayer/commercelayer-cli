import { test } from '@oclif/test'

describe('config:set', () => {
  test
    .stdout()
    .command(['config:set', 'fake', 'value'])
    .catch(/Invalid configuration param/, { raiseIfNotThrown: false })
    .it('runs config:set')
})
