import type { TransformerContent } from '../../types'
import type { FormatterId } from './types'

export const FORMATTER_SECTION_TITLE = 'Formatters'
export const FORMATTER_TRANSFORM_ACTION = 'Format'
export const FORMATTER_TRANSFORMED_STATE = 'Formatted'

type FormatterContent = TransformerContent<FormatterId>

const CSS: FormatterContent = {
  displayName: 'CSS/SCSS',
  id: 'css',
  pageTitle: 'CSS/SCSS Formatter',
  slug: 'css',
}

const HTML: FormatterContent = {
  displayName: 'HTML',
  id: 'html',
  pageTitle: 'HTML Formatter',
  slug: 'html',
}

const JSON: FormatterContent = {
  displayName: 'JSON',
  id: 'json',
  pageTitle: 'JSON Formatter',
  slug: 'json',
}

const MD: FormatterContent = {
  displayName: 'Markdown',
  id: 'md',
  pageTitle: 'Markdown Formatter',
  slug: 'markdown',
}

const TS: FormatterContent = {
  displayName: 'JS/TS',
  id: 'ts',
  pageTitle: 'JavaScript & TypeScript Formatter',
  slug: 'typescript',
}

const XML: FormatterContent = {
  displayName: 'XML',
  id: 'xml',
  pageTitle: 'XML Formatter',
  slug: 'xml',
}

const YAML: FormatterContent = {
  displayName: 'YAML',
  id: 'yaml',
  pageTitle: 'YAML Formatter',
  slug: 'yaml',
}

export const FORMATTER_CONTENTS: Record<FormatterId, FormatterContent> = {
  css: CSS,
  html: HTML,
  json: JSON,
  md: MD,
  ts: TS,
  xml: XML,
  yaml: YAML,
}
