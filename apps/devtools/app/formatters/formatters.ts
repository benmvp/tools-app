import type { TransformerConfig } from '../../types'
import {
  formatCssAction,
  formatHtmlAction,
  formatJsonAction,
  formatMarkdownAction,
  formatTypescriptAction,
  formatYamlAction,
} from './actions'
import type { FormatterId, Indentation, Formatter } from './types'

export const indentationConfig: TransformerConfig<Indentation> = {
  id: 'indentation',
  label: 'Indentation',
  options: [
    {
      label: 'Two Spaces',
      value: 'two-spaces',
    },
    {
      label: 'Four Spaces',
      value: 'four-spaces',
    },
    {
      label: 'Tabs',
      value: 'tabs',
    },
  ],
}

const htmlFormatter: Formatter = {
  action: formatHtmlAction,
  configs: [indentationConfig],
}

const cssFormatter: Formatter = {
  action: formatCssAction,
  configs: [indentationConfig],
}

const typeScriptFormatter: Formatter = {
  action: formatTypescriptAction,
  configs: [indentationConfig],
}

const markdownFormatter: Formatter = {
  action: formatMarkdownAction,
  configs: [indentationConfig],
}

const jsonFormatter: Formatter = {
  action: formatJsonAction,
  configs: [indentationConfig],
}

const xmlFormatter: Formatter = htmlFormatter

const yamlFormatter: Formatter = {
  action: formatYamlAction,
  configs: [indentationConfig],
}

export const FORMATTERS: Record<FormatterId, Formatter> = {
  css: cssFormatter,
  html: htmlFormatter,
  json: jsonFormatter,
  md: markdownFormatter,
  ts: typeScriptFormatter,
  xml: xmlFormatter,
  yaml: yamlFormatter,
}
