import { clColor } from '@commercelayer/cli-core'
import { VALIDITY_MIN, VALIDITY_MAX } from './token'


type Check = (input: any) => string | true


const checkMandatory: Check = (input: any) => {
  return (input !== '') || 'The value is mandatory'
}

const checkList: Check = (input: any) => {
  // eslint-disable-next-line prefer-regex-literals
  return !input || new RegExp(/^([a-z]+)(,\s*[a-z]+)*$/i).test(input) || 'The value must be a comma separated list of strings'
}

const checkValidity: Check = (mins: string | number) => {
  const n = Number(mins)
  if (!Number.isFinite(n) || (n < 0)) return 'The value must be a positive integer'
  return ((n >= VALIDITY_MIN) && (n <= VALIDITY_MAX)) || `Token expiration time must be between ${clColor.style.number(VALIDITY_MIN)} and ${clColor.style.number(VALIDITY_MAX)} minutes`
}


export { checkMandatory, checkList, checkValidity }
