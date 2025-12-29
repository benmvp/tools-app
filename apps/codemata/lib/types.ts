export type Indentation = 'two-spaces' | 'four-spaces' | 'tabs'

export interface FormatConfig {
  indentation: Indentation
}

export interface Tool {
  id: string
  name: string
  description: string
  url: string
  comingSoon?: boolean
}
