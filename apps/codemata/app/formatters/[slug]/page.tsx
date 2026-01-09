import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AIContentSkeleton } from "@/components/AIContentSkeleton";
import { CategoryBackLink } from "@/components/CategoryBackLink";
import { FormatterAIContent } from "@/components/FormatterAIContent";
import { FormatterIntro } from "@/components/FormatterIntro";
import { JsonLd } from "@/components/JsonLd";
import { ScrollToTopFab } from "@/components/ScrollToTopFab";
import { Transformer } from "@/components/Transformer";
import { getFormatterContent } from "@/lib/ai/helpers";
import { FORMATTER_TOOLS } from "@/lib/tools-data";
import type { FormatterAction } from "@/lib/types";
import { getAppUrl, getOgImageUrl, isProductionBuild } from "@/lib/utils";

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Extend serverless function timeout for AI generation
// Default is 10s on Hobby, this allows up to 30s on Preview/Production
export const maxDuration = 30;

// Enable dynamic params for ISR
export const dynamicParams = true;

export function generateStaticParams() {
  // Pre-render all pages ONLY in true Vercel production builds
  // This ensures crawlers get instant pages with good SEO
  // Preview builds and local dev use on-demand ISR to save API costs
  if (isProductionBuild()) {
    return Object.keys(FORMATTER_TOOLS).map((slug) => ({ slug }));
  }

  // Return empty array for preview/dev - pages generated on-demand
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const formatter = FORMATTER_TOOLS[slug];

  if (!formatter) {
    return {
      title: "Formatter Not Found",
    };
  }

  // Try to get AI-generated content for metadata
  const aiContent = await getFormatterContent(slug, formatter.name);

  if (aiContent) {
    return {
      title: aiContent.seo.title,
      description: aiContent.seo.description,
      keywords: aiContent.seo.keywords,
      alternates: {
        canonical: getAppUrl(`/formatters/${slug}`),
      },
      openGraph: {
        title: aiContent.openGraph.title,
        description: aiContent.openGraph.description,
        type: aiContent.openGraph.type,
        url: `/formatters/${slug}`,
        images: [
          {
            url: getOgImageUrl(formatter.name, aiContent.openGraph.description),
            width: 1200,
            height: 630,
            alt: `Codemata - ${formatter.name}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: aiContent.openGraph.title,
        description: aiContent.openGraph.description,
        images: [
          getOgImageUrl(formatter.name, aiContent.openGraph.description),
        ],
      },
    };
  }

  // Fallback to static metadata if AI generation fails
  return {
    title: formatter.metadata.title,
    description: formatter.metadata.description,
    alternates: {
      canonical: getAppUrl(`/formatters/${slug}`),
    },
    openGraph: {
      title: formatter.metadata.title,
      description: formatter.metadata.description,
      url: `/formatters/${slug}`,
      images: [
        {
          url: getOgImageUrl(formatter.name, formatter.metadata.description),
          width: 1200,
          height: 630,
          alt: `Codemata - ${formatter.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [getOgImageUrl(formatter.name, formatter.metadata.description)],
    },
  };
}

export default async function FormatterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const formatter = FORMATTER_TOOLS[slug];

  if (!formatter) {
    notFound();
  }

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: formatter.name,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    url: getAppUrl(`/formatters/${slug}`),
  };

  return (
    <>
      {/* Structured Data */}
      <JsonLd data={structuredData} />

      <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col">
        {/* Page Header (first in DOM for SEO/A11y) */}
        <h1 className="mb-2 text-4xl font-bold">{formatter.name}</h1>

        {/* Category Navigation (after H1 in DOM, but displayed above via CSS order) */}
        <CategoryBackLink href="/formatters" label="Formatters" />

        {/* Intro paragraph with Suspense (replaces with AI intro when ready) */}
        <Suspense
          fallback={
            <p className="mb-8 text-slate-600 dark:text-slate-400">
              {formatter.description}
            </p>
          }
        >
          <FormatterIntro
            slug={slug}
            formatterName={formatter.name}
            fallbackDescription={formatter.description}
          />
        </Suspense>

        {/* Transformer Tool */}
        <Transformer
          action={formatter.action as FormatterAction}
          actionLabel="Format"
          defaultInput={formatter.example}
          language={formatter.language}
          configOptions={[
            {
              id: "indentation",
              label: "Indentation",
              defaultValue: "two-spaces",
              options: [
                { label: "2 Spaces", value: "two-spaces" },
                { label: "4 Spaces", value: "four-spaces" },
                { label: "Tabs", value: "tabs" },
              ],
            },
          ]}
        />

        {/* AI-Generated Content Sections with Suspense */}
        <div className="mt-12 space-y-8">
          <Suspense fallback={<AIContentSkeleton />}>
            <FormatterAIContent slug={slug} formatterName={formatter.name} />
          </Suspense>
        </div>

        {/* Scroll to Top FAB */}
        <ScrollToTopFab />
      </div>
    </>
  );
}
