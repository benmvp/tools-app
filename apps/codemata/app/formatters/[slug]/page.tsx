import { Stack, Typography } from '@mui/material'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ContentSection } from '../../../components/content-section-ui'
import { ContentSectionsUi } from '../../../components/content-sections-ui'
import { TransformerUi } from '../../../components/transformer'
import { getFormatterContent } from '../ai'
import { FORMATTERS } from '../formatters'
import {
  FORMATTERS_INFO,
  FORMATTER_TRANSFORM_ACTION,
  FORMATTER_TRANSFORMED_STATE,
} from '../info'
import { getFormatterIdBySlug } from '../utils'

interface PageProps {
  params: { slug: string }
}

// Next.js will invalidate the cache when a
// request comes in, at most once every 60 seconds.
export const revalidate = 60

export function generateStaticParams() {
  return Object.values(FORMATTERS_INFO).map(({ slug }) => ({
    params: {
      slug,
    },
  }))
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
  const sections = [
    formatterContent?.features,
    formatterContent?.rationale,
    formatterContent?.purpose,
    formatterContent?.integrate,
    formatterContent?.faq,
    formatterContent?.recommendations,
    formatterContent?.resources,
  ].filter((section): section is ContentSection => Boolean(section))

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

        <ContentSectionsUi sections={sections} />
      </Stack>
    </>
  )
}
