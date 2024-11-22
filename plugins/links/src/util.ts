import { clColor, clOutput } from "@commercelayer/cli-core"
import type { Link } from "@commercelayer/sdk"

export const DOC_DATE_TIME_STRING_FORMAT = 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format'


export const linkStatus = (status?: Link['status']): string => {
  if (!status) return ''
  switch (status.toLowerCase()) {
    case 'active': return clColor.msg.success(status)
    case 'expired': return clColor.msg.warning(status)
    case 'disabled': return clColor.msg.error(status)
    case 'pending':
    default: return status
  }
}


export const fillUTCDate = (date: string): string => {
  const parsed = Date.parse(date)
  if (Number.isNaN(parsed)) throw new Error('Invalid date: ' + date)
  switch (date.length) {
    case 4: return fillUTCDate(date + '-01')
    case 7: return fillUTCDate(date + '-01')
    case 10: return fillUTCDate(date + 'T00:00')
    case 16: return fillUTCDate(date + ':00')
    case 19: return fillUTCDate(date + '.000Z')
    case 20: return fillUTCDate(date + '000Z')
    default: return date.endsWith('Z') ? date : fillUTCDate(date + 'Z')
  }
}


export const formatDate = (value?: string | null, locale?: boolean): string => {
  if (!value) return ''
  return locale? clOutput.localeDate(value) : clOutput.cleanDate(value)
}
