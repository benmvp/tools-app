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
  get url() {
    return `/${this.slug}-minifier`
  },
}

const HTML: MinifierInfo = {
  displayName: 'HTML',
  id: 'html',
  pageTitle: 'HTML Minifier',
  slug: 'html',
  get url() {
    return `/${this.slug}-minifier`
  },
}

const JSON: MinifierInfo = {
  displayName: 'JSON',
  id: 'json',
  pageTitle: 'JSON Minifier',
  slug: 'json',
  get url() {
    return `/${this.slug}-minifier`
  },
}

const SVG: MinifierInfo = {
  displayName: 'SVG',
  id: 'svg',
  pageTitle: 'SVG Minifier',
  slug: 'svg',
  get url() {
    return `/${this.slug}-minifier`
  },
}

const TS: MinifierInfo = {
  displayName: 'JS/TS',
  id: 'ts',
  pageTitle: 'JavaScript & TypeScript Minifier',
  slug: 'typescript',
  get url() {
    return `/${this.slug}-minifier`
  },
}

const XML: MinifierInfo = {
  displayName: 'XML',
  id: 'xml',
  pageTitle: 'XML Minifier',
  slug: 'xml',
  get url() {
    return `/${this.slug}-minifier`
  },
}

export const MINIFIERS_INFO: Record<MinifierId, MinifierInfo> = {
  css: CSS,
  html: HTML,
  json: JSON,
  svg: SVG,
  ts: TS,
  xml: XML,
}
