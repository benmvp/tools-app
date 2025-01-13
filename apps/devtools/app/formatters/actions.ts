'use server'

import type { Options as PrettierOptions } from 'prettier'
import { format as prettierFormat } from 'prettier'
import type { Indentation } from './types'

export async function formatCssAction(data: FormData) {
  const rawCode = data.get('code')?.toString() || ''

  const prettierOptions: PrettierOptions = {
    parser: 'css',
    ...getIndentationPrettierOptions(
      data.get('indentation') as Indentation | null,
    ),
  }

  return prettierFormat(rawCode, prettierOptions)
}

export async function formatHtmlAction(data: FormData) {
  const rawCode = data.get('code')?.toString() || ''

  const prettierOptions: PrettierOptions = {
    parser: 'html',
    ...getIndentationPrettierOptions(
      data.get('indentation') as Indentation | null,
    ),
  }

  return prettierFormat(rawCode, prettierOptions)
}

export async function formatMarkdownAction(data: FormData) {
  const rawCode = data.get('code')?.toString() || ''

  const prettierOptions: PrettierOptions = {
    parser: 'markdown',
    ...getIndentationPrettierOptions(
      data.get('indentation') as Indentation | null,
    ),
  }

  return prettierFormat(rawCode, prettierOptions)
}

export async function formatJsonAction(data: FormData) {
  const rawCode = data.get('code')?.toString() || ''
  const { tabWidth, useTabs } = getIndentationPrettierOptions(
    data.get('indentation') as Indentation | null,
  )

  return Promise.resolve(
    JSON.stringify(JSON.parse(rawCode), null, useTabs ? '\t' : tabWidth),
  )
}

export async function formatTypescriptAction(data: FormData) {
  const rawCode = data.get('code')?.toString() || ''

  const prettierOptions: PrettierOptions = {
    parser: 'typescript',
    ...getIndentationPrettierOptions(
      data.get('indentation') as Indentation | null,
    ),
  }

  return prettierFormat(rawCode, prettierOptions)
}

export async function formatYamlAction(data: FormData) {
  const rawCode = data.get('code')?.toString() || ''

  const prettierOptions: PrettierOptions = {
    parser: 'yaml',
    ...getIndentationPrettierOptions(
      data.get('indentation') as Indentation | null,
    ),
  }

  return prettierFormat(rawCode, prettierOptions)
}

function getIndentationPrettierOptions(indentation: Indentation | null) {
  return {
    tabWidth: indentation === 'four-spaces' ? 4 : 2,
    useTabs: indentation === 'tabs',
  }
}
