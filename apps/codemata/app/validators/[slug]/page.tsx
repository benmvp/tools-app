import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryBackLink } from "@/components/CategoryBackLink";
import { JsonValidator } from "@/components/validators/JsonValidator";
import { VALIDATOR_TOOLS } from "@/lib/tools-data";
import { VALIDATOR_EXAMPLES } from "@/lib/validators/examples";

// ISR revalidation - 24 hours
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = VALIDATOR_TOOLS[slug];

  if (!tool) {
    return {
      title: "Validator Not Found | Codemata",
      description: "The requested validator tool could not be found.",
    };
  }

  return {
    title: tool.metadata.title,
    description: tool.metadata.description,
  };
}

export async function generateStaticParams() {
  // Generate static routes for all validator tools
  return Object.keys(VALIDATOR_TOOLS).map((slug) => ({
    slug,
  }));
}

export default async function ValidatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = VALIDATOR_TOOLS[slug];

  // 404 if tool doesn't exist
  if (!tool) {
    notFound();
  }

  // 404 if tool is coming soon (Phase 9.1 - all validators are coming soon)
  if (tool.comingSoon) {
    notFound();
  }

  // JSON Validator
  if (slug === "json-validator") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
        <div className="flex flex-col gap-6">
          <CategoryBackLink href="/validators" label="Validators" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{tool.name}</h1>
            <p className="text-muted-foreground text-lg">{tool.description}</p>
          </div>
          <JsonValidator
            example={VALIDATOR_EXAMPLES.json}
            exampleSchema={VALIDATOR_EXAMPLES.jsonSchema}
          />
        </div>
      </div>
    );
  }

  // Phase 9.3+: Other validators
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
      <h1>{tool.name}</h1>
      <p>Validator implementation coming in Phase 9.3+</p>
    </div>
  );
}
