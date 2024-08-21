
import { fixDashedFlagValue } from '../src/command'
import { clApi } from '../src'

const argv = ['-o', 'costa-coffee-demo', '-i', '-a2il5AjVhLJAldaykzE9A8LtA6mOty8Pkp3INIW0D8', '-S', 'market:15769', '-a', 'costa-south']

const clientId = '-a2il5AjVhLJAldaykzE9A8LtA6mOty8Pkp3INIW0D8'

const flag = {
	name: 'clientId',
	char: 'i'
}

const parsed = {
	argv: [],
	flags: {
	  organization: 'costa-coffee-demo',
	  clientId: '____-a2il5AjVhLJAldaykzE9A8LtA6mOty8Pkp3INIW0D8',
	  scope: [ 'market:15769' ],
	  alias: 'costa-south'
	},
	args: {},
	raw: [
	  { type: 'flag', flag: 'organization', input: 'costa-coffee-demo' },
	  {
		type: 'flag',
		flag: 'clientId',
		input: '____-a2il5AjVhLJAldaykzE9A8LtA6mOty8Pkp3INIW0D8'
	  },
	  { type: 'flag', flag: 'scope', input: 'market:15769' },
	  { type: 'flag', flag: 'alias', input: 'costa-south' }
	],
	metadata: { flags: { debug: {}, provisioning: {} } },
	nonExistentFlags: []
  }


console.log(argv)
fixDashedFlagValue(argv, flag)
console.log(argv)
fixDashedFlagValue(argv, flag, undefined, parsed)
console.log(argv)
console.log(parsed)
