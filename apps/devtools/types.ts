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

export interface TransformerContent<Id> {
  displayName: string
  id: Id
  pageTitle: string
  slug: string
}
