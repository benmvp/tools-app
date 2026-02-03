import type { Metadata } from "next";
import { getToolContent } from "./ai/helpers";
import { SITE_CONFIG } from "./site-config";
import type { Tool } from "./types";
import { getAppUrl, getOgImageUrl } from "./utils";

export interface ToolMetadataParams {
  slug: string;
  category: string;
  tools: Record<string, Tool>;
  toolType: "formatter" | "minifier" | "encoder" | "validator" | "generator";
}

/**
 * Generate metadata for tool pages with AI-first fallback pattern
 * Shared across all tool categories to ensure consistency
 */
export async function generateToolMetadata({
  slug,
  category,
  tools,
  toolType,
}: ToolMetadataParams): Promise<Metadata> {
  const tool = tools[slug];

  if (!tool) {
    return {
      title: "Not Found",
    };
  }

  // Try AI-generated content first
  const aiContent = await getToolContent(slug, tool.name, toolType);

  // Extract common values (single source of truth)
  const canonicalUrl = getAppUrl(`/${category}/${slug}`);

  // Use AI if available, otherwise fallback to static metadata
  const title = aiContent?.seo.title || tool.metadata.title;
  const description = aiContent?.seo.description || tool.metadata.description;
  const ogTitle = aiContent?.openGraph.title || tool.metadata.title;
  const ogDescription =
    aiContent?.openGraph.description || tool.metadata.description;
  const ogType = aiContent?.openGraph.type || SITE_CONFIG.openGraph.type;

  // Generate OG image once (reused in openGraph + twitter)
  const ogImageUrl = getOgImageUrl(tool.name, ogDescription);

  // Single return statement - no duplication
  return {
    title,
    description,
    keywords: aiContent?.seo.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: ogType,
      url: canonicalUrl,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${SITE_CONFIG.name} - ${tool.name}`,
        },
      ],
    },
    twitter: {
      card: SITE_CONFIG.twitter.card,
      title: ogTitle,
      description: ogDescription,
      images: [ogImageUrl],
    },
  };
}
