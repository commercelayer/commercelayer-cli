import { Command } from '@oclif/command'
import jwt from 'jsonwebtoken'
import { print } from '../../common'


export default class UtilJwt extends Command {

  static description = 'decode a Commerce Layer JWT'

  static aliases = ['jwt']

  static hidden: true


  static args = [
    { name: 'token', description: 'the token to decode', required: true },
  ]


  async run() {

    const { args } = this.parse(UtilJwt)

    const token = args.token

    const data = jwt.decode(token)

    this.log(print(data))

  }

}
