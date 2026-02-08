import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AIContentSkeleton } from "@/components/AIContentSkeleton";
import { CategoryBackLink } from "@/components/CategoryBackLink";
import { JsonLd } from "@/components/JsonLd";
import { ViewerAIContent } from "@/components/ViewerAIContent";
import { ViewerIntro } from "@/components/ViewerIntro";
import { VisitTracker } from "@/components/VisitTracker";
import { MarkdownViewer } from "@/components/viewers/MarkdownViewer";
import { generateToolMetadata } from "@/lib/metadata-helpers";
import { VIEWER_TOOLS } from "@/lib/tools-data";
import { getToolStructuredData, isProductionBuild } from "@/lib/utils";

// ISR: Revalidate every 24 hours
export const revalidate = 86400;
export const maxDuration = 30; // For AI generation
export const dynamicParams = true;

// Pre-render all viewer pages at build time (production only)
export async function generateStaticParams() {
  if (isProductionBuild()) {
    return Object.keys(VIEWER_TOOLS).map((slug) => ({ slug }));
  }
  return [];
}

// Generate metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return generateToolMetadata({
    slug,
    category: "viewers",
    tools: VIEWER_TOOLS,
    toolType: "viewer",
  });
}

export default async function ViewerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = VIEWER_TOOLS[slug];

  if (!tool) {
    notFound();
  }

  // Map slug to component
  const renderViewer = () => {
    switch (slug) {
      case "markdown-previewer":
        return (
          <MarkdownViewer action={tool.action} defaultInput={tool.example} />
        );
      default:
        // Fail fast - tool exists in registry but no component mapping
        throw new Error(
          `Missing component mapping for viewer: ${slug}. Add a case to renderViewer().`,
        );
    }
  };

  const structuredData = getToolStructuredData(`/viewers/${slug}`, tool.name);

  return (
    <>
      <JsonLd data={structuredData} />
      <VisitTracker url={`/viewers/${slug}`} />

      <div className="container mx-auto px-4 py-8 space-y-8">
        <CategoryBackLink href="/viewers" label="Viewers" />

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">{tool.name}</h1>
          <Suspense
            fallback={
              <p className="text-xl text-muted-foreground">
                {tool.description}
              </p>
            }
          >
            <ViewerIntro slug={slug} viewerName={tool.name} />
          </Suspense>
        </div>

        {renderViewer()}

        <Suspense fallback={<AIContentSkeleton />}>
          <ViewerAIContent slug={slug} viewerName={tool.name} />
        </Suspense>
      </div>
    </>
  );
}
