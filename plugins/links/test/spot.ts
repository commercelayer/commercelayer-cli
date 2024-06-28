import { fillUTCDate } from '../src/util'

function checkDateValue(value: string): string {
  try {
    const parsed = Date.parse(value)
    if (Number.isNaN(parsed)) throw new Error('Invalid date')
    const isoDate = new Date(value)
    return isoDate.toISOString()
  } catch (err: any) {
    console.log(err)
    throw err
  }
}


const param = '2024-11-10T00:00:00.0Z'
console.log(param.length)

const x = fillUTCDate(param)

console.log(x)
