import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TransformerMinifier } from "@/components/TransformerMinifier";
import {
  CSS_MINIFIER_EXAMPLE,
  HTML_MINIFIER_EXAMPLE,
  JSON_MINIFIER_EXAMPLE,
  SVG_MINIFIER_EXAMPLE,
  TYPESCRIPT_MINIFIER_EXAMPLE,
  XML_MINIFIER_EXAMPLE,
} from "@/lib/examples";
import {
  minifyCss,
  minifyHtml,
  minifyJson,
  minifySvg,
  minifyTypescript,
  minifyXml,
} from "../actions";

type MinifierSlug =
  | "typescript-minifier"
  | "json-minifier"
  | "css-minifier"
  | "html-minifier"
  | "svg-minifier"
  | "xml-minifier";

type SupportedLanguage =
  | "typescript"
  | "javascript"
  | "json"
  | "css"
  | "html"
  | "xml";

interface MinifierConfig {
  name: string;
  description: string;
  action: (input: string) => Promise<string>;
  example: string;
  language: SupportedLanguage;
  metadata: {
    title: string;
    description: string;
  };
}

const MINIFIERS: Record<MinifierSlug, MinifierConfig> = {
  "typescript-minifier": {
    name: "TypeScript & JavaScript Minifier",
    description: "Minify and compress your JavaScript and TypeScript code",
    action: minifyTypescript,
    example: TYPESCRIPT_MINIFIER_EXAMPLE,
    language: "typescript",
    metadata: {
      title: "TypeScript & JavaScript Minifier | Codemata",
      description:
        "Minify and compress JavaScript and TypeScript code. Free online minifier that removes whitespace, shortens variable names, and optimizes your code for production.",
    },
  },
  "json-minifier": {
    name: "JSON Minifier",
    description: "Compress JSON by removing whitespace",
    action: minifyJson,
    example: JSON_MINIFIER_EXAMPLE,
    language: "json",
    metadata: {
      title: "JSON Minifier | Codemata",
      description:
        "Minify and compress JSON data by removing whitespace. Free online JSON minifier for reducing file size.",
    },
  },
  "css-minifier": {
    name: "CSS Minifier",
    description: "Minify and optimize your CSS stylesheets",
    action: minifyCss,
    example: CSS_MINIFIER_EXAMPLE,
    language: "css",
    metadata: {
      title: "CSS Minifier | Codemata",
      description:
        "Minify and optimize CSS stylesheets. Free online CSS minifier that removes whitespace, comments, and optimizes your styles for production.",
    },
  },
  "html-minifier": {
    name: "HTML Minifier",
    description: "Compress HTML by removing whitespace and comments",
    action: minifyHtml,
    example: HTML_MINIFIER_EXAMPLE,
    language: "html",
    metadata: {
      title: "HTML Minifier | Codemata",
      description:
        "Minify and compress HTML code. Free online HTML minifier that removes whitespace, comments, and optimizes your HTML for production.",
    },
  },
  "svg-minifier": {
    name: "SVG Minifier",
    description: "Optimize and compress SVG images",
    action: minifySvg,
    example: SVG_MINIFIER_EXAMPLE,
    language: "xml",
    metadata: {
      title: "SVG Minifier | Codemata",
      description:
        "Optimize and compress SVG images. Free online SVG minifier that removes unnecessary data, comments, and optimizes your SVG files.",
    },
  },
  "xml-minifier": {
    name: "XML Minifier",
    description: "Compress XML by removing whitespace and comments",
    action: minifyXml,
    example: XML_MINIFIER_EXAMPLE,
    language: "xml",
    metadata: {
      title: "XML Minifier | Codemata",
      description:
        "Minify and compress XML documents. Free online XML minifier that removes whitespace, comments, and optimizes your XML for production.",
    },
  },
};

export async function generateStaticParams() {
  return Object.keys(MINIFIERS).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const minifier = MINIFIERS[slug as MinifierSlug];

  if (!minifier) {
    return {};
  }

  return {
    title: minifier.metadata.title,
    description: minifier.metadata.description,
  };
}

export default async function MinifierPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const minifier = MINIFIERS[slug as MinifierSlug];

  if (!minifier) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{minifier.name}</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        {minifier.description}
      </p>

      <TransformerMinifier
        action={minifier.action}
        actionLabel="Minify"
        defaultInput={minifier.example}
        language={minifier.language}
      />
    </div>
  );
}
