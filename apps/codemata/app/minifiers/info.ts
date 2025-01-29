import type { TransformerInfo } from '../../types'
import type { MinifierId } from './types'

export const MINIFIER_SECTION_TITLE = 'Minifiers'
export const MINIFIER_TRANSFORM_ACTION = 'Minify'
export const MINIFIER_TRANSFORMED_STATE = 'Minified'

type MinifierInfo = TransformerInfo<MinifierId>

const CSS: MinifierInfo = {
  displayName: 'CSS',
  id: 'css',
  pageTitle: 'CSS Minifier',
  slug: 'css',
  url: '/minifiers/css',
}

const HTML: MinifierInfo = {
  displayName: 'HTML',
  id: 'html',
  pageTitle: 'HTML Minifier',
  slug: 'html',
  url: '/minifiers/html',
}

const JSON: MinifierInfo = {
  displayName: 'JSON',
  id: 'json',
  pageTitle: 'JSON Minifier',
  slug: 'json',
  url: '/minifiers/json',
}

const SVG: MinifierInfo = {
  displayName: 'SVG',
  id: 'svg',
  pageTitle: 'SVG Minifier',
  slug: 'svg',
  url: '/minifiers/svg',
}

const TS: MinifierInfo = {
  displayName: 'JS/TS',
  id: 'ts',
  pageTitle: 'JavaScript & TypeScript Minifier',
  slug: 'typescript',
  url: '/minifiers/typescript',
}

const XML: MinifierInfo = {
  displayName: 'XML',
  id: 'xml',
  pageTitle: 'XML Minifier',
  slug: 'xml',
  url: '/minifiers/xml',
}

export const MINIFIERS_INFO: Record<MinifierId, MinifierInfo> = {
  css: CSS,
  html: HTML,
  json: JSON,
  svg: SVG,
  ts: TS,
  xml: XML,
}
