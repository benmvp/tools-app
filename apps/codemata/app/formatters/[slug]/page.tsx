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
import { VisitTracker } from "@/components/VisitTracker";
import { getFormatterContent } from "@/lib/ai/helpers";
import { generateToolMetadata } from "@/lib/metadata-helpers";
import { FORMATTER_TOOLS } from "@/lib/tools-data";
import type { FormatterAction } from "@/lib/types";
import { getToolStructuredData, isProductionBuild } from "@/lib/utils";

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Configuration option type
interface ConfigOption {
  id: string;
  label: string;
  defaultValue: string;
  options: { label: string; value: string }[];
}

// Special configuration options for specific formatters
const SPECIAL_CONFIG_OPTIONS: Record<string, ConfigOption[]> = {
  "sql-formatter": [
    {
      id: "dialect",
      label: "SQL Dialect",
      defaultValue: "postgresql",
      options: [
        { label: "PostgreSQL", value: "postgresql" },
        { label: "MySQL", value: "mysql" },
        { label: "MariaDB", value: "mariadb" },
        { label: "SQLite", value: "sqlite" },
        { label: "SQL Server", value: "transactsql" },
        { label: "BigQuery", value: "bigquery" },
        { label: "DB2", value: "db2" },
        { label: "DB2i", value: "db2i" },
        { label: "Hive", value: "hive" },
        { label: "N1QL", value: "n1ql" },
        { label: "PL/SQL", value: "plsql" },
        { label: "Redshift", value: "redshift" },
        { label: "SingleStoreDB", value: "singlestoredb" },
        { label: "Snowflake", value: "snowflake" },
        { label: "Spark", value: "spark" },
        { label: "Standard SQL", value: "sql" },
        { label: "Trino", value: "trino" },
      ],
    },
    {
      id: "keywordCase",
      label: "Keyword Case",
      defaultValue: "uppercase",
      options: [
        { label: "UPPERCASE", value: "uppercase" },
        { label: "lowercase", value: "lowercase" },
      ],
    },
  ],
};

// Standard indentation config (always added last)
const INDENTATION_CONFIG: ConfigOption = {
  id: "indentation",
  label: "Indentation",
  defaultValue: "two-spaces",
  options: [
    { label: "2 Spaces", value: "two-spaces" },
    { label: "4 Spaces", value: "four-spaces" },
    { label: "Tabs", value: "tabs" },
  ],
};

/**
 * Get configuration options for a formatter
 * Special options (if any) come first, indentation always comes last
 */
function getConfigOptions(slug: string): ConfigOption[] {
  const specialOptions = SPECIAL_CONFIG_OPTIONS[slug] || [];
  return [...specialOptions, INDENTATION_CONFIG];
}

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
  return generateToolMetadata({
    slug,
    category: "formatters",
    tools: FORMATTER_TOOLS,
    aiContentGetter: getFormatterContent,
  });
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

  const structuredData = getToolStructuredData(
    `/formatters/${slug}`,
    formatter.name,
  );

  return (
    <>
      {/* Track page visit for recent tools */}
      <VisitTracker url={`/formatters/${slug}`} />

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
          configOptions={getConfigOptions(slug)}
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
