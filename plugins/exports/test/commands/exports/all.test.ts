import { test } from '@oclif/test'
import { AUTH } from '../../helpers'

describe('exports:all', () => {
  test
    .command(['exports:all', ...AUTH, '-t', 'skus', '-x', 'out'])
    .catch(/This command is deprecated, please use the updated version of the command exports:create/)
    .it('is deprecated in favour of exports:create')
})
