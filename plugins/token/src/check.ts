import { VALIDITY_MIN, VALIDITY_MAX } from './token'
import chalk from 'chalk'


type Check = (input: any) => string | true


const checkMandatory: Check = (input: any) => {
  return (input !== '') || 'The value is mandatory'
}

const checkList: Check = (input: any) => {
  return !input || new RegExp(/^([a-z]+)(,\s*[a-z]+)*$/i).test(input) || 'The value must be a comma separated list of strings'
}

const checkValidity: Check = (mins: string | number) => {
  const n = Number(mins)
  if (!Number.isFinite(n) || (n < 0)) return 'The value must be a positive integer'
  return ((n >= VALIDITY_MIN) && (n <= VALIDITY_MAX)) || `Token expiration time must be between ${chalk.yellowBright(VALIDITY_MIN)} and ${chalk.yellowBright(VALIDITY_MAX)} minutes`
}


export { checkMandatory, checkList, checkValidity }
