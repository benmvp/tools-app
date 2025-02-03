import { Box, Typography } from '@mui/material'
import { Markdown } from '@repo/ui/markdown'
import { z } from 'zod'

export const contentSectionSchema = z.object({
  content: z.string(),
  heading: z.string(),
})

export type ContentSection = z.infer<typeof contentSectionSchema>

export function ContentSectionUi({ section }: { section?: ContentSection }) {
  if (!section) {
    return null
  }

  return (
    <Box>
      <Typography component="h2" sx={{ mb: 2 }} variant="h4">
        {section.heading}
      </Typography>
      <Markdown>{section.content}</Markdown>
    </Box>
  )
}
