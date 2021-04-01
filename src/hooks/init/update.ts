
import { Hook } from '@oclif/config'
import updateNotifier from 'update-notifier'
// import { inspect } from 'util'

const pkg = require('../../../package.json')


const second = 1000
const minute = second * 60
const hour = minute * 60
const day = hour * 24
// const week = day * 7


const hook: Hook<'init'> = async function (_opts) {

  // this.log('Checking for CLI updates ...')
  const notifier = updateNotifier({ pkg, updateCheckInterval: day })

  notifier.notify()
  // console.log(notifier.update)
  // this.log(inspect(notifier, false, null, true))

}

export default hook
