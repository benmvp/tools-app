'use server'

import prettierPluginXml from '@prettier/plugin-xml'
import type {
  Options as PrettierOptions,
  Plugin as PrettierPlugin,
} from 'prettier'
import { format as prettierFormat } from 'prettier'
import type { Indentation } from './types'

export const formatCssAction = getLanguageFormatAction('scss')
export const formatGraphqlAction = getLanguageFormatAction('graphql')
export const formatHtmlAction = getLanguageFormatAction('html')
export const formatMarkdownAction = getLanguageFormatAction('mdx')
export const formatJsonAction = getLanguageFormatAction('json')
export const formatTypescriptAction = getLanguageFormatAction('typescript')
export const formatXmlAction = getLanguageFormatAction('xml', [
  prettierPluginXml,
])
export const formatYamlAction = getLanguageFormatAction('yaml')

function getLanguageFormatAction(
  parser: string,
  plugins: PrettierPlugin[] = [],
) {
  return async (data: FormData) => {
    const rawCode = data.get('code')?.toString() || ''

    const prettierOptions: PrettierOptions = {
      parser,
      plugins,
      ...getIndentationPrettierOptions(
        data.get('indentation') as Indentation | null,
      ),
    }

    return prettierFormat(rawCode, prettierOptions)
  }
}

function getIndentationPrettierOptions(indentation: Indentation | null) {
  return {
    tabWidth: indentation === 'four-spaces' ? 4 : 2,
    useTabs: indentation === 'tabs',
  }
}
