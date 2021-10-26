import { Command } from '@oclif/command'
import cliux from 'cli-ux'
import chalk from 'chalk'

export default class OrdersActions extends Command {

  static description = 'show a list of possible actions'

  static hidden = false


  async run() {

    const actionsArray = Object.keys(validActions).sort().map(a => {
      return { action: a, description: validActions[a] }
    })

    this.log()
    cliux.table(actionsArray,
      {
        action: { header: 'ACTION', minWidth: 35, get: row => chalk.blueBright(row.action) },
        description: { header: 'TO BE EXECUTED IF YOU WANT ...', get: row => row.description },
      },
      {
        printLine: this.log,
      })
    this.log()

  }
}


const validActions: any = {
  archive: 'archive the order',
  unarchive: 'unarchive the order',
  place: 'place the order',
  cancel: 'cancel a placed order (the order\'s authorization will be automatically voided)',
  approve: 'approve a placed order',
  approve_and_capture: 'approve and capture a placed order',
  authorize: 'authorize the order\'s payment source',
  capture: 'capture an approved order',
  refund: 'refund a captured order',
  update_taxes: 'force tax calculation for this order (a tax calculator must be associated to the order\'s market)',
  shipping_address_same_as_billing: 'the shipping address to be cloned from the order\'s billing address',
  billing_address_same_as_shipping: 'the billing address to be cloned from the order\'s shipping address',
  save_payment_source_to_customer_wallet: 'the order\'s payment source to be saved in the customer\'s wallet as a customer payment source',
  save_shipping_address_to_customer_address_book: 'the order\'s shipping address to be saved in the customer\'s address book as a customer address',
  save_billing_address_to_customer_address_book: 'the order\'s billing address to be saved in the customer\'s address book as a customer address',
  refresh: 'refresh an order',
} as const


export { validActions }

