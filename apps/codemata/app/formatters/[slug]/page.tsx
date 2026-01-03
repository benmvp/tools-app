import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Transformer } from "@/components/Transformer";
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

export function generateStaticParams() {
  return Object.keys(FORMATTERS).map((slug) => ({ slug }));
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

  return {
    title: formatter.metadata.title,
    description: formatter.metadata.description,
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{formatter.name}</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        {formatter.description}
      </p>

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
    </div>
  );
}
