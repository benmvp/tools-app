#!/usr/bin/env tsx

/**
 * Metadata Verification Script
 *
 * Fetches all pages from localhost and validates metadata completeness:
 * - Title length (50-60 chars ideal)
 * - Description length (150-160 chars ideal)
 * - Uniqueness across all pages
 * - Canonical URLs presence
 * - OpenGraph tags (og:title, og:description, og:url, og:type)
 * - Twitter Card tags
 * - Structured data (JSON-LD)
 *
 * Usage:
 *   1. Start dev server: pnpm dev (in apps/codemata)
 *   2. Run script: pnpm verify-metadata
 *
 * Requirements:
 *   - pnpm add -D cheerio @types/cheerio @next/env
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnvConfig } from "@next/env";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectDir = join(__dirname, "..");
loadEnvConfig(projectDir);

import { load } from "cheerio";
import { FORMATTER_TOOLS, MINIFIER_TOOLS } from "../lib/tools-data";
import { getAppUrl, getToolUrl } from "../lib/utils";

interface PageMetadata {
  url: string;
  title: string | null;
  titleLength: number;
  description: string | null;
  descriptionLength: number;
  canonical: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogUrl: string | null;
  ogType: string | null;
  ogImage: string | null;
  ogImageAccessible: boolean;
  twitterCard: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  twitterImageAccessible: boolean;
  structuredData: boolean;
}

interface ValidationResult {
  url: string;
  issues: string[];
}

async function fetchPageMetadata(url: string): Promise<PageMetadata | null> {
  try {
    console.log(`Fetching ${url}...`);
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`❌ Failed to fetch ${url}: ${response.statusText}`);
      return null;
    }

    const html = await response.text();
    const $ = load(html);

    const title = $("title").text() || null;
    const description = $('meta[name="description"]').attr("content") || null;
    const canonical = $('link[rel="canonical"]').attr("href") || null;

    const ogTitle = $('meta[property="og:title"]').attr("content") || null;
    const ogDescription =
      $('meta[property="og:description"]').attr("content") || null;
    const ogUrl = $('meta[property="og:url"]').attr("content") || null;
    const ogType = $('meta[property="og:type"]').attr("content") || null;
    const ogImage = $('meta[property="og:image"]').attr("content") || null;

    const twitterCard = $('meta[name="twitter:card"]').attr("content") || null;
    const twitterTitle =
      $('meta[name="twitter:title"]').attr("content") || null;
    const twitterDescription =
      $('meta[name="twitter:description"]').attr("content") || null;
    const twitterImage =
      $('meta[name="twitter:image"]').attr("content") || null;

    const structuredData = $('script[type="application/ld+json"]').length > 0;

    // Check if image URLs are accessible
    let ogImageAccessible = false;
    if (ogImage) {
      try {
        const imageUrl = ogImage.startsWith("http")
          ? ogImage
          : `${new URL(url).origin}${ogImage}`;
        const imageResponse = await fetch(imageUrl, { method: "HEAD" });
        ogImageAccessible = imageResponse.ok;
      } catch {
        ogImageAccessible = false;
      }
    }

    let twitterImageAccessible = false;
    if (twitterImage) {
      try {
        const imageUrl = twitterImage.startsWith("http")
          ? twitterImage
          : `${new URL(url).origin}${twitterImage}`;
        const imageResponse = await fetch(imageUrl, { method: "HEAD" });
        twitterImageAccessible = imageResponse.ok;
      } catch {
        twitterImageAccessible = false;
      }
    }

    return {
      url,
      title,
      titleLength: title?.length || 0,
      description,
      descriptionLength: description?.length || 0,
      canonical,
      ogTitle,
      ogDescription,
      ogUrl,
      ogType,
      ogImage,
      ogImageAccessible,
      twitterCard,
      twitterTitle,
      twitterDescription,
      twitterImage,
      twitterImageAccessible,
      structuredData,
    };
  } catch (error) {
    console.error(`❌ Error fetching ${url}:`, error);
    return null;
  }
}

function validateMetadata(metadata: PageMetadata): string[] {
  const issues: string[] = [];

  // Title validation (30-70 chars is reasonable, SEO ideal is 50-60)
  if (!metadata.title) {
    issues.push("Missing <title> tag");
  } else {
    if (metadata.titleLength < 30) {
      issues.push(`Title too short (${metadata.titleLength} chars)`);
    }
    if (metadata.titleLength > 70) {
      issues.push(`Title too long (${metadata.titleLength} chars)`);
    }
  }

  // Description validation (80-200 chars is acceptable, SEO ideal is 120-160)
  // These thresholds catch truly problematic cases while allowing minor deviations
  if (!metadata.description) {
    issues.push("Missing meta description");
  } else {
    if (metadata.descriptionLength < 80) {
      issues.push(
        `Description too short (${metadata.descriptionLength} chars, min 80)`,
      );
    }
    if (metadata.descriptionLength > 200) {
      issues.push(
        `Description too long (${metadata.descriptionLength} chars, max 200)`,
      );
    }
  }

  // Canonical URL
  if (!metadata.canonical) {
    issues.push("Missing canonical URL");
  }

  // OpenGraph
  if (!metadata.ogTitle) issues.push("Missing og:title");
  if (!metadata.ogDescription) issues.push("Missing og:description");
  if (!metadata.ogImage) {
    issues.push("Missing og:image");
  } else if (!metadata.ogImageAccessible) {
    issues.push(`og:image URL not accessible: ${metadata.ogImage}`);
  }

  // Twitter Card
  if (!metadata.twitterCard) issues.push("Missing twitter:card");
  if (!metadata.twitterTitle) issues.push("Missing twitter:title");
  if (!metadata.twitterDescription) issues.push("Missing twitter:description");
  if (!metadata.twitterImage) {
    issues.push("Missing twitter:image");
  } else if (!metadata.twitterImageAccessible) {
    issues.push(`twitter:image URL not accessible: ${metadata.twitterImage}`);
  }

  // Structured Data (only for tool pages, not home/category pages)
  if (
    metadata.url.includes("/formatters/") ||
    metadata.url.includes("/minifiers/")
  ) {
    if (!metadata.structuredData) {
      issues.push("Missing JSON-LD structured data");
    }
  }

  return issues;
}

function checkUniqueness(allMetadata: PageMetadata[]): ValidationResult[] {
  const results: ValidationResult[] = [];
  const titles = new Map<string, string[]>();
  const descriptions = new Map<string, string[]>();

  // Group by title and description
  for (const meta of allMetadata) {
    if (meta.title) {
      if (!titles.has(meta.title)) {
        titles.set(meta.title, []);
      }
      titles.get(meta.title)?.push(meta.url);
    }

    if (meta.description) {
      if (!descriptions.has(meta.description)) {
        descriptions.set(meta.description, []);
      }
      descriptions.get(meta.description)?.push(meta.url);
    }
  }

  // Find duplicates
  for (const [title, urls] of titles) {
    if (urls.length > 1) {
      for (const url of urls) {
        results.push({
          url,
          issues: [
            `Duplicate title: "${title}" (shared with ${urls.length - 1} other page(s))`,
          ],
        });
      }
    }
  }

  for (const [, urls] of descriptions) {
    if (urls.length > 1) {
      for (const url of urls) {
        const existing = results.find((r) => r.url === url);
        if (existing) {
          existing.issues.push(
            `Duplicate description (shared with ${urls.length - 1} other page(s))`,
          );
        } else {
          results.push({
            url,
            issues: [
              `Duplicate description (shared with ${urls.length - 1} other page(s))`,
            ],
          });
        }
      }
    }
  }

  return results;
}

async function main() {
  console.log("🔍 Starting metadata verification...\n");

  // Build list of pages to check
  const pages = [
    { url: getAppUrl(), name: "Home" },
    { url: getAppUrl("/formatters"), name: "Formatters" },
    { url: getAppUrl("/minifiers"), name: "Minifiers" },
    ...FORMATTER_TOOLS.map((tool) => ({
      url: getToolUrl(tool),
      name: tool.name,
    })),
    ...MINIFIER_TOOLS.map((tool) => ({
      url: getToolUrl(tool),
      name: tool.name,
    })),
  ];

  console.log(`📄 Checking ${pages.length} pages...\n`);

  // Fetch all metadata
  const allMetadata: PageMetadata[] = [];
  for (const page of pages) {
    const metadata = await fetchPageMetadata(page.url);
    if (metadata) {
      allMetadata.push(metadata);
    }
  }

  console.log(`\n✅ Fetched metadata from ${allMetadata.length} pages\n`);
  console.log("=".repeat(80));
  console.log("\n📊 VALIDATION RESULTS\n");

  // Validate each page
  const validationResults: ValidationResult[] = [];
  let totalIssues = 0;

  for (const metadata of allMetadata) {
    const issues = validateMetadata(metadata);
    if (issues.length > 0) {
      validationResults.push({ url: metadata.url, issues });
      totalIssues += issues.length;
    }
  }

  // Check uniqueness
  const uniquenessIssues = checkUniqueness(allMetadata);
  for (const result of uniquenessIssues) {
    const existing = validationResults.find((r) => r.url === result.url);
    if (existing) {
      existing.issues.push(...result.issues);
    } else {
      validationResults.push(result);
    }
    totalIssues += result.issues.length;
  }

  // Print results
  if (validationResults.length === 0) {
    console.log("✅ All pages passed validation!\n");
  } else {
    console.log(
      `❌ Found ${totalIssues} issue(s) across ${validationResults.length} page(s):\n`,
    );

    for (const result of validationResults) {
      console.log(`\n${result.url}`);
      for (const issue of result.issues) {
        console.log(`  • ${issue}`);
      }
    }
  }

  console.log(`\n${"=".repeat(80)}`);
  console.log("\n📈 SUMMARY\n");
  console.log(`Total pages checked: ${allMetadata.length}`);
  console.log(`Pages with issues: ${validationResults.length}`);
  console.log(`Total issues found: ${totalIssues}`);
  console.log(
    `Pass rate: ${Math.round(((allMetadata.length - validationResults.length) / allMetadata.length) * 100)}%\n`,
  );

  // Exit with error code if issues found
  if (validationResults.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
