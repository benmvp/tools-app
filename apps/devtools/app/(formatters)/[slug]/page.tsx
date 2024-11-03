import { Stack, Typography } from '@mui/material'
import { Formatter } from './formatter'
import {
  FORMATTERS,
  getFormatterById,
  getFormatterIdFromQuerySlug,
  getFormatterSlugById,
} from './formatters'

export const dynamicParams = false

export function generateStaticParams() {
  return Object.values(FORMATTERS).map(({ id }) => ({
    params: {
      slug: getFormatterSlugById(id),
    },
  }))
}

interface PageProps {
  params: { slug: string }
}

export default function FormatterPage({ params }: PageProps) {
  const formatterId = getFormatterIdFromQuerySlug(params.slug)

  if (!formatterId) {
    return null
  }

  const formatter = getFormatterById(formatterId)

  return (
    <>
      <Typography component="h1" variant="h6">
        {formatter.pageTitle}
      </Typography>

      <Stack spacing={5} useFlexGap>
        <Typography mb={4} variant="body1">
          Description for {formatter.display} formatter here
        </Typography>

        <Formatter id={formatter.id} />
      </Stack>
    </>
  )
}
