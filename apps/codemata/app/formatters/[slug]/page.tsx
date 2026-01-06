import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AIContentSkeleton } from "@/components/AIContentSkeleton";
import { FormatterAIContent } from "@/components/FormatterAIContent";
import { FormatterIntro } from "@/components/FormatterIntro";
import { JsonLd } from "@/components/JsonLd";
import { ScrollToTopFab } from "@/components/ScrollToTopFab";
import { Transformer } from "@/components/Transformer";
import { getFormatterContent } from "@/lib/ai/helpers";
import {
  CSS_EXAMPLE,
  GRAPHQL_EXAMPLE,
  HTML_EXAMPLE,
  JSON_EXAMPLE,
  MARKDOWN_EXAMPLE,
  TYPESCRIPT_EXAMPLE,
  XML_EXAMPLE,
  YAML_EXAMPLE,
} from "@/lib/examples";
import type { FormatConfig } from "@/lib/types";
import { getAppUrl, isProductionBuild } from "@/lib/utils";
import {
  formatCss,
  formatGraphql,
  formatHtml,
  formatJson,
  formatMarkdown,
  formatTypescript,
  formatXml,
  formatYaml,
} from "../actions";

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Extend serverless function timeout for AI generation
// Default is 10s on Hobby, this allows up to 30s on Preview/Production
export const maxDuration = 30;

type SupportedLanguage =
  | "typescript"
  | "javascript"
  | "json"
  | "yaml"
  | "css"
  | "html"
  | "graphql"
  | "markdown"
  | "xml";

type FormatterConfig = {
  name: string;
  description: string;
  action: (input: string, config: FormatConfig) => Promise<string>;
  example: string;
  language: SupportedLanguage;
  metadata: {
    title: string;
    description: string;
  };
};

const FORMATTERS: Record<string, FormatterConfig> = {
  "typescript-formatter": {
    name: "TypeScript Formatter",
    description: "Format and beautify TypeScript code with proper indentation",
    action: formatTypescript,
    example: TYPESCRIPT_EXAMPLE,
    language: "typescript",
    metadata: {
      title: "TypeScript Formatter | Codemata",
      description:
        "Format and beautify TypeScript code with proper indentation. Free online TypeScript formatter for cleaner, more readable code.",
    },
  },
  "json-formatter": {
    name: "JSON Formatter",
    description: "Format and beautify JSON data with proper indentation",
    action: formatJson,
    example: JSON_EXAMPLE,
    language: "json",
    metadata: {
      title: "JSON Formatter | Codemata",
      description:
        "Format and beautify JSON data with proper indentation. Free online JSON formatter for better readability.",
    },
  },
  "css-formatter": {
    name: "CSS Formatter",
    description: "Format and beautify CSS code with proper indentation",
    action: formatCss,
    example: CSS_EXAMPLE,
    language: "css",
    metadata: {
      title: "CSS Formatter | Codemata",
      description:
        "Format and beautify CSS code with proper indentation. Free online CSS formatter for cleaner stylesheets.",
    },
  },
  "html-formatter": {
    name: "HTML Formatter",
    description: "Format and beautify HTML code with proper indentation",
    action: formatHtml,
    example: HTML_EXAMPLE,
    language: "html",
    metadata: {
      title: "HTML Formatter | Codemata",
      description:
        "Format and beautify HTML code with proper indentation. Free online HTML formatter for cleaner markup.",
    },
  },
  "graphql-formatter": {
    name: "GraphQL Formatter",
    description: "Format and beautify GraphQL schemas and queries",
    action: formatGraphql,
    example: GRAPHQL_EXAMPLE,
    language: "graphql",
    metadata: {
      title: "GraphQL Formatter | Codemata",
      description:
        "Format and beautify GraphQL schemas and queries. Free online GraphQL formatter for better readability.",
    },
  },
  "markdown-formatter": {
    name: "Markdown Formatter",
    description: "Format and beautify Markdown documents",
    action: formatMarkdown,
    example: MARKDOWN_EXAMPLE,
    language: "markdown",
    metadata: {
      title: "Markdown Formatter | Codemata",
      description:
        "Format and beautify Markdown documents. Free online Markdown formatter for consistent formatting.",
    },
  },
  "xml-formatter": {
    name: "XML Formatter",
    description: "Format and beautify XML documents with proper indentation",
    action: formatXml,
    example: XML_EXAMPLE,
    language: "xml",
    metadata: {
      title: "XML Formatter | Codemata",
      description:
        "Format and beautify XML documents with proper indentation. Free online XML formatter for cleaner markup.",
    },
  },
  "yaml-formatter": {
    name: "YAML Formatter",
    description: "Format and beautify YAML configuration files",
    action: formatYaml,
    example: YAML_EXAMPLE,
    language: "yaml",
    metadata: {
      title: "YAML Formatter | Codemata",
      description:
        "Format and beautify YAML configuration files. Free online YAML formatter for consistent formatting.",
    },
  },
};

// Enable dynamic params for ISR
export const dynamicParams = true;

export function generateStaticParams() {
  // Pre-render all pages ONLY in true Vercel production builds
  // This ensures crawlers get instant pages with good SEO
  // Preview builds and local dev use on-demand ISR to save API costs
  if (isProductionBuild()) {
    return Object.keys(FORMATTERS).map((slug) => ({ slug }));
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
  const formatter = FORMATTERS[slug];

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
      },
      twitter: {
        card: "summary_large_image",
        title: aiContent.openGraph.title,
        description: aiContent.openGraph.description,
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
  };
}

export default async function FormatterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const formatter = FORMATTERS[slug];

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

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Page Header */}
        <h1 className="mb-2 text-4xl font-bold">{formatter.name}</h1>

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
          action={formatter.action}
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
