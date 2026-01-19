import type { MetadataRoute } from "next";
import { getAppUrl, getToolUrl } from "@/lib/utils";
import { ALL_TOOLS } from "../lib/tools-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date().toISOString();

  // Home page
  const home: MetadataRoute.Sitemap[0] = {
    url: getAppUrl(),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.9,
  };

  // Category pages
  const categories: MetadataRoute.Sitemap = [
    {
      url: getAppUrl(`/formatters`),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: getAppUrl(`/minifiers`),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: getAppUrl(`/encoders`),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Tool pages
  const tools: MetadataRoute.Sitemap = Object.values(ALL_TOOLS)
    .flat(2)
    .map((tool) => ({
      url: getToolUrl(tool),
      lastModified,
      changeFrequency: "daily" as const,
      priority: 1.0,
    }));

  return [home, ...categories, ...tools];
}
