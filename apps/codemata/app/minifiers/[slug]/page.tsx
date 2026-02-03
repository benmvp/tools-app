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
import { VisitTracker } from "@/components/VisitTracker";
import { generateToolMetadata } from "@/lib/metadata-helpers";
import { MINIFIER_TOOLS } from "@/lib/tools-data";
import type { MinifierAction } from "@/lib/types";
import { getToolStructuredData, isProductionBuild } from "@/lib/utils";

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
  return generateToolMetadata({
    slug,
    category: "minifiers",
    tools: MINIFIER_TOOLS,
    toolType: "minifier",
  });
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

  const structuredData = getToolStructuredData(
    `/minifiers/${slug}`,
    minifier.name,
  );

  return (
    <>
      {/* Track page visit for recent tools */}
      <VisitTracker url={`/minifiers/${slug}`} />

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
