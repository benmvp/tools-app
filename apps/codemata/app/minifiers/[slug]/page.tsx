import { Stack, Typography } from '@mui/material'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ContentSectionUi } from '../../../components/content-section'
import { TransformerUi } from '../../../components/transformer'
import { getMinifierContent } from '../ai'
import {
  MINIFIERS_INFO,
  MINIFIER_TRANSFORM_ACTION,
  MINIFIER_TRANSFORMED_STATE,
} from '../info'
import { MINIFIERS } from '../minifiers'
import { getMinifierIdBySlug } from '../utils'

export function generateStaticParams() {
  return Object.values(MINIFIERS_INFO).map(({ slug }) => ({
    params: {
      slug,
    },
  }))
}

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Metadata {
  const { slug } = params
  const minifierId = getMinifierIdBySlug(slug)

  if (!minifierId) {
    return notFound()
  }

  const minifierContent = await getMinifierContent(minifierId)

  if (!minifierContent) {
    const { pageTitle } = MINIFIERS_INFO[minifierId]

    return { title: pageTitle }
  }

  return {
    description: minifierContent.seo.description,
    keywords: minifierContent.seo.keywords,
    title: `${minifierContent.seo.title} | Codemata Developer Tools`,
  }
}

export default async function MinifierPage({ params }: PageProps) {
  const { slug } = params
  const minifierId = getMinifierIdBySlug(slug)

  if (!minifierId) {
    return notFound()
  }

  const { displayName, pageTitle } = MINIFIERS_INFO[minifierId]
  const minifierContent = await getMinifierContent(minifierId)
  const minifier = MINIFIERS[minifierId]

  return (
    <>
      <Typography component="h1" variant="h6">
        {pageTitle}
      </Typography>

      <Stack spacing={5} useFlexGap>
        {minifierContent?.intro ? (
          <Typography variant="body1">{minifierContent.intro}</Typography>
        ) : null}

        <TransformerUi
          action={minifier.action}
          actionLabel={MINIFIER_TRANSFORM_ACTION}
          configs={minifier.configs}
          displayName={displayName}
          howToUse={minifierContent?.howToUse}
          stateLabel={MINIFIER_TRANSFORMED_STATE}
        />

        <ContentSectionUi section={minifierContent?.features} />
        <ContentSectionUi section={minifierContent?.rationale} />
        <ContentSectionUi section={minifierContent?.purpose} />
        <ContentSectionUi section={minifierContent?.integrate} />
        <ContentSectionUi section={minifierContent?.faq} />
        <ContentSectionUi section={minifierContent?.recommendations} />
        <ContentSectionUi section={minifierContent?.resources} />
      </Stack>
    </>
  )
}
