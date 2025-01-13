'use server'
import type { TransformerAction, TransformerConfig } from '../../types'

export type MinifierId = 'html' | 'css' | 'ts' | 'xml' | 'json'

export interface Minifier {
  action: TransformerAction
  configs?: TransformerConfig[]
}
