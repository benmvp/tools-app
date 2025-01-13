import {
  minifyCssAction,
  minifyHtmlAction,
  minifyJsonAction,
  minifyTypescriptAction,
  minifyXmlAction,
} from './actions'
import type { MinifierId, Minifier } from './types'

const htmlMinifier: Minifier = {
  action: minifyHtmlAction,
}

const cssMinifier: Minifier = {
  action: minifyCssAction,
}

const jsonMinifier: Minifier = {
  action: minifyJsonAction,
}

const tsMinifier: Minifier = {
  action: minifyTypescriptAction,
}

const xmlMinifier: Minifier = {
  action: minifyXmlAction,
}

export const MINIFIERS: Record<MinifierId, Minifier> = {
  css: cssMinifier,
  html: htmlMinifier,
  json: jsonMinifier,
  ts: tsMinifier,
  xml: xmlMinifier,
}
