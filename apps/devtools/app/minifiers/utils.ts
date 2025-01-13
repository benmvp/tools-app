import { MINIFIER_CONTENTS } from './content'
import { MINIFIERS } from './minifiers'
import type { MinifierId } from './types'

export function isMinifierId(id?: string): id is MinifierId {
  return id ? Object.keys(MINIFIERS).includes(id) : false
}

export function getMinifierIdBySlug(slug: string): MinifierId | undefined {
  return Object.values(MINIFIER_CONTENTS).find(
    (minifier) => minifier.slug === slug,
  )?.id
}
