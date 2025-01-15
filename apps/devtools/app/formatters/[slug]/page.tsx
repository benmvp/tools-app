import { Stack, Typography } from '@mui/material'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TransformerUi } from '../../../components/transformer'
import {
  FORMATTER_CONTENTS,
  FORMATTER_TRANSFORM_ACTION,
  FORMATTER_TRANSFORMED_STATE,
} from '../content'
import { FORMATTERS } from '../formatters'
import { getFormatterIdBySlug } from '../utils'

export function generateStaticParams() {
  return Object.values(FORMATTER_CONTENTS).map(({ slug }) => ({
    params: {
      slug,
    },
  }))
}
interface PageProps {
  params: { slug: string }
}

export function generateMetadata({ params }: PageProps): Metadata {
  const { slug } = params
  const formatterId = getFormatterIdBySlug(slug)

  if (!formatterId) {
    return notFound()
  }

  const formatterContent = FORMATTER_CONTENTS[formatterId]

  return {
    description: `TODO TODO TODO: Meta description for ${formatterContent.displayName} formatter here`,
    title: `${formatterContent.pageTitle} | Free Developer Tools | Codemata`,
  }
}

export default function FormatterPage({ params }: PageProps) {
  const { slug } = params
  const formatterId = getFormatterIdBySlug(slug)

  if (!formatterId) {
    return notFound()
  }

  const formatterContent = FORMATTER_CONTENTS[formatterId]
  const formatter = FORMATTERS[formatterId]

  return (
    <>
      <Typography component="h1" variant="h6">
        {formatterContent.pageTitle}
      </Typography>

      <Stack spacing={5} useFlexGap>
        <Typography mb={4} variant="body1">
          Description for {formatterContent.displayName} formatter here
        </Typography>

        <TransformerUi
          action={formatter.action}
          actionLabel={FORMATTER_TRANSFORM_ACTION}
          configs={formatter.configs}
          displayName={formatterContent.displayName}
          stateLabel={FORMATTER_TRANSFORMED_STATE}
        />
      </Stack>
    </>
  )
}
