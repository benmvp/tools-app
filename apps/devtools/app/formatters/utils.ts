import { FORMATTER_CONTENTS } from './content'
import { FORMATTERS } from './formatters'
import type { FormatterId } from './types'

export function isFormatterId(id?: string): id is FormatterId {
  return id ? Object.keys(FORMATTERS).includes(id) : false
}

export function getFormatterIdBySlug(slug: string) {
  return Object.values(FORMATTER_CONTENTS).find(
    (formatter) => formatter.slug === slug,
  )?.id
}
