import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VALIDATOR_TOOLS } from "@/lib/tools-data";

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

  // Phase 9.2+: Render validator components here
  // For now, this returns 404 for all validators
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
      <h1>{tool.name}</h1>
      <p>Validator implementation coming in Phase 9.2+</p>
    </div>
  );
}
