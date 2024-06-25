import { clColor } from "@commercelayer/cli-core"
import type { Link } from "@commercelayer/sdk"

export const DOC_DATE_TIME_STRING_FORMAT = 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format'


export const linkStatus = (status?: Link['status']): string => {
  if (!status) return ''
  switch (status.toLowerCase()) {
    case 'active': return clColor.msg.success(status)
    case 'expired': return clColor.msg.error(status)
    case 'disabled': return clColor.msg.warning(status)
    case 'pending':
    default: return status
  }
}
