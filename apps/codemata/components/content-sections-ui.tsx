import { Divider, Stack } from '@mui/material'
import { ContentSectionUi } from './content-section-ui'
import type { ContentSection } from './content-section-ui'

export function ContentSectionsUi({
  sections,
}: {
  sections: ContentSection[]
}) {
  return (
    <Stack
      divider={<Divider orientation="horizontal" variant="middle" />}
      spacing={5}
    >
      {sections.map((section) => (
        <ContentSectionUi key={section.content} section={section} />
      ))}
    </Stack>
  )
}
