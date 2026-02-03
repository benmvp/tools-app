import type { MetadataRoute } from "next";
import { getAppUrl, getToolUrl } from "@/lib/utils";
import { getAllTools, getCategoriesByOrder } from "../lib/tools-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date().toISOString();

  // Home page
  const home: MetadataRoute.Sitemap[0] = {
    url: getAppUrl(),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.9,
  };

  // Category pages (auto-generated from ALL_TOOLS)
  const categories: MetadataRoute.Sitemap = getCategoriesByOrder().map(
    (category) => ({
      url: getAppUrl(category.url),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    }),
  );

  // Tool pages (auto-generated from ALL_TOOLS)
  const tools: MetadataRoute.Sitemap = getAllTools().map((tool) => ({
    url: getToolUrl(tool),
    lastModified,
    changeFrequency: "daily" as const,
    priority: 1.0,
  }));

  return [home, ...categories, ...tools];
}
