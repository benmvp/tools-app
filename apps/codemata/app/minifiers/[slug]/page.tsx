import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AIContentSkeleton } from "@/components/AIContentSkeleton";
import { CategoryBackLink } from "@/components/CategoryBackLink";
import { JsonLd } from "@/components/JsonLd";
import { MinifierAIContent } from "@/components/MinifierAIContent";
import { MinifierIntro } from "@/components/MinifierIntro";
import { ScrollToTopFab } from "@/components/ScrollToTopFab";
import { TransformerMinifier } from "@/components/TransformerMinifier";
import { getMinifierContent } from "@/lib/ai/helpers";
import { MINIFIER_TOOLS } from "@/lib/tools-data";
import type { MinifierAction } from "@/lib/types";
import { getAppUrl, getOgImageUrl, isProductionBuild } from "@/lib/utils";

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Extend serverless function timeout for AI generation
// Default is 10s on Hobby, this allows up to 30s on Preview/Production
export const maxDuration = 30;

// Enable dynamic params for ISR
export const dynamicParams = true;

export async function generateStaticParams() {
  // Pre-render all pages ONLY in true Vercel production builds
  // This ensures crawlers get instant pages with good SEO
  // Preview builds and local dev use on-demand ISR to save API costs
  if (isProductionBuild()) {
    return Object.keys(MINIFIER_TOOLS).map((slug) => ({ slug }));
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
  const minifier = MINIFIER_TOOLS[slug];

  if (!minifier) {
    return {
      title: "Minifier Not Found",
    };
  }

  // Try to get AI-generated content for metadata
  const aiContent = await getMinifierContent(slug, minifier.name);

  if (aiContent) {
    return {
      title: aiContent.seo.title,
      description: aiContent.seo.description,
      keywords: aiContent.seo.keywords,
      alternates: {
        canonical: getAppUrl(`/minifiers/${slug}`),
      },
      openGraph: {
        title: aiContent.openGraph.title,
        description: aiContent.openGraph.description,
        type: aiContent.openGraph.type,
        url: `/minifiers/${slug}`,
        images: [
          {
            url: getOgImageUrl(minifier.name, aiContent.openGraph.description),
            width: 1200,
            height: 630,
            alt: `Codemata - ${minifier.name} Minifier`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: aiContent.openGraph.title,
        description: aiContent.openGraph.description,
        images: [getOgImageUrl(minifier.name, aiContent.openGraph.description)],
      },
    };
  }

  // Fallback to static metadata if AI generation fails
  return {
    title: minifier.metadata.title,
    description: minifier.metadata.description,
    alternates: {
      canonical: getAppUrl(`/minifiers/${slug}`),
    },
    openGraph: {
      title: minifier.metadata.title,
      description: minifier.metadata.description,
      url: `/minifiers/${slug}`,
      images: [
        {
          url: getOgImageUrl(minifier.name, minifier.metadata.description),
          width: 1200,
          height: 630,
          alt: `Codemata - ${minifier.name} Minifier`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [getOgImageUrl(minifier.name, minifier.metadata.description)],
    },
  };
}

export default async function MinifierPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const minifier = MINIFIER_TOOLS[slug];

  if (!minifier) {
    notFound();
  }

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: minifier.name,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    url: getAppUrl(`/minifiers/${slug}`),
  };

  return (
    <>
      {/* Structured Data */}
      <JsonLd data={structuredData} />

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col">
        {/* Page Header (first in DOM for SEO/A11y) */}
        <h1 className="text-4xl font-bold mb-2">{minifier.name}</h1>

        {/* Category Navigation (after H1 in DOM, but displayed above via CSS order) */}
        <CategoryBackLink href="/minifiers" label="Minifiers" />

        {/* Intro paragraph with Suspense (replaces with AI intro when ready) */}
        <Suspense
          fallback={
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              {minifier.description}
            </p>
          }
        >
          <MinifierIntro
            slug={slug}
            minifierName={minifier.name}
            fallbackDescription={minifier.description}
          />
        </Suspense>

        {/* Transformer Tool */}
        <TransformerMinifier
          action={minifier.action as MinifierAction}
          actionLabel="Minify"
          defaultInput={minifier.example}
          language={minifier.language}
        />

        {/* AI-Generated Content Sections with Suspense */}
        <div className="mt-12 space-y-8">
          <Suspense fallback={<AIContentSkeleton />}>
            <MinifierAIContent slug={slug} minifierName={minifier.name} />
          </Suspense>
        </div>

        {/* Scroll to Top FAB */}
        <ScrollToTopFab />
      </div>
    </>
  );
}
