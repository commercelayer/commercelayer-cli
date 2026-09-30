import { test } from '@oclif/test'

describe('config:del', () => {
  test
    .stdout()
    .command(['config:del', 'fake'])
    .catch(/Invalid configuration param/, { raiseIfNotThrown: false })
    .it('runs config:del')
})
