import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AIContentSkeleton } from "@/components/AIContentSkeleton";
import { CategoryBackLink } from "@/components/CategoryBackLink";
import { GeneratorAIContent } from "@/components/GeneratorAIContent";
import { GeneratorIntro } from "@/components/GeneratorIntro";
import { GitignoreGenerator } from "@/components/GitignoreGenerator";
import { JsonLd } from "@/components/JsonLd";
import { generateToolMetadata } from "@/lib/metadata-helpers";
import { GENERATOR_TOOLS } from "@/lib/tools-data";
import { getToolStructuredData } from "@/lib/utils";
import { generateGitignore } from "../actions";

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Pre-render all generator pages at build time
export async function generateStaticParams() {
  return Object.keys(GENERATOR_TOOLS).map((slug) => ({ slug }));
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
    category: "generators",
    tools: GENERATOR_TOOLS,
    toolType: "generator",
  });
}

export default async function GeneratorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = GENERATOR_TOOLS[slug];

  if (!tool) {
    notFound();
  }

  // Map slug to component
  const renderGenerator = () => {
    switch (slug) {
      case "gitignore-generator":
        return <GitignoreGenerator action={generateGitignore} />;
      default:
        return null;
    }
  };

  const structuredData = getToolStructuredData(
    `/generators/${slug}`,
    tool.name,
  );

  return (
    <>
      <JsonLd data={structuredData} />

      <div className="container mx-auto px-4 py-8 space-y-8">
        <CategoryBackLink href="/generators" label="Generators" />

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">{tool.name}</h1>
          <p className="text-xl text-muted-foreground">{tool.description}</p>
        </div>

        <GeneratorIntro slug={slug} generatorName={tool.name} />

        {renderGenerator()}

        <Suspense fallback={<AIContentSkeleton />}>
          <GeneratorAIContent slug={slug} generatorName={tool.name} />
        </Suspense>
      </div>
    </>
  );
}
