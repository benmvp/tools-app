import type { TransformerContent } from '../../types'
import type { MinifierId } from './types'

export const MINIFIER_SECTION_TITLE = 'Minifiers'
export const MINIFIER_TRANSFORM_ACTION = 'Minify'
export const MINIFIER_TRANSFORMED_STATE = 'Minified'

type MinifierContent = TransformerContent<MinifierId>

const CSS: MinifierContent = {
  displayName: 'CSS/SCSS',
  id: 'css',
  pageTitle: 'CSS/SCSS Minifier',
  slug: 'css',
}

const HTML: MinifierContent = {
  displayName: 'HTML',
  id: 'html',
  pageTitle: 'HTML Minifier',
  slug: 'html',
}

const JSON: MinifierContent = {
  displayName: 'JSON',
  id: 'json',
  pageTitle: 'JSON Minifier',
  slug: 'json',
}

const TS: MinifierContent = {
  displayName: 'JS/TS',
  id: 'ts',
  pageTitle: 'JavaScript & TypeScript Minifier',
  slug: 'typescript',
}

const XML: MinifierContent = {
  displayName: 'XML',
  id: 'xml',
  pageTitle: 'XML Minifier',
  slug: 'xml',
}

export const MINIFIER_CONTENTS: Record<MinifierId, MinifierContent> = {
  css: CSS,
  html: HTML,
  json: JSON,
  ts: TS,
  xml: XML,
}
