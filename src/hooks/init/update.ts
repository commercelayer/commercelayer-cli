import { Hook } from '@oclif/config'
import updateNotifier from 'update-notifier'

const pkg = require('../../../package.json')


const hook: Hook<'init'> = async function (_opts) {
  const notifier = updateNotifier({ pkg })
  notifier.notify()
  // console.log(notifier.update)
}

export default hook
