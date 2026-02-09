import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AIContentSkeleton } from "@/components/AIContentSkeleton";
import { CategoryBackLink } from "@/components/CategoryBackLink";
import { JsonLd } from "@/components/JsonLd";
import { ValidatorAIContent } from "@/components/ValidatorAIContent";
import { ValidatorIntro } from "@/components/ValidatorIntro";
import { VisitTracker } from "@/components/VisitTracker";
import { CssValidator } from "@/components/validators/CssValidator";
import { DockerfileValidator } from "@/components/validators/DockerfileValidator";
import { HtmlValidator } from "@/components/validators/HtmlValidator";
import { JsonValidator } from "@/components/validators/JsonValidator";
import { UrlValidator } from "@/components/validators/UrlValidator";
import { XmlValidator } from "@/components/validators/XmlValidator";
import { YamlValidator } from "@/components/validators/YamlValidator";
import { generateToolMetadata } from "@/lib/metadata-helpers";
import { VALIDATOR_TOOLS } from "@/lib/tools-data";
import { getToolStructuredData, isProductionBuild } from "@/lib/utils";
import { VALIDATOR_EXAMPLES } from "@/lib/validators/examples";

// ISR revalidation - 24 hours
export const revalidate = 86400;

// Max duration for Vercel serverless functions (AI generation)
export const maxDuration = 30;

// Enable dynamic params for ISR
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return generateToolMetadata({
    slug,
    category: "validators",
    tools: VALIDATOR_TOOLS,
    toolType: "validator",
  });
}

export function generateStaticParams() {
  // Pre-render all pages ONLY in true Vercel production builds
  // This ensures crawlers get instant pages with good SEO
  // Preview builds and local dev use on-demand ISR to save API costs
  if (isProductionBuild()) {
    return Object.keys(VALIDATOR_TOOLS).map((slug) => ({ slug }));
  }

  // Return empty array for preview/dev - pages generated on-demand
  return [];
}

export default async function ValidatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = VALIDATOR_TOOLS[slug];

  // 404 if tool doesn't exist or tool is coming soon
  if (!tool || tool.comingSoon) {
    notFound();
  }

  // Map slug to validator component
  const renderValidator = () => {
    switch (slug) {
      case "json-validator":
        return (
          <JsonValidator
            example={VALIDATOR_EXAMPLES.json}
            exampleSchema={VALIDATOR_EXAMPLES.jsonSchema}
          />
        );
      case "html-validator":
        return <HtmlValidator example={VALIDATOR_EXAMPLES.html} />;
      case "css-validator":
        return <CssValidator example={VALIDATOR_EXAMPLES.css} />;
      case "xml-validator":
        return <XmlValidator example={VALIDATOR_EXAMPLES.xml} />;
      case "url-validator":
        return <UrlValidator example={VALIDATOR_EXAMPLES.url} />;
      case "dockerfile-validator":
        return <DockerfileValidator example={VALIDATOR_EXAMPLES.dockerfile} />;
      case "yaml-validator":
        return <YamlValidator example={VALIDATOR_EXAMPLES.yaml} />;
      default:
        return null;
    }
  };

  const structuredData = getToolStructuredData(
    `/validators/${slug}`,
    tool.name,
  );

  return (
    <>
      {/* Track page visit for recent tools */}
      <VisitTracker url={`/validators/${slug}`} />

      {/* Structured Data */}
      <JsonLd data={structuredData} />

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
        <div className="flex flex-col gap-6">
          <CategoryBackLink href="/validators" label="Validators" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{tool.name}</h1>
            <Suspense
              fallback={
                <p className="text-muted-foreground text-lg">
                  {tool.description}
                </p>
              }
            >
              <ValidatorIntro
                slug={slug}
                validatorName={tool.name}
                fallbackDescription={tool.description}
              />
            </Suspense>
          </div>
          {renderValidator()}
          <Suspense fallback={<AIContentSkeleton />}>
            <ValidatorAIContent slug={slug} validatorName={tool.name} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
