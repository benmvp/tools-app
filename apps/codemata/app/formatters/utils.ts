import { FORMATTERS } from './formatters'
import { FORMATTERS_INFO } from './info'
import type { FormatterId } from './types'

export function isFormatterId(id?: string): id is FormatterId {
  return id ? Object.keys(FORMATTERS).includes(id) : false
}

export function getFormatterIdBySlug(slug: string) {
  return Object.values(FORMATTERS_INFO).find(
    (formatter) => formatter.slug === slug,
  )?.id
}
