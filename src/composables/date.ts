// function getDate(date: Date | string | number): Date {
//   const _date = new Date(date)
//   const offset = _date.getTimezoneOffset()
//   return new Date(_date.getTime() - (offset*60*1000))
// }

import { useDateFormat, useNow } from '@vueuse/core'
import { ComputedRef } from 'vue'

function formattedDate(): ComputedRef<string> {
  return useDateFormat(useNow(), 'YYYY-MM-DD', { locales: 'en-US' })
}

export { formattedDate }
