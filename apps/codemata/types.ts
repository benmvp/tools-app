import type { SvgIconTypeMap } from '@mui/material'
import type { OverridableComponent } from '@mui/material/OverridableComponent'

export type Transformer = 'formatter' | 'minifier'

export interface TransformerConfig<Value extends string = string> {
  id: string
  label: string
  options: {
    label: string
    value: Value
  }[]
}

export type TransformerAction = (data: FormData) => Promise<string>

export interface TransformerInfo<Id> {
  Icon: OverridableComponent<SvgIconTypeMap<object>>
  displayName: string
  id: Id
  pageTitle: string
  slug: string
  url: string
}
