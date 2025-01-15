import {
  minifyCssAction,
  minifyHtmlAction,
  minifyJsonAction,
  minifySvgAction,
  minifyTypescriptAction,
  minifyXmlAction,
} from './actions'
import type { MinifierId, Minifier } from './types'

const cssMinifier: Minifier = {
  action: minifyCssAction,
}

const htmlMinifier: Minifier = {
  action: minifyHtmlAction,
}

const jsonMinifier: Minifier = {
  action: minifyJsonAction,
}

const svgMiniifier: Minifier = {
  action: minifySvgAction,
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
  svg: svgMiniifier,
  ts: tsMinifier,
  xml: xmlMinifier,
}
