import type { TransformerInfo } from '../../types'
import type { FormatterId } from './types'

export const FORMATTER_SECTION_TITLE = 'Formatters'
export const FORMATTER_TRANSFORM_ACTION = 'Format'
export const FORMATTER_TRANSFORMED_STATE = 'Formatted'

type FormatterInfo = TransformerInfo<FormatterId>

const CSS: FormatterInfo = {
  displayName: 'CSS/SCSS',
  id: 'css',
  pageTitle: 'CSS/SCSS Formatter',
  slug: 'css',
  get url() {
    return `/${this.slug}-formatter`
  },
}

const GRAPHQL: FormatterInfo = {
  displayName: 'GraphQL',
  id: 'graphql',
  pageTitle: 'GraphQL Formatter',
  slug: 'graphql',
  get url() {
    return `/${this.slug}-formatter`
  },
}

const HTML: FormatterInfo = {
  displayName: 'HTML',
  id: 'html',
  pageTitle: 'HTML Formatter',
  slug: 'html',
  get url() {
    return `/${this.slug}-formatter`
  },
}

const JSON: FormatterInfo = {
  displayName: 'JSON',
  id: 'json',
  pageTitle: 'JSON Formatter',
  slug: 'json',
  get url() {
    return `/${this.slug}-formatter`
  },
}

const MD: FormatterInfo = {
  displayName: 'Markdown/MDX',
  id: 'md',
  pageTitle: 'Markdown/MDX Formatter',
  slug: 'markdown',
  get url() {
    return `/${this.slug}-formatter`
  },
}

const TS: FormatterInfo = {
  displayName: 'JS/TS',
  id: 'ts',
  pageTitle: 'JavaScript & TypeScript Formatter',
  slug: 'typescript',
  get url() {
    return `/${this.slug}-formatter`
  },
}

const XML: FormatterInfo = {
  displayName: 'XML',
  id: 'xml',
  pageTitle: 'XML Formatter',
  slug: 'xml',
  get url() {
    return `/${this.slug}-formatter`
  },
}

const YAML: FormatterInfo = {
  displayName: 'YAML',
  id: 'yaml',
  pageTitle: 'YAML Formatter',
  slug: 'yaml',
  get url() {
    return `/${this.slug}-formatter`
  },
}

export const FORMATTERS_INFO: Record<FormatterId, FormatterInfo> = {
  css: CSS,
  graphql: GRAPHQL,
  html: HTML,
  json: JSON,
  md: MD,
  ts: TS,
  xml: XML,
  yaml: YAML,
}
