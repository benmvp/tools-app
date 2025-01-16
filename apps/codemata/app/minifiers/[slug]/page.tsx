import { Stack, Typography } from '@mui/material'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TransformerUi } from '../../../components/transformer'
// import { MinifierUi } from './minifier-ui'
import {
  MINIFIER_CONTENTS,
  MINIFIER_TRANSFORM_ACTION,
  MINIFIER_TRANSFORMED_STATE,
} from '../content'
import { MINIFIERS } from '../minifiers'
import { getMinifierIdBySlug } from '../utils'

export function generateStaticParams() {
  return Object.values(MINIFIER_CONTENTS).map(({ slug }) => ({
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
  const minifierId = getMinifierIdBySlug(slug)

  if (!minifierId) {
    return notFound()
  }

  const minifierContent = MINIFIER_CONTENTS[minifierId]

  return {
    description: `Meta description for ${minifierContent.displayName} minifier here`,
    title: `${minifierContent.pageTitle} | Free Developer Tools`,
  }
}

export default function MinifierPage({ params }: PageProps) {
  const { slug } = params
  const minifierId = getMinifierIdBySlug(slug)

  if (!minifierId) {
    return notFound()
  }

  const minifier = MINIFIERS[minifierId]
  const minifierContents = MINIFIER_CONTENTS[minifierId]

  return (
    <>
      <Typography component="h1" variant="h6">
        {minifierContents.pageTitle}
      </Typography>

      <Stack spacing={5} useFlexGap>
        <Typography mb={4} variant="body1">
          Description for {minifierContents.displayName} minifier here
        </Typography>

        <TransformerUi
          action={minifier.action}
          actionLabel={MINIFIER_TRANSFORM_ACTION}
          configs={minifier.configs}
          displayName={minifierContents.displayName}
          stateLabel={MINIFIER_TRANSFORMED_STATE}
        />
      </Stack>
    </>
  )
}
