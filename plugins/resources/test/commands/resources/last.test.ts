import { test } from '@oclif/test'
import { AUTH } from '../../helpers'

describe('resources:last', () => {
  test
    .stdout()
    .command(['resources:last', 'unicorns', ...AUTH])
    .catch(/Invalid resource unicorns/)
    .it('rejects an unknown resource')
})
