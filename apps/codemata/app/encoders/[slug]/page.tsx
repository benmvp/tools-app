import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AIContentSkeleton } from "@/components/AIContentSkeleton";
import { CategoryBackLink } from "@/components/CategoryBackLink";
import { EncoderAIContent } from "@/components/EncoderAIContent";
import { EncoderIntro } from "@/components/EncoderIntro";
import { JsonLd } from "@/components/JsonLd";
import { ScrollToTopFab } from "@/components/ScrollToTopFab";
import { TransformerEncoder } from "@/components/TransformerEncoder";
import { VisitTracker } from "@/components/VisitTracker";
import { getEncoderContent } from "@/lib/ai/helpers";
import { ENCODER_TOOLS } from "@/lib/tools-data";
import { getAppUrl, getOgImageUrl, isProductionBuild } from "@/lib/utils";

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Extend serverless function timeout for AI generation
export const maxDuration = 30;

// Enable dynamic params for ISR
export const dynamicParams = true;

export function generateStaticParams() {
  // Pre-render all pages ONLY in true Vercel production builds
  if (isProductionBuild()) {
    return Object.keys(ENCODER_TOOLS).map((slug) => ({ slug }));
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
  const encoder = ENCODER_TOOLS[slug];

  if (!encoder) {
    return {
      title: "Encoder Not Found",
    };
  }

  // Try to get AI-generated content for metadata
  const aiContent = await getEncoderContent(slug, encoder.name);

  if (aiContent) {
    return {
      title: aiContent.seo.title,
      description: aiContent.seo.description,
      keywords: aiContent.seo.keywords,
      alternates: {
        canonical: getAppUrl(`/encoders/${slug}`),
      },
      openGraph: {
        title: aiContent.openGraph.title,
        description: aiContent.openGraph.description,
        type: aiContent.openGraph.type,
        url: `/encoders/${slug}`,
        images: [
          {
            url: getOgImageUrl(encoder.name, aiContent.openGraph.description),
            width: 1200,
            height: 630,
            alt: `Codemata - ${encoder.name}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: aiContent.openGraph.title,
        description: aiContent.openGraph.description,
        images: [getOgImageUrl(encoder.name, aiContent.openGraph.description)],
      },
    };
  }

  // Fallback to static metadata if AI generation fails
  return {
    title: encoder.metadata.title,
    description: encoder.metadata.description,
    alternates: {
      canonical: getAppUrl(`/encoders/${slug}`),
    },
    openGraph: {
      title: encoder.metadata.title,
      description: encoder.metadata.description,
      url: `/encoders/${slug}`,
      images: [
        {
          url: getOgImageUrl(encoder.name, encoder.metadata.description),
          width: 1200,
          height: 630,
          alt: `Codemata - ${encoder.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [getOgImageUrl(encoder.name, encoder.metadata.description)],
    },
  };
}

export default async function EncoderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const encoder = ENCODER_TOOLS[slug];

  if (!encoder) {
    notFound();
  }

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: encoder.name,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    url: getAppUrl(`/encoders/${slug}`),
  };

  return (
    <>
      {/* Track page visit for recent tools */}
      <VisitTracker url={`/encoders/${slug}`} />

      {/* Structured Data */}
      <JsonLd data={structuredData} />

      <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col">
        {/* Page Header (first in DOM for SEO/A11y) */}
        <h1 className="mb-2 text-4xl font-bold">{encoder.name}</h1>

        {/* Category Navigation (after H1 in DOM, but displayed above via CSS order) */}
        <CategoryBackLink href="/encoders" label="Encoders" />

        {/* Intro paragraph with Suspense (replaces with AI intro when ready) */}
        <Suspense
          fallback={
            <p className="mb-8 text-slate-600 dark:text-slate-400">
              {encoder.description}
            </p>
          }
        >
          <EncoderIntro
            slug={slug}
            encoderName={encoder.name}
            fallbackDescription={encoder.description}
          />
        </Suspense>

        {/* Transformer Encoder Tool */}
        <TransformerEncoder
          action={encoder.action}
          defaultInput={encoder.example}
          language={encoder.language}
          modes={encoder.modes}
          toolName={encoder.name}
        />

        {/* AI-Generated Content Sections with Suspense */}
        <div className="mt-12 space-y-8">
          <Suspense fallback={<AIContentSkeleton />}>
            <EncoderAIContent slug={slug} encoderName={encoder.name} />
          </Suspense>
        </div>

        {/* Scroll to Top FAB */}
        <ScrollToTopFab />
      </div>
    </>
  );
}
