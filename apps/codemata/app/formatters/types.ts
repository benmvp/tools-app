'user server'
import type { TransformerAction, TransformerConfig } from '../../types'
import type { indentationConfig } from './formatters'

export type FormatterId =
  | 'css'
  | 'graphql'
  | 'html'
  | 'json'
  | 'md'
  | 'ts'
  | 'xml'
  | 'yaml'
export type Indentation = 'two-spaces' | 'four-spaces' | 'tabs'

export interface Formatter {
  action: TransformerAction
  configs: [typeof indentationConfig, ...TransformerConfig[]]
}
