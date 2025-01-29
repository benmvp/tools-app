import { Stack, Typography } from '@mui/material'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ContentSectionUi } from '../../../components/content-section'
import { TransformerUi } from '../../../components/transformer'
import { getFormatterContent } from '../ai'
import { FORMATTERS } from '../formatters'
import {
  FORMATTERS_INFO,
  FORMATTER_TRANSFORM_ACTION,
  FORMATTER_TRANSFORMED_STATE,
} from '../info'
import { getFormatterIdBySlug } from '../utils'

export function generateStaticParams() {
  return Object.values(FORMATTERS_INFO).map(({ slug }) => ({
    params: {
      slug,
    },
  }))
}
interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = params
  const formatterId = getFormatterIdBySlug(slug)

  if (!formatterId) {
    return notFound()
  }

  const formatterContent = await getFormatterContent(formatterId)

  if (!formatterContent) {
    const { pageTitle } = FORMATTERS_INFO[formatterId]

    return { title: pageTitle }
  }

  return {
    description: formatterContent.seo.description,
    keywords: formatterContent.seo.keywords,
    title: `${formatterContent.seo.title} | Codemata Developer Tools`,
  }
}

export default async function FormatterPage({ params }: PageProps) {
  const { slug } = params
  const formatterId = getFormatterIdBySlug(slug)

  if (!formatterId) {
    return notFound()
  }

  const { displayName, pageTitle } = FORMATTERS_INFO[formatterId]
  const formatterContent = await getFormatterContent(formatterId)
  const formatter = FORMATTERS[formatterId]

  return (
    <>
      <Typography component="h1" mb={2} variant="h6">
        {pageTitle}
      </Typography>

      <Stack spacing={5} useFlexGap>
        {formatterContent?.intro ? (
          <Typography variant="body1">{formatterContent.intro}</Typography>
        ) : null}

        <TransformerUi
          action={formatter.action}
          actionLabel={FORMATTER_TRANSFORM_ACTION}
          configs={formatter.configs}
          displayName={displayName}
          howToUse={formatterContent?.howToUse}
          stateLabel={FORMATTER_TRANSFORMED_STATE}
        />

        <ContentSectionUi section={formatterContent?.features} />
        <ContentSectionUi section={formatterContent?.rationale} />
        <ContentSectionUi section={formatterContent?.purpose} />
        <ContentSectionUi section={formatterContent?.integrate} />
        <ContentSectionUi section={formatterContent?.faq} />
        <ContentSectionUi section={formatterContent?.recommendations} />
        <ContentSectionUi section={formatterContent?.resources} />
      </Stack>
    </>
  )
}
