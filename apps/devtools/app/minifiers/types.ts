'use server'
import type { TransformerAction, TransformerConfig } from '../../types'

export type MinifierId = 'css' | 'html' | 'json' | 'svg' | 'ts' | 'xml'

export interface Minifier {
  action: TransformerAction
  configs?: TransformerConfig[]
}
