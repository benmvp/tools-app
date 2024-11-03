import type { Options as PrettierOptions } from 'prettier'
import babelParser from 'prettier/parser-babel'
import htmlParser from 'prettier/parser-html'
import markdownParser from 'prettier/parser-markdown'
import cssParser from 'prettier/parser-postcss'
import typeScriptParser from 'prettier/parser-typescript'
import yamlParser from 'prettier/parser-yaml'
// eslint-disable-next-line import/default -- for some reason ESLint doesn't recognize the default export
import estreePlugin from 'prettier/plugins/estree'
import { format as prettierFormat } from 'prettier/standalone'

export type FormatterId =
  | 'html'
  | 'css'
  | 'typescript'
  | 'json'
  | 'markdown'
  | 'xml'
  | 'yaml'
type FormatterSlug = `${FormatterId}-formatter`
interface FormatterConfig<Value extends string = string> {
  id: string
  label: string
  options: {
    label: string
    value: Value
  }[]
}
type Indentation = 'two-spaces' | 'four-spaces' | 'tabs'

export interface Formatter {
  configs: [typeof indentationConfig, ...FormatterConfig[]]
  display: string
  format: (data: FormData) => Promise<string>
  id: FormatterId
  pageTitle: string
}

function isFormatterId(id?: string): id is FormatterId {
  return id ? Object.keys(FORMATTERS).includes(id) : false
}

export function getFormatterIdFromQuerySlug(slug: string) {
  const [formatterId] = slug.split('-')

  return isFormatterId(formatterId) ? formatterId : null
}

export function getFormatterSlugById(id: FormatterId): FormatterSlug {
  return `${id}-formatter`
}

export function getFormatterById(id: FormatterId) {
  return FORMATTERS[id]
}

const indentationConfig: FormatterConfig<Indentation> = {
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

function getIndentationPrettierOptions(indentation: Indentation | null) {
  return {
    tabWidth: indentation === 'four-spaces' ? 4 : 2,
    useTabs: indentation === 'tabs',
  }
}

const htmlFormatter: Formatter = {
  configs: [indentationConfig],
  display: 'HTML',
  format: async (data) => {
    const rawCode = data.get('code')?.toString()

    if (!rawCode) {
      return ''
    }

    const prettierOptions: PrettierOptions = {
      parser: 'html',
      plugins: [htmlParser],
      ...getIndentationPrettierOptions(
        data.get('indentation') as Indentation | null,
      ),
    }

    return prettierFormat(rawCode, prettierOptions)
  },
  id: 'html',
  pageTitle: 'HTML Formatter',
}

const cssFormatter: Formatter = {
  configs: [indentationConfig],
  display: 'CSS/SCSS',
  format: async (data) => {
    const rawCode = data.get('code')?.toString()

    if (!rawCode) {
      return ''
    }

    const prettierOptions: PrettierOptions = {
      parser: 'css',
      plugins: [cssParser],
      ...getIndentationPrettierOptions(
        data.get('indentation') as Indentation | null,
      ),
    }

    return prettierFormat(rawCode, prettierOptions)
  },
  id: 'css',
  pageTitle: 'CSS/SCSS Formatter',
}

const typeScriptFormatter: Formatter = {
  configs: [indentationConfig],
  display: 'JS/TS',
  format: async (data) => {
    const rawCode = data.get('code')?.toString()

    if (!rawCode) {
      return ''
    }

    const prettierOptions: PrettierOptions = {
      parser: 'typescript',
      plugins: [typeScriptParser, estreePlugin],
      ...getIndentationPrettierOptions(
        data.get('indentation') as Indentation | null,
      ),
    }

    return prettierFormat(rawCode, prettierOptions)
  },
  id: 'typescript',
  pageTitle: 'JavaScript & TypeScript Formatter',
}

const markdownFormatter: Formatter = {
  configs: [indentationConfig],
  display: 'Markdown',
  format: async (data) => {
    const rawCode = data.get('code')?.toString()

    if (!rawCode) {
      return ''
    }

    const prettierOptions: PrettierOptions = {
      parser: 'markdown',
      plugins: [markdownParser],
      ...getIndentationPrettierOptions(
        data.get('indentation') as Indentation | null,
      ),
    }

    return prettierFormat(rawCode, prettierOptions)
  },
  id: 'markdown',
  pageTitle: 'Markdown Formatter',
}

const jsonFormatter: Formatter = {
  configs: [indentationConfig],
  display: 'JSON',
  format: async (data) => {
    const rawCode = data.get('code')?.toString()

    if (!rawCode) {
      return ''
    }

    const prettierOptions: PrettierOptions = {
      parser: 'json',
      plugins: [babelParser, estreePlugin],
      ...getIndentationPrettierOptions(
        data.get('indentation') as Indentation | null,
      ),
    }

    return prettierFormat(rawCode, prettierOptions)
  },
  id: 'json',
  pageTitle: 'JSON Formatter',
}

const xmlFormatter: Formatter = {
  ...htmlFormatter,
  display: 'XML',
  id: 'xml',
  pageTitle: 'XML Formatter',
}

const yamlFormatter: Formatter = {
  configs: [indentationConfig],
  display: 'YAML',
  format: async (data) => {
    const rawCode = data.get('code')?.toString()

    if (!rawCode) {
      return ''
    }

    const prettierOptions: PrettierOptions = {
      parser: 'yaml',
      plugins: [yamlParser],
      ...getIndentationPrettierOptions(
        data.get('indentation') as Indentation | null,
      ),
    }

    return prettierFormat(rawCode, prettierOptions)
  },
  id: 'yaml',
  pageTitle: 'YAML Formatter',
}

export const FORMATTERS: Record<FormatterId, Formatter> = {
  css: cssFormatter,
  html: htmlFormatter,
  json: jsonFormatter,
  markdown: markdownFormatter,
  typescript: typeScriptFormatter,
  xml: xmlFormatter,
  yaml: yamlFormatter,
}
